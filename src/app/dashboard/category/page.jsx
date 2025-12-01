'use client'
import React, { useState, useEffect } from 'react';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { id: null, name: '' }
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      showNotification(`Error fetching categories: ${error.message}`, 'error');
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000); // Clear notification after 3 seconds
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showNotification('Category name cannot be empty', 'error');
      return;
    }
    try {
      const response = await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      showNotification('Category added successfully', 'success');
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      showNotification(`Error adding category: ${error.message}`, 'error');
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      showNotification('Category deleted successfully', 'success');
      fetchCategories();
    } catch (error) {
      showNotification(`Error deleting category: ${error.message}`, 'error');
      console.error('Error deleting category:', error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      showNotification('Category name cannot be empty', 'error');
      return;
    }
    try {
      const response = await fetch(`/api/category/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingCategory.name }),
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      showNotification('Category updated successfully', 'success');
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      showNotification(`Error updating category: ${error.message}`, 'error');
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Category Management</h1>

      {notification.message && (
        <div className={`p-3 mb-4 rounded-md text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}

      {/* Add New Category Form */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="flex gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={editingCategory ? editingCategory.name : newCategoryName}
            onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategoryName(e.target.value)}
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Existing Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No categories found.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between py-4">
                <span className="text-lg text-gray-900 dark:text-white">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
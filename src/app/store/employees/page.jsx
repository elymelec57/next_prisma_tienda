// src/app/store/employees/page.jsx
"use client";

import { useEffect, useState } from 'react';
import EmployeeList from '../../../components/employees/EmployeeList';
import EmployeeForm from '../../../components/employees/EmployeeForm';
import EmployeeSchedule from '../../../components/employees/EmployeeSchedule';

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (employeeId) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/schedules`);
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    fetchSchedules(employee.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      const url = selectedEmployee ? `/api/employees/${selectedEmployee.id}` : '/api/employees';
      const method = selectedEmployee ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      fetchEmployees();
      setIsFormVisible(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedEmployee(null);
    setSchedules([]);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsFormVisible(true);
    setSchedules([]);
  };

  const handleAddSchedule = async (employeeId, newShift) => {
    try {
      await fetch(`/api/employees/${employeeId}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShift),
      });
      fetchSchedules(employeeId);
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <button onClick={handleAddNew} className="bg-green-500 text-white px-4 py-2 rounded">
          Add New Employee
        </button>
      </div>

      {isFormVisible && (
        <div className="mb-4">
          <EmployeeForm
            employee={selectedEmployee}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          {selectedEmployee && (
            <EmployeeSchedule
              employee={selectedEmployee}
              schedules={schedules}
              onAddSchedule={handleAddSchedule}
            />
          )}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <EmployeeList employees={employees} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

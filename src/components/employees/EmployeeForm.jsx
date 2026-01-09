// src/components/employees/EmployeeForm.jsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';

const employeeSchema = z.object({
  nombre: z.string().min(1, 'Name is required'),
  apellido: z.string().min(1, 'Last name is required'),
  telefono: z.string().optional(),
  rolId: z.number().int().positive('Role is required'),
  userId: z.number().int().positive('User is required'),
});

export default function EmployeeForm({ employee, onSave, onCancel }) {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {},
  });

  useEffect(() => {
    reset(employee || {});
  }, [employee, reset]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles');
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium">Name</label>
        <input {...register('nombre')} id="nombre" className="w-full border rounded px-2 py-1" />
        {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
      </div>
      <div>
        <label htmlFor="apellido" className="block text-sm font-medium">Last Name</label>
        <input {...register('apellido')} id="apellido" className="w-full border rounded px-2 py-1" />
        {errors.apellido && <p className="text-red-500 text-xs">{errors.apellido.message}</p>}
      </div>
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium">Phone</label>
        <input {...register('telefono')} id="telefono" className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label htmlFor="rolId" className="block text-sm font-medium">Role</label>
        <select {...register('rolId', { valueAsNumber: true })} id="rolId" className="w-full border rounded px-2 py-1">
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.nombre}</option>
          ))}
        </select>
        {errors.rolId && <p className="text-red-500 text-xs">{errors.rolId.message}</p>}
      </div>
      <div>
        <label htmlFor="userId" className="block text-sm font-medium">User</label>
        <select {...register('userId', { valueAsNumber: true })} id="userId" className="w-full border rounded px-2 py-1">
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        {errors.userId && <p className="text-red-500 text-xs">{errors.userId.message}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </form>
  );
}

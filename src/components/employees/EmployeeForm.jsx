
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Save, X, Loader2, User, Phone, Briefcase, Mail, Lock } from 'lucide-react';

const employeeSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').or(z.literal('')),
  rolId: z.number().int().positive('El rol es requerido'),
});

export default function EmployeeForm({ employee, onSave, onCancel }) {
  const [roles, setRoles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? { ...employee, password: '' } : {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      password: '',
      rolId: '',
    },
  });

  useEffect(() => {
    reset(employee ? { ...employee, password: '' } : {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      password: '',
      rolId: '',
    });
  }, [employee, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await fetch('/api/roles');
        if (rolesRes.ok) setRoles(await rolesRes.json());
      } catch (error) {
        console.error('Error fetching form options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <User className="h-4 w-4" /> Nombre
          </label>
          <input
            {...register('nombre')}
            placeholder="Ej. Juan"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
          {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <User className="h-4 w-4" /> Apellido
          </label>
          <input
            {...register('apellido')}
            placeholder="Ej. Pérez"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
          {errors.apellido && <p className="text-red-500 text-xs">{errors.apellido.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </label>
          <input
            {...register('email')}
            placeholder="juan.perez@ejemplo.com"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Lock className="h-4 w-4" /> Contraseña {employee && '(Opcional)'}
          </label>
          <input
            {...register('password')}
            type="password"
            placeholder="******"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Phone className="h-4 w-4" /> Teléfono
          </label>
          <input
            {...register('telefono')}
            placeholder="Ej. +58 412..."
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Rol
          </label>
          <select
            {...register('rolId', { valueAsNumber: true })}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.nombre}</option>
            ))}
          </select>
          {errors.rolId && <p className="text-red-500 text-xs">{errors.rolId.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white px-4 py-2 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-gray-900 text-gray-50 px-4 py-2 hover:bg-gray-900/90 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Empleado
        </button>
      </div>
    </form>
  );
}

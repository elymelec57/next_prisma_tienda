
"use client";

import { Pencil, Trash, User, Phone, Briefcase, Calendar } from 'lucide-react';

export default function EmployeeList({ employees, onEdit, onDelete }) {
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-950 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
        <User className="h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No hay empleados registrados.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Empleado</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Rol</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Teléfono</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Contratado</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{`${employee.nombre} ${employee.apellido}`}</div>
                      <div className="text-xs text-gray-500 lg:hidden">{employee.rol?.nombre}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle hidden sm:table-cell">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20">
                    <Briefcase className="mr-1 h-3 w-3" />
                    {employee.rol?.nombre}
                  </span>
                </td>
                <td className="p-4 align-middle hidden md:table-cell text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {employee.telefono || 'Sin teléfono'}
                  </div>
                </td>
                <td className="p-4 align-middle hidden lg:table-cell text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(employee.fechaContrato).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(employee)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                      <span className="sr-only">Editar</span>
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

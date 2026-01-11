
"use client";

import { useState } from 'react';
import { Calendar, Clock, Plus, Trash, Loader2 } from 'lucide-react';

export default function EmployeeSchedule({ employee, schedules, onAddSchedule, onDeleteSchedule }) {
  const [newShift, setNewShift] = useState({ startTime: '', endTime: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddShift = async () => {
    if (!newShift.startTime || !newShift.endTime) return;
    setIsAdding(true);
    try {
      await onAddSchedule(employee.id, newShift);
      setNewShift({ startTime: '', endTime: '' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Horarios de {employee.nombre}</h2>
      </div>

      <div className="space-y-4">
        {schedules.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No hay turnos asignados para este empleado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(schedule.startTime).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {onDeleteSchedule && (
                  <button
                    onClick={() => onDeleteSchedule(schedule.id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors text-gray-400"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Asignar Nuevo Turno
        </h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500">Inicio</label>
            <input
              type="datetime-local"
              value={newShift.startTime}
              onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
            />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500">Fin</label>
            <input
              type="datetime-local"
              value={newShift.endTime}
              onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
            />
          </div>
          <button
            onClick={handleAddShift}
            disabled={isAdding || !newShift.startTime || !newShift.endTime}
            className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 text-white px-6 text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Agregar Turno'}
          </button>
        </div>
      </div>
    </div>
  );
}

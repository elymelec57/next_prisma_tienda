// src/components/employees/EmployeeSchedule.jsx
"use client";

import { useState } from 'react';

export default function EmployeeSchedule({ employee, schedules, onAddSchedule }) {
  const [newShift, setNewShift] = useState({ startTime: '', endTime: '' });

  const handleAddShift = () => {
    onAddSchedule(employee.id, newShift);
    setNewShift({ startTime: '', endTime: '' });
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Schedule for {employee.nombre} {employee.apellido}</h2>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            {new Date(schedule.startTime).toLocaleString()} - {new Date(schedule.endTime).toLocaleString()}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Add New Shift</h3>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={newShift.startTime}
            onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
            className="border rounded px-2 py-1"
          />
          <input
            type="datetime-local"
            value={newShift.endTime}
            onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
            className="border rounded px-2 py-1"
          />
          <button onClick={handleAddShift} className="bg-green-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

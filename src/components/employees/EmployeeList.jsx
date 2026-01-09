// src/components/employees/EmployeeList.jsx
"use client";

export default function EmployeeList({ employees, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="py-2 px-4 border-b">{`${employee.nombre} ${employee.apellido}`}</td>
              <td className="py-2 px-4 border-b">{employee.rol.nombre}</td>
              <td className="py-2 px-4 border-b">{employee.telefono}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onEdit(employee)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(employee.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

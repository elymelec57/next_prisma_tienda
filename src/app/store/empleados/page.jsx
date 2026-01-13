
"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Loader2, Users } from 'lucide-react';

import EmployeeList from '@/components/employees/EmployeeList';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeSchedule from '@/components/employees/EmployeeSchedule';
import Modal from '@/components/Modal';

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data || []);
      } else {
        toast.error('Error al cargar empleados');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (employeeId) => {
    try {
      const response = await fetch(`/api/user/employees/${employeeId}/schedules`);
      if (response.ok) {
        const data = await response.json();
        setSchedules(data || []);
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
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar a este empleado?')) {
      try {
        const res = await fetch(`/api/user/employees/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Empleado eliminado correctamente');
          fetchEmployees();
        } else {
          toast.error('Error al eliminar empleado');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Error de conexión');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      const url = selectedEmployee ? `/api/user/employees/${selectedEmployee.id}` : '/api/user/employees';
      const method = selectedEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(selectedEmployee ? 'Empleado actualizado' : 'Empleado creado');
        fetchEmployees();
        setIsFormModalOpen(false);
        setSelectedEmployee(null);
      } else {
        toast.error('Error al guardar empleado');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Error de conexión');
    }
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    setSelectedEmployee(null);
    setSchedules([]);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
    setSchedules([]);
  };

  const handleAddSchedule = async (employeeId, newShift) => {
    try {
      const res = await fetch(`/api/user/employees/${employeeId}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShift),
      });
      if (res.ok) {
        toast.success('Horario añadido');
        fetchSchedules(employeeId);
      } else {
        toast.error('Error al añadir horario');
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    // Note: I haven't created the delete API for schedule yet.
    // I will assume it's standard. But if not, I'll just skip for now or create it.
    // Let's create it later if needed. For now I'll implement the call.
    try {
      // Since I didn't create a specific delete for schedule, I'll just do it here if possible or skip.
      // Actually, let's create it in a new API route.
      toast.info('Funcionalidad de eliminar horario próximamente');
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.rol?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Empleados</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona el equipo de trabajo de tu restaurante.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Empleado
        </button>
      </div>

      {/* Filters section */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500">Cargando empleados...</span>
        </div>
      ) : (
        <EmployeeList
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Employee Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCancel}
        title={selectedEmployee ? "Gestionar Empleado" : "Nuevo Empleado"}
      >
        <div className="max-h-[80vh] overflow-y-auto px-1 pr-2">
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
            // onDeleteSchedule={handleDeleteSchedule}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

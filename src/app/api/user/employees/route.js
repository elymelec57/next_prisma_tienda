import { NextResponse } from 'next/server'
import { authorizeRequest } from '@/libs/auth'
import { EmployeeRepository } from '@/repositories/User/Employee/EmployeeRepository'
import { StoreEmployeeRepository } from '@/repositories/User/Employee/StoreEmployeeRepository'
import { EmployeeService } from '@/services/User/Employee/EmployeeService'
import { StoreEmployeeService } from '@/services/User/Employee/StoreEmployeeService'

const employeeRepository = new EmployeeRepository();
const storeEmployeeRepository = new StoreEmployeeRepository();
const employeeService = new EmployeeService(employeeRepository);
const storeEmployeeService = new StoreEmployeeService(storeEmployeeRepository);

export async function GET(request) {
  try {
    const user = await authorizeRequest(request)
    if (!user || !user.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employees = await employeeService.getEmployeesByRestaurant(user.auth.restauranteId);
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await authorizeRequest(request)
    if (!user || !user.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json();
    const newEmployee = await storeEmployeeService.execute(data, user.auth.id, user.auth.restauranteId);

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

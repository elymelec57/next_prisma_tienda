import { NextResponse } from 'next/server'
import { authorizeRequest } from '@/libs/auth'
import { MesaRepository } from '@/repositories/User/Mesa/MesaRepository'
import { StoreMesaRepository } from '@/repositories/User/Mesa/StoreMesaRepository'
import { MesaService } from '@/services/User/Mesa/MesaService'
import { StoreMesaService } from '@/services/User/Mesa/StoreMesaService'

const mesaRepository = new MesaRepository();
const storeMesaRepository = new StoreMesaRepository();
const mesaService = new MesaService(mesaRepository);
const storeMesaService = new StoreMesaService(mesaRepository, storeMesaRepository);

export async function GET(request) {
  const user = await authorizeRequest(request)

  if (!user || !user.authorized) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const mesas = await mesaService.getMesasByUserId(user.auth.restauranteId);

    if (mesas === null) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    return NextResponse.json(mesas)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching mesas' }, { status: 500 })
  }
}

export async function POST(request) {
  const user = await authorizeRequest(request)

  if (!user || !user.authorized) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const newMesa = await storeMesaService.createMesa(user.auth.id, data);

    if (newMesa === null) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    return NextResponse.json(newMesa)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating mesa' }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma'

export async function POST(request) {
    try {
        const { form, pago } = await request.json()

        // 1. Find Restaurant
        const restaurant = await prisma.restaurant.findFirst({
            where: { slug: form.slug }
        })

        if (!restaurant) {
            return NextResponse.json({ status: false, message: 'Restaurante no encontrado' })
        }

        // 2. Upsert Cliente
        let cliente;
        if (form.email) {
            cliente = await prisma.cliente.findUnique({ where: { email: form.email } });
        } else if (form.phone) {
            cliente = await prisma.cliente.findUnique({ where: { telefono: form.phone } });
        }

        if (!cliente) {
            cliente = await prisma.cliente.create({
                data: {
                    nombre: form.name,
                    email: form.email || null,
                    telefono: form.phone || null,
                    restaurant: {
                        connect: { id: restaurant.id }
                    }
                }
            })
        } else {
            await prisma.cliente.update({
                where: { id: cliente.id },
                data: {
                    nombre: form.name,
                    restaurant: {
                        connect: { id: restaurant.id }
                    }
                }
            })
        }

        // 3. Find or Create Mesa
        let mesa = await prisma.mesa.findFirst();
        if (!mesa) {
            mesa = await prisma.mesa.create({
                data: {
                    numero: 999,
                    capacidad: 4,
                    estado: "Libre"
                }
            })
        }

        // 4. Create Pedido
        const pedido = await prisma.pedido.create({
            data: {
                total: parseFloat(form.total),
                estado: "Pendiente",
                cliente: { connect: { id: cliente.id } },
                restaurant: { connect: { id: restaurant.id } },
                mesa: { connect: { id: mesa.id } },
            }
        })

        // 5. Create Payment record
        if (pago) {
            await prisma.payment.create({
                data: {
                    monto: parseFloat(form.total),
                    status: "PENDING",
                    paymentMethod: { connect: { id: pago } }, // 'pago' contains the paymentMethodId
                    pedido: { connect: { id: pedido.id } },
                    restaurant: { connect: { id: restaurant.id } }
                }
            })
        }

        // 6. Create ItemPedido(s) with Consolidated Notes
        if (form.order && Array.isArray(form.order)) {
            for (const item of form.order) {

                // --- Logic to consolidate per-unit configurations into a single Note ---
                // Because ItemPedido has @@unique([pedidoId, platoId]), we must aggregate.

                let nota = "";
                const configCounts = {}; // "Rice, Salad" -> 2

                // Ensure we handle the count correctly
                const count = item.count || 1;
                const relevantSelection = Array.isArray(item.selectedContornos) ? item.selectedContornos : [];

                // Iterate through every unit individually
                for (let i = 0; i < count; i++) {
                    let ids = [];
                    // Get selection for this unit
                    if (i < relevantSelection.length && Array.isArray(relevantSelection[i])) {
                        ids = relevantSelection[i];
                    } else {
                        // Default: All available contornos if not specified
                        // But wait, if unit customization implies "remove", then default is ALL.
                        // Ideally the frontend passed the full config. If missing (e.g. legacy or freshly added), assume All.
                        ids = item.contornos ? item.contornos.map(c => c.id.toString()) : [];
                    }

                    // Resolve IDs to Names
                    const names = ids.map(id => {
                        const c = item.contornos ? item.contornos.find(cx => cx.id.toString() === id) : null;
                        return c ? c.nombre : null;
                    }).filter(Boolean).sort().join(', '); // Sort for consistent grouping

                    const key = names || "Sin Contornos";
                    configCounts[key] = (configCounts[key] || 0) + 1;
                }

                // Build note string
                const parts = [];
                for (const [names, qty] of Object.entries(configCounts)) {
                    parts.push(`${qty}x [${names}]`);
                }
                if (parts.length > 0) {
                    nota = `Detalle: ${parts.join('; ')}`;
                }

                await prisma.itemPedido.create({
                    data: {
                        cantidad: count,
                        precioUnitario: parseFloat(item.price),
                        nota: nota,
                        pedido: { connect: { id: pedido.id } },
                        plato: { connect: { id: item.id } }
                    }
                })
            }
        }

        return NextResponse.json({ status: true, message: 'Orden solicitada con exito' })

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ status: false, message: 'Error al procesar la orden: ' + error.message })
    }
}
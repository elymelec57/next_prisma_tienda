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
        const conditions = [];
        if (form.email) conditions.push({ email: form.email });
        if (form.phone) conditions.push({ telefono: form.phone });

        if (conditions.length > 0) {
            cliente = await prisma.cliente.findFirst({
                where: {
                    OR: conditions
                }
            });
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
            const updateData = {
                nombre: form.name,
                restaurant: {
                    connect: { id: restaurant.id }
                }
            };
            // Update email/phone if they were missing but provided now
            if (!cliente.email && form.email) updateData.email = form.email;
            if (!cliente.telefono && form.phone) updateData.telefono = form.phone;

            await prisma.cliente.update({
                where: { id: cliente.id },
                data: updateData
            })
        }

        // 3. Create Pedido (Delivery orders don't require a mesa)
        const pedido = await prisma.pedido.create({
            data: {
                total: parseFloat(form.total),
                subTotal: parseFloat(form.subtotal) || 0,
                estado: "Pendiente",
                cliente: { connect: { id: cliente.id } },
                restaurant: { connect: { id: restaurant.id } },
                sucursalId: form.sucursalId ? parseInt(form.sucursalId) : null,
                direccion: form.direccion || null,
                distancia: form.distancia ? parseFloat(form.distancia) : null,
                deliveryFee: form.deliveryFee ? parseFloat(form.deliveryFee) : null,
            }
        })

        // 5. Create Payment record
        let payment = null;
        if (pago) {
            payment = await prisma.payment.create({
                data: {
                    monto: parseFloat(form.total),
                    status: "PENDING",
                    paymentMethod: { connect: { id: pago } }, // 'pago' contains the paymentMethodId
                    pedido: { connect: { id: pedido.id } },
                    restaurant: { connect: { id: restaurant.id } },
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
                        ids = [];
                    }

                    // Calculate total extra price for this configuration per unit
                    let unitExtraPrice = 0;
                    ids.forEach(id => {
                        const c = item.contornos ? item.contornos.find(cx => cx.id.toString() === id.toString()) : null;
                        if (c && c.price) unitExtraPrice += Number(c.price);
                    });

                    const names = ids.map(id => {
                        const c = item.contornos ? item.contornos.find(cx => cx.id.toString() === id) : null;
                        return c ? c.nombre : null;
                    }).filter(Boolean).sort().join(', '); // Sort for consistent grouping

                    const key = unitExtraPrice > 0 
                        ? `${names || "Sin extras"} (+$${unitExtraPrice.toFixed(2)})`
                        : (names || "Sin extras");
                        
                    configCounts[key] = (configCounts[key] || 0) + 1;
                }

                // Iterate through every distinct configuration and create an ItemPedido for each
                for (const [configKey, qty] of Object.entries(configCounts)) {
                    // Extract extra price from configKey if present
                    // Key format: "Names (+$Price)" or "Names"
                    let extraPrice = 0;
                    const priceMatch = configKey.match(/\(\+\$([0-9.]+)\)/);
                    if (priceMatch) {
                        extraPrice = parseFloat(priceMatch[1]);
                    }

                    await prisma.itemPedido.create({
                        data: {
                            cantidad: qty,
                            precioUnitario: parseFloat(item.price) + extraPrice,
                            nota: configKey.startsWith("Sin extras") && !configKey.includes("+$") ? null : `Detalle: ${configKey}`,
                            pedido: { connect: { id: pedido.id } },
                            plato: { connect: { id: item.id } }
                        }
                    })
                }
            }
        }

        return NextResponse.json({ status: true, message: 'Orden solicitada con exito', paymentId: payment.id })

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ status: false, message: 'Error al procesar la orden' })
    }
}
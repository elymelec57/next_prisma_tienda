import { NextResponse } from "next/server";
import { IBuy } from "@/interfaces/Platform/BuyInterface";
import { SaveImageInterface } from "@/interfaces/Shared/File/SaveImageInterface";

export class BuyService {
    constructor(private buyRepository: IBuy, private saveImage: SaveImageInterface) { }

    async execute(form: any, pago: any, comprobante: any) {
        // find restaurant by slug
        const restaurant = await this.buyRepository.findRestaurantBySlug(form.slug)

        if (!restaurant) {
            return NextResponse.json({ status: false, message: 'Restaurante no encontrado' })
        }

        // 2. Upsert Cliente
        let cliente;
        const conditions = [];
        if (form.email) conditions.push({ email: form.email });
        if (form.phone) conditions.push({ telefono: form.phone });

        if (conditions.length > 0) {
            cliente = await this.buyRepository.findClient(conditions);
        }

        if (!cliente) {
            cliente = await this.buyRepository.createClient({
                data: {
                    nombre: String(form.name),
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
                email: form.email || null,
                telefono: form.phone || null,
                restaurant: {
                    connect: { id: restaurant.id }
                }
            };

            await this.buyRepository.updateClient(cliente.id, updateData);
        }

        // 3. Create Pedido (Delivery orders don't require a mesa)
        let pedido;
        if (form.sucursalId != null) {
            pedido = await this.buyRepository.createPedido({
                data: {
                    total: parseFloat(form.total),
                    subTotal: parseFloat(form.subtotal) || 0,
                    estado: "Pendiente",
                    cliente: { connect: { id: cliente.id } },
                    restaurant: { connect: { id: restaurant.id } },
                    sucursal: { connect: { id: Number(form.sucursalId) } },
                    direccion: form.direccion || null,
                    distancia: form.distancia ? parseFloat(form.distancia) : null,
                    deliveryFee: form.deliveryFee ? parseFloat(form.deliveryFee) : null,
                }
            })
        } else {
            pedido = await this.buyRepository.createPedido({
                data: {
                    total: parseFloat(form.total),
                    subTotal: parseFloat(form.subtotal) || 0,
                    estado: "Pendiente",
                    cliente: { connect: { id: cliente.id } },
                    restaurant: { connect: { id: restaurant.id } },
                    direccion: form.direccion || null,
                    distancia: form.distancia ? parseFloat(form.distancia) : null,
                    deliveryFee: form.deliveryFee ? parseFloat(form.deliveryFee) : null,
                }
            })
        }

        // 5. Create Payment record
        let payment = null;
        if (pago) {
            if (comprobante) {
                // Guardar comprobante
                const blob = await this.saveImage.saveImage('payment', comprobante);

                const image = await this.buyRepository.createImage({
                    blob: blob,
                    id: 'Por_definir',
                    model: "payment",
                });

                payment = await this.buyRepository.createPayment({
                    data: {
                        monto: parseFloat(form.total),
                        status: "PENDING",
                        paymentMethod: { connect: { id: pago } }, // 'pago' contains the paymentMethodId
                        pedido: { connect: { id: pedido.id } },
                        mainImageId: image.id,
                        restaurant: { connect: { id: restaurant.id } },
                    }
                })

                await this.buyRepository.updateImage(image.id, String(payment.id));
            } else {
                payment = await this.buyRepository.createPayment({
                    data: {
                        monto: parseFloat(form.total),
                        status: "PENDING",
                        paymentMethod: { connect: { id: pago } }, // 'pago' contains the paymentMethodId
                        pedido: { connect: { id: pedido.id } },
                        restaurant: { connect: { id: restaurant.id } },
                    }
                })
            }
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

                    await this.buyRepository.createItemPedido({
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

        return payment;
    }
}
/**
 * Genera el próximo código de pedido para un restaurante y sucursal.
 * El código no depende del id autoincrementable, se contruye en base a:
 * - restaurante: prefijo con su id
 * - sucursal: su id (o 'C' para central / delivery sin sucursal)
 * - contador secuencial por restaurante + sucursal
 *
 * Debe ejecutarse dentro de una transacción para evitar duplicados.
 */
export async function getNextOrderCode(tx, restaurantId, sucursalId) {
    const branch = sucursalId ? `S${sucursalId}` : 'C';
    const prefix = `R${restaurantId}-${branch}`;

    const existing = await tx.pedido.findFirst({
        where: { codigo: { startsWith: `${prefix}-` } },
        orderBy: { id: 'desc' },
        select: { codigo: true },
    });

    let next = 1;
    if (existing?.codigo) {
        const lastPart = existing.codigo.split('-').pop();
        const lastNum = parseInt(lastPart, 10);
        if (!Number.isNaN(lastNum)) {
            next = lastNum + 1;
        }
    }

    return `${prefix}-${String(next).padStart(4, '0')}`;
}
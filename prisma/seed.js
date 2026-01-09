// prisma/seed.ts

const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

const bcrypt = require('bcryptjs');

async function main() {
  console.log('--- Iniciando el seeding ---');

  // 1. Limpieza de datos (Opcional, cuidado en producción)
  // El orden importa por las relaciones
  await prisma.image.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.plato.deleteMany();
  await prisma.mesa.deleteMany();
  await prisma.restaurantHours.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rolUser.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.categoriaIngrediente.deleteMany();

  // 2. Crear Roles de Usuario (Sistema)
  const rolAdmin = await prisma.rolUser.create({ data: { name: 'Admin' } });
  const rolUser = await prisma.rolUser.create({ data: { name: 'User' } });

  // 3. Crear Usuario con Múltiples Roles
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("elymelec", salt);

  const user = await prisma.user.create({
    data: {
      email: 'usuarioprueba@gmail.com',
      name: 'usuario prueba',
      password: hash, // En un caso real, usa bcrypt
      roles: {
        connect: [{ id: rolUser.id }]
      }
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'elymelecc084@gmail.com',
      name: 'elymelec',
      password: hash, // En un caso real, usa bcrypt
      roles: {
        connect: [{ id: rolAdmin.id }]
      }
    }
  });

  // 4. Crear Categorías
  const catComida = await prisma.categoria.create({ data: { nombre: 'Hamburguesas' } });
  const catBebida = await prisma.categoria.create({ data: { nombre: 'Bebidas' } });
  const catIngrediente = await prisma.categoriaIngrediente.create({ data: { nombre: 'Proteínas' } });

  // 5. Crear Restaurante
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'La Forchetta de Oro',
      slug: 'la-forchetta-oro',
      slogan: 'Sabor italiano en tu mesa',
      phone: '+584120000000',
      direcction: 'Calle Falsa 123, Caracas',
      userId: user.id,
      restaurantHours: {
        create: {
          dayOfWeek: 1, // Lunes
          openTime: '08:00',
          closeTime: '22:00',
        }
      }
    }
  });

  // 6. Manejo Polimórfico: Crear Imagen para el Restaurante
  await prisma.image.create({
    data: {
      url: 'https://mi-bucket.com/logo-restaurant.jpg',
      altText: 'Logo de La Forchetta',
      modelId: restaurant.id.toString(), // ID del restaurante
      modelType: 'Restaurant'           // Tipo de modelo
    }
  });

  // 7. Crear Platos
  const plato1 = await prisma.plato.create({
    data: {
      nombre: 'Hamburguesa Trufada',
      descripcion: 'Carne de angus con aceite de trufa',
      precio: 15.50,
      categoriaId: catComida.id,
      restaurantId: restaurant.id,
    }
  });

  // 8. Crear Mesas
  await prisma.mesa.createMany({
    data: [
      { numero: 1, capacidad: 4, estado: 'Libre' },
      { numero: 2, capacidad: 2, estado: 'Ocupada' },
      { numero: 3, capacidad: 6, estado: 'Libre' },
    ]
  });

  // 9. Métodos de Pago
  await prisma.paymentMethod.create({
    data: {
      type: 'PAGO_MOVIL',
      label: 'Banesco Principal',
      ownerName: 'Admin User',
      ownerId: 'V-12345678',
      bankName: 'Banesco',
      phoneNumber: '04121234567',
      restaurantId: restaurant.id
    }
  });

  // 10. Roles de Empleados y Empleado
  const rolMesero = await prisma.rol.create({ data: { nombre: 'Mesero' } });

  await prisma.empleado.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      rolId: rolMesero.id,
      userId: user.id, // Vinculado al mismo usuario por simplicidad en el seed
    }
  });

  console.log('--- Seeding completado con éxito ---');
}

// Ejecuta la función principal y maneja los errores
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cierra la conexión de Prisma al finalizar
    await prisma.$disconnect();
  });
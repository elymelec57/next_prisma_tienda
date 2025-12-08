// prisma/seed.ts

const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

const bcrypt = require('bcryptjs');

async function main() {
  console.log('Iniciando el proceso de seeding...');

  // --- 1. Seeders para Roles (Empleados) ---
  console.log('Creando roles...');
  const rolesData = [
    { nombre: 'Administrador' },
    { nombre: 'Mesero' },
    { nombre: 'Cocinero' },
    { nombre: 'Barista' },
  ];

  for (const rol of rolesData) {
    await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: {}, // No hacemos nada si existe
      create: rol,
    });
  }

  await prisma.rolUser.createMany({
    data: [
      {
        name: 'Admin',
      },
      {
        name: 'User',
      },
    ],
    skipDuplicates: true, // Esto evita errores si intentamos insertar platos con el mismo nombre
  });

  console.log("creando los usuarios de las cuentas para los restarantes")

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("elymelec", salt);

  const user = await prisma.user.upsert({
    where: { email: 'usuarioprueba@gmail.com' },
    update: {},
    create: {
      email: 'usuarioprueba@gmail.com',
      name: 'usuario prueba',
      password: hash,
      roles: {
        connect: {
          id: 2,
        },
      },
    },
  })

  const rest = await prisma.restaurant.createMany({
    data: [
      {
        slug: 'los-mejores',
        name: 'Los mejores',
        slogan: "jhiugi ig igiu giu ilug ilugliu giug i",
        direcction: "jhiugi ig igiu giu ilug ilugliu giug i",
        slogan: "jhiugi ig igiu giu ilug ilugliu giug i",
        phone: "53563565656",
        logo: "logo-xfAFf3VBTRBbQE9hrAGUbczaGYPKEN.jpg",
        userId: user.id,
      },
    ],
    skipDuplicates: true, // Esto evita errores si intentamos insertar platos con el mismo nombre
  });

  // Obtenemos los IDs de los roles para usarlos en Empleado si fuera necesario
  const rolMesero = await prisma.rol.findUnique({ where: { nombre: 'Mesero' } });
  const rolAdmin = await prisma.rol.findUnique({ where: { nombre: 'Administrador' } });


  // --- 2. Seeders para Categorías (Menú) ---
  console.log('Creando categorías de menú...');
  const categoriaEntrada = await prisma.categoria.upsert({
    where: { nombre: 'Entradas' },
    update: {},
    create: { nombre: 'Entradas' },
  });

  const categoriaPrincipal = await prisma.categoria.upsert({
    where: { nombre: 'Platos Principales' },
    update: {},
    create: { nombre: 'Platos Principales' },
  });

  const categoriaBebida = await prisma.categoria.upsert({
    where: { nombre: 'Bebidas' },
    update: {},
    create: { nombre: 'Bebidas' },
  });

  // --- 3. Seeders para Platos ---
  // console.log('Creando platos de ejemplo...');
  // await prisma.plato.createMany({
  //   data: [
  //     {
  //       nombre: 'Sopa del Día',
  //       precio: 5.50,
  //       descripcion: 'Deliciosa sopa fresca de temporada.',
  //       categoriaId: categoriaEntrada.id,
  //       restaurantId: 1
  //     },
  //     {
  //       nombre: 'Filete de Res a la Parrilla',
  //       precio: 18.99,
  //       descripcion: 'Servido con papas rústicas y vegetales.',
  //       categoriaId: categoriaPrincipal.id,
  //       restaurantId: 1
  //     },
  //     {
  //       nombre: 'Limonada de Menta',
  //       precio: 3.50,
  //       descripcion: 'Refrescante limonada natural con hojas de menta.',
  //       categoriaId: categoriaBebida.id,
  //       restaurantId: 1
  //     },
  //   ],
  //   skipDuplicates: true, // Esto evita errores si intentamos insertar platos con el mismo nombre
  // });

  // --- 4. Seeders para Mesas ---
  console.log('Creando mesas...');
  await prisma.mesa.createMany({
    data: [
      { numero: 1, capacidad: 4, estado: "Libre" },
      { numero: 2, capacidad: 2, estado: "Libre" },
      { numero: 3, capacidad: 6, estado: "Libre" },
    ],
    skipDuplicates: true,
  });


  console.log('Seeding completado exitosamente.');
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
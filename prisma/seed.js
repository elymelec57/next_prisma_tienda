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
  await prisma.categoriaRestaurant.deleteMany();

  // 2. Crear Roles de Usuario (Sistema)
  const rolAdmin = await prisma.rolUser.create({ data: { name: 'Admin' } });
  const rolUser = await prisma.rolUser.create({ data: { name: 'User' } });

  // --- Crear Categorías de Restaurante ---
  const catItaliana = await prisma.categoriaRestaurant.create({ data: { nombre: 'Italiana' } });
  const catHamburguesas = await prisma.categoriaRestaurant.create({ data: { nombre: 'Hamburguesas' } });
  const catPizza = await prisma.categoriaRestaurant.create({ data: { nombre: 'Pizza' } });
  const catSushi = await prisma.categoriaRestaurant.create({ data: { nombre: 'Sushi' } });
  const catMexicana = await prisma.categoriaRestaurant.create({ data: { nombre: 'Mexicana' } });
  const catCafe = await prisma.categoriaRestaurant.create({ data: { nombre: 'Cafetería' } });
  const catComidaRapida = await prisma.categoriaRestaurant.create({ data: { nombre: 'Comida Rápida' } });

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
  const catPerros = await prisma.categoria.create({ data: { nombre: 'Perros' } });
  const catBebida = await prisma.categoria.create({ data: { nombre: 'Bebidas' } });
  const catPostres = await prisma.categoria.create({ data: { nombre: 'Postres' } });
  const catIngrediente = await prisma.categoriaIngrediente.create({ data: { nombre: 'Proteínas' } });

  const data = [
    {
      category: 'Frutas y Verduras',
      ingredients: ['Tomate', 'Cebolla', 'Ajo', 'Zanahoria', 'Espinacas', 'Manzana', 'Aguacate', 'Limón']
    },
    {
      category: 'Proteínas (Carnes y Pescados)',
      ingredients: ['Pechuga de Pollo', 'Carne de Res', 'Salmón', 'Lomo de Cerdo', 'Atún en lata']
    },
    {
      category: 'Lácteos y Huevos',
      ingredients: ['Leche entera', 'Queso Parmesano', 'Yogur natural', 'Huevo', 'Mantequilla']
    },
    {
      category: 'Legumbres y Granos',
      ingredients: ['Arroz blanco', 'Lentejas', 'Garbanzos', 'Frijoles negros', 'Quinoa']
    },
    {
      category: 'Especias y Hierbas',
      ingredients: ['Sal marina', 'Pimienta negra', 'Orégano', 'Albahaca', 'Comino', 'Pimentón']
    },
    {
      category: 'Aceites y Grasas',
      ingredients: ['Aceite de Oliva Virgen Extra', 'Aceite de Girasol', 'Manteca de cerdo', 'Aceite de Coco']
    },
    {
      category: 'Panadería y Repostería',
      ingredients: ['Harina de Trigo', 'Azúcar blanca', 'Levadura seca', 'Polvo de hornear', 'Pepitas de Chocolate']
    },
    {
      category: 'Condimentos y Salsas',
      ingredients: ['Mostaza', 'Ketchup', 'Mayonesa', 'Salsa de Soja', 'Vinagre de manzana']
    },
    {
      category: 'Bebidas',
      ingredients: ['Agua mineral', 'Café en grano', 'Té verde', 'Vino tinto', 'Cerveza']
    },
    {
      category: 'Frutos Secos y Semillas',
      ingredients: ['Nueces', 'Almendras', 'Semillas de Chía', 'Sésamo', 'Cacahuetes']
    }
  ];

  console.log('🌱 Sembrando categorías e ingredientes...');

  for (const item of data) {
    // 1. Primero creamos o actualizamos la categoría
    const category = await prisma.categoriaIngrediente.upsert({
      where: { nombre: item.category },
      update: {},
      create: { nombre: item.category },
    });

    console.log(`  - Categoría: ${category.nombre}`);

    // 2. Insertamos los ingredientes asociados a esa categoría
    for (const ingredientName of item.ingredients) {
      const i = await prisma.ingrediente.upsert({
        where: { nombre: ingredientName }, // Asumiendo que el nombre es único
        update: { categoriaIngredienteId: Number(category.id) },
        create: {
          nombre: ingredientName,
          categoriaIngredienteId: Number(category.id),
        },
      });
    }
  }

  console.log('✅ Base de datos poblada con éxito.');

  // 5. Crear Restaurante
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'La Forchetta de Oro',
      slug: 'la-forchetta-oro',
      slogan: 'Sabor italiano en tu mesa',
      phone: '+584120000000',
      direcction: 'Calle Falsa 123, Caracas',
      userId: user.id,
      categoriaRestaurant: {
        connect: [{ id: catItaliana.id }, { id: catCafe.id }]
      },
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

  const plato2 = await prisma.plato.create({
    data: {
      nombre: 'Hamburguesa de la casa',
      descripcion: 'Carne de angus con aceite de trufa',
      precio: 15.50,
      categoriaId: catComida.id,
      restaurantId: restaurant.id,
    }
  });

  const plato3 = await prisma.plato.create({
    data: {
      nombre: 'Hamburguesa 3',
      descripcion: 'Carne de angus con aceite de trufa',
      precio: 15.50,
      categoriaId: catComida.id,
      restaurantId: restaurant.id,
    }
  });

  const plato4 = await prisma.plato.create({
    data: {
      nombre: 'Perros calientes',
      descripcion: 'todo lo mejor',
      precio: 15.50,
      categoriaId: catPerros.id,
      restaurantId: restaurant.id,
    }
  });

  const plato5 = await prisma.plato.create({
    data: {
      nombre: 'Perros 2',
      descripcion: 'todo lo mejor',
      precio: 15.50,
      categoriaId: catPerros.id,
      restaurantId: restaurant.id,
    }
  });

  const plato6 = await prisma.plato.create({
    data: {
      nombre: 'Perros 3',
      descripcion: 'todo lo mejor',
      precio: 15.50,
      categoriaId: catPerros.id,
      restaurantId: restaurant.id,
    }
  });

  const plato7 = await prisma.plato.create({
    data: {
      nombre: 'Jugo de guayaba',
      descripcion: 'todo lo mejor',
      precio: 15.50,
      categoriaId: catBebida.id,
      restaurantId: restaurant.id,
    }
  });

  const plato8 = await prisma.plato.create({
    data: {
      nombre: 'Jugo de pera',
      descripcion: 'todo lo mejor',
      precio: 15.50,
      categoriaId: catBebida.id,
      restaurantId: restaurant.id,
    }
  });

  const plato9 = await prisma.plato.create({
    data: {
      nombre: 'Jugo de naranja',
      descripcion: 'todo lo mejor',
      precio: 15.50,
      categoriaId: catBebida.id,
      restaurantId: restaurant.id,
    }
  });

  const plato10 = await prisma.plato.create({
    data: {
      nombre: 'Torta de ahuyama',
      descripcion: 'todo lo mejor',
      precio: 15.50,
      categoriaId: catPostres.id,
      restaurantId: restaurant.id,
    }
  });
  // 8. Crear Mesas
  await prisma.mesa.createMany({
    data: [
      { numero: 1, capacidad: 4, estado: 'Libre', restaurantId: restaurant.id },
      { numero: 2, capacidad: 2, estado: 'Libre', restaurantId: restaurant.id },
      { numero: 3, capacidad: 6, estado: 'Libre', restaurantId: restaurant.id },
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
  const rolMesero = await prisma.rol.create({ data: { name: 'Mesero' } });
  const rolCocina = await prisma.rol.create({ data: { name: 'Cocina' } });
  const rolCaja = await prisma.rol.create({ data: { name: 'Caja' } });
  const rolDelivery = await prisma.rol.create({ data: { name: 'Delivery' } });

  await prisma.empleado.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'mesero@gmail.com',
      password: hash,
      rolId: rolMesero.id,
      userId: user.id, // Vinculado al mismo usuario por simplicidad en el seed
      restaurantId: restaurant.id
    }
  });

  await prisma.empleado.create({
    data: {
      nombre: 'Juan2',
      apellido: 'Pérez',
      email: 'cocina@gmail.com',
      password: hash,
      rolId: rolCocina.id,
      userId: user.id, // Vinculado al mismo usuario por simplicidad en el seed
      restaurantId: restaurant.id
    }
  });

  await prisma.empleado.create({
    data: {
      nombre: 'Juan3',
      apellido: 'Pérez',
      email: 'caja@gmail.com',
      password: hash,
      rolId: rolCaja.id,
      userId: user.id, // Vinculado al mismo usuario por simplicidad en el seed
      restaurantId: restaurant.id
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
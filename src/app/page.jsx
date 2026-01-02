import NavBarIndex from '@/components/NavBarIndex';
import { prisma } from '@/libs/prisma';
import CartBusiness from '@/components/cartBusiness';

export async function generateMetadata() {
  return {
    title: "APP STORE",
    description: "Las mejeres tiendas las encuetras aqui",
  }
}

export default async function page() {
  const restaurant = await prisma.restaurant.findMany()

  const imageIds = restaurant
    .map((r) => r.mainImageId)
    .filter((id) => id !== null);

  if (imageIds.length === 0) {
    // No hay imágenes para buscar, devolver solo los productos
    const dataRest = restaurant.map((r) => ({ ...r, mainImage: null }));
    return NextResponse.json({ dataRest })
  }

  const images = await prisma.image.findMany({
    where: {
      id: {
        in: imageIds, // Filtrar por los IDs que acabamos de extraer
      },
      modelType: 'restaurant',
    },
    select: {
      id: true, // Incluir el ID para mapear
      url: true,
      //altText: true,
    },
  });

  // 4. Mapear las imágenes a los productos
  const imageMap = new Map(images.map((img) => [img.id, img]));

  const dataRest = restaurant.map((r) => ({
    ...r,
    mainImage: r.mainImageId ? imageMap.get(r.mainImageId) : null,
  }));

  console.log(dataRest)
  return (
    <div>
      <NavBarIndex />
      <div className='container mt-30 mx-auto'>
        <div className='flex flex-wrap justify-center space-x-2'>
          <CartBusiness restaurant={dataRest} />
        </div>
      </div>
    </div>
  )
}

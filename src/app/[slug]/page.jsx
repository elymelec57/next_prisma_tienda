import { BusinessData } from '@/libs/BusinessData';
import NavBarBusiness from '@/components/NavBarBusiness';
import { prisma } from '@/libs/prisma';
import Cart from '@/components/Cart';

export async function generateMetadata({ params }) {
  const { slug } = await params
  const business = await BusinessData(slug)
  return {
    title: business.name,
    description: business.slogan,
  }
}

export default async function page({ params }) {
  const { slug } = await params
  const business = await BusinessData(slug)

  const products = await prisma.product.findMany({
    where: {
      user: {
        id: Number(business.userId)
      }
    }
  })

  return (
    <div>
      <NavBarBusiness business={business} />
      <div className='container mt-30 mx-auto'>
        <div className='flex flex-wrap justify-center space-x-2'>
          <Cart products={JSON.parse(JSON.stringify(products))} />
        </div>
      </div>
    </div>
  )
}

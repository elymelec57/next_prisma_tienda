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
  const business = await prisma.business.findMany()
  console.log(process.env.JWT_TOKEN)
  return (
    <div>
      <NavBarIndex />
      <div className='container mt-30 mx-auto'>
        <div className='flex flex-wrap justify-center space-x-2'>
          <CartBusiness business={business} />
        </div>
      </div>
    </div>
  )
}

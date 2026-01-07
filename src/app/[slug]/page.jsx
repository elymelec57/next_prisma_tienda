import { BusinessData } from '@/libs/BusinessData';
import NavBarBusiness from '@/components/NavBarBusiness';
import Cart from '@/components/Cart';
import { ProductsData } from '@/libs/ProductsData';

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
  const products = await ProductsData(business.userId)

  return (
    <div>
      <NavBarBusiness business={business} />
      <div className='container mt-30 mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          <Cart products={JSON.parse(JSON.stringify(products))} />
        </div>
      </div>
    </div>
  )
}

import { BusinessData } from '@/libs/BusinessData';
import NavBarBusiness from '@/components/NavBarBusiness';
import { prisma } from '@/libs/prisma';

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
        <div className='flex justify-center space-x-2'>
          {
            products.map((p) => (
              <div key={p.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <img className="rounded-t-lg" src={`/images/${p.image}`} alt="" />
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{p.name}</h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{p.description}</p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{parseFloat(p.price).toFixed(2)}</p>
                  <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Comprar
                  </a>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

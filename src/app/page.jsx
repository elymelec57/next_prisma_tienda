import NavBarIndex from '@/components/NavBarIndex';
import RestaurantList from '@/components/RestaurantList';

export async function generateMetadata() {
  return {
    title: "APP STORE",
    description: "Las mejeres tiendas las encuetras aqui",
  }
}

export default function page() {
  return (
    <div>
      <NavBarIndex />
      <div className='container mt-30 mx-auto'>
        <RestaurantList />
      </div>
    </div>
  )
}

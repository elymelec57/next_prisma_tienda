import { prisma } from '@/libs/prisma'
import ButtomEdit from '@/components/buttomEdit';
import Link from 'next/link';
import ButtomDelete from '@/components/buttomdelete';

export default async function ListAdmin() {

  const admin = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      roles: {
        some: {
          name: "Admin"
        }
      }
    },
  });

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-center text-2xl font-bold mb-2">List of Admin</h1>
      <div>
        <Link href={'/dashboard/admin/new'} className="bg-blue-500 text-white p-2 rounded-md">New Admin</Link>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {
              admin.map((a) => (
                <tr key={a.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {a.name}
                  </th>
                  <td className="px-6 py-4">
                    {a.email}
                  </td>
                  <td className="px-6 py-4">
                    <ButtomEdit path='/dashboard/admin/edit/' id={a.id} />
                    <ButtomDelete path='/api/user/' id={a.id} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

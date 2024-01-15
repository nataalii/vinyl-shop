import { getServerSession } from 'next-auth/next';
import { getOrders, getUser, orderItem } from '@/lib/handlers';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import {
  BuildingOfficeIcon,
  CakeIcon,
  EnvelopeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function Profile() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }
  const user = await getUser(session.user._id);
  const orderItems = (await getOrders(
    session.user._id,
  )) as unknown as Array<orderItem>;

  if (!orderItems) {
    notFound();
  }

  return (
    <>
      <section className='flex flex-col gap-3 md:px-10 text-xs sm:text-sm font-bold '>
        <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
          User Profile
        </h3>
        <div className=' flex gap-3'>
          <UserIcon className=' w-4 fill-black' />
          <p>Full name: </p>
          <p className=' font-light'>
            {user?.name} {user?.surname}
          </p>
        </div>
        <div className=' flex gap-3'>
          <EnvelopeIcon className=' w-4 fill-black text-white' />
          <p>E-mail address: </p>
          <p className=' font-light'>{user?.email}</p>
        </div>
        <div className=' flex gap-3 items-center'>
          <BuildingOfficeIcon className=' w-4 fill-black' />
          <p>Address: </p>
          <p className=' font-light'>{user?.address}</p>
        </div>
        <div className=' flex gap-3'>
          <CakeIcon className=' w-4 fill-black' />
          <p>Birthdate:</p>
          <p className=' font-light'>
            {user?.birthdate
              ? new Date(user.birthdate).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </section>

      <section className='flex flex-col gap-3 mt-10 md:px-10 text-xs sm:text-sm  '>
        <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
          Orders
        </h3>
        <div className='relative overflow-auto shadow-md rounded-xl'>
          <table className='w-full text-xs md:text-sm text-left text-gray-600 rounded-lg'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-100'>
              <tr>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 md:px-6 py-3'
                >
                  ORDER ID
                </th>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 md:px-6 py-3'
                >
                  SHIPMENT ADDRESS
                </th>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 md:px-6 py-3'
                >
                  PAYMENT INFORMATION
                </th>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 md:px-6 py-3 hidden sm:block'
                ></th>
              </tr>
            </thead>

            <tbody className=' font-medium'>
              {orderItems.map((orderItem: orderItem) => (
                <tr
                  className='bg-white border-b border-gray-200'
                  key={orderItem._id.toString()}
                >
                  <th
                    scope='row'
                    className='text-[10px] sm:text-sm px-2 md:px-6 py-4 font-medium text-gray-900  '
                  >
                    <Link href={`/orders/${orderItem._id}`}>
                      {orderItem._id.toString()}
                    </Link>
                  </th>

                  <td className='text-[10px] sm:text-sm px-2 md:px-6 py-4'>
                    {orderItem.address}
                  </td>
                  <td className='text-[10px] sm:text-sm px-2 md:px-6 py-4'>
                    {orderItem.cardHolder} <br />
                    <span className=' font-light'>{orderItem.cardNumber}</span>
                  </td>
                  <td className='text-[10px] sm:text-sm px-2 md:px-6 py-4 hidden sm:block'>
                    <Link href={`/orders/${orderItem._id}`}>View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

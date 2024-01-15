import { getServerSession } from 'next-auth/next';
import { getOrder } from '@/lib/handlers';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import {
  BuildingOfficeIcon,
  CalendarIcon,
  CreditCardIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function Order({
  params,
}: {
  params: { orderId: string };
}) {
  const session: Session | null = await getServerSession(authOptions);
  const orderId = params.orderId;

  if (!session) {
    redirect('/auth/signin');
  }

  const order = await getOrder(session.user._id, orderId);

  if (!order) {
    notFound();
  }
  const totalPrice = order.orderItems.reduce(
    (total, orderItem) => total + orderItem.qty * orderItem.price,
    0,
  );
  return (
    <>
      <section className='flex flex-col gap-3 md:px-10 text-xs sm:text-sm font-bold '>
        <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
          Order Details
        </h3>
        <div className=' flex gap-3'>
          <ShoppingCartIcon className=' w-4 fill-black' />
          <p>Order ID: </p>
          <p className=' font-light'>{order?._id}</p>
        </div>
        <div className=' flex gap-3'>
          <BuildingOfficeIcon className=' w-4 fill-black' />
          <p>Shipping address: </p>
          <p className=' font-light'>{order?.address}</p>
        </div>
        <div className=' flex gap-3 items-center'>
          <CreditCardIcon className=' w-4 fill-black text-white' />
          <p>Payment Information: </p>
          <p className=' font-light'>
            {order?.cardNumber} ({order?.cardHolder})
          </p>
        </div>
        <div className=' flex gap-3'>
          <CalendarIcon className=' w-4' />
          <p>Date of purchase:</p>
          <p className=' font-light'>
            {order?.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </section>

      <section className='flex flex-col gap-3 mt-10 md:px-10 text-xs sm:text-sm  '>
        <div className='relative overflow-x-auto shadow-md rounded-xl'>
          <table className='w-full text-sm text-left text-gray-600 rounded-lg'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-100'>
              <tr>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 sm:px-6 py-3'
                >
                  Product Name
                </th>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 sm:px-6 py-3'
                >
                  Quantity
                </th>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 sm:px-6 py-3'
                >
                  Price
                </th>
                <th
                  scope='col'
                  className='text-[10px] sm:text-sm px-2 sm:px-6 py-3'
                >
                  Total
                </th>
              </tr>
            </thead>

            <tbody className=' font-medium'>
              {order.orderItems.map((orderItem: any) => (
                <tr
                  className='bg-white border-b border-gray-200'
                  key={orderItem.product._id.toString()}
                >
                  <th
                    scope='row'
                    className='text-[10px] sm:text-sm px-2 sm:px-6 py-4 font-medium text-gray-900 '
                  >
                    <Link href={`/products/${orderItem.product._id}`}>
                      {orderItem.product.name}
                    </Link>
                  </th>
                  <td className='text-[10px] sm:text-sm px-2 sm:px-6 py-4'>
                    {orderItem.qty}
                  </td>
                  <td className='text-[10px] sm:text-sm px-2 sm:px-6 py-4'>
                    {orderItem.price} <br />
                    <span className=' font-light'>{orderItem.cardNumber}</span>
                  </td>
                  <td className='text-[10px] sm:text-sm px-2 sm:px-6 py-4'>
                    {(
                      Math.round(orderItem.qty * orderItem.price * 100) / 100
                    ).toFixed(2) + ' €'}
                  </td>
                </tr>
              ))}
              <tr className='bg-white border-b border-gray-200'>
                <th className='text-[10px] sm:text-sm px-2 sm:px-6 py-4 font-bold text-gray-900 text-left'>
                  Total
                </th>

                <td></td>
                <td></td>
                <td className='text-[10px] sm:text-sm px-2 sm:px-6 py-4'>
                  {totalPrice.toFixed(2)} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

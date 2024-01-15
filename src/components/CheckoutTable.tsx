'use client';
import PurchaseForm from './PurchaseForm';
import Link from 'next/link';
import { useContext } from 'react';
import { CartItemsContext } from '@/providers/CartItemsProvides';

export default function CheckoutTable({ userId }: any) {
  const { cartItems } = useContext(CartItemsContext);

  const totalPrice = cartItems.reduce(
    (total, cartItem) => total + cartItem.qty * cartItem.product.price,
    0,
  );
  return (
    <>
      {cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
          <div className='relative overflow-x-auto shadow-md rounded-xl'>
            <table className='w-full text-sm text-left text-gray-600'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className=' text-[10px] sm:text-base px-2 sm:px-6 py-3'
                  >
                    PRODUCT NAME
                  </th>
                  <th
                    scope='col'
                    className=' text-[10px] sm:text-base px-2 sm:px-6 py-3'
                  >
                    QUANTITY
                  </th>
                  <th
                    scope='col'
                    className=' text-[10px] sm:text-base px-2 sm:px-6 py-3'
                  >
                    PRICE
                  </th>
                  <th
                    scope='col'
                    className=' text-[10px] sm:text-base px-2 sm:px-6 py-3 '
                  >
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((cartItem: any) => (
                  <tr
                    className='bg-white border-b border-gray-200'
                    key={cartItem.product._id.toString()}
                  >
                    <th
                      scope='row'
                      className=' text-[10px] sm:text-base px-2 sm:px-6 py-4 font-medium text-gray-900 '
                    >
                      <Link href={`/products/${cartItem.product._id}`}>
                        {cartItem.product.name}
                      </Link>
                    </th>

                    <td className=' text-[10px] sm:text-base px-2 sm:px-6 py-4 pl-6 sm:pl-12'>
                      {cartItem.qty}
                    </td>
                    <td className=' text-[10px] sm:text-base px-2 sm:px-6 py-4'>
                      {' '}
                      {cartItem.product.price} €
                    </td>
                    <td className=' text-[10px] sm:text-base px-2 sm:px-6 py-4'>
                      {(
                        Math.round(
                          cartItem.qty * cartItem.product.price * 100,
                        ) / 100
                      ).toFixed(2) + ' €'}
                    </td>
                  </tr>
                ))}
                <tr className='bg-white border-b border-gray-200'>
                  <th className=' text-[10px] sm:text-base px-2 sm:px-6 py-4 font-bold text-gray-900 text-left '>
                    Total
                  </th>
                  <td></td>
                  <td></td>
                  <td className=' text-[10px] sm:text-base px-2 sm:px-6 py-4'>
                    {totalPrice.toFixed(2)} €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className=' flex justify-center  mt-10'>
            <PurchaseForm userId={userId} />
          </div>
        </>
      )}
    </>
  );
}

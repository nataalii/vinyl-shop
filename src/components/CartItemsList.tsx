'use client';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { CartItemsContext } from '@/providers/CartItemsProvides';
import CartItemCounterWrapper from './CartItemCounterWrapper';

export default function CartItemsList({ userId }: any) {
  const { cartItems, updateCartItems } = useContext(CartItemsContext);
  const totalPrice = cartItems.reduce(
    (total, cartItem) => total + cartItem.qty * cartItem.product.price,
    0,
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/cart`);
        const body = await res.json();
        updateCartItems(body.cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchData();
  }, [userId, updateCartItems]);

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
              <thead className=' text-[10px] sm:text-xs text-gray-700 uppercase bg-gray-100'>
                <tr>
                  <th
                    scope='col'
                    className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-3'
                  >
                    product name
                  </th>
                  <th
                    scope='col'
                    className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-3'
                  >
                    quantity
                  </th>
                  <th
                    scope='col'
                    className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-3'
                  >
                    price
                  </th>
                  <th
                    scope='col'
                    className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-3 hidden md:block'
                  >
                    total
                  </th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((cartItem: any) => (
                  <tr
                    className='bg-white border-b border-gray-200'
                    key={cartItem.product._id}
                  >
                    <th
                      scope='row'
                      className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-4 font-medium text-gray-900 '
                    >
                      <Link href={`/products/${cartItem.product._id}`}>
                        {cartItem.product.name}
                      </Link>
                    </th>

                    <td className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-4'>
                      <CartItemCounterWrapper
                        key={cartItem.qty}
                        productId={cartItem.product._id}
                        userId={userId}
                      />
                    </td>
                    <td className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-4'>
                      {cartItem.product.price} €
                    </td>
                    <td className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-4 hidden md:block'>
                      {(
                        Math.round(
                          cartItem.qty * cartItem.product.price * 100,
                        ) / 100
                      ).toFixed(2) + ' €'}
                    </td>
                  </tr>
                ))}
                <tr className='bg-white border-b border-gray-200'>
                  <th className=' text-[10px]  sm:text-xs md:text-sm px-2 md:px-6 py-4 font-bold text-gray-900 text-left'>
                    Total
                  </th>

                  <td></td>
                  <td></td>
                  <td className='px-6 py-4 hidden md:block'>
                    {totalPrice.toFixed(2)} €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className=' flex justify-center mt-10'>
            <button className=' text-white bg-gray-800  w-40 h-12 rounded-lg'>
              <Link href='/checkout'>Checkout</Link>
            </button>
          </div>
        </>
      )}
    </>
  );
}

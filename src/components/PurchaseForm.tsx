'use client';

import { CartItemsContext } from '@/providers/CartItemsProvides';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface FormValues {
  address: string;
  cardHolder: string;
  cardNumber: string;
}
export default function PurchaseForm({ userId }: any) {
  const [error, setError] = useState<string>('');
  const [formValues, setFormValues] = useState<FormValues>({
    address: '',
    cardHolder: '',
    cardNumber: '',
  });
  const router = useRouter();
  const { updateCartItems } = useContext(CartItemsContext);
  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      return false;
    }

    try {
      const res = await fetch(`/api/users/${userId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (res.ok) {
        setError('');
        const cartItems = await fetch(`/api/users/${userId}/cart`);
        if (cartItems.ok) {
          const updatedCartData = await cartItems.json();
          updateCartItems(updatedCartData.cartItems);
          router.push('/cart');
        }
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <form
      className='group space-y-6 w-full flex flex-col items-center'
      onSubmit={handleSubmit}
      noValidate
    >
      <div className='mb-4 w-full'>
        <label
          htmlFor='address'
          className='block text-gray-600 text-sm font-medium mb-2'
        >
          Shipping Address
        </label>
        <input
          type='text'
          id='address'
          name='address'
          autoComplete='address'
          minLength={4}
          className='peer w-full text-sm sm:text-base px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-gray-300'
          placeholder=' 221b Baker St, London, UK'
          required
          value={formValues.address}
          onChange={(e) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              address: e.target.value,
            }))
          }
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please provide a valid shipping address.
        </p>
      </div>
      <div className='flex flex-col md:flex-row md:gap-7 w-full'>
        <div className='mb-4 w-full'>
          <label
            htmlFor='cardHolder'
            className='block text-gray-600 text-sm font-medium mb-2'
          >
            Card Holder
          </label>
          <input
            type='text'
            id='cardHolder'
            name='cardHolder'
            className='peer text-sm sm:text-base w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-gray-300'
            placeholder='Foo Bar'
            autoComplete='cardHolder'
            minLength={4}
            required
            value={formValues.cardHolder}
            onChange={(e) =>
              setFormValues((prevFormValues) => ({
                ...prevFormValues,
                cardHolder: e.target.value,
              }))
            }
          />
          <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
            Please provide a valid card holder.
          </p>
        </div>

        <div className='mb-4 w-full'>
          <label
            htmlFor='cardNumber'
            className='block text-gray-600 text-sm font-medium mb-2'
          >
            Card Number
          </label>
          <input
            type='number'
            id='cardNumber'
            name='cardNumber'
            autoComplete='cardNumber'
            minLength={4}
            className='peer text-sm sm:text-base w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-gray-300'
            placeholder='00000011122222333'
            value={formValues.cardNumber}
            required
            onChange={(e) =>
              setFormValues((prevFormValues) => ({
                ...prevFormValues,
                cardNumber: e.target.value,
              }))
            }
          />
          <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
            Please provide a valid card number.
          </p>
        </div>
      </div>
      {error && (
        <div className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 ring-1 ring-inset ring-red-500'>
          <p className='text-sm text-gray-900'>{error}</p>
        </div>
      )}

      <button
        type='submit'
        className='flex max-w-[170px] w-full justify-center rounded-md bg-gray-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 group-invalid:pointer-events-none group-invalid:opacity-30'
      >
        Purchase
      </button>
    </form>
  );
}

import React from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { CartItemsContext } from '@/providers/CartItemsProvides';
import { useSession } from 'next-auth/react';

interface CartItemCounterProps {
  productId: string;
}

const CartItemCounter = ({ productId }: CartItemCounterProps) => {
  const { data: session } = useSession({ required: true });
  const { cartItems, updateCartItems } = useContext(CartItemsContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const cartItem = cartItems.find(
    (cartItem) => cartItem.product._id === productId,
  );
  const qty = cartItem ? cartItem.qty : 0;

  const onPlusBtnClick = async function () {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `/api/users/${session!.user._id}/cart/${productId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            qty: qty + 1,
          }),
        },
      );

      if (res.ok) {
        const body = await res.json();
        updateCartItems(body.cartItems);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onMinusBtnClick = async function () {
    setIsUpdating(true);

    try {
      const newQty = Math.max(0, qty - 1);

      const res = await fetch(
        `/api/users/${session!.user._id}/cart/${productId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            qty: newQty,
          }),
        },
      );

      if (res.ok) {
        const body = await res.json();
        updateCartItems(body.cartItems);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onDeleteBtnClick = async () => {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `/api/users/${session!.user._id}/cart/${productId}`,
        {
          method: 'DELETE',
        },
      );

      if (res.ok) {
        const body = await res.json();
        updateCartItems(body.cartItems);
      }
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className='flex gap-2 h-[28px]'>
      <div className='flex align-center items-center '>
        <button
          className=' w-4 sm:w-[35px]  h-[28px] border-gray-300 bg-gray-100 border-[1px] rounded-l-md flex items-center justify-center'
          onClick={onMinusBtnClick}
          disabled={!session || isUpdating || qty === 0}
        >
          <MinusIcon className='h-5 w-5' aria-hidden='true' />
        </button>
        <div className=' px-3 h-[28px] border-y-[1px] flex  items-center bg-white'>
          {qty}
        </div>
        <button
          className=' w-4 sm:w-[35px]  h-[28px] border-gray-300 bg-gray-100 border-[1px] rounded-r-md flex items-center justify-center'
          onClick={onPlusBtnClick}
          disabled={!session || isUpdating}
        >
          <PlusIcon className='h-5 w-5' aria-hidden='true' />
        </button>
      </div>
      <button
        className=' flex items-center border-gray-300 bg-red-200 px-1 sm:px-2 rounded-md border-[1px]'
        onClick={onDeleteBtnClick}
      >
        <TrashIcon className='h-4 ' aria-hidden='true' />
      </button>
    </div>
  );
};

export default CartItemCounter;

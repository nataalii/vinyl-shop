'use client';

import React, { ReactNode, useContext } from 'react';
import { navbarButtonClasses } from '@/components/NavbarButton';
import Link from 'next/link';
import { CartItemsContext } from '@/providers/CartItemsProvides';

interface NavbarCartButtonProps {
  children: ReactNode;
}

export default function NavbarCartButton({ children }: NavbarCartButtonProps) {
  const { cartItems } = useContext(CartItemsContext);

  const qty = cartItems.reduce(
    (partialSum: any, cartItem: { qty: any }) => partialSum + cartItem.qty,
    0,
  );

  return (
    <Link
      href={'/cart'}
      className={`relative inline-flex ${navbarButtonClasses}`}
    >
      {children}
      <div className='absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900'>
        {qty}
      </div>
    </Link>
  );
}

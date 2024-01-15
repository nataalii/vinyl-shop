'use client';
import { useContext, useEffect } from 'react';
import CartItemCounter from './CartItemCounter';
import { CartItemsContext } from '@/providers/CartItemsProvides';

interface CartItemCounterWrapperProps {
  productId: string;
  userId: string;
}

const CartItemCounterWrapper: React.FC<CartItemCounterWrapperProps> = ({
  productId,
  userId,
}) => {
  const { updateCartItems } = useContext(CartItemsContext);

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
  }, [updateCartItems, userId]);

  return <CartItemCounter productId={productId} />;
};

export default CartItemCounterWrapper;

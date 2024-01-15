import { NextRequest, NextResponse } from 'next/server';
import { CartItem, updateCartItem, removeCartItem } from '@/lib/handlers';
import { Types } from 'mongoose';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  },
): Promise<NextResponse<{ cartItems: CartItem[] } | {}>> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json({}, { status: 400 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  const body = await request.json();
  const qty = body.qty;

  if (typeof qty !== 'number' || qty <= 0) {
    return NextResponse.json({}, { status: 400 });
  }

  const updatedCartItem = await updateCartItem(
    params.userId,
    params.productId,
    qty,
  );

  if (updatedCartItem.cartItems.length === 0) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(updatedCartItem);
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  },
): Promise<NextResponse<CartItem | {}>> {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json({}, { status: 400 });
  }

  const updatedCartItems = await removeCartItem(
    params.userId,
    params.productId,
  );

  if (updatedCartItems === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json({ cartItems: updatedCartItems });
}

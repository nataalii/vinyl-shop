import { NextRequest, NextResponse } from 'next/server';
import { UserResponse, getCartItems } from '@/lib/handlers';
import { Types } from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  },
): Promise<NextResponse<UserResponse> | void | Response> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {},
      { status: 400, statusText: 'Invalid User id or Product ID' },
    );
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  const cartItems = await getCartItems(params.userId);

  if (cartItems === null) {
    return NextResponse.json({}, { status: 401 });
  }

  console.log(cartItems);

  return NextResponse.json(cartItems);
}

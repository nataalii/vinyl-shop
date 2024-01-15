import { NextRequest, NextResponse } from 'next/server';
import { UserResponse, createOrder, getOrders } from '@/lib/handlers';
import { Types } from 'mongoose';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

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

  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  const orders = await getOrders(params.userId);
  if (!orders) {
    return NextResponse.json({}, { status: 401 });
  }

  const response = {
    orders: orders,
  };

  return NextResponse.json(response);
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  },
): Promise<NextResponse> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  const body = await request.json();

  if (!body.address || !body.cardHolder || !body.cardNumber) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  const order = await createOrder(params.userId, {
    address: body.address,
    cardHolder: body.cardHolder,
    cardNumber: body.cardNumber,
  });
  const orderId = (order as any)?.id;

  if (orderId === null) {
    return NextResponse.json(
      { error: 'Invalid request or user not found' },
      { status: 400 },
    );
  }

  const headers = new Headers();
  headers.append('Location', `/api/users/${params.userId}/orders/${orderId}`);

  return NextResponse.json({ _id: orderId }, { status: 201, headers: headers });
}

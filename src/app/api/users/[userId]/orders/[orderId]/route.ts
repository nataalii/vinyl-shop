import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/handlers';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; orderId: string };
  },
): Promise<NextResponse> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }
  try {
    const order = await getOrder(params.userId, params.orderId);

    if (order === null) {
      return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

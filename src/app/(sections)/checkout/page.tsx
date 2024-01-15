import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import CheckoutTable from '@/components/CheckoutTable';

export default async function Checkout() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='flex flex-col '>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Checkout
      </h3>
      <CheckoutTable userId={session.user._id} />
    </div>
  );
}

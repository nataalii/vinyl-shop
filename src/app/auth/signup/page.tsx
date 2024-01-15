/* eslint-disable @next/next/no-img-element */
import SignUpForm from '@/components/SignUpForm';
import Link from 'next/link';
import { authOptions } from '@/lib/authOptions';
import { Session, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function SignUp() {
  const session: Session | null = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }
  return (
    <div className='flex w-full flex-col px-6 py-12'>
      <div className='mx-auto w-full max-w-sm'>
        <img
          className='mx-auto h-10 w-auto'
          src='/img/logo.png'
          alt='Vinyl logo'
        />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Sign Up
        </h2>
      </div>
      <div className='mx-auto mt-10 w-full max-w-sm'>
        <SignUpForm />
        <p className='mt-10 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link
            href='/auth/signin'
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          >
            Sign in!
          </Link>
        </p>
      </div>
    </div>
  );
}

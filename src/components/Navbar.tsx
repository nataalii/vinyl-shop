/* eslint-disable @next/next/no-img-element */
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import NavbarButton from '@/components/NavbarButton';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import { Session } from 'next-auth';
import NavbarCartButton from './NavbarCartButton';
import NavbarSignOutButton from './NavbarSignOutButton';

export default async function Navbar() {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <nav className='fixed top-0 z-50 w-full bg-opacity-90 backdrop-blur-lg backdrop-filter'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='flex flex-1 items-stretch justify-start'>
            <Link
              className='flex flex-shrink-0 items-center space-x-4 text-gray-300 hover:text-gray-100'
              href='/'
            >
              <img
                className='block h-5 sm:h-8 w-auto'
                src='/img/logo.png'
                alt='Vinyl shop logo'
              />
              <div className='inline-block w-auto text-sm sm:text-xl font-semibold'>
                Vinyl shop
              </div>
            </Link>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center sm:space-x-4'>
            {session ? (
              <>
                <NavbarCartButton>
                  <span className='sr-only'>Cart</span>
                  <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarCartButton>
                <NavbarButton href='/profile'>
                  <span className='sr-only'>User profile</span>
                  <UserIcon className=' h-5 sm:h-6' aria-hidden='true' />
                </NavbarButton>
                <NavbarSignOutButton />
              </>
            ) : (
              <>
                <Link
                  href='/auth/signup'
                  className='rounded-md px-1 sm:px-3 py-2 text-[10px] sm:text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                >
                  Sign up
                </Link>
                <Link
                  href='/auth/signin'
                  className='rounded-md px-1 sm:px-3 py-2 text-[10px] sm:text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

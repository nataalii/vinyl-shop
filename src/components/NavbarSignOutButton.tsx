'use client';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

const NavbarSignOutButton = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button onClick={handleSignOut}>
      <span className='sr-only'>Sign Out</span>
      <ArrowRightOnRectangleIcon
        className='h-5 sm:h-6 text-gray-400'
        aria-hidden='true'
      />
    </button>
  );
};

export default NavbarSignOutButton;

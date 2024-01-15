export default function Header() {
  return (
    <header className='mx-auto w-full bg-header-texture bg-fixed px-6 pb-16 pt-24 text-center sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32 bg-no-repeat bg-cover'>
      <div className='mx-auto max-w-2xl'>
        <h1 className=' text-4xl md:text-6xl font-bold text-gray-100 sm:text-7xl lg:text-8xl'>
          Vinyl Shop
        </h1>
        <p className='mt-4 text-sm leading-8 text-white md:text-gray-400 sm:mt-6 sm:text-base lg:text-lg'>
          True experience you will always remember.
        </p>
      </div>
    </header>
  );
}

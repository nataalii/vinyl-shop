/* eslint-disable @next/next/no-img-element */
import { Types } from 'mongoose';
import { getProduct } from '@/lib/handlers';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { notFound } from 'next/navigation';
import CartItemCounterWrapper from '@/components/CartItemCounterWrapper';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const product = await getProduct(params.productId);

  if (product === null) {
    notFound();
  }
  const session: Session | null = await getServerSession(authOptions);

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        {product.name}
      </h3>
      <div className=' flex md:flex-row flex-col gap-10 '>
        <div className=' flex flex-col items-center gap-3  md:w-[50%]'>
          <img
            className=' rounded-xl md:h-96 md:w-full object-cover'
            src={product.img}
            alt='Vinyl image'
          />
          <h1 className=' text-3xl'>{product.price} €</h1>
          {session && (
            <div className='text-gray-700'>
              <CartItemCounterWrapper
                userId={session.user._id}
                key={params.productId}
                productId={params.productId}
              />
            </div>
          )}
        </div>

        <div className='  md:w-[50%]'>
          <h3 className=' font-bold mb-4 sm:text-xl'>Product Details</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

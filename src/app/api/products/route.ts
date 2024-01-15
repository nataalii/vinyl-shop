import { ProductsResponse, getProducts } from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ProductsResponse> | void | Response> {
  console.log(request);
  const products = await getProducts();
  return NextResponse.json(products);
}

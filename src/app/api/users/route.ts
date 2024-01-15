import { NextRequest, NextResponse } from 'next/server';
import {
  createUser,
  CreateUserResponse,
  getUsers,
  UsersResponse,
} from '@/lib/handlers';
import Users from '@/models/User';

export async function GET(): Promise<NextResponse<UsersResponse>> {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateUserResponse> | void | Response> {
  const body = await request.json();
  console.log(body);
  if (
    !body.email ||
    !body.password ||
    !body.name ||
    !body.surname ||
    !body.address ||
    !body.birthdate
  ) {
    return NextResponse.json({}, { status: 400 });
  }
  const existingUser = await Users.findOne({ email: body.email });
  const newUserResponse = await createUser(body);

  if (existingUser) {
    return NextResponse.json(
      { error: 'Email is already registered' },
      { status: 400 },
    );
  }

  if (!newUserResponse) {
    return NextResponse.json({}, { status: 400 });
  }

  const headers = new Headers();
  headers.append('Location', `/api/users/${newUserResponse._id}`);

  return NextResponse.json(
    { _id: newUserResponse._id },
    { status: 201, headers: headers },
  );
}

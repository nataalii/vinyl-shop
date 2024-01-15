import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import { Types } from 'mongoose';
import connect from '@/lib/mongoose';
import Orders from '@/models/Order';
import bcrypt from 'bcrypt';
// products
export interface ProductsResponse {
  products: Product[];
}

export async function getProducts(): Promise<ProductsResponse> {
  await connect();
  const productProjection = {
    name: true,
    price: true,
    img: true,
  };
  const products = await Products.find({}, productProjection);
  return {
    products: products,
  };
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  img: string;
  price: number;
}

export async function getProduct(
  productId: string,
): Promise<ProductResponse | null> {
  await connect();
  const productProjection = {
    id: true,
    name: true,
    description: true,
    img: true,
    price: true,
  };
  const product = await Products.findById(productId, productProjection);
  if (product === null) {
    return null;
  }
  return product;
}

// users
export interface UsersResponse {
  users: User[];
}

export async function getUsers(): Promise<UsersResponse> {
  await connect();
  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  };
  const users = await Users.find({}, userProjection);
  return {
    users: users,
  };
}

export interface CreateUserResponse {
  _id: Types.ObjectId | string;
}

export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();
  const prevUser = await Users.find({ email: user.email });
  if (prevUser.length !== 0) {
    return null;
  }

  const hash = await bcrypt.hash(user.password, 10);
  const doc: User = {
    ...user,
    password: hash,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };
  const newUser = await Users.create(doc);
  return {
    _id: newUser._id,
  };
}

export interface UserResponse {
  email: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}

export async function getUser(userId: string): Promise<UserResponse | null> {
  await connect();
  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  };
  const user = await Users.findById(userId, userProjection);
  if (user === null) {
    return null;
  }
  return user;
}

// cart items
export interface cartItemsResponse {
  cartItems: {
    product: {
      _id: Types.ObjectId | string;
      name: string;
      price: number;
    };
    qty: number;
  }[];
}

export async function getCartItems(userId: string): Promise<cartItemsResponse> {
  await connect();
  try {
    const user = await Users.findById(userId).populate({
      path: 'cartItems.product',
      model: 'Product',
    });
    if (!user) {
      return { cartItems: [] };
    }

    const cartItems = user.cartItems.map((cartItem: CartItem) => {
      const { _id, name, price } = cartItem.product;
      return {
        product: {
          _id,
          name,
          price,
        },
        qty: cartItem.qty,
      };
    });

    return { cartItems };
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { cartItems: [] };
  }
}

export type CartItem = {
  product: Product;
  qty: number;
};

export async function updateCartItem(
  userId: string,
  productId: string,
  qty: number,
): Promise<{ cartItems: CartItem[] }> {
  await connect();

  const user = await Users.findById(userId);

  if (!user) {
    return { cartItems: [] };
  }

  const cartItemIndex = user.cartItems.findIndex((cartItem: any) =>
    cartItem.product._id.equals(productId),
  );

  if (cartItemIndex !== -1) {
    user.cartItems[cartItemIndex].qty = qty;
  } else {
    const newCartItem = {
      product: new Types.ObjectId(productId),
      qty: qty,
    };
    user.cartItems.push(newCartItem);
  }

  await user.save();

  const updatedCartItems = await Users.findById(userId).populate({
    path: 'cartItems.product',
    model: 'Product',
  });
  return {
    cartItems: updatedCartItems.cartItems.map((item: any) => ({
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
      },
      qty: item.qty,
    })),
  };
}

export const removeCartItem = async (
  userId: string,
  productId: string,
): Promise<CartItem[] | null> => {
  await connect();

  const user = await Users.findById(userId).populate('cartItems.product');

  if (!user) {
    return null;
  }

  const cartItemIndex = user.cartItems.findIndex((cartItem: any) =>
    cartItem.product._id.equals(productId),
  );

  if (cartItemIndex !== -1) {
    user.cartItems.splice(cartItemIndex, 1);
  }

  await user.save();

  return user.cartItems;
};

// Orders
export interface orderItem {
  _id: Types.ObjectId | string;
  address: string;
  date: number;
  cardHolder: string;
  cardNumber: number;
}

export interface orderItemsResponse {
  orders: {
    _id: Types.ObjectId | string;
    address: string;
    date: number;
    cardHolder: string;
    cardNumber: number;
  }[];
}

export async function getOrders(
  userId: string,
): Promise<orderItemsResponse | null> {
  await connect();
  const user = await Users.findById(userId).populate('orders');
  if (!user) {
    return null;
  }
  const formattedOrders = user.orders.map((order: any) => ({
    _id: order._id,
    address: order.address,
    date: order.date,
    cardHolder: order.cardHolder,
    cardNumber: order.cardNumber,
  }));
  await user.save();

  return formattedOrders;
}

export async function createOrder(
  userId: string,
  orderData: {
    address: string;
    cardHolder: string;
    cardNumber: string;
  },
): Promise<orderItemsResponse | null> {
  if (!Types.ObjectId.isValid(userId)) {
    return null;
  }

  const user = await Users.findById(userId).populate('cartItems.product');

  if (!user) {
    return null;
  }

  if (!orderData.address || !orderData.cardHolder || !orderData.cardNumber) {
    return null;
  }

  const orderItems = user.cartItems.map((cartItem: any) => ({
    product: cartItem.product._id,
    qty: cartItem.qty,
    price: cartItem.product.price,
  }));

  const newOrder = new Orders({
    address: orderData.address,
    date: new Date(),
    cardHolder: orderData.cardHolder,
    cardNumber: orderData.cardNumber,
    orderItems: orderItems,
  });

  await newOrder.save();

  user.orders.push(newOrder);
  user.cartItems = [];

  await user.save();
  return newOrder;
}

export interface OrderResponse {
  _id: string;
  address: string;
  date: Date;
  cardHolder: string;
  cardNumber: string;
  orderItems: {
    product: {
      _id: string;
      name: string;
    };
    qty: number;
    price: number;
  }[];
}

export async function getOrder(
  userId: string,
  orderId: string,
): Promise<OrderResponse | null> {
  try {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orderId)) {
      return null;
    }

    const user = await Users.findById(userId).populate({
      path: 'orders',
      populate: {
        path: 'orderItems.product',
        model: 'Product',
      },
    });

    if (!user) {
      return null;
    }

    const order = user.orders.find((o: any) => o._id.toString() === orderId);

    if (!order) {
      return null;
    }

    const formattedOrder: OrderResponse = {
      _id: order._id,
      address: order.address,
      date: order.date,
      cardHolder: order.cardHolder,
      cardNumber: order.cardNumber,
      orderItems: order.orderItems.map((item: any) => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
        },
        qty: item.qty,
        price: item.price,
      })),
    };

    return formattedOrder;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { Users };

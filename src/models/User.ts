import mongoose, { Schema, Types } from 'mongoose';
import { Order } from './Order';
export interface User {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
  cartItems: {
    product: Types.ObjectId;
    qty: number;
  }[];
  orders: Types.ObjectId[] | Order[]; // Change the type to allow embedding orders
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  cartItems: [
    {
      _id: false,
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      qty: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
});
export default mongoose.models.User || mongoose.model<User>('User', UserSchema);

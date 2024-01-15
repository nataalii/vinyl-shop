import mongoose, { Schema, Types } from 'mongoose';
export interface Product {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  img: string;
  price: number;
}

const ProductSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Product ||
  mongoose.model<Product>('Product', ProductSchema);

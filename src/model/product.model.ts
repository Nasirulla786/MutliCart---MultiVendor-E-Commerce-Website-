import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "./user.model";

export interface IProduct {
  _id: mongoose.Types.ObjectId;

  title: string;
  description: string;
  price: string;

  stock: number;
  isStock: boolean;

  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;

  vendor: mongoose.Types.ObjectId;
  category: string;

  isWearble?: boolean;
  sizes?: string[];

  verificationStatus: "pending" | "approve" | "reject";
  isApproved?: boolean;
  requestAt?: Date;
  rejectReason?: string;

  isActive?: boolean;

  replacmentDays?: number;
  freeDelivery?: boolean;
  warenty?: string;
  payOnDelivery?: boolean;

  detailPoints: string[];

  reviews: {
    user: mongoose.Types.ObjectId; 
    rating: number;
    comment?: string;
    image?: string;
    createdAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },

    stock: { type: Number, default: 0 },
    isStock: { type: Boolean, default: true },

    image1: { type: String, required: true },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: { type: String, required: true },

    isWearble: { type: Boolean, default: false },
    sizes: [
        { type: String }
    ],

    verificationStatus: {
      type: String,
      enum: ["pending", "approve", "reject"],
      default: "pending",
    },

    isApproved: { type: Boolean, default: false },
    requestAt: { type: Date },
    rejectReason: { type: String },

    isActive: { type: Boolean, default: false},

    replacmentDays: { type: Number },
    freeDelivery: { type: Boolean, default: false },
    warenty: { type: String },
    payOnDelivery: { type: Boolean, default: false },

    detailPoints: [{ type: String }],

    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String },
        image: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);


// 🔥 HOT RELOAD FIX (VERY IMPORTANT)
const Product = mongoose.models.Product || mongoose.model("Product" ,productSchema);

export default Product;

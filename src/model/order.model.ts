import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  buyer: mongoose.Types.ObjectId;

  productTotal: number;
  deliveryCharge: number;
  serviceCharge: number;
  totalAmount: number;

  paymentMethod: "cod" | "stripe";

  orderStatus:
    | "pending"
    | "confirmed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned";

  cancelAt?: Date;

  returnAmount?: number;

  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pinCode: string;
  };

  paymentDetails?: {
    stripePaymentID?: string;
    stripeSessionID?: string;
  };
  isPaid:boolean

  deliveryDate?: Date;
  deliveryOTP?: string;
  OTPExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      
      },
    ],

    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 faster queries
    },

    productTotal: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 40,
    },

    serviceCharge: {
      type: Number,
      default: 20,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "stripe"],
      required: true,
    },

    isPaid:{
        type:Boolean,
        default:false
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
      index: true,
    },

    cancelAt: Date,

    returnAmount: {
      type: Number,
      default: 0,
    },

    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pinCode: { type: String, required: true },
    },

    paymentDetails: {
      stripePaymentID: String,
      stripeSessionID: String,
    },

    deliveryDate: Date,

    deliveryOTP: {
      type: String,
    },

    OTPExpires: Date,
  },
  {
    timestamps: true, // 🔥 auto createdAt & updatedAt
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", orderSchema);

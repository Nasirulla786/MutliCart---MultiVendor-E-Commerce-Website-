import mongoose from "mongoose";
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "vendor";
  phone?: string;
  image?: string;

  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  isApproved: boolean;
  verificationStatus: "pending" | "approved" | "reject";
  requestAt: Date;
  approvedAt: Date;
  rejectReason: string;

  vendorProducts: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  cart: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];

  chats: {
    with: mongoose.Types.ObjectId;
    message: [
      {
        sender: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
      },
    ];
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },

    phone: {
      type: String,
      //   default:"",
    },

    shopAddress: {
      type: String,
    },

    shopName: {
      type: String,
    },

    gstNumber: {
      type: String,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["approved", "pending", "reject"],
      default: "pending",
    },
    requestAt: {
      type: Date,
    },

    approvedAt: {
      type: Date,
    },

    rejectReason: {
      type: String,
    },

    vendorProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    chats: [
      {
        with: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: [
          {
            sender: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            text: {
              type: String,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

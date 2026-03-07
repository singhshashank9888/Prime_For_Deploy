import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price']
    },
    category: {
      type: String,
      required: [true, 'Please provide product category']
    },
    image: {
      type: String,
      default: null
    },
    stock: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        comment: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
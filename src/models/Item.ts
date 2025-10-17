import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description?: string;
  link?: string;
  thumb?: string;
  lg_img?: string;
  categories?: string;
  subcategory?: string;
  price?: string;
  short_name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  thumb: {
    type: String,
    trim: true
  },
  lg_img: {
    type: String,
    trim: true
  },
  categories: {
    type: String,
    uppercase: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  short_name: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes
ItemSchema.index({ categories: 1 });
ItemSchema.index({ name: 'text', description: 'text' });

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;

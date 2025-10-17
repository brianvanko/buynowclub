import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  displayName?: string;
  active: boolean;
  isAdmin: boolean;
  favorites: mongoose.Types.ObjectId[];
  comparePasswords(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false  // Don't return password by default
  },
  googleId: String,
  facebookId: String,
  displayName: String,
  active: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }]
}, {
  timestamps: true
});

// Method to compare passwords
UserSchema.methods.comparePasswords = async function(password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Prevent password from being returned in JSON
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

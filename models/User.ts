import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  image?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  image: { type: String },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
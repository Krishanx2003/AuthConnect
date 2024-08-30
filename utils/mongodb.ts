// utils/mongodb.ts
import mongoose, { ConnectOptions } from 'mongoose';

const connect = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
    
    } as ConnectOptions);
    console.log('Mongo Connection successfully established.');
  } catch (error) {
    throw new Error('Error connecting to Mongoose');
  }
};

export default connect;

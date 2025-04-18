import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const cached = (global as any).mongoose || { conn: null, promise: null };

export async function dbConnect() {
    if (cached.conn) {
        console.log('✅ MongoDB already connected');
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: 'nextauthdb',
            })
            .then((mongoose) => {
                console.log('✅ MongoDB connected successfully');
                return mongoose;
            })
            .catch((error) => {
                console.error('❌ MongoDB connection error:', error);
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

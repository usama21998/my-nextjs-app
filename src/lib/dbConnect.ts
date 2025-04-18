import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedConnection: mongoose.Connection | null = null;

export async function dbConnect() {
    if (cachedConnection) {
        console.log('✅ MongoDB already connected');
        return cachedConnection;
    }

    try {
        const connection = await mongoose.connect(MONGODB_URI, {
            dbName: 'nextauthdb',
        });
        console.log('✅ MongoDB connected successfully');
        cachedConnection = connection.connection;
        return cachedConnection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

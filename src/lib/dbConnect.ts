import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// Explicitly type the cached object
interface CachedConnection {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}

const cached: CachedConnection = (global as any).mongoose || { conn: null, promise: null };

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
            .then(() => {
                // Now we correctly get the connection from mongoose.connection
                console.log('✅ MongoDB connected successfully');
                return mongoose.connection;
            })
            .catch((error) => {
                console.error('❌ MongoDB connection error:', error);
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

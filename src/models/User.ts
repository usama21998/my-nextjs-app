import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed in real apps
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);


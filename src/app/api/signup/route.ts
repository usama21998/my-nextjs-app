import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = new User({
            email,
            password: hashedPassword,
        });

        await user.save();

        return NextResponse.json({ success: true, message: 'Account created successfully!' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong!' }, { status: 500 });
    }
}

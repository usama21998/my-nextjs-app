import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';  // Import bcrypt for password comparison

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Connect to the database
        await dbConnect();

        // Find the user by email
        const user = await User.findOne({ email });

        // If no user is found, return an invalid credentials message
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords don't match, return an invalid credentials message
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Return a success response if the credentials match
        return NextResponse.json({ success: true, message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong!' }, { status: 500 });
    }
}

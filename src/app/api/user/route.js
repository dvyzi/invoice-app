import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const timestamp = new Date().getTime();
        const user = await prisma.user.create({
            data: {
                name: 'Alice',
                email: `alice@example.com`,
                password: 'hashed_password_here', // Required field according to schema
            },
        });
        
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Prisma error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
} 
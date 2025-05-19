import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();


export async function GET(request) {
    return NextResponse.json(
        {
            error: 'Not Found',
            message: 'The requested resource was not found',
            status: 404
        },
        { status: 404 }
    );
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export async function GET(request, res) {
    res.status(404).json({
        message : 'bruh' 
    })
} 
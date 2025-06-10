import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Récupérer le token depuis les cookies
        const cookieStore = cookies();
        const token = cookieStore.get('auth-token')?.value;
        
        if (!token) {
            return NextResponse.json(
                {
                    error: 'Non authentifié',
                    status: 401
                },
                { status: 401 }
            );
        }
        
        // Vérifier et décoder le token
        const { payload } = await jwtVerify(
            token, 
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        
        // Retourner les informations de l'utilisateur
        return NextResponse.json(
            {
                user: {
                    id: payload.id,
                    email: payload.email,
                    name: payload.name,
                    lastName: payload.lastName
                },
                status: 200
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        return NextResponse.json(
            {
                error: 'Non authentifié',
                status: 401
            },
            { status: 401 }
        );
    } finally {
        await prisma.$disconnect();
    }
} 
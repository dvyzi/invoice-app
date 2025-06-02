import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

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

export async function POST(request) {
    try {
        const body = await request?.json();
        
        // Vérifier que l'email et le mot de passe sont présents
        if (!body.email || !body.password) {
            return NextResponse.json(
                {
                    error: 'Email et mot de passe requis',
                    status: 400
                },
                { status: 400 }
            );
        }
        
        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        
        // Si l'utilisateur n'existe pas ou le mot de passe est incorrect
        if (!user || !(await bcrypt.compare(body.password, user.password))) {
            return NextResponse.json(
                {
                    error: 'Email ou mot de passe incorrect',
                    status: 401
                },
                { status: 401 }
            );
        }
        
        // Créer un token JWT
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            name: user.name,
            lastName: user.lastName
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Expire dans 24 heures
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
        
        // Créer une réponse avec le token dans un cookie
        const response = NextResponse.json(
            {
                message: 'Connexion réussie',
                status: 200,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName
                }
            },
            { status: 200 }
        );
        
        // Définir le cookie avec le token
        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true, // Le cookie ne peut pas être accédé par JavaScript
            secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 heures en secondes
        });
        
        return response;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return NextResponse.json(
            {
                error: 'Erreur serveur',
                status: 500
            },
            { status: 500 }
        );
    }
}
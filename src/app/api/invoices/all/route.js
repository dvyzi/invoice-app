import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * Récupère les factures de l'utilisateur connecté
 * @param {Request} request - Requête HTTP
 * @returns {NextResponse} Réponse avec les factures de l'utilisateur ou une erreur
 */

export async function GET(request){
    // Récupérer le token d'authentification depuis les cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
        return NextResponse.json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }
    
    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your_jwt_secret');
        const userId = decoded.id; // L'ID de l'utilisateur est stocké dans le champ 'id' du token
        
        // Récupérer uniquement les factures de l'utilisateur connecté
        const userInvoices = await prisma.invoice.findMany({
            where: {
                userId: userId
            },
            include: {
                items: true
            }
        });
        
        // Renvoyer les données au format JSON
        return NextResponse.json({ success: true, invoices: userInvoices.map(invoice => {
            return {
                ...invoice, 
                dueDate: invoice.dueDate.toISOString()
            }
        }) }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        return NextResponse.json({ success: false, message: 'Erreur lors de la récupération des factures' }, { status: 500 });
    }
}
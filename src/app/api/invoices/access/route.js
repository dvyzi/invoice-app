import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Vérifie le mot de passe d'accès à une facture
 */
export async function POST(request) {
    try {
        const data = await request.json();
        const { invoiceId, password } = data;

        if (!invoiceId || !password) {
            return NextResponse.json({ 
                success: false, 
                error: "L'ID de facture et le mot de passe sont requis" 
            }, { status: 400 });
        }

        // Récupérer la facture avec son hash de mot de passe
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            select: {
                id: true,
                clientName: true,
                accessPasswordHash: true
            }
        });

        if (!invoice) {
            return NextResponse.json({ 
                success: false, 
                error: "Facture introuvable" 
            }, { status: 404 });
        }

        if (!invoice.accessPasswordHash) {
            return NextResponse.json({ 
                success: false, 
                error: "Cette facture n'a pas de mot de passe configuré" 
            }, { status: 400 });
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, invoice.accessPasswordHash);

        if (!passwordMatch) {
            return NextResponse.json({ 
                success: false, 
                error: "Mot de passe incorrect" 
            }, { status: 401 });
        }

        return NextResponse.json({ 
            success: true,
            message: "Authentification réussie"
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe:', error);
        return NextResponse.json({ 
            success: false, 
            error: "Une erreur est survenue lors de la vérification du mot de passe" 
        }, { status: 500 });
    }
}
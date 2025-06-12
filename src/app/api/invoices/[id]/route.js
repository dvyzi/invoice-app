import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// Récupère une facture par son ID
export async function GET(req, { params }) {
    const id = params.id; // l'id vient directement de l'URL (/api/invoice/:id)

    try {
        // On cherche la facture correspondante en base de données
        const invoice = await prisma.invoice.findUnique({
            where: { id },             // recherche par ID 
            include: { items: true },  // on récupère aussi les items liés à la facture
        });

        // Si aucune facture trouvée, on renvoie une 404
        if (!invoice) {
            return NextResponse.json(
                { success: false, error: 'Facture non trouvée' },
                { status: 404 }
            );
        }

        // On renvoie la facture, en convertissant la date pour éviter les soucis avec JSON
        return NextResponse.json({
            success: true,
            invoice: {
                ...invoice,
                dueDate: invoice.dueDate.toISOString(), // on formate la date proprement
            },
        });

    } catch (error) {
        // S’il y a une erreur serveur, on log et on répond proprement
        console.error('Erreur lors de la récupération de la facture :', error);

        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

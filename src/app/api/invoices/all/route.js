import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

/**
 * Gère la création d'une nouvelle facture et ses items associés
 * @param {Request} request - Requête HTTP contenant les données de la facture
 * @returns {NextResponse} Réponse avec la facture créée ou une erreur
 */

export async function GET(){

    const allInvoice = await prisma.invoice.findMany({
        include: {
            items: true
        }
    });
    
    // Renvoi ma data au format json
    return NextResponse.json({ success: true, invoices: allInvoice.map(invoice => {
        return {
            ...invoice, 
            dueDate: invoice.dueDate.toISOString()
        }
    }) }, { status: 201 });
}
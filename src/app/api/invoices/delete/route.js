import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

/**
 * Gère la création d'une nouvelle facture et ses items associés
 * @param {Request} request - Requête HTTP contenant les données de la facture
 * @returns {NextResponse} Réponse avec la facture créée ou une erreur
 */

export async function DELETE(request) {
    const { id } = await request.json();
    const invoice = await prisma.invoice.delete({
        where: { id },
    });
    return NextResponse.json({ success: true, invoice }, { status: 201 });
}

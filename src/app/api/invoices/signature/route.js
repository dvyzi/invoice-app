import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// Configuration pour éviter le cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const { invoiceId, signatureData } = await request.json();

    if (!invoiceId || !signatureData) {
      return NextResponse.json(
        { error: 'ID de facture et signature requis' },
        { status: 400 }
      );
    }

    // Vérifier si la facture existe
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la facture avec la signature et changer le statut à PAID
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        signature: signatureData,
        isSigned: true,
        signatureDate: new Date(),
        status: 'PAID', // Changer le statut à PAID lors de la signature
      },
    });

    return NextResponse.json(
      {
        message: 'Signature enregistrée avec succès',
        invoice: {
          id: updatedInvoice.id,
          isSigned: updatedInvoice.isSigned,
          signatureDate: updatedInvoice.signatureDate,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la signature:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la signature' },
      { status: 500 }
    );
  }
}

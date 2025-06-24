import { PrismaClient } from '../../../generated/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * Met à jour le statut d'une facture de PENDING à PAID
 * @param {Request} request - Requête HTTP contenant l'ID de la facture
 * @returns {NextResponse} Réponse avec la facture mise à jour ou une erreur
 */
export async function PUT(request) {
    try {
        // Récupérer le token d'authentification depuis les cookies
        const cookieStore = cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json({ success: false, message: 'Non authentifié' }, { status: 401 });
        }

        try {
            // Vérifier et décoder le token
            const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
            const userId = decoded.id; // L'ID de l'utilisateur est stocké dans le champ 'id' du token

            // Récupérer les données de la requête
            const { invoiceId } = await request.json();

            if (!invoiceId) {
                return NextResponse.json({ success: false, message: 'ID de facture manquant' }, { status: 400 });
            }

            // Récupérer la facture pour vérifier qu'elle appartient à l'utilisateur
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId },
            });

            if (!invoice) {
                return NextResponse.json({ success: false, message: 'Facture non trouvée' }, { status: 404 });
            }

            // Vérifier que l'utilisateur est propriétaire de la facture
            if (invoice.userId !== userId) {
                return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 403 });
            }

            // Vérifier que le statut actuel est PENDING
            if (invoice.status !== 'PENDING') {
                return NextResponse.json(
                    { success: false, message: 'Seules les factures en attente peuvent être marquées comme payées' },
                    { status: 400 }
                );
            }

            // Mettre à jour le statut de la facture
            const updatedInvoice = await prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: 'PAID' },
            });

            return NextResponse.json({
                success: true,
                message: 'Statut de la facture mis à jour avec succès',
                invoice: {
                    ...updatedInvoice,
                    dueDate: updatedInvoice.dueDate.toISOString(), // on formate la date proprement
                }
            });

        } catch (jwtError) {
            console.error('Erreur de vérification du token:', jwtError);
            return NextResponse.json({ success: false, message: 'Token invalide' }, { status: 401 });
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
import { Resend } from 'resend';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../../../generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour convertir une chaîne en slug URL-friendly
function slugify(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export async function POST(request) {
    try {
        // Récupérer les données du corps de la requête
        const data = await request.json();
        const { clientEmail, clientName, invoiceId } = data;
        
        console.log('Données reçues:', { clientEmail, clientName, invoiceId });

        // Vérification minimale que l'email et l'ID de facture existent
        if (!clientEmail) {
            return NextResponse.json({
                success: false,
                error: "L'adresse email du client est requise"
            }, { status: 400 });
        }
        
        if (!invoiceId) {
            return NextResponse.json({
                success: false,
                error: "L'ID de la facture est requis"
            }, { status: 400 });
        }

        // Générer un mot de passe aléatoire
        const plainPassword = crypto.randomBytes(6).toString('base64');
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
        try {
            // Mise à jour de la facture avec le mot de passe hashé
            await prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    accessPasswordHash: hashedPassword,
                }
            });
        } catch (dbError) {
            console.error('Erreur lors de la mise à jour de la facture:', dbError);
            return NextResponse.json({
                success: false,
                error: "Erreur lors de la mise à jour de la facture"
            }, { status: 500 });
        }
        
        // Construction du lien
        const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invoice/${slugify(clientName)}/${invoiceId}`;

        try {
            const result = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: [clientEmail.trim()],
                subject: 'Votre facture est prête',
                html: `<p>Bonjour ${clientName}</p>
                <p>Une facture vous a été envoyée</p>
                <p>Vous pouvez la consulter ici : ${link}</p>
                <p>Le mot de passe est : ${plainPassword}</p>`,
            });

            console.log('Email envoyé:', result);
            return NextResponse.json({ success: true, result });
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email:', emailError);
            return NextResponse.json({
                success: false,
                error: "Erreur lors de l'envoi de l'email"
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Erreur générale:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

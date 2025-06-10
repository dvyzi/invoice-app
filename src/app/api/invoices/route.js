import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

/**
 * Gère la création d'une nouvelle facture et ses items associés
 * @param {Request} request - Requête HTTP contenant les données de la facture
 * @returns {NextResponse} Réponse avec la facture créée ou une erreur
 */
export async function POST(request) {

    // Transforme ma data au format json
    const data = await request.json();
    
    // Recuperer l'id de l'utilisateur qui a crée la facture
    const userId = request.headers.get('userId');

    // Calcul des dates importantes
    const invoiceDate = new Date(data.invoiceDate);
    const paymentTerms = parseInt(data.paymentTerms);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTerms);

    // Calcul du montant total
    const total = data.products.reduce((sum, product) => sum + parseFloat(product.total), 0);

    // Création de la facture avec ses items en une seule transaction
    const invoice = await prisma.invoice.create({
        data: {
            // Informations de base
            userId: userId,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,

            // Informations client
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientAddress: data.clientAddress,
            clientCity: data.clientCity,
            clientPostalCode: data.clientPostalCode,
            clientCountry: data.clientCountry,

            // Dates et conditions
            invoiceDate: invoiceDate,
            paymentTerms: paymentTerms,
            dueDate: dueDate,
            description: data.projectDescription,

            // Statut et montant
            // Forcer le statut à DRAFT si isDraft est true
            status: data.isDraft === true ? 'DRAFT' : 'PENDING',
            total: total,

            // Création des items associés
            items: {
                create: data.products.map(product => ({
                    name: product.name,
                    quantity: parseInt(product.quantity),
                    price: parseFloat(product.price),
                    total: parseFloat(product.total)
                }))
            }
        },
        // Inclure les items dans la réponse
        include: {
            items: true
        }
    });
    

    // Renvoi ma data au format json
    return NextResponse.json({ success: true, invoice }, { status: 201 });
}

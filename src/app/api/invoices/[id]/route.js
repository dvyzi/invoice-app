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

        // On renvoie la facture, en convertissant les dates pour éviter les soucis avec JSON
        return NextResponse.json({
            success: true,
            invoice: {
                ...invoice,
                dueDate: invoice.dueDate.toISOString(), // on formate la date proprement
                invoiceDate: invoice.invoiceDate.toISOString(), // on formate également la date de facture
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


export async function PUT(request, { params }) {
    try {
        const { id } = params;

        // Récupérer les données envoyées dans la requête
        const data = await request.json();

        // Vérifier que la facture existe
        const existingInvoice = await prisma.invoice.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!existingInvoice) {
            return NextResponse.json(
                { success: false, error: 'Facture non trouvée' },
                { status: 404 }
            );
        }

        // Calculer la date d'échéance
        const invoiceDate = new Date(data.invoiceDate);
        const paymentTerms = parseInt(data.paymentTerms);
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + paymentTerms);

        // Calculer le total
        const total = data.products.reduce((sum, product) => {
            return sum + parseFloat(product.total || 0);
        }, 0);

        // Mettre à jour la facture
        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: {
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                clientAddress: data.clientAddress,
                clientCity: data.clientCity,
                clientPostalCode: data.clientPostalCode,
                clientCountry: data.clientCountry,
                invoiceDate: new Date(data.invoiceDate),
                dueDate: dueDate,
                paymentTerms: paymentTerms,
                description: data.projectDescription,
                status: data.isDraft ? 'DRAFT' : 'PENDING',
                total: total,
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
                country: data.country,
            }
        });

        // Supprimer les anciens items
        await prisma.invoiceItem.deleteMany({
            where: { invoiceId: id }
        });

        // Créer les nouveaux items
        const items = data.products.map(product => ({
            name: product.name,
            quantity: parseInt(product.quantity),
            price: parseFloat(product.price),
            total: parseFloat(product.total),
            invoiceId: id
        }));

        await prisma.invoiceItem.createMany({
            data: items
        });

        return NextResponse.json({
            success: true,
            invoice: {
                ...updatedInvoice,
                dueDate: updatedInvoice.dueDate.toISOString()
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la facture:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

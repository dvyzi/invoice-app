"use client"

import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import Status from "@components/Status";
import Buttons from "@components/buttons";
import { useEffect, useState } from 'react';
import NewInvoicePopup from "@components/forms/new-invoice-popup";



function ProductItem({ name, quantity, price, total }) {
    return (
        <div className='md:grid md:grid-cols-4 w-full pb-6 '>
            <div className='flex justify-between items-center md:hidden'>
                <div className='flex flex-col gap-2'>
                    <p className='text-heading-s text-dark-2'>{name}</p>
                    <div className='flex flex-row gap-1'>
                        <p className='text-heading-s text-dark-gray text-center'>{quantity}</p>
                        <p className='text-heading-s text-dark-gray text-center'>x</p>
                        <p className='text-heading-s text-dark-gray text-center'>{price} €</p>
                    </div>
                </div>
                <p className='text-heading-s text-dark-2 text-right'>{total} €</p>
            </div>
            <p className='text-heading-s text-dark-2 hidden md:block'>{name}</p>
            <p className='text-heading-s text-dark-gray text-center hidden md:block'>{quantity}</p>
            <p className='text-heading-s text-dark-gray text-center hidden md:block'>{price} €</p>
            <p className='text-heading-s text-dark-2 text-right hidden md:block'>{total} €</p>
        </div>
    )
}
const InvoicePage = () => {

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const params = useParams();
    const id = params.id; // Récupère l'ID depuis l'URL

    const [invoice, setInvoice] = useState({
        id: '',
        description: '',
        clientAddress: '',
        clientCity: '',
        clientPostalCode: '',
        clientCountry: '',
        invoiceDate: '',
        dueDate: '',
        clientName: '',
        clientEmail: '',
        items: []
    })

    useEffect(() => {
        fetch(`/api/invoices/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.invoice) {
                    // Formatage des dates
                    const formattedInvoice = {
                        ...data.invoice,
                        invoiceDate: formatDate(data.invoice.invoiceDate),
                        dueDate: formatDate(data.invoice.dueDate)
                    };
                    setInvoice(formattedInvoice);
                }
            })
            .catch(error => console.error('Erreur lors de la récupération de la facture:', error));
    }, [id]);

    // Fonction utilitaire pour formater les dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    };


    return (
        <>
            {invoice && invoice.id ? (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2 text-dark-2 text-heading-s-nobold cursor-pointer hover:text-muted-dark w-fit"><ChevronLeft className="text-primary w-5 h-5" /> Retour</Link>
                        <div className="flex items-center justify-between bg-white rounded-lg p-6">
                            <div className="flex items-center w-full md:w-auto justify-between md:gap-7">
                                <p className="text-body text-dark-gray">Statut</p>
                                <Status status={invoice.status} />
                            </div>
                            <div className="hidden md:flex flex-row items-center gap-4">
                                {(invoice.status === 'PENDING' || invoice.status === "DRAFT") && (
                                    <Buttons
                                        type="secondary"
                                        onPress={() => setIsEditPopupOpen(true)}
                                    >
                                        Modifier
                                    </Buttons>
                                )}
                                <Buttons type="delete" onPress={invoice.id}>Supprimer</Buttons>
                                {invoice.status === 'PENDING' && (
                                    <Buttons type="primary" onPress={invoice.id}>Marquer comme payé</Buttons>
                                )}
                            </div>
                        </div>
                        <div className='bg-white rounded-lg p-5 mb-20 md:p-12 my-5 flex flex-col gap-6'>
                            <div className='flex flex-col gap-5 md:flex-row md:justify-between md:items-center'>
                                <div className='flex flex-col gap-1 md:gap-2'>
                                    <p className='text-heading-s text-dark-2'><span className='text-muted-dark text-heading-s'>#</span>{invoice.id.slice(0, 8).toUpperCase()}</p>
                                    <p className='text-body text-dark-gray'>{invoice.description}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='text-dark-gray text-body'>{invoice.clientAddress}</p>
                                    <p className='text-dark-gray text-body'>{invoice.clientCity}</p>
                                    <p className='text-dark-gray text-body'>{invoice.clientPostalCode}</p>
                                    <p className='text-dark-gray text-body'>{invoice.clientCountry}</p>
                                </div>
                            </div>
                            <div className='flex items-start justify-between pr-0 md:pr-24'>
                                <div className='flex flex-col gap-6'>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-body text-dark-gray'>Date de la facture</p>
                                        <p className='text-heading-s text-dark-2'>{invoice.invoiceDate}</p>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-body text-dark-gray'>Date limite de paiement</p>
                                        <p className='text-heading-s text-dark-2'>{invoice.dueDate}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-body text-dark-gray'>Facturer à</p>
                                        <p className='text-heading-s text-dark-2'>{invoice.clientName}</p>
                                    </div>
                                    <p className='text-dark-gray text-body'>{invoice.clientAddress}</p>
                                    <p className='text-dark-gray text-body'>{invoice.clientCity}</p>
                                    <p className='text-dark-gray text-body'>{invoice.clientPostalCode}</p>
                                    <p className='text-dark-gray text-body'>{invoice.clientCountry}</p>
                                </div>
                                <div className='hidden md:flex md:flex-col md:gap-2'>
                                    <p className='text-body text-dark-gray'>Envoyé à</p>
                                    <p className='text-heading-s text-dark-2'>{invoice.clientEmail}</p>
                                </div>
                            </div>
                            <div className='flex md:hidden flex-col gap-2'>
                                <p className='text-body text-dark-gray'>Envoyé à</p>
                                <p className='text-heading-s text-dark-2'>{invoice.clientEmail}</p>
                            </div>
                            <div>
                                <div className='flex flex-col items-center gap-2 bg-gray-light rounded-t-lg p-2 md:p-10 md:mt-6'>
                                    <div className='grid grid-cols-4 w-full pb-8'>
                                        <p className='text-body text-dark-gray hidden md:block'>Nom du produit</p>
                                        <p className='text-body text-dark-gray text-center hidden md:block'>QTE.</p>
                                        <p className='text-body text-dark-gray text-center hidden md:block'>Prix</p>
                                        <p className='text-body text-dark-gray text-right hidden md:block'>Total</p>
                                    </div>
                                    {invoice.items && invoice.items.map((item, index) => (
                                        <ProductItem
                                            key={index}
                                            name={item.name}
                                            quantity={item.quantity}
                                            price={item.price}
                                            total={item.total}
                                        />
                                    ))}
                                </div>
                                <div className='bg-dark-light p-8 rounded-b-lg flex justify-between items-center'>
                                    <p className='text-body text-primary-foreground'>Total à payer</p>
                                    <p className='text-heading-m text-primary-foreground'>{invoice.total} €</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='md:hidden flex justify-between items-center gap-1 w-full bg-white rounded-lg p-4 fixed bottom-0 left-0 right-0'>
                        {(invoice.status === 'PENDING' || invoice.status === "DRAFT") && (
                            <Buttons
                                type="secondary"
                                onPress={() => setIsEditPopupOpen(true)}
                            >
                                Modifier
                            </Buttons>
                        )}
                        <Buttons type="delete" onPress={invoice.id}>Supprimer</Buttons>
                        {invoice.status === 'PENDING' && (
                            <Buttons type="primary" onPress={invoice.id}>Marquer comme payé</Buttons>
                        )}
                    </div>
                </div>
            ) : (
                <div>Chargement...</div>
            )}
            {
                isEditPopupOpen && (
                    <NewInvoicePopup
                        isOpen={isEditPopupOpen}
                        onClose={() => setIsEditPopupOpen(false)}
                        onInvoiceCreated={() => {
                            // Rafraîchir les données après modification
                            window.location.reload();
                        }}
                        invoiceToEdit={invoice}
                        isEditing={true}
                    />
                )
            }
        </>
    )
}

export default InvoicePage;
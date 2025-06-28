"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import Status from "@components/Status";
import Buttons from "@components/buttons";
import SignatureModal from "@components/SignatureModal";

// Composant pour afficher un élément de produit dans la facture
function ProductItem({ name, quantity, price, total }) {
    return (
        <div className='md:grid md:grid-cols-4 w-full pb-6'>
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

// Composant pour le formulaire de mot de passe
function PasswordForm({ onSubmit, error }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-md">
            <h2 className="text-heading-m text-dark-2 mb-6 text-center">Accès à la facture</h2>
            <p className="text-body text-dark-gray mb-6 text-center">
                Veuillez saisir le mot de passe qui vous a été envoyé par email pour accéder à votre facture.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-body text-dark-2">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <div className="flex justify-center">
                    <Buttons type="primary" className="mt-4 w-auto px-8">
                        Accéder à la facture
                    </Buttons>
                </div>
            </form>
        </div>
    );
}

// Page principale de la facture client
export default function ClientInvoicePage() {
    const params = useParams();
    const { clientName, invoiceId } = params;

    const [invoice, setInvoice] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

    // Récupérer les données de la facture
    const fetchInvoiceData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/invoices/${invoiceId}`);
            const data = await response.json();
            
            if (data.invoice) {
                // Formatage des dates
                const formattedInvoice = {
                    ...data.invoice,
                    invoiceDate: formatDate(data.invoice.invoiceDate),
                    dueDate: formatDate(data.invoice.dueDate)
                };
                setInvoice(formattedInvoice);
            }
            
            setIsLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération de la facture:', error);
            setIsLoading(false);
        }
    };

    // Fonction pour vérifier le mot de passe
    const handlePasswordSubmit = async (password) => {
        try {
            setError('');
            setIsLoading(true);
            const response = await fetch('/api/invoices/access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invoiceId,
                    password
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setIsAuthenticated(true);
                fetchInvoiceData();
            } else {
                setError('Mot de passe incorrect. Veuillez réessayer.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du mot de passe:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
            setIsLoading(false);
        }
    };

    // Fonction utilitaire pour formater les dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    };

    if (isLoading && !invoice) {
        return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
    }

    // Si l'utilisateur n'est pas authentifié, afficher le formulaire de mot de passe
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <PasswordForm onSubmit={handlePasswordSubmit} error={error} />
            </div>
        );
    }

    // Si l'utilisateur est authentifié mais la facture n'est pas chargée
    if (!invoice) {
        return <div className="flex justify-center items-center min-h-screen">Facture introuvable</div>;
    }

    // Afficher la facture
    return (
        <div className="min-h-screen flex items-center justify-center py-8">
            <div className="container mx-auto p-4 md:p-8 max-w-4xl">
                <div className="bg-white rounded-lg p-6 mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h1 className="text-heading-m text-dark-2">
                                Facture <span className="text-dark-gray">#</span><span className="font-bold">{invoice.id.substring(0, 6).toUpperCase()}</span>
                            </h1>
                            <Status status={invoice.status} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-body text-dark-gray mb-2">Facturé à</p>
                            <p className="text-heading-s text-dark-2">{invoice.clientName}</p>
                            <p className="text-body text-dark-gray">{invoice.clientAddress}</p>
                            <p className="text-body text-dark-gray">{invoice.clientCity}, {invoice.clientPostalCode}</p>
                            <p className="text-body text-dark-gray">{invoice.clientCountry}</p>
                        </div>
                        
                        <div>
                            <div className="mb-4">
                                <p className="text-body text-dark-gray mb-2">Date de facturation</p>
                                <p className="text-heading-s text-dark-2">{invoice.invoiceDate}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-body text-dark-gray mb-2">Date d'échéance</p>
                                <p className="text-heading-s text-dark-2">{invoice.dueDate}</p>
                            </div>
                            <div>
                                <p className="text-body text-dark-gray mb-2">Envoyé à</p>
                                <p className="text-heading-s text-dark-2">{invoice.clientEmail}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="bg-gray-light rounded-t-lg p-6 md:p-10">
                            <div className="grid grid-cols-4 w-full pb-8 hidden md:grid">
                                <p className="text-body text-dark-gray">Nom du produit</p>
                                <p className="text-body text-dark-gray text-center">QTE.</p>
                                <p className="text-body text-dark-gray text-center">Prix</p>
                                <p className="text-body text-dark-gray text-right">Total</p>
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
                        <div className="bg-dark-light p-8 rounded-b-lg flex justify-between items-center">
                            <p className="text-body text-primary-foreground">Total à payer</p>
                            <p className="text-heading-m text-primary-foreground">{invoice.total} €</p>
                        </div>
                        
                        {/* Bouton pour signer la facture */}
                        <div className="mt-6 flex justify-end">
                            <Buttons 
                                type="primary" 
                                onPress={() => setIsSignatureModalOpen(true)}
                                disabled={invoice.status === 'PAID' || invoice.isSigned}
                                className={invoice.status === 'PAID' || invoice.isSigned ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                {invoice.isSigned ? "Facture signée" : "Signer la facture"}
                            </Buttons>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal de signature */}
            <SignatureModal 
                isOpen={isSignatureModalOpen} 
                onClose={() => setIsSignatureModalOpen(false)} 
                onSignatureSave={(data) => {
                    // Mettre à jour l'état de la facture avec la signature et le statut PAID
                    setInvoice(prev => ({
                        ...prev,
                        isSigned: true,
                        signatureDate: new Date().toISOString(),
                        status: 'PAID' // Mettre à jour le statut à PAID dans l'interface
                    }));
                }}
                invoiceId={invoiceId}
            />
        </div>
    );
}
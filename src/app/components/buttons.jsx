import { useState } from 'react';

export default function Buttons({ type, children, onPress, disabled }) {
    /**
     * Fonction qui gère la suppression d'une facture
     * - Vérifie que l'ID est valide (string ou number)
     * - Envoie une requête DELETE à l'API
     * - Recharge la page après suppression réussie
     */
    const handleDeleteInvoice = () => {
        if (confirm("Confirmez vous la supression de cette facture ?")) {
            // Vérification de sécurité: onPress doit être un ID valide
            if (typeof onPress !== 'string' && typeof onPress !== 'number') {
                return; // Arrêt si l'ID n'est pas valide
            }

            // Appel à l'API pour supprimer la facture
            fetch('/api/invoices/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: onPress }), // Envoi de l'ID dans le corps de la requête
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur réseau: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Rediriger vers la page d'accueil après suppression réussie
                        window.location.href = '/';
                    }
                })
                .catch(error => { /* Gestion silencieuse des erreurs */ });
        }
    }

    /**
     * Fonction qui gère le changement de statut d'une facture de PENDING à PAID
     * - Vérifie que l'ID est valide (string ou number)
     * - Envoie une requête PUT à l'API
     * - Recharge la page après mise à jour réussie
     */
    const handleMarkAsPaid = () => {
        if (confirm("Confirmez-vous que cette facture a été payée ?")) {
            // Vérification de sécurité: onPress doit être un ID valide
            if (typeof onPress !== 'string' && typeof onPress !== 'number') {
                return; // Arrêt si l'ID n'est pas valide
            }

            // Appel à l'API pour mettre à jour le statut
            fetch('/api/update-invoice-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoiceId: onPress }), // Envoi de l'ID dans le corps de la requête
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur réseau: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Recharger la page pour afficher le nouveau statut
                        window.location.reload();
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour du statut:', error);
                    alert('Une erreur est survenue lors de la mise à jour du statut.');
                });
        }
    }


    switch (type) {
        case 'new-invoice':
            return <button onClick={onPress} className="bg-primary text-white px-2 py-2 rounded-3xl items-center gap-2 hover:bg-primary-light text-heading-s hidden md:flex"> <img src="/new.svg" alt="New Invoice" /> {children}</button>;
        case 'new-invoice-mobile':
            return <button onClick={onPress} className="bg-primary px-[6px] py-[6px] rounded-full text-heading-s flex md:hidden"><img src="/new.svg" alt="New Invoice" /></button>;
        case 'delete':
            // Bouton de suppression qui utilise handleDeleteInvoice avec l'ID passé via onPress
            return <button onClick={handleDeleteInvoice} className="bg-danger text-white px-4 py-3 rounded-3xl flex items-center hover:bg-danger-light text-heading-s"> {children}</button>;
        case 'primary':
            return <button
                onClick={type === 'primary' && children === 'Marquer comme payé' ? handleMarkAsPaid : onPress}
                disabled={disabled}
                className={`bg-primary text-white px-3 py-3 rounded-3xl flex items-center gap-2 hover:bg-primary-light text-heading-s ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {children}
            </button>;
        case 'secondary':
            return <button onClick={onPress} className="bg-gray-1 text-dark-gray px-6 py-3 rounded-3xl flex items-center gap-2 hover:bg-gray-light text-heading-s">{children}</button>;
        case 'cancel':
            return <button onClick={onPress} className="bg-gray-1 text-dark-gray px-3 py-3 rounded-3xl flex items-center gap-2 hover:bg-gray-light text-heading-s">{children}</button>;
        default:
            return <button className="bg-primary text-white px-4 py-2 rounded-md text-heading-s">{children}</button>;
        case 'tertiary':
            return <button onClick={onPress} className="bg-dark-light text-gray-2 px-3 py-3 rounded-3xl flex items-center gap-2 hover:bg-dark-2 text-heading-s">{children}</button>;
    }
}
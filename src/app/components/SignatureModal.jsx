"use client";

import { useState } from 'react';
import SignaturePadComponent from './SignaturePad';

export default function SignatureModal({ isOpen, onClose, onSignatureSave, invoiceId }) {
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveSignature = async (signatureData) => {
    try {
      setIsSaving(true);
      
      // Envoyer la signature au serveur
      const response = await fetch('/api/invoices/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId,
          signatureData
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de la signature');
      }

      const data = await response.json();
      onSignatureSave(data);
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'enregistrement de la signature');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex flex-col gap-6">
          <h2 className="text-heading-m text-dark-2">Signez votre facture</h2>
          <p className="text-body text-dark-gray">
            Veuillez signer dans l'espace ci-dessous pour valider votre facture.
          </p>
          
          <SignaturePadComponent 
            onSave={handleSaveSignature}
            onCancel={onClose}
          />
          
          {isSaving && (
            <div className="text-center text-body text-dark-gray">
              Enregistrement en cours...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';
import Buttons from './buttons';

export default function SignaturePadComponent({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    // Initialiser le pad de signature lorsque le composant est monté
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
      });
      
      // Vérifier si la signature est vide
      signaturePadRef.current.addEventListener("endStroke", () => {
        setIsEmpty(signaturePadRef.current.isEmpty());
      });
    }

    // Nettoyer lorsque le composant est démonté
    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, []);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setIsEmpty(true);
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      // Obtenir l'image de la signature en base64
      const signatureData = signaturePadRef.current.toDataURL();
      onSave(signatureData);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full" 
          style={{ 
            touchAction: 'none',
            width: '100%',
            height: '200px'
          }}
        />
      </div>
      <div className="flex justify-between gap-4">
        <Buttons type="secondary" onPress={handleClear}>
          Effacer
        </Buttons>
        <div className="flex gap-2">
          <Buttons type="secondary" onPress={onCancel}>
            Annuler
          </Buttons>
          <Buttons 
            type="primary" 
            onPress={handleSave} 
            disabled={isEmpty}
            className={isEmpty ? "opacity-50 cursor-not-allowed" : ""}
          >
            Enregistrer
          </Buttons>
        </div>
      </div>
    </div>
  );
}

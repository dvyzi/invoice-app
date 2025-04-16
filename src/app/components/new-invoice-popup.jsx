"use client"

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Buttons from "@components/buttons";

const NewInvoicePopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Durée de l'animation
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div
        ref={popupRef}
        className={`fixed left-[85px] px-14 py-7 top-0 h-full bg-white w-full max-w-[616px] ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}
      >
        <div className="p-8 h-full overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <h2 className="text-heading-m text-dark-2 mb-6">Nouvelle Facture</h2>

          <form className="space-y-6">

            <div className='flex flex-col gap-6 pt-3'>
              <h3 className="text-heading-s text-primary">Facturé par</h3>
              <div className='flex flex-col gap-2'>
                <label htmlFor="address" className='text-body text-muted-dark'>Adresse</label>
                <input type="text" id="address" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
              </div>
              <div className='flex justify-between items-center gap-4'>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor="city" className='text-body text-muted-dark'>Ville</label>
                  <input type="text" id="city" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor="postalCode" className='text-body text-muted-dark'>Code postal</label>
                  <input type="text" id="postalCode" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor="country" className='text-body text-muted-dark'>Pays</label>
                  <input type="text" id="country" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
              </div>
            </div>






            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-heading-s text-gray-2 hover:text-gray-3"
              >
                Annuler
              </button>
              <Buttons type="primary">
                Sauvegarder &amp; envoyer
              </Buttons>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewInvoicePopup; 
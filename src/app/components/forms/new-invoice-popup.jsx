"use client"

import { useState, useRef, useEffect } from 'react';
import { Trash, Plus, X } from 'lucide-react';

import Buttons from "@components/buttons";

const ProductInputs = ({ productDetails, onProductChange, onRemove }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex-[3]'>
          <input 
            type="text" 
            id="productName" 
            value={productDetails.name}
            onChange={(e) => onProductChange('name', e.target.value)}
            className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' 
          />
        </div>
        <div className='flex-1'>
          <input 
            type="number" 
            id="productQuantity" 
            value={productDetails.quantity}
            onChange={(e) => onProductChange('quantity', e.target.value)}
            className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' 
          />
        </div>
        <div className='flex-[2]'>
          <input 
            type="number" 
            id="productPrice" 
            value={productDetails.price}
            onChange={(e) => onProductChange('price', e.target.value)}
            className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' 
          />
        </div>
        <div className='flex-[2]'>
          <input 
            type="number" 
            id="productTotal" 
            value={productDetails.total}
            readOnly
            className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full bg-gray-50' 
          />
        </div>
        {onRemove && (
          <button 
            onClick={onRemove}
            className="text-danger hover:text-danger-light"
          >
            <Trash size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

const NewInvoicePopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [products, setProducts] = useState([{
    name: '',
    quantity: '',
    price: '',
    total: ''
  }]);

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

  const handleProductChange = (index, field, value) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = {
        ...newProducts[index],
        [field]: value
      };
      
      if (field === 'quantity' || field === 'price') {
        const quantity = parseFloat(newProducts[index].quantity) || 0;
        const price = parseFloat(newProducts[index].price) || 0;
        newProducts[index].total = (quantity * price).toFixed(2);
      }
      
      return newProducts;
    });
  };

  const addProduct = () => {
    setProducts(prev => [...prev, {
      name: '',
      quantity: '',
      price: '',
      total: ''
    }]);
  };

  const removeProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
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

          <h2 className="text-heading-m text-dark-2 mb-8">Nouvelle Facture</h2>

          <form className="space-y-8">
            <div>
              <h3 className="text-heading-s text-primary mb-4">Facturé par</h3>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="address" className='text-body text-muted-dark'>Adresse</label>
                    <p className='text-xs text-danger'>Champs manquant</p>
                  </div>
                  <input type="text" id="address" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
                <div className='flex justify-between items-center gap-4'>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="city" className='text-body text-muted-dark'>Ville</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <input type="text" id="city" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="postalCode" className='text-body text-muted-dark'>C. postal</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <input type="text" id="postalCode" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="country" className='text-body text-muted-dark'>Pays</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <input type="text" id="country" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-heading-s text-primary mb-4">Facturé à</h3>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="clientName" className='text-body text-muted-dark'>Nom du client</label>
                    <p className='text-xs text-danger'>Champs manquant</p>
                  </div>
                  <input type="text" id="clientName" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="clientEmail" className='text-body text-muted-dark'>Email client</label>
                    <p className='text-xs text-danger'>Champs manquant</p>
                  </div>
                  <input type="text" id="clientEmail" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="clientAddress" className='text-body text-muted-dark'>Adresse</label>
                    <p className='text-xs text-danger'>Champs manquant</p>
                  </div>
                  <input type="text" id="clientAddress" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
                <div className='flex justify-between items-center gap-4'>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="city" className='text-body text-muted-dark'>Ville</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <input type="text" id="city" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="postalCode" className='text-body text-muted-dark'>C. postal</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <input type="text" id="postalCode" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="country" className='text-body text-muted-dark'>Pays</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <input type="text" id="country" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                  </div>
                </div>
                <div className='flex justify-between items-center pt-10'>
                  <div className='flex flex-col gap-2 w-[48%]'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="invoiceDate" className='text-body text-muted-dark'>Date de la facture</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <input type="date" id="invoiceDate" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                  </div>
                  <div className='flex flex-col gap-2 w-[48%]'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="paymentTerms" className='text-body text-muted-dark'>Conditions de paiement</label>
                      <p className='text-xs text-danger'>Ch. manquant</p>
                    </div>
                    <select id="paymentTerms" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'>
                      <option value="1">Net 1 jour</option>
                      <option value="2">Net 7 jours</option>
                      <option value="3">Net 14 jours</option>
                      <option value="4">Net 30 jours</option>
                    </select>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="projectDescription" className='text-body text-muted-dark'>Description de projet</label>
                    <p className='text-xs text-danger'>Champs manquant</p>
                  </div>
                  <input type="text" id="projectDescription" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full' />
                </div>
                <h2 className='text-gray-2 text-heading-s'>Liste produits</h2>
                <div className='flex flex-col gap-4'>
                  <div className='flex justify-between items-center gap-4'>
                    <div className='flex-[3]'>
                      <label htmlFor="productName" className='text-body text-muted-dark'>Nom des produits</label>
                    </div>
                    <div className='flex-1'>
                      <label htmlFor="productQuantity" className='text-body text-muted-dark'>QTE.</label>
                    </div>
                    <div className='flex-[2]'>
                      <label htmlFor="productPrice" className='text-body text-muted-dark'>Prix</label>
                    </div>
                    <div className='flex-[2]'>
                      <label htmlFor="productTotal" className='text-body text-muted-dark'>Total</label>
                    </div>
                    <div className='w-5'></div>
                  </div>
                  {products.map((product, index) => (
                    <ProductInputs
                      key={index}
                      productDetails={product}
                      onProductChange={(field, value) => handleProductChange(index, field, value)}
                      onRemove={products.length > 1 ? () => removeProduct(index) : null}
                    />
                  ))}
                </div>
                <button
                  onClick={addProduct}
                  type="button"
                  className="flex justify-center items-center gap-2 text-gray-3 bg-gray-light hover:bg-gray-1 mt-4 rounded-full h-12"
                >
                  <Plus size={20} />
                  <span className="text-heading-s">Ajouter un nouveau produit</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <Buttons
                type="cancel"
              >
                Annuler
              </Buttons>
              <div className='flex gap-4'>
                <Buttons type="tertiary">
                  Brouillon
                </Buttons>
                <Buttons type="primary">
                  Sauvegarder &amp; envoyer
                </Buttons>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewInvoicePopup; 
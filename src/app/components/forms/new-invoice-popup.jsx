"use client"

import { useState, useRef, useEffect } from 'react';
import { Trash, Plus, X } from 'lucide-react';

import Buttons from "@components/buttons";


const ProductInputs = ({ productDetails, onProductChange, onRemove, hasError }) => {

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex-[3]'>
          <input
            type="text"
            id="productName"
            value={productDetails.name}
            onChange={(e) => onProductChange('name', e.target.value)}
            className={`text-heading-s text-dark-2 border ${hasError && !productDetails.name.trim() ? 'border-danger' : 'border-gray-1'} rounded-lg h-12 px-4 outline-primary-light outline-1 w-full`}
          />
        </div>
        <div className='flex-1'>
          <input
            type="number"
            id="productQuantity"
            value={productDetails.quantity}
            onChange={(e) => onProductChange('quantity', e.target.value)}
            className={`text-heading-s text-dark-2 border ${hasError && !productDetails.quantity ? 'border-danger' : 'border-gray-1'} rounded-lg h-12 px-4 outline-primary-light outline-1 w-full`}
          />
        </div>
        <div className='flex-[2]'>
          <input
            type="number"
            id="productPrice"
            value={productDetails.price}
            onChange={(e) => onProductChange('price', e.target.value)}
            className={`text-heading-s text-dark-2 border ${hasError && !productDetails.price ? 'border-danger' : 'border-gray-1'} rounded-lg h-12 px-4 outline-primary-light outline-1 w-full`}
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
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="text-danger hover:text-danger-light"
          >
            <Trash size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

const NewInvoicePopup = ({
  isOpen,
  onClose,
  onInvoiceCreated,
  invoiceToEdit = null,   // Nouvelle prop pour la facture à modifier
  isEditing = false       // Nouvelle prop pour indiquer le mode édition
}) => {

  const [userData, setUserData] = useState(null);
  // Récupérer les informations de l'utilisateur au chargement du composant
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    };

    fetchUserData();
  }, []);

  const popupRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [products, setProducts] = useState([{
    name: '',
    quantity: '',
    price: '',
    total: ''
  }]);

  // Ajout d'un état pour stocker les valeurs des champs
  const [formValues, setFormValues] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientCity: '',
    clientPostalCode: '',
    clientCountry: '',
    invoiceDate: '',
    projectDescription: ''
  });

  // Ajout d'un état pour suivre les erreurs de validation
  const [errors, setErrors] = useState({});
  // État pour vérifier si le formulaire a été soumis
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  useEffect(() => {
    if (isEditing && invoiceToEdit) {
      // Formater les dates pour l'input date (format YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
          let date;

          // Vérifier si la date est au format français (ex: "20 juin 2025")
          if (typeof dateString === 'string' && dateString.includes(' ')) {
            // Tableau de correspondance des mois en français
            const moisFrancais = {
              'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
              'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
              'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
            };

            const parties = dateString.split(' ');
            if (parties.length === 3) {
              const jour = parties[0].padStart(2, '0');
              const mois = moisFrancais[parties[1].toLowerCase()];
              const annee = parties[2];

              if (jour && mois && annee) {
                // Format YYYY-MM-DD pour l'input date
                return `${annee}-${mois}-${jour}`;
              }
            }
          }

          // Essayer le format standard
          date = new Date(dateString);

          // Vérifier si la date est valide
          if (isNaN(date.getTime())) {
            console.error('Date invalide:', dateString);
            return '';
          }

          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Erreur lors du formatage de la date:', error);
          return '';
        }
      };

      // Pré-remplir le formulaire avec les données de la facture
      setFormValues({
        address: invoiceToEdit.address || '',
        city: invoiceToEdit.city || '',
        postalCode: invoiceToEdit.postalCode || '',
        country: invoiceToEdit.country || '',
        clientName: invoiceToEdit.clientName || '',
        clientEmail: invoiceToEdit.clientEmail || '',
        clientAddress: invoiceToEdit.clientAddress || '',
        clientCity: invoiceToEdit.clientCity || '',
        clientPostalCode: invoiceToEdit.clientPostalCode || '',
        clientCountry: invoiceToEdit.clientCountry || '',
        invoiceDate: formatDateForInput(invoiceToEdit.invoiceDate) || '',
        projectDescription: invoiceToEdit.description || ''
      });

      // Pré-remplir les produits
      if (invoiceToEdit.items && invoiceToEdit.items.length > 0) {
        setProducts(invoiceToEdit.items.map(item => ({
          name: item.name || '',
          quantity: item.quantity || '',
          price: item.price || '',
          total: item.total || ''
        })));
      }

      // Pré-sélectionner les termes de paiement
      setTimeout(() => {
        const paymentTermsSelect = document.getElementById('paymentTerms');
        if (paymentTermsSelect && invoiceToEdit.paymentTerms) {
          paymentTermsSelect.value = invoiceToEdit.paymentTerms;
        }
      }, 0);
    }
  }, [isEditing, invoiceToEdit]);

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

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));

    // Si le formulaire a déjà été soumis, on valide le champ qui vient d'être modifié
    if (isSubmitted) {
      validateField(field, value);
    }
  };

  // Validation d'un champ spécifique
  const validateField = (field, value) => {
    if (!value.trim()) {
      setErrors(prev => ({
        ...prev,
        [field]: 'Ch. manquant'
      }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };


  // Validation du formulaire entier
  const validateForm = () => {
    const requiredFields = [
      'address', 'city', 'postalCode', 'country',
      'clientName', 'clientEmail', 'clientAddress', 'clientCity',
      'clientPostalCode', 'clientCountry', 'invoiceDate'
    ];

    const newErrors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      const value = formValues[field] || '';
      if (!value.trim()) {
        newErrors[field] = 'Ch. manquant';
        isValid = false;
      }
    });

    // Validation des produits
    const productsValid = products.every(product =>
      product.name.trim() && product.quantity && product.price
    );

    if (!productsValid) {
      newErrors.products = 'Tous les produits doivent être remplis correctement';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
 * Gère la soumission du formulaire de facture
 * @param {Event} e - Événement de soumission
 * @param {boolean} isDraft - Indique si c'est un brouillon
 */
  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();

    // Pour les brouillons, pas besoin de validation
    if (isDraft) {
      await saveInvoice(true);
      return;
    }

    // Marquer le formulaire comme soumis pour activer la validation continue
    setIsSubmitted(true);

    // Valider le formulaire
    const isValid = validateForm();

    if (isValid) {
      await saveInvoice(false);
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientEmail: formValues.clientEmail,
          clientName: formValues.clientName
        }),
      });
      const data = await res.json();
      console.log(data);
    } else {
      console.log('Formulaire invalide', errors);
    }
  };

  /**
   * Envoie les données de la facture à l'API
   * @param {boolean} isDraft - Indique si c'est un brouillon
   */
  const saveInvoice = async (isDraft) => {
    try {
      // Préparation des données
      const invoiceData = {
        ...formValues,
        paymentTerms: document.getElementById('paymentTerms').value,
        products: products,
        isDraft: isDraft
      };

      // URL et méthode différentes selon création ou modification
      const url = isEditing
        ? `/api/invoices/${invoiceToEdit.id}` // Endpoint de mise à jour
        : '/api/invoices';                    // Endpoint de création

      const method = isEditing ? 'PUT' : 'POST';

      // Envoi à l'API
      const response = await fetch(url, {
        method: method,
        headers: {
          'userId': userData?.id,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();

      if (result.success) {
        // Appeler la fonction de callback si elle existe
        if (typeof onInvoiceCreated === 'function') {
          onInvoiceCreated();
        }
        handleClose();
      } else {
        console.error('Erreur lors de l\'enregistrement de la facture', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données', error);
    }
  };

  // Ajouter avant le return
  const popupTitle = isEditing
    ? 'Modifier la facture'
    : 'Nouvelle Facture';

  const invoiceNumber = isEditing ? invoiceToEdit?.id?.slice(0, 8).toUpperCase() : null;


  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div
        ref={popupRef}
        className={`fixed md:left-0 lg:left-[85px] px-6 md:px-10 lg:px-14 py-7 top-0 h-full bg-white w-full md:max-w-[80%] lg:max-w-[616px] ${isClosing ? 'animate-slideOut' : 'animate-slideIn'} pt-[80px] md:pt-[100px]`}
      >
        <div className="p-8 h-full overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-[85px] md:top-[105px] lg:top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <h2 className="text-heading-m text-dark-2 mb-8">
            {popupTitle} {isEditing && (
              <span>
                <br />
                <br />
                <span className="text-dark-gray text-heading-s">#</span>
                <span className="font-bold text-heading-s">{invoiceNumber}</span>
              </span>
            )}
          </h2>

          <form className="space-y-8" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <h3 className="text-heading-s text-primary mb-4">Facturé par</h3>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="address" className='text-body text-muted-dark'>Adresse</label>
                    {errors.address && <p className='text-xs text-danger'>{errors.address}</p>}
                  </div>
                  <input
                    type="text"
                    id="address"
                    value={formValues.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                  />
                </div>
                <div className='flex justify-between items-center gap-4'>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="city" className='text-body text-muted-dark'>Ville</label>
                      {errors.city && <p className='text-xs text-danger'>{errors.city}</p>}
                    </div>
                    <input
                      type="text"
                      id="city"
                      value={formValues.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                    />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="postalCode" className='text-body text-muted-dark'>C. postal</label>
                      {errors.postalCode && <p className='text-xs text-danger'>{errors.postalCode}</p>}
                    </div>
                    <input
                      type="text"
                      id="postalCode"
                      value={formValues.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                    />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="country" className='text-body text-muted-dark'>Pays</label>
                      {errors.country && <p className='text-xs text-danger'>{errors.country}</p>}
                    </div>
                    <input
                      type="text"
                      id="country"
                      value={formValues.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-heading-s text-primary mb-4">Facturé à</h3>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="clientName" className='text-body text-muted-dark'>Nom & prénom du client</label>
                    {errors.clientName && <p className='text-xs text-danger'>{errors.clientName}</p>}
                  </div>
                  <input
                    type="text"
                    id="clientName"
                    value={formValues.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="clientEmail" className='text-body text-muted-dark'>Email client</label>
                    {errors.clientEmail && <p className='text-xs text-danger'>{errors.clientEmail}</p>}
                  </div>
                  <input
                    type="text"
                    id="clientEmail"
                    value={formValues.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="clientAddress" className='text-body text-muted-dark'>Adresse</label>
                    {errors.clientAddress && <p className='text-xs text-danger'>{errors.clientAddress}</p>}
                  </div>
                  <input
                    type="text"
                    id="clientAddress"
                    value={formValues.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                  />
                </div>
                <div className='flex justify-between items-center gap-4'>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="clientCity" className='text-body text-muted-dark'>Ville</label>
                      {errors.clientCity && <p className='text-xs text-danger'>{errors.clientCity}</p>}
                    </div>
                    <input
                      type="text"
                      id="clientCity"
                      value={formValues.clientCity}
                      onChange={(e) => handleInputChange('clientCity', e.target.value)}
                      className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                    />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="clientPostalCode" className='text-body text-muted-dark'>C. postal</label>
                      {errors.clientPostalCode && <p className='text-xs text-danger'>{errors.clientPostalCode}</p>}
                    </div>
                    <input
                      type="text"
                      id="clientPostalCode"
                      value={formValues.clientPostalCode}
                      onChange={(e) => handleInputChange('clientPostalCode', e.target.value)}
                      className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                    />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="clientCountry" className='text-body text-muted-dark'>Pays</label>
                      {errors.clientCountry && <p className='text-xs text-danger'>{errors.clientCountry}</p>}
                    </div>
                    <input
                      type="text"
                      id="clientCountry"
                      value={formValues.clientCountry}
                      onChange={(e) => handleInputChange('clientCountry', e.target.value)}
                      className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                    />
                  </div>
                </div>
                <div className='flex justify-between items-center pt-10'>
                  <div className='flex flex-col gap-2 w-[48%]'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="invoiceDate" className='text-body text-muted-dark'>Date de la facture</label>
                      {errors.invoiceDate && <p className='text-xs text-danger'>{errors.invoiceDate}</p>}
                    </div>
                    <input
                      type="date"
                      id="invoiceDate"
                      value={formValues.invoiceDate}
                      onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                    />
                  </div>
                  <div className='flex flex-col gap-2 w-[48%]'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="paymentTerms" className='text-body text-muted-dark'>Conditions de paiement</label>
                    </div>
                    <select id="paymentTerms" className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'>
                      <option value="1">Net 1 jour</option>
                      <option value="7">Net 7 jours</option>
                      <option value="14">Net 14 jours</option>
                      <option value="30">Net 30 jours</option>
                    </select>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="projectDescription" className='text-body text-muted-dark'>Description de projet</label>
                  </div>
                  <input
                    type="text"
                    id="projectDescription"
                    value={formValues.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    className='text-heading-s text-dark-2 border border-gray-1 rounded-lg h-12 px-4 outline-primary-light outline-1 w-full'
                  />
                </div>
                <h2 className='text-gray-2 text-heading-s'>Liste produits</h2>
                {errors.products && <p className='text-xs text-danger'>{errors.products}</p>}
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
                      hasError={!!errors.products && isSubmitted}
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
                onPress={handleClose}
              >
                Annuler
              </Buttons>
              <div className='flex gap-4'>
                {/* Toujours afficher le bouton Brouillon pour les nouvelles factures ou les factures existantes non payées */}
                {(!isEditing || (isEditing && invoiceToEdit?.status === "DRAFT")) && (
                  <Buttons
                    type="tertiary"
                    onPress={(e) => handleSubmit(e, true)}
                  >
                    Brouillon
                  </Buttons>
                )}
                <Buttons
                  type="primary"
                  onPress={(e) => handleSubmit(e)}
                >
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
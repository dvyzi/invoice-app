/**
 * Test unitaire pour la validation de formulaire
 */

// Fonction de validation de formulaire (similaire à celle dans votre application)
function validateForm(formValues) {
  const requiredFields = [
    'address', 'city', 'postalCode', 'country',
    'clientName', 'clientEmail', 'clientAddress', 'clientCity',
    'clientPostalCode', 'clientCountry', 'invoiceDate'
  ];

  let isValid = true;

  requiredFields.forEach(field => {
    const value = formValues[field] || '';
    if (!value.trim()) {
      isValid = false;
    }
  });

  return isValid;
}

describe('Validation du formulaire de facture', () => {
  test('validateForm retourne false quand des champs obligatoires sont manquants', () => {
    // Arrangement
    const formValues = {
      address: '',
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
      clientName: 'Client Test',
      clientEmail: '',  // Champ obligatoire manquant
      clientAddress: '456 Rue Client',
      clientCity: 'Lyon',
      clientPostalCode: '69000',
      clientCountry: 'France',
      invoiceDate: '2025-07-01'
    };
    
    // Action
    const result = validateForm(formValues);
    
    // Assertion
    expect(result).toBe(false);
  });
  
  test('validateForm retourne true quand tous les champs obligatoires sont remplis', () => {
    // Arrangement
    const formValues = {
      address: '123 Rue Test',
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
      clientName: 'Client Test',
      clientEmail: 'client@test.com',
      clientAddress: '456 Rue Client',
      clientCity: 'Lyon',
      clientPostalCode: '69000',
      clientCountry: 'France',
      invoiceDate: '2025-07-01'
    };
    
    // Action
    const result = validateForm(formValues);
    
    // Assertion
    expect(result).toBe(true);
  });
});

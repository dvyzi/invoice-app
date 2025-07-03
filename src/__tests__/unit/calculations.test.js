/**
 * Tests unitaires pour les calculs de montants
 */

// Fonction utilitaire pour calculer le total d'une facture
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
}

describe('Calculs de montants', () => {
  test('calculateTotal calcule correctement le total des articles', () => {
    // Arrangement
    const items = [
      { name: 'Article 1', quantity: 2, price: 100 },
      { name: 'Article 2', quantity: 1, price: 50 },
      { name: 'Article 3', quantity: 3, price: 75 }
    ];
    
    // Action
    const total = calculateTotal(items);
    
    // Assertion
    expect(total).toBe(475); // 2*100 + 1*50 + 3*75 = 475
  });
  
  test('calculateTotal retourne 0 pour un tableau vide', () => {
    expect(calculateTotal([])).toBe(0);
  });
});

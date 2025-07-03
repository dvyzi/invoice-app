/**
 * Tests unitaires pour les fonctions de formatage des dates
 */

// Fonction utilitaire pour formater les dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(date);
}

describe('Formatage des dates', () => {
  test('formatDate formate correctement les dates au format français', () => {
    expect(formatDate('2025-07-01')).toBe('01/07/2025');
    expect(formatDate('2025-12-31')).toBe('31/12/2025');
    expect(formatDate('2025-01-15')).toBe('15/01/2025');
  });
});

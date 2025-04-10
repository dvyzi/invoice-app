import Buttons from '@/components/buttons';

export default function Home() {

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenue sur votre application de facturation
      </h1>
      <p className="text-gray-600">
        Commencez à créer et gérer vos factures en toute simplicité.
      </p>
      <Buttons type="new-invoice">
        Nouvelle facture
      </Buttons>
      <Buttons type="new-invoice-mobile">
      </Buttons>
      <Buttons type="delete">
        Supprimer
      </Buttons>
      <Buttons type="primary">
        Marquer comme payé
      </Buttons>
      <Buttons type="primary">
        Sauvegarder
      </Buttons>
      <Buttons type="secondary">
        Modifier
      </Buttons>
      <Buttons type="secondary">
        Annuler
      </Buttons>
      <Buttons type="tertiary">
        Enregistrer dans brouillon
      </Buttons>
    </main>
  );
} 
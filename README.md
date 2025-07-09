# Application de Facturation

## Aperçu

### Stack Technique
- **Frontend**: Next.js, React.js, Tailwind CSS
- **Backend**: Prisma (ORM)
- **Base de données**: MySQL

## Prérequis
Avant d'exécuter le projet, assurez-vous d'avoir les éléments suivants installés sur votre système :

- Node.js (v16 ou version ultérieure recommandée)
- npm ou yarn (gestionnaire de paquets)

## Démarrage

### Étape 1 : Cloner le dépôt
```bash
git clone https://github.com/votre-repo/invoice-app
cd invoice-app
```

### Étape 2 : Installer les dépendances
```bash
pnpm install
```

### Étape 3 : Configurer les variables d'environnement
Créez un fichier `.env` dans le répertoire racine du projet et configurez-le selon l'exemple fourni dans `.env.local`.

### Étape 4 : Configurer la base de données
Le projet utilise Prisma comme ORM. Pour configurer votre base de données :

```bash
npx prisma migrate dev
```

### Étape 5 : Lancer l'application localement
Démarrez le serveur de développement :

```bash
pnpm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Configuration de production

### Étape 1 : Construire pour la production
Pour préparer l'application pour la production, exécutez :

```bash
pnpm run build
```

### Étape 2 : Démarrer l'application en mode production
Après avoir construit l'application, démarrez-la en mode production :

```bash
pnpm run start
```

Le serveur de production fonctionnera sur [http://localhost:3000](http://localhost:3000) par défaut.

## Fonctionnalités

- Création et gestion de factures
- Signature électronique avec SignaturePad
- Authentification utilisateur
- Interface utilisateur moderne avec Tailwind CSS


## Tests

Pour exécuter les tests :

```bash
pnpm run test
```
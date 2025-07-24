# BeatZone

**BeatZone** est une application web et mobile dédiée aux événements musicaux.  
Elle permet aux utilisateurs de découvrir les concerts et festivals à proximité, aux organisateurs de créer et gérer leurs événements, et aux artistes d’indiquer leurs dates de représentation.  
Les utilisateurs peuvent également ajouter des artistes ou des événements à leurs favoris pour rester informés de leur actualité.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Frontend Web](#frontend-web)
- [Frontend Mobile](#frontend-mobile)
- [Backend API](#backend-api)
- [Base de données](#base-de-données)
- [Conteneurisation](#conteneurisation)
- [Carte interactive](#carte-interactive)
- [Authentification](#authentification)
- [Mise en place du projet](#mise-en-place-du-projet)

---

## Fonctionnalités

BeatZone offre une expérience personnalisée selon le rôle des utilisateurs :

- **Visiteurs** : exploration des événements géolocalisés, ajout aux favoris, consultation des artistes programmés.
- **Organisateurs** : création, modification et gestion d’événements, contrôle de la visibilité.
- **Artistes** : association à des événements, enrichissement de leur profil, communication avec les organisateurs.

---

## Frontend Web

Le frontend web est développé avec **React**, accompagné des technologies suivantes :

- **TypeScript** : typage statique pour une meilleure robustesse du code.
- **Vite** : bundler rapide pour un démarrage fluide du serveur de développement.
- **Tailwind CSS** : framework utilitaire pour un design rapide et cohérent.
- **TanStack Query** : gestion performante des appels API.
- **React Router** : navigation fluide entre les pages.
- **Stripe** : gestion des paiements en ligne de manière sécurisée.

---

## Frontend Mobile

L’application mobile est développée avec **React Native**, permettant le partage de logique avec le frontend web tout en générant des applications **natives iOS et Android**.

- **Expo** est utilisé pour simplifier le développement, les tests et le déploiement.

---

## Backend API

Le backend est construit avec **Node.js** et **Fastify**, un framework rapide et typé, bien adapté à TypeScript.

Il permet de gérer :
- les routes de l’API
- l’authentification
- les paiements
- les accès aux données
- la logique métier

---

## Base de données

La base de données est gérée avec **PostgreSQL**, via **Supabase**, qui fournit :

- Une interface d’administration conviviale
- Un hébergement managé
- Des fonctionnalités intégrées : authentification, stockage de fichiers, règles de sécurité
- Le support des données géographiques pour la localisation des événements

---

## Conteneurisation

**Docker** est utilisé pour garantir un environnement identique en développement et production :

- Déploiement simplifié
- Maintenance facilitée
- Hébergement cloud optimisé

---

## Carte interactive

L'application intègre **Mapbox** pour l’affichage des événements sur une carte interactive :

- Géolocalisation en temps réel
- Interface hautement personnalisable

---

## Authentification

L’authentification est assurée par **Supabase Auth**, basé sur **JWT**, avec support :

- Email / mot de passe
- Magic links
- Fournisseurs OAuth
- Gestion des rôles et permissions directement intégrée

---

## Mise en place du projet

### 1. Installation des dépendances

```bash
npm install
```

À faire dans les dossiers : frontend | backend | mobile

### 2. Configuration des variables d’environnement

Backend (backend/.env.development)

```bash
   PORT="votre_port"
   SUPABASE_URL="https://votre_instance.supabase.co"
   SUPABASE_KEY="votre_clé_supabase"
```

Frontend Web (frontend/.env.development)

```bash
   VITE_URL_API="https://votre_site/api"
   VITE_MAPBOX_TOKEN="votre_token_mapbox"
   VITE_SUPABASE_URL="https://votre_instance.supabase.co"
   VITE_SUPABASE_KEY="votre_clé_supabase"
```

Frontend Mobile (mobile/.env.development)

```bash
   EXPO_PUBLIC_URL_API="https://votre_site/api"
   EXPO_SUPABASE_URL="https://votre_instance.supabase.co"
   EXPO_SUPABASE_KEY="votre_clé_supabase"
```

### 3. Lancement du projet avec Docker

Depuis le dossier BeatZone, exécutez :

```bash
docker compose up --build -d
```

Pour arrêter les services :

```bash
docker compose down
```
### 4. Lancement de l’application mobile
1) Installer l’application Expo Go sur votre téléphone.
2) Dans le dossier mobile, exécutez :
   
   ```bash
    npm install
    npx expo start
   ```
   
4) Scanner le QR Code affiché avec l’application Expo Go pour accéder à l’application sur mobil



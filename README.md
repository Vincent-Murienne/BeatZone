# BeatZone

BeatZone est une application web et mobile dédiée aux événements musicaux. Elle permet aux utilisateurs de découvrir les concerts et festivals autour d’eux, aux organisateurs de créer et gérer des événements, et aux artistes d’indiquer où ils jouent. Les utilisateurs peuvent également ajouter des artistes ou des événements à leurs favoris pour ne rien manquer de leur actualité.

## Fonctionnalités principales

L’application propose une expérience différenciée selon le rôle des utilisateurs. Les visiteurs peuvent explorer les événements géolocalisés, les ajouter à leurs favoris, et consulter les artistes programmés. Les organisateurs ont la possibilité de créer et modifier leurs événements, d’en gérer les détails et d’assurer leur visibilité. Les artistes peuvent indiquer leur participation à un événement, enrichir leur profil et interagir avec les organisateurs.

## Frontend Web

Le frontend web est développé avec React, la bibliothèque la plus utilisée pour construire des interfaces dynamiques. Grâce à sa structure en composants réutilisables et à son écosystème mature, elle permet un développement rapide et maintenable. Le bundler Vite est utilisé pour optimiser le temps de démarrage du serveur de développement.

Le typage est assuré par TypeScript, qui offre une meilleure lisibilité du code et limite les erreurs. Le design est géré avec Tailwind CSS, une solution utilitaire permettant un styling rapide et cohérent. Pour la gestion des appels API, TanStack Query est utilisé. La navigation entre les pages repose sur React Router. Le paiement en ligne est pris en charge via Stripe, assurant un traitement sécurisé.

## Frontend Mobile

Le frontend mobile est construit avec React Native, qui permet de partager la logique et une partie des composants avec le frontend web tout en produisant des applications natives pour iOS et Android. Expo facilite le développement mobile et le déploiement sans configuration complexe.

## Backend API

Le backend repose sur Node.js avec Fastify, un framework plus rapide et typé qu’Express, particulièrement bien adapté à TypeScript. Il permet de gérer les routes de l’API, l’authentification, les paiements, la communication avec la base de données et la logique métier.

## Base de données

Le backend utilise PostgreSQL comme système de gestion de base de données, via Supabase. Supabase offre une interface d’administration intuitive, un hébergement managé, et intègre nativement des fonctionnalités comme l’authentification, le stockage de fichiers et les règles de sécurité. PostgreSQL permet de gérer des relations complexes et des types de données variés comme les coordonnées géographiques.

## Conteneurisation

Docker est utilisé pour garantir un environnement de développement et de production identique sur toutes les machines. Il simplifie l'hébergement, la maintenance et le déploiement, notamment en environnement cloud.

## CI/CD

GitHub Actions est utilisé pour automatiser les workflows de test, build et déploiement. Cela garantit un cycle de livraison rapide et fiable, sans outil externe.

## Carte interactive

BeatZone utilise Mapbox pour l’affichage des cartes et la géolocalisation des événements. Cette solution permet une personnalisation poussée de l’interface et prend en charge l’affichage en temps réel des positions.

## Hébergement

Le déploiement est effectué sur Render, qui prend en charge les conteneurs Docker, propose une base PostgreSQL managée, une intégration GitHub native, un certificat SSL automatique et un monitoring intégré.

## Authentification

L’authentification est gérée par Supabase Auth, qui propose une solution complète basée sur JWT, avec prise en charge de l’email, des magic links et des fournisseurs OAuth. L’intégration est native avec la base de données et permet de gérer les rôles et permissions.


## Mise en place du projet

Faire un npm i dans le dossier frontend et le dossier backend.

ajouter un fichier .env.development dans le dossier backend de la forme : 
PORT="mettre votre port"
SUPABASE_URL="lien vers votre base supabase"
SUPABASE_KEY="votre cle pour ce connecter a supabase"

ajouter un fichier .env.development dans le dossier frontend de la forme : 
VITE_URL_API="adresse_de_votre_site/api"
VITE_MAPBOX_TOKEN="token pour utiliser mapbox"
VITE_SUPABASE_URL="lien vers votre base supabase"
VITE_SUPABASE_KEY="votre cle pour ce connecter a supabase"

ajouter un fichier .env.development dans le dossier mobile de la forme : 
EXPO_PUBLIC_URL_API="adresse_de_votre_site/api"  (dois avoir la meme adresse que votre back)
EXPO_SUPABASE_URL="lien vers votre base supabase"
EXPO_SUPABASE_KEY="votre cle pour ce connecter a supabase"

Ce mettre dans le dossier BeatZone et faire la commande :docker compose-up --build -d
Cela va lancer le projet. Pour le fermer faire la commande :docker-compose down 

Pour la partie mobile vous devez installer l'application expo GO sur votre téléphone.
Faire la commande npm i dans le dossier mobile.
Ensuite faire la commande npx expo start. Un QR va s'afficher, le scanner avec votre téléphone. Cela va ouvrir une page web qui ensuite vous redirigera vers l'aplication expo.




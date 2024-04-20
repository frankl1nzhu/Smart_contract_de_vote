# Projet de Contrat Intelligent de Vote

Ce projet consiste en un contrat intelligent (smart contract) de vote écrit en Solidity, ainsi qu'une interface utilisateur frontend pour interagir avec ce contrat sur la blockchain.

## Contrat Intelligent de Vote

Le contrat intelligent de vote implémente la logique du système de vote. Voici quelques points clés sur le contrat :

- Utilise la bibliothèque OpenZeppelin pour l'accès propriétaire.
- Définit plusieurs étapes dans l'énumération `WorkflowStatus`, telles que l'inscription des électeurs, l'enregistrement des propositions, la session de vote, etc.
- Stocke les électeurs et les propositions dans des structures de données appropriées.
- Fournit des fonctions pour l'inscription des électeurs, l'enregistrement des propositions, le vote, le comptage des votes, etc.
- Utilise des modificateurs pour restreindre l'accès à certaines fonctions en fonction du statut du workflow et de l'état de l'utilisateur.

## Interface Utilisateur Frontend

L'interface utilisateur frontend est construite en React.js et permet aux utilisateurs d'interagir avec le contrat intelligent. Voici quelques points à noter sur l'interface :

- Utilise le package `@rainbow-me/rainbowkit` pour afficher un bouton de connexion.
- Utilise les packages `wagmi` et `@wagmi/core` pour interagir avec le contrat intelligent.
- Permet à l'utilisateur de se connecter à son portefeuille (wallet) et d'interagir avec le contrat intelligent en exécutant des fonctions telles que l'inscription des électeurs, l'enregistrement des propositions, le vote, etc.
- Affiche les résultats ou les messages de retour à l'utilisateur.

## Comment Utiliser

1. Cloner le dépôt.
2. Installer les dépendances en exécutant `npm install`.
3. Lancer l'application frontend en exécutant `npm start`.
4. Connecter votre portefeuille (wallet) à l'application.
5. Interagir avec le contrat intelligent en utilisant les différentes fonctionnalités fournies dans l'interface utilisateur.

## Auteur

Yuzhe ZHU

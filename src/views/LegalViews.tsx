import React from 'react';
import { BusinessSettings } from '../types';

interface LegalViewProps {
  settings: BusinessSettings;
  type: 'terms' | 'privacy';
}

export const LegalView: React.FC<LegalViewProps> = ({ settings, type }) => {
  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-700 dark:text-zinc-300 min-h-screen text-xs leading-relaxed transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {type === 'terms' ? (
          <div className="space-y-6 bg-white dark:bg-[#12141a] p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white">
              Conditions Générales de Location — DZ RENT CAR
            </h1>
            <p className="text-gray-500 dark:text-zinc-400">
              Dernière mise à jour : 2026 · Agence basée à {settings.address}.
            </p>

            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">1. Conditions d'Éligibilité</h2>
              <p>
                Le conducteur principal doit être âgé d'au moins 21 ans (selon la catégorie du véhicule) et titulaire d'un permis de conduire en cours de validité depuis au moins deux (2) ans.
              </p>

              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">2. Documents Exigés</h2>
              <p>
                Pour toute remise de véhicule, le locataire doit présenter un permis de conduire original, une pièce d'identité officielle (passeport ou carte nationale biométrique), ainsi qu'un justificatif de domicile si demandé.
              </p>

              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">3. Caution et Modalités de Paiement</h2>
              <p>
                Une caution est requise avant la remise des clés. Son montant varie selon la catégorie du véhicule loué (citadine, berline ou SUV). La caution est restituée intégralement après vérification de l'état du véhicule lors du retour.
              </p>

              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">4. Livraison et Restitution à l'Aéroport</h2>
              <p>
                La livraison et la restitution à l'Aéroport International d'Alger Houari Boumediene sont organisées en coordination avec le client. En cas de retard de vol notifié, notre équipe assure le maintien de la réservation.
              </p>

              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">5. Assurance et Assistance</h2>
              <p>
                Tous nos véhicules bénéficient d'une couverture d'assurance tous risques et d'une assistance routière 24h/24 et 7j/7 sur l'ensemble du territoire national algérien.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 bg-white dark:bg-[#12141a] p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white">
              Politique de Confidentialité — DZ RENT CAR
            </h1>
            <p className="text-gray-500 dark:text-zinc-400">
              Dernière mise à jour : 2026.
            </p>

            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">1. Collecte des Données</h2>
              <p>
                Les informations recueillies via notre formulaire de réservation (nom, numéro de téléphone, adresse email, informations de vol) sont uniquement destinées au traitement de votre demande de location et à la prise de contact direct par nos agents.
              </p>

              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">2. Sécurité & Confidentialité</h2>
              <p>
                DZ RENT CAR ne commercialise, ne loue, ni ne transmet vos données personnelles à des tiers à des fins publicitaires. Vos coordonnées sont exclusivement utilisées pour la gestion de votre contrat de location automobile.
              </p>

              <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase">3. Contact</h2>
              <p>
                Pour toute question relative à vos données personnelles, vous pouvez joindre l'administration par email à : {settings.email} ou par téléphone au {settings.primary_phone}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

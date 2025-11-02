"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Composant de débogage pour tester le Web Speech API
 * À utiliser temporairement pour diagnostiquer les problèmes TTS
 */
export const TTSDebug = () => {
  const [testStatus, setTestStatus] = useState<string>("Prêt à tester...");
  const [voices, setVoices] = useState<any[]>([]);

  const testWebSpeechAPI = async () => {
    setTestStatus("🔍 Vérification du Web Speech API...");

    // Test 1: Vérifier si l'API existe
    if (!("speechSynthesis" in window)) {
      setTestStatus("❌ Web Speech API NOT supported dans ce navigateur");
      return;
    }

    setTestStatus("✅ Web Speech API IS supported - Chargement des voix...");

    // Test 2: Attendre que les voix se chargent (important!)
    let availableVoices = window.speechSynthesis.getVoices();

    // Si vides, attendre l'événement voiceschanged
    if (availableVoices.length === 0) {
      await new Promise((resolve) => {
        const handler = () => {
          availableVoices = window.speechSynthesis.getVoices();
          window.speechSynthesis.removeEventListener("voiceschanged", handler);
          resolve(null);
        };
        window.speechSynthesis.addEventListener("voiceschanged", handler);
        // Timeout après 3 secondes
        setTimeout(() => {
          window.speechSynthesis.removeEventListener("voiceschanged", handler);
          resolve(null);
        }, 3000);
      });
    }

    setVoices(availableVoices);
    console.log("Voix disponibles:", availableVoices);

    // Chercher voix française en priorité, sinon anglaise, sinon première disponible
    const frenchVoices = availableVoices.filter(
      (v) => v.lang.startsWith("fr") || v.name.toLowerCase().includes("french")
    );

    const englishVoices = availableVoices.filter(
      (v) => v.lang.startsWith("en") || v.name.toLowerCase().includes("english")
    );

    let selectedVoice = frenchVoices[0] || englishVoices[0] || availableVoices[0];

    if (!selectedVoice) {
      setTestStatus(
        `❌ Aucune voix trouvée! Voix disponibles: ${availableVoices
          .map((v) => `${v.name} (${v.lang})`)
          .join(", ") || "AUCUNE"}`
      );
      return;
    }

    const voiceType = frenchVoices[0] ? "🇫🇷 Française" : englishVoices[0] ? "🇬🇧 Anglaise" : "❓ Autre";
    setTestStatus(
      `✅ Voix sélectionnée: ${voiceType} - ${selectedVoice.name} (${selectedVoice.lang})`
    );

    // Test 3: Tester la lecture
    setTestStatus("🔊 Tentative de lecture...");

    const utterance = new SpeechSynthesisUtterance("Hello, this is a test");
    utterance.voice = selectedVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setTestStatus("🔊 ▶️ Lecture EN COURS...");
      console.log("Lecture commencée");
    };

    utterance.onend = () => {
      setTestStatus("✅ Lecture terminée avec succès!");
      console.log("Lecture terminée");
    };

    utterance.onerror = (event) => {
      setTestStatus(
        `❌ ERREUR: ${event.error} - ${JSON.stringify(event)}`
      );
      console.error("Erreur TTS:", event.error, event);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setTestStatus(`❌ Exception: ${error}`);
      console.error("Exception:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-orange-500 rounded-lg p-4 shadow-lg max-w-xs z-50">
      <h3 className="font-bold text-orange-600 mb-2">🐛 TTS Debug</h3>
      <div className="bg-gray-100 p-2 rounded mb-2 text-sm max-h-48 overflow-y-auto">
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {testStatus}
        </p>
        {voices.length > 0 && (
          <div className="mt-2 text-xs">
            <p className="font-bold">Voix disponibles ({voices.length}):</p>
            {voices.map((v, i) => (
              <p key={i} className="text-gray-600">
                {v.name} ({v.lang}) {v.default ? "📍 défaut" : ""}
              </p>
            ))}
          </div>
        )}
      </div>
      <Button
        onClick={testWebSpeechAPI}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
      >
        Tester Web Speech API
      </Button>
    </div>
  );
};

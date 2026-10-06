'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Volume2 } from 'lucide-react';
import { api } from '@/services/api';
import { useCustomizerStore } from '@/store/customizerStore';

interface Props {
  onFeedback?: (msg: string) => void;
}

export const VoiceButton: React.FC<Props> = ({ onFeedback }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);

  const { applyAIChanges } = useCustomizerStore();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Works for Indian English & Hindi

      recognition.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        await handleProcessVoiceCommand(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setProcessing(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleProcessVoiceCommand = async (text: string) => {
    try {
      setProcessing(true);
      if (onFeedback) onFeedback(`Heard: "${text}"`);

      const res = await api.sendAICommand(text);

      if (res.action === 'UPDATE_CUSTOMIZATION' && res.changes) {
        applyAIChanges(res.changes);
        if (onFeedback) onFeedback(res.reply);
      } else if (onFeedback) {
        onFeedback(res.reply);
      }

      // Speak aloud reply if browser supports SpeechSynthesis
      if ('speechSynthesis' in window && res.spokenReply) {
        const utterance = new SpeechSynthesisUtterance(res.spokenReply);
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch (e: any) {
      if (onFeedback) onFeedback('Could not process command. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        className={`relative p-3 rounded-full flex items-center justify-center transition-all shadow-md ${
          isListening
            ? 'bg-vermillion text-porcelain animate-pulse ring-4 ring-vermillion/30'
            : processing
            ? 'bg-gold text-obsidian animate-spin'
            : 'bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian'
        }`}
        title={isListening ? 'Listening to voice command...' : 'Voice Customizer (Astra JARVIS)'}
      >
        {isListening ? <Mic size={18} /> : <Mic size={18} />}
      </button>

      {isListening && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-vermillion">
          LISTENING...
        </span>
      )}
    </div>
  );
};

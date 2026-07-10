'use client';

import { useEffect, useRef, useState } from 'react';
import {
  drawWinner,
  fetchParticipants,
  DrawResult,
  Participant,
} from '@/lib/api';

export default function SorteioPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rollingName, setRollingName] = useState('');
  const [winner, setWinner] = useState<DrawResult | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadParticipants();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function loadParticipants() {
    try {
      const data = await fetchParticipants();
      setParticipants(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar participantes');
    }
  }

  async function handleDraw() {
    if (participants.length === 0) {
      setError('Não há participantes cadastrados ainda.');
      return;
    }

    setError('');
    setWinner(null);
    setDrawing(true);

    // Efeito visual de nomes "rolando" antes do resultado final
    let ticks = 0;
    const maxTicks = 20;
    intervalRef.current = setInterval(() => {
      const random =
        participants[Math.floor(Math.random() * participants.length)];
      setRollingName(random.fullName);
      ticks += 1;
      if (ticks >= maxTicks) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 90);

    try {
      const result = await drawWinner(false);
      // Garante que a animação termine antes de mostrar o resultado
      setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setWinner(result);
        setDrawing(false);
        loadParticipants();
      }, maxTicks * 90 + 150);
    } catch (err: any) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDrawing(false);
      setError(err.message || 'Erro ao realizar sorteio');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-cna-blue">Sorteio CNA</h1>
          <p className="text-sm text-gray-500 mt-1">
            {participants.length} participante(s) disponível(is)
          </p>
        </div>

        <div className="h-24 flex items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-300 text-xl font-semibold">
          {drawing
            ? rollingName || '...'
            : winner
              ? `🎉 ${winner.registration.fullName}`
              : 'Clique em sortear'}
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleDraw}
          disabled={drawing}
          className="w-full bg-cna-red text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {drawing ? 'Sorteando...' : 'Realizar sorteio'}
        </button>

        <a
          href="/"
          className="block text-sm text-cna-blue underline underline-offset-2"
        >
          ← Voltar para o cadastro
        </a>
      </div>
    </main>
  );
}

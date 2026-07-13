export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const EXPORT_REGISTRATIONS_EXCEL_URL = `${API_URL}/registrations/export-excel`;

export type LanguagePreference = "EN" | "ES";

export interface RegistrationPayload {
  fullName: string;
  whatsapp: string;
  email?: string;
  language: LanguagePreference;
}

export interface Participant {
  id: string;
  fullName: string;
}

export interface DrawResult {
  id: string;
  registrationId: string;
  drawnAt: string;
  registration: Participant & { whatsapp: string };
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    let message = "Ocorreu um erro. Tente novamente.";
    try {
      const data = await res.json();
      message = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || message;
    } catch {
      // mantém mensagem padrão
    }
    throw new Error(message);
  }
  return res.json();
}

export async function createRegistration(payload: RegistrationPayload) {
  const res = await fetch(`${API_URL}/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchParticipants(): Promise<Participant[]> {
  const res = await fetch(`${API_URL}/raffle/participants`, {
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function drawWinner(allowRepeat = false): Promise<DrawResult> {
  const res = await fetch(`${API_URL}/raffle/draw?allowRepeat=${allowRepeat}`, {
    method: "POST",
  });
  return handleResponse(res);
}

export async function fetchHistory(): Promise<DrawResult[]> {
  const res = await fetch(`${API_URL}/raffle/history`, { cache: "no-store" });
  return handleResponse(res);
}

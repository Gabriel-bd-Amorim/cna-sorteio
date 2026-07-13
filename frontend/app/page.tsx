import { EXPORT_REGISTRATIONS_EXCEL_URL } from "@/lib/api";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-600">
          Exportação de registros
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Baixe a planilha com todos os cadastros da tabela de registros.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Este botão chama a rota do backend que gera um arquivo Excel com todos
          os registros salvos no banco de dados.
        </p>

        <a
          href={EXPORT_REGISTRATIONS_EXCEL_URL}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2">
          Baixar Excel
        </a>
      </section>
    </main>
  );
}

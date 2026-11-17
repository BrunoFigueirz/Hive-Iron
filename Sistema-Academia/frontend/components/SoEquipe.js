"use client";
import Link from "next/link";
import { useSessao, ehEquipe } from "@/components/Sessao";

export default function SoEquipe({ children }) {
  const { usuario } = useSessao();
  if (ehEquipe(usuario)) return children;
  return (
    <section className="cartao estreito">
      <h1>Sem acesso</h1>
      <p className="suave">Seu perfil não pode abrir esta página.</p>
      <Link className="pilula neon" href="/">Voltar ao painel</Link>
    </section>
  );
}

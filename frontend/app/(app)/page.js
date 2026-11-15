"use client";
// Painel por perfil: só mostra o que as histórias entregam (US01 e US03).
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSessao, ehEquipe } from "@/components/Sessao";
import { listarAlunos } from "@/lib/api";

export default function Painel() {
  const { usuario } = useSessao();
  const [alunos, setAlunos] = useState(null);

  useEffect(() => {
    if (ehEquipe(usuario)) listarAlunos().then(setAlunos).catch(() => setAlunos(null));
  }, [usuario]);

  const primeiroNome = usuario.nome.split(" ")[0];

  if (!ehEquipe(usuario)) {
    return (
      <>
        <span className="tag">Área do aluno</span>
        <h1>Olá, {primeiroNome}</h1>
        <section className="cartao estreito">
          <h2>Você entrou como aluno</h2>
          <p className="suave">Seu plano, pagamentos e frequência vão aparecer aqui quando forem liberados.</p>
        </section>
      </>
    );
  }

  const total = alunos?.length;
  const estudantes = alunos?.filter((a) => a.estudante).length;

  return (
    <>
      <span className="tag">Painel da equipe</span>
      <h1>Olá, {primeiroNome}</h1>
      <p className="subtitulo">Alunos e cadastro</p>

      <div className="kpis">
        <div className="cartao kpi"><span className="kpi-rotulo">Alunos cadastrados</span><span className="kpi-valor">{total ?? "–"}</span></div>
        <div className="cartao kpi"><span className="kpi-rotulo">Estudantes</span><span className="kpi-valor">{estudantes ?? "–"}</span></div>
      </div>

      <Link className="pilula neon grande" href="/alunos/novo">Cadastrar aluno</Link>
    </>
  );
}

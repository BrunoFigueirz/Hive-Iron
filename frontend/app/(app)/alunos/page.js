"use client";
// UC04 Cadastrar e editar aluno (US03): consulta.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SoEquipe from "@/components/SoEquipe";
import { listarAlunos } from "@/lib/api";
import { mascaraCpf } from "@/lib/cpf";

const AVISOS = { cadastrado: "Aluno cadastrado.", editado: "Alterações salvas." };

export default function Alunos({ searchParams }) {
  const [alunos, setAlunos] = useState(null);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarAlunos().then(setAlunos).catch((e) => setErro(e.message));
  }, []);

  const filtrados = useMemo(() => {
    if (!alunos) return [];
    const t = busca.trim().toLowerCase();
    if (!t) return alunos;
    const digitos = t.replace(/\D/g, "");
    return alunos.filter((a) =>
      a.nome.toLowerCase().includes(t) || a.email.includes(t) || (digitos && a.cpf.includes(digitos)));
  }, [alunos, busca]);

  const aviso = AVISOS[searchParams?.ok];

  return (
    <SoEquipe>
      {aviso && <div className="aviso" role="status">{aviso}</div>}
      {erro && <div className="aviso erro" role="alert">{erro}</div>}

      <div className="cabecalho">
        <div>
          <span className="tag">Alunos</span>
          <h1>Consulta de alunos</h1>
        </div>
        <Link className="pilula neon" href="/alunos/novo">Cadastrar aluno</Link>
      </div>

      {alunos && alunos.length > 0 && (
        <section className="cartao">
          <div className="campo busca">
            <label htmlFor="busca">Buscar por nome, CPF ou e-mail</label>
            <input id="busca" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          {filtrados.length > 0 ? (
            <div className="tabela-rolavel">
              <table>
                <thead><tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Telefone</th><th>Tipo</th><th><span className="so-leitor">Ações</span></th></tr></thead>
                <tbody>
                  {filtrados.map((a) => (
                    <tr key={a.id}>
                      <td>{a.nome}</td>
                      <td>{mascaraCpf(a.cpf)}</td>
                      <td>{a.email}</td>
                      <td>{a.telefone || "—"}</td>
                      <td>{a.estudante ? <span className="selo">Estudante</span> : "Comum"}</td>
                      <td><Link className="link-editar" href={`/alunos/${a.id}/editar`}>Editar</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="suave">Nenhum aluno encontrado para “{busca}”.</p>
          )}
        </section>
      )}

      {alunos && alunos.length === 0 && (
        <section className="cartao vazio">
          <h2>Nenhum aluno cadastrado</h2>
          <p className="suave">Cadastre o primeiro aluno para poder criar a matrícula dele.</p>
          <Link className="pilula neon" href="/alunos/novo">Cadastrar aluno</Link>
        </section>
      )}
    </SoEquipe>
  );
}

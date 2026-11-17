"use client";
// UC04 Cadastrar e editar aluno US03
//comprova por matricula ou carteirinha da instituicao de ensino ou do governo RN02.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { salvarAluno } from "@/lib/api";
import { apenasDigitos, cpfValido, mascaraCpf } from "@/lib/cpf";

const VAZIO = { nome: "", cpf: "", email: "", telefone: "", estudante: false, comprovacao: "", numero_comprovante: "" };

function Campo({ id, rotulo, opcional, dica, erro, children }) {
  return (
    <div className={`campo ${erro ? "invalido" : ""}`}>
      <label htmlFor={id}>{rotulo} {opcional && <small>(opcional)</small>}</label>
      {children}
      {dica && !erro && <small className="dica">{dica}</small>}
      {erro && <span className="erro-campo">{erro}</span>}
    </div>
  );
}

export default function FormAluno({ inicial, id }) {
  const router = useRouter();
  const [d, setD] = useState({ ...VAZIO, ...inicial, cpf: mascaraCpf(inicial?.cpf) });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (e) =>
    setD({ ...d, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setErroGeral("");
    if (!cpfValido(d.cpf)) { setErros({ cpf: "Informe um CPF válido." }); return; }
    setErros({}); setEnviando(true);
    try {
      await salvarAluno({ ...d, cpf: apenasDigitos(d.cpf) }, id);
      router.push(`/alunos?ok=${id ? "editado" : "cadastrado"}`);
    } catch (err) {
      if (err.erros) setErros(err.erros); else setErroGeral(err.message);
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario" onSubmit={enviar} noValidate>
      {erroGeral && <div className="aviso erro" role="alert">{erroGeral}</div>}

      <Campo id="nome" rotulo="Nome completo" erro={erros.nome}>
        <input id="nome" type="text" required value={d.nome} onChange={mudar("nome")} />
      </Campo>

      <div className="linha">
        <Campo id="cpf" rotulo="CPF" erro={erros.cpf}>
          <input id="cpf" type="text" inputMode="numeric" placeholder="000.000.000-00" required
            value={d.cpf} onChange={(e) => setD({ ...d, cpf: mascaraCpf(e.target.value) })} />
        </Campo>
        <Campo id="telefone" rotulo="Telefone" opcional>
          <input id="telefone" type="tel" value={d.telefone} onChange={mudar("telefone")} />
        </Campo>
      </div>

      <Campo id="email" rotulo="E-mail" erro={erros.email}>
        <input id="email" type="email" required value={d.email} onChange={mudar("email")} />
      </Campo>

      <div className="check">
        <input id="estudante" type="checkbox" checked={d.estudante} onChange={mudar("estudante")} />
        <label htmlFor="estudante">Aluno estudante (R$ 5 de desconto na mensalidade)</label>
      </div>

      {d.estudante && (
        <div className="bloco">
          <Campo id="comprovacao" rotulo="Como comprova" erro={erros.comprovacao}
            dica="Matrícula ou carteirinha da instituição de ensino ou do governo.">
            <select id="comprovacao" value={d.comprovacao} onChange={mudar("comprovacao")}>
              <option value="">Selecione</option>
              <option value="matricula">Matrícula</option>
              <option value="carteirinha">Carteirinha</option>
            </select>
          </Campo>
          <Campo id="numero_comprovante" rotulo="Número do documento" erro={erros.numero_comprovante}>
            <input id="numero_comprovante" type="text" value={d.numero_comprovante} onChange={mudar("numero_comprovante")} />
          </Campo>
        </div>
      )}

      <div className="acoes">
        <button className="pilula neon" type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : id ? "Salvar alterações" : "Cadastrar aluno"}
        </button>
        <Link className="pilula contorno" href="/alunos">Cancelar</Link>
      </div>
    </form>
  );
}

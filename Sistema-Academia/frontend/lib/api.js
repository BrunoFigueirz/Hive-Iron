/**
 * Camada de API do front: é AQUI que o front conversa com o Flask do Kaio.
 * Contrato completo em docs/contrato-api.md.
 *
 * Modo mock (padrão): NEXT_PUBLIC_API_URL vazio -> dados falsos no localStorage.
 * Modo real: NEXT_PUBLIC_API_URL=http://localhost:5000 -> fetch no Flask (cookie de sessão).
 * As telas não mudam; só este arquivo escolhe o modo.
 */
import { apenasDigitos, cpfValido } from "@/lib/cpf";

const BASE = process.env.NEXT_PUBLIC_API_URL;

// ---------- modo real ----------
async function http(caminho, opcoes = {}) {
  const r = await fetch(`${BASE}${caminho}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (r.status === 204) return null;
  const corpo = await r.json().catch(() => null);
  if (!r.ok) {
    const e = new Error(corpo?.erro || "Não foi possível concluir a ação.");
    e.status = r.status;
    e.erros = corpo?.erros;
    throw e;
  }
  return corpo;
}

const real = {
  entrar: (email, senha) => http("/api/login", { method: "POST", body: JSON.stringify({ email, senha }) }),
  sair: () => http("/api/logout", { method: "POST" }),
  usuarioAtual: () => http("/api/me"),
  listarAlunos: () => http("/api/alunos"),
  obterAluno: (id) => http(`/api/alunos/${id}`),
  salvarAluno: (dados, id) =>
    http(id ? `/api/alunos/${id}` : "/api/alunos", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(dados),
    }),
};

// ---------- modo mock ----------
const USUARIOS = {
  "admin@hiveiron.com": { senha: "admin123", id: 1, nome: "Ana Admin", perfil: "administrador" },
  "func@hiveiron.com": { senha: "func123", id: 2, nome: "Fábio Funcionário", perfil: "funcionario" },
  "aluno@hiveiron.com": { senha: "aluno123", id: 3, nome: "Carlos Mendes", perfil: "aluno" },
};
const SEED = [
  { id: 1, nome: "Carlos Mendes", cpf: "52998224725", email: "aluno@hiveiron.com", telefone: "(89) 99999-0001", estudante: true, comprovacao: "carteirinha", numero_comprovante: "20231234" },
  { id: 2, nome: "Marina Souza", cpf: "11144477735", email: "marina@email.com", telefone: "", estudante: false, comprovacao: "", numero_comprovante: "" },
];

const ler = (k, padrao) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; }
};
const gravar = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const falha = (status, erro, erros) => Object.assign(new Error(erro), { status, erros });

function validar(d, outros) {
  const erros = {};
  if (!d.nome) erros.nome = "Informe o nome do aluno.";
  if (!cpfValido(d.cpf)) erros.cpf = "Informe um CPF válido.";
  else if (outros.some((a) => a.cpf === d.cpf)) erros.cpf = "Já existe um aluno com este CPF.";
  if (!/^\S+@\S+\.\S+$/.test(d.email)) erros.email = "Informe um e-mail válido, como nome@email.com.";
  else if (outros.some((a) => a.email === d.email)) erros.email = "Já existe um aluno com este e-mail.";
  if (d.estudante) {
    if (!["matricula", "carteirinha"].includes(d.comprovacao)) erros.comprovacao = "Escolha matrícula ou carteirinha.";
    if (!d.numero_comprovante) erros.numero_comprovante = "Informe o número do documento.";
  }
  return erros;
}

const mock = {
  async entrar(email, senha) {
    const u = USUARIOS[email.trim().toLowerCase()];
    if (!u || u.senha !== senha) throw falha(401, "E-mail ou senha incorretos."); // sem dizer qual campo errou (US01)
    const { senha: _omitida, ...publico } = u;
    gravar("hive:usuario", publico);
    return publico;
  },
  async sair() { localStorage.removeItem("hive:usuario"); return null; },
  async usuarioAtual() {
    const u = ler("hive:usuario", null);
    if (!u) throw falha(401, "Sem sessão.");
    return u;
  },
  async listarAlunos() { return ler("hive:alunos", SEED); },
  async obterAluno(id) {
    const a = ler("hive:alunos", SEED).find((x) => x.id === Number(id));
    if (!a) throw falha(404, "Aluno não encontrado.");
    return a;
  },
  async salvarAluno(dados, id) {
    const todos = ler("hive:alunos", SEED);
    const outros = todos.filter((a) => a.id !== Number(id));
    const limpo = {
      nome: dados.nome.trim(),
      cpf: apenasDigitos(dados.cpf),
      email: dados.email.trim().toLowerCase(),
      telefone: dados.telefone.trim(),
      estudante: !!dados.estudante,
      comprovacao: dados.estudante ? dados.comprovacao : "",
      numero_comprovante: dados.estudante ? dados.numero_comprovante.trim() : "",
    };
    const erros = validar(limpo, outros);
    if (Object.keys(erros).length) throw falha(422, "Dados inválidos.", erros);
    if (id) {
      const novo = { ...limpo, id: Number(id) };
      gravar("hive:alunos", todos.map((a) => (a.id === Number(id) ? novo : a)));
      return novo;
    }
    const novo = { ...limpo, id: Math.max(0, ...todos.map((a) => a.id)) + 1 };
    gravar("hive:alunos", [...todos, novo]);
    return novo;
  },
};

const api = BASE ? real : mock;
export const { entrar, sair, usuarioAtual, listarAlunos, obterAluno, salvarAluno } = api;

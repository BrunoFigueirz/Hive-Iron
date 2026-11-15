"use client";
// UC01 Entrar (US01). Mensagem de erro única, sem dizer qual campo errou.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { entrar } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(""); setEnviando(true);
    try {
      await entrar(email, senha);
      router.replace("/");
    } catch (err) {
      setErro(err.message);
      setEnviando(false);
    }
  }

  return (
    <div className="login">
      <section className="login-marca" aria-label="Hive Iron">
        <p className="login-nome">Hive Iron</p>
        <p className="login-lema">Bom não, mel</p>
      </section>

      <section className="login-lado">
        <form className="cartao login-cartao" onSubmit={enviar} noValidate>
          <span className="tag">Gestão em tempo real para a sua academia</span>
          <h1>Entre</h1>
          {erro && <div className="aviso erro" role="alert">{erro}</div>}
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <button className="pilula neon grande" type="submit" disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</button>
        </form>
      </section>
    </div>
  );
}
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usuarioAtual, sair as apiSair } from "@/lib/api";

const Ctx = createContext(null);
export const useSessao = () => useContext(Ctx);

export function SessaoProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    usuarioAtual().then(setUsuario).catch(() => setUsuario(null)).finally(() => setCarregando(false));
  }, []);

  const sair = async () => { await apiSair(); setUsuario(null); };
  return <Ctx.Provider value={{ usuario, carregando, sair }}>{children}</Ctx.Provider>;
}

export const ROTULOS = { administrador: "Administrador", funcionario: "Funcionário", aluno: "Aluno" };
// Administrador é especialização de Funcionário ou seja vai herdar tudo
export const ehEquipe = (u) => !!u && (u.perfil === "funcionario" || u.perfil === "administrador");

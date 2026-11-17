"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessaoProvider, useSessao } from "@/components/Sessao";
import Topo from "@/components/Topo";

function Casca({ children }) {
  const { usuario, carregando } = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) router.replace("/login");
  }, [carregando, usuario, router]);

  if (carregando || !usuario) return null;
  return (
    <>
      <Topo />
      <main className="conteudo">{children}</main>
    </>
  );
}

export default function AppLayout({ children }) {
  return <SessaoProvider><Casca>{children}</Casca></SessaoProvider>;
}

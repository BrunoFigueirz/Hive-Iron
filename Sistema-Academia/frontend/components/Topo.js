"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useSessao, ROTULOS, ehEquipe } from "@/components/Sessao";

export default function Topo() {
  const { usuario, sair } = useSessao();
  const router = useRouter();
  const caminho = usePathname();

  return (
    <header className="topo">
      <Link className="marca" href="/"><Logo /><span>Hive Iron</span></Link>
      <nav className="topo-nav" aria-label="Principal">
        <Link href="/" aria-current={caminho === "/" ? "page" : undefined}>Painel</Link>
        {ehEquipe(usuario) && (
          <Link href="/alunos" aria-current={caminho.startsWith("/alunos") ? "page" : undefined}>Alunos</Link>
        )}
      </nav>
      <div className="topo-usuario">
        <span><strong>{usuario.nome}</strong><small>{ROTULOS[usuario.perfil]}</small></span>
        <button className="pilula contorno" type="button"
          onClick={async () => { await sair(); router.replace("/login"); }}>Sair</button>
      </div>
    </header>
  );
}

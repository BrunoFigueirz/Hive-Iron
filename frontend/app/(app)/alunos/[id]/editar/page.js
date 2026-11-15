"use client";
import { useEffect, useState } from "react";
import SoEquipe from "@/components/SoEquipe";
import FormAluno from "@/components/FormAluno";
import { obterAluno } from "@/lib/api";

export default function EditarAluno({ params }) {
  const [aluno, setAluno] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    obterAluno(params.id).then(setAluno).catch((e) => setErro(e.message));
  }, [params.id]);

  return (
    <SoEquipe>
      <span className="tag">Alunos</span>
      <h1>Editar aluno</h1>
      {erro && <div className="aviso erro" role="alert">{erro}</div>}
      {aluno && <FormAluno inicial={aluno} id={params.id} />}
    </SoEquipe>
  );
}

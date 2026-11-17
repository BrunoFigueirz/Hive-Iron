"use client";
import SoEquipe from "@/components/SoEquipe";
import FormAluno from "@/components/FormAluno";

export default function NovoAluno() {
  return (
    <SoEquipe>
      <span className="tag">Alunos</span>
      <h1>Cadastrar aluno</h1>
      <FormAluno />
    </SoEquipe>
  );
}

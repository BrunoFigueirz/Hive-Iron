# Esse arquivo inicia o banco de dados, caso ele não exista, será criado

import sqlite3
from pathlib import Path

CAMINHO_BANCO = Path(__file__).parent / "academia.db"

def conectar():
    conexao = sqlite3.connect(CAMINHO_BANCO)
    conexao.row_factory = sqlite3.Row
    conexao.execute("PRAGMA foreign_keys = ON")
    return conexao


def criar_tabelas():
    conexao = conectar()
    try:
        conexao.execute("""
        create table if not exists usuarios (
        id_usuario integer primary key autoincrement,
        cpf text unique not null,
        nome text not null,
        data_nasc text not null,
        telefone text,
        email text not null unique,
        senha_hash text not null,
        perfil text not null check(perfil in('aluno', 'funcionario', 'administrador')),
        criado_em text not null default current_timestamp
        );
        """)

        conexao.execute("""
        create table if not exists alunos (
        id_usuario integer primary key,
        ativo integer not null default 1 check(ativo in(0, 1)),
        estudante integer not null default 0 check(estudante in(0, 1)),
        foreign key(id_usuario) references usuarios(id_usuario)
        );
        """)
        conexao.execute("""
        create table if not exists funcionarios (
        id_usuario integer primary key,
        ativo integer not null default 1 check(ativo in(0, 1)),
        foreign key(id_usuario) references usuarios(id_usuario)
        );
        """)
        conexao.execute("""
        create table if not exists planos (
        id_plano integer primary key autoincrement,
        nome text not null,
        descricao text,
        tipo text not null check(tipo in('diario', 'mensal', 'anual')),
        preco_centavos integer not null check(preco_centavos_cn > 0),
        ativo integer not null default 1 check(ativo in(0, 1))
        );
        """)
        conexao.execute("""create table if not exists matriculas(
        id_matricula integer primary key autoincrement,
        id_aluno integer not null,
        id_plano integer not null,
        data_inicio text not null,
        data_fim text,
        status text not null check(status in('ativa', 'suspensa', 'pendente', 'encerrada')),
        motivo_suspensao text,
        foreign key(id_aluno) references alunos(id_usuario),
        foreign key(id_plano) references planos(id_plano)
        );""")
        conexao.execute("""
        create table if not exists treinos(
        id_treino integer primary key autoincrement,
        id_aluno integer not null,
        foreign key(id_aluno) references alunos(id_usuario)
        );""")
        conexao.execute("""create table if not exists periodos_treino(
        id_periodo integer primary key autoincrement,
        id_treino integer not null,
        data_inicio text not null,
        data_fim text,
        foreign key(id_treino) references treinos(id_treino)
        );""")
        conexao.execute("""create table if not exists exercicios(
        id_exercicio integer primary key autoincrement,
        nome text not null,
        descricao text,
        ativo integer not null default 1 check(ativo in(0, 1))
        );""")
        conexao.execute("""create table if not exists treino_exercicio(
        id_treino_exercicio integer primary key autoincrement,
        id_treino integer not null,
        id_exercicio integer not null,
        series integer not null check(series > 0),
        repeticoes integer not null check(repeticoes > 0),
        carga real check(carga is null or carga >= 0),
        ordem integer not null check(ordem > 0),
        observacao text,
        foreign key(id_treino) references treinos(id_treino),
        foreign key(id_exercicio) references exercicios(id_exercicio),
        unique(id_treino, ordem)
        );""")
        conexao.execute("""create table if not exists pagamentos(
        id_pagamento integer primary key autoincrement,
        id_matricula integer not null,
        valor_centavos integer not null check(valor_centavos > 0),
        desconto_centavos integer not null default 0 check(desconto_centavos >= 0),
        data_venc text not null,
        data_pagamento text,
        status text not null check(status in('pago_em_dia', 'pago_atrasado', 'pendente')),
        foreign key(id_matricula) references matriculas(id_matricula)
        );""")
        conexao.execute("""create table if not exists frequencias(
        id_frequencia integer primary key autoincrement,
        id_matricula integer not null,
        data_hora text not null,
        foreign key(id_matricula) references matriculas(id_matricula)
        );""")
        conexao.commit()
    except  Exception:
        conexao.rollback()
        raise
    finally:
        conexao.close()


def teste_tabelas():
    conexao = conectar()

    try:
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%';
        """)

        tabelas = [linha["name"] for linha in cursor.fetchall()]

        print("Tabelas encontradas:", ", ".join(tabelas))

    finally:
        conexao.close()


teste_tabelas()
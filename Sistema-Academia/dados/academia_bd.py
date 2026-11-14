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
        id_aluno integer primary key,
        ativo integer not null default 1 check(ativo in(0, 1)),
        foreign key(id_aluno) references usuarios(id_usuario)
        );
        """)
        conexao.execute("""
        create table if not exists funcionarios (
        id_funcionario integer primary key,
        ativo integer not null default 1 check(ativo in(0, 1)),
        foreign key(id_funcionario) references usuarios(id_usuario)
        );
        """)
        conexao.execute("""
        create table if not exists planos (
        id_plano integer primary key autoincrement,
        nome text not null,
        descricao text,
        tipo text not null check(tipo in('diario', 'mensal', anual)),
        preco integer not null check(preco > 0),
        ativo integer not null default 1 check(ativo in(0, 1))
        );
        """)
        conexao.commit()

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
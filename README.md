<h1>
  <img src="https://i.imgur.com/00vzWQG.png" alt="Logo Hive Iron" width="80" align="center">
  Hive Iron - Bom não, mel
</h1>

## Tema

Sistema web para gerenciar uma academia: alunos, funcionários, planos, matrículas, pagamentos, treinos e frequência. Três perfis de acesso: **Administrador**, **Funcionário** e **Aluno**.

## Integrantes

| Nome | Papel | GitHub |
|---|---|---|
| Bruno | PO e desenvolvedor (front-end) | @BrunoFigueirz |
| Kaio | Desenvolvedor (infraestrutura, banco de dados e back-end) | @kaiodrigues3-art |
| Iohan | Desenvolvedor (modelagem UML) | @iohanbryandev |
| Inacio | Desenvolvedor (especificação e interface) | @InacioThiago |

## Tecnologias

- **Back-end:** Python 3 e Flask
- **Banco de dados:** SQLite (local, criado pelo próprio sistema)
- **Front-end:** Next.js (React), que consome a API do Flask
- **Controle de versão e gestão:** Git e GitHub (issues e GitHub Projects como Product Backlog)

## Estrutura do projeto

```
Projeto-Sistema-Gestao-Academia/
├── README.md
├── requirements.txt             dependências do Python
├── .github/ISSUE_TEMPLATE/      template de história de usuário
├── docs/
│   ├── historias-de-usuario.md
│   ├── casos-de-uso.md
│   ├── contrato-api.md          o que o front espera da API do Flask
│   ├── diagramas/               diagramas (.png e arquivo-fonte)
│   └── prototipos/              telas do protótipo
├── Sistema-Academia/            back-end (Flask)
│   ├── app.py                   inicia a aplicação
│   ├── rotas/                   rotas (blueprints) por área
│   ├── dados/                   acesso ao banco de dados
│   └── servicos/                regras de negócio
└── frontend/                    front-end (Next.js)
    ├── package.json
    ├── jsconfig.json
    ├── .env.example             modelo de configuração
    ├── public/                  imagens (logo)
    ├── app/
    │   ├── layout.js
    │   ├── globals.css          estilo do projeto
    │   ├── login/page.js        tela de login
    │   └── (app)/               telas que exigem login
    │       ├── layout.js        barra do topo e proteção de rota
    │       ├── page.js          painel por perfil
    │       └── alunos/
    │           ├── page.js              consulta de alunos
    │           ├── novo/page.js         cadastrar aluno
    │           └── [id]/editar/page.js  editar aluno
    ├── components/              componentes de interface
    └── lib/                     api.js (comunicação com o Flask) e utilidades
```

## Como executar

Requisito: Node.js 18 ou mais novo.

    cd frontend
    npm install
    npm run dev

Abra http://localhost:3000 e entre com `func@hiveiron.com` / `func123`.
Nas próximas vezes, basta o segundo comando. Abra o link local que aparecer no terminal (normalmente `http://localhost:5000`).

### 3. Front-end (Next.js)

Em **outro terminal**, a partir da raiz do projeto:

```
cd frontend
npm install
npm run dev
```

Abra `http://localhost:3000`. Para parar o servidor, use `Ctrl+C`.

Sem nenhuma configuração, o front roda em **modo demonstração**, com dados falsos salvos no navegador. Não precisa do back-end ligado para testar as telas.

Contas de demonstração:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@hiveiron.com` | `admin123` |
| Funcionário | `func@hiveiron.com` | `func123` |
| Aluno | `aluno@hiveiron.com` | `aluno123` |

Para testar o cadastro de aluno, use um CPF válido, como `529.982.247-25`.


## Situação atual

- **Front-end:** login (UC01), painel por perfil e consulta, cadastro e edição de aluno (UC04), em modo demonstração.
- **Back-end:** estrutura inicial do Flask. As rotas da API descritas em `docs/contrato-api.md` ainda serão implementadas.

## Documentação

- [Histórias de usuário](docs/historias-de-usuario.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Diagrama de casos de uso](docs/diagramas/casos-de-uso.png)
- [Contrato da API](docs/contrato-api.md)
- [README do front-end](frontend/README.md)
- Product Backlog: aba **Projects** do repositório

# Hive Iron — Front-end

Telas do Sistema de Gestão de Academia, feitas em **Next.js (React)**. O front consome a API do backend em Flask (`Sistema-Academia/`) e segue o visual do protótipo: preto, neon, cartões com borda branca e botões em pílula.

## O que já está pronto

| Tela | Caso de uso | História |
|---|---|---|
| Login | UC01 Entrar no sistema | US01 |
| Painel (muda por perfil) | UC01 | US01 |
| Consulta de alunos, com busca por nome, CPF ou e-mail | UC04 Cadastrar e editar aluno | US03 |
| Cadastrar aluno | UC04 | US03 |
| Editar aluno | UC04 | US03 |

Regras que o front já aplica (o backend precisa aplicar também):

- Login com mensagem única de erro, sem dizer qual campo errou.
- Menu e telas por perfil: o **Aluno** não vê "Alunos"; **Funcionário** e **Administrador** veem (o Administrador herda tudo do Funcionário).
- CPF obrigatório, com máscara e validação dos dígitos. O backend recusa CPF já cadastrado.
- Aluno estudante exige comprovação por **matrícula** ou **carteirinha** (instituição de ensino ou governo) e o número do documento.

Ficaram de fora de propósito as telas que ainda não têm história: "Sobre nós", "Seja um afiliado", "Planos" e "Cadastrar" (autocadastro).

## Tecnologias

- Next.js 14 (App Router) e React 18, em JavaScript
- CSS puro (`app/globals.css`), sem biblioteca de componentes
- Fontes do Google Fonts: Syne, Barlow Condensed e Barlow (precisa de internet; sem ela, o navegador usa fontes de reserva)

## Como executar

Requisito: **Node.js 18 ou mais novo** (`node -v` para conferir).

```
cd frontend
npm install
npm run dev
```

Abra `http://localhost:3000`. Para parar o servidor, `Ctrl+C`.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento, atualiza sozinho ao salvar |
| `npm run build` | Compila para produção e mostra erros de código |
| `npm start` | Roda a versão compilada (precisa do `build` antes) |

### Contas de demonstração (modo mock)

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@hiveiron.com` | `admin123` |
| Funcionário | `func@hiveiron.com` | `func123` |
| Aluno | `aluno@hiveiron.com` | `aluno123` |

Para testar o cadastro, use um CPF válido, como `529.982.247-25`.

## Modo mock e modo real

Toda a comunicação com o backend passa por **um único arquivo**: `lib/api.js`. As telas não sabem de onde vêm os dados.

- **Mock (padrão):** sem configuração, os dados são falsos e ficam salvos no `localStorage` do navegador. Para zerar, limpe os dados do site no navegador.
- **Real:** copie `.env.example` para `.env.local` e preencha:

  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  ```

  Reinicie o `npm run dev` (o Next só lê o `.env.local` ao iniciar). O backend precisa seguir o contrato em [`../docs/contrato-api.md`](../docs/contrato-api.md) e liberar CORS com credenciais para `http://localhost:3000` (`flask-cors` com `supports_credentials=True`).

Importante: o bloqueio de telas por perfil no front é só visual. **Quem barra de verdade é o backend** (US01).

## Estrutura

```
frontend/
├── package.json
├── jsconfig.json              atalho "@/" para a raiz do front
├── .env.example               modelo de configuração
├── public/
│   └── iron_logo.png          logo (servido em /iron_logo.png)
├── app/
│   ├── layout.js              HTML base e fontes
│   ├── globals.css            estilo do projeto (cores e componentes)
│   ├── login/page.js          tela de login (UC01)
│   └── (app)/                 telas protegidas (exigem login)
│       ├── layout.js          barra do topo e redirecionamento ao login
│       ├── page.js            painel por perfil
│       └── alunos/
│           ├── page.js        consulta de alunos (UC04)
│           ├── novo/page.js   cadastrar aluno (UC04)
│           └── [id]/editar/page.js   editar aluno (UC04)
├── components/
│   ├── Logo.js                logo da marca (usa public/iron_logo.png)
│   ├── Topo.js                barra do topo com menu por perfil
│   ├── Sessao.js              usuário logado (contexto) e perfis
│   ├── SoEquipe.js            bloqueia a tela para quem é aluno
│   └── FormAluno.js           formulário de cadastro e edição
└── lib/
    ├── api.js                 comunicação com o backend (mock ou real)
    └── cpf.js                 máscara e validação de CPF
```

A pasta `(app)` entre parênteses só agrupa as telas que compartilham o layout com barra do topo; ela não aparece na URL (`/alunos`, não `/(app)/alunos`).

## Cores e fontes

Definidas no início de `app/globals.css`, na seção `:root`. Para mudar o neon ou o ouro da marca, altere `--neon` e `--ouro` num lugar só.

## Trocar o logo

Substitua `public/iron_logo.png` mantendo o nome, ou mude o caminho em `components/Logo.js`. O componente é usado no login e na barra do topo, então a troca vale para os dois.

## O que não está coberto

- Não há testes automatizados no front.
- A autenticação do modo mock é só demonstração (senhas em texto puro no código). No sistema real a senha é guardada com hash e a sessão é controlada pelo backend.
- Ainda não existem telas para criar planos (US04), gerenciar funcionários (US02), matrículas, pagamentos, presença, treinos ou relatórios.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `npm: command not found` | Node.js não instalado |
| Erro "defined multiple times" | Linha de `import` repetida no arquivo indicado na mensagem |
| Logo aparece quebrado | `public/` está fora de `frontend/`, ou o nome do arquivo não bate |
| Voltei para o login sozinho | Sessão do mock limpa; entre de novo |
| Mudei o `.env.local` e nada mudou | Reinicie o `npm run dev` |
| Login falha no modo real | CORS sem credenciais no Flask, ou `NEXT_PUBLIC_API_URL` incorreta |

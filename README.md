<h1>
  <img src="https://i.imgur.com/00vzWQG.png" alt="Logo Hive Iron" width="80" align="center">
  Hive Iron - Bom não, mel
</h1>

## Tema

Sistema web para gerenciar uma academia: alunos, funcionários, planos, matrículas, pagamentos, treinos e frequência. Três perfis de acesso: **Administrador**, **Funcionário** e **Aluno**.

## Integrantes

| Nome | Papel | GitHub |
|---|---|---|
| Bruno | PO e desenvolvedor | @BrunoFigueirz |
| Kaio | Desenvolvedor (infraestrutura e repositório) | @kaiodrigues3-art |
| Iohan | Desenvolvedor (modelagem UML) |@iohanbryandev |
| Inacio| Desenvolvedor (especificação e interface) | @InacioThiago |

## Tecnologias

- Python 3 e Flask
- SQLite (banco local, criado pelo próprio sistema)
- HTML, CSS e JavaScript nas telas
- Git e GitHub (issues e GitHub Projects como Product Backlog)



## Estrutura do projeto

```
Projeto-Sistema-Gestao-Academia/
├── README.md                    
├── requirements.txt             (Flask + flask-cors)
├── .github/ISSUE_TEMPLATE/
├── docs/
│   ├── historias-de-usuario.md
│   ├── casos-de-uso.md
│   ├── contrato-api.md          (novo: o que o front espera do Flask)
│   ├── diagramas/
│   └── prototipos/              
├── Sistema-Academia/            
│   ├── app.py
│   ├── rotas/
│   ├── dados/
│   └── servicos/
└── frontend/                    novo: Next.js
    ├── package.json
    ├── jsconfig.json
    ├── .env.example
    ├── app/
    │   ├── layout.js
    │   ├── globals.css
    │   ├── login/page.js           
    │   └── (app)/
    │       ├── layout.js            barra do topo + proteção de rota
    │       ├── page.js              painel por perfil
    │       └── alunos/
    │           ├── page.js         
    │           ├── novo/page.js     
    │           └── [id]/editar/page.js
    ├── components/                  
    └── lib/                         contrato com o Flask
```

## Instruções de Execução

- A partir da raiz do projeto, use o seguinte comando: ./.venv/bin/python ./Sistema-Academia/app.py
- Abra o link local que aparecer no terminal no navegador




## Documentação

- [Histórias de usuário](docs/historias-de-usuario.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Diagrama de casos de uso](docs/diagramas/casos-de-uso.png)
- Product Backlog: aba **Projects** do repositório

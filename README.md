# 💡Cabeleleila Leila - Teste Prático - DSIN

Este desafio conssite no desenvolvimento de uma aplicação full stack, podendo ser desenvolvida em qualquer linguagem de sua escolha e utilizando qualquer banco de dado 

## 📜 Descrição do Projeto

Este projeto consiste na criação de um sistema de agendamento online especialmente feito para o salão da Leila, que permite com que seus clientes marquem e controlem seus proprios agendamentos de um jeito fácil e útil. O sistema deve conter:

* Agendamento de vários serviços
* Mudança de agendamentos (com limites de tempo)
* Histórico dos agendamentos com informações
* Sugestão para agendamento de serviços na mesma data para clientes com muitos compromissos na semana. 

Além disso͏(opcional), o sis͏tema deve ter tarefas que ajudam a Leila no cui͏dado do salão:

* Um acesso para ela mudar os horários dos clientes;
* Uma lista e conf͏irmação ͏dos agendam͏entos;
* U͏m c͏ontrole do estado dos serviços;
* Ferra͏mentas para monitoramento da performance semanal do negó͏c͏io. ͏
͏
---

## 🛠️ Funcionalidades

### ✅ O Sistema deve permitir o cadastro de usuarios
### ✅ O Sistema deve permitir a realização de agendamentos
### ✅ O Sistema deve permitir a criação de serviços
### ✅ O Sistema deve permitir a alteração dos serviços em caso de solicitação em até 2 dias antes do agendado
### ✅ O Sistema deve permitir a consulta do historico dos agendamentos realizados em determinado periodo
### ✅ O Sistema deve permitir a visualização de detalhes dos agendamentos listados no historico
### ❌ O Sistema deve realizar a identificação da existencia de mais de um agendamento de um cliente em uma semana
### ❌ O Sistema deve permitir a alteração da data dos agendamentos para a mesma data do primeiro agendamento

### ✅ O Sistema deve ter um gerenciamento por cargos
### ❌ O Sistema deve permitir apenas o admin ou funcionarios alterarem o agendamento dos clients
### ✅ O Sistema deve disponibilizar uma listagem dos agendamentos recebidos
### ❌ O Sistema deve permitir a confirmação do agendamento do cliente
### ✅ O Sistema deve permitir o gerenciamento do status de cada um dos serviços solicitados


---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

### Linguagem de Programação
- **TypeScript**:  Linguagem de programação que adiciona tipagem estática ao JavaScript, melhorando a segurança e a manutenibilidade do código.

### FrontEnd.

- **React**:: Utilizado como biblioteca principal de desenvolvimento.
- **Next.js**:: Framework utilizado pela sua praticidade de sistema de gerenciamento de rotas/controle de autenticação pelo middleware e simplicidade na implementação.
- **React**: Biblioteca principal de desenvolvimento.
- **Next.js**: Framework utilizado pela sua praticidade de sistema de gerenciamento de rotas/controle de autenticação pelo middleware e simplicidade na implementação.
- **Acertinity UI**: Biblioteca vasta com código de componentes pré-estilizados que você instala e importa e com isso os configura ao seu modo.
- **Shadcn UI**: Fornece uma vasta gama de componentes de interface do usuário pré-construídos e reutilizáveis.
- **Tailwind CSS**: Framework CSS utilitário, altamente personalizável, para estilização rápida e eficiente da interface do usuário.

### BackEnd
- **Node.js**: Ambiente de execução JavaScript para o servidor.
- **Express.js**: Framework web para Node.js, utilizado para criar APIs e gerenciar rotas.
- **.env (Dotenv)**: Módulo para carregar variáveis de ambiente de um arquivo .env.
- **bcrypt**: Biblioteca para criptografia de senhas.
- **Nodemon**: Ferramenta que reinicia automaticamente o servidor Node.js durante o desenvolvimento.

### ORM
- **Prisma**: ORM (Object-Relational Mapper) para facilitar a interação com o banco de dados.

### Banco de Dados
- **MySQL**: Sistema de gerenciamento de banco de dados relacional.

### Ferramentas Adicionais
- **LazyVim**: Configuração do Vim para desenvolvimento eficiente.
- **Docker**: Plataforma para conteinerização de aplicações, facilitando a implantação e o gerenciamento.
- **Postman**: Ferramenta para testar e documentar APIs.


---


## 🔧 Como executar o projeto?

 Clone este repositório em sua máquina:
   ```bash
   git clone https://github.com/MrClaro/cabeleleila-leila-dsin-final.git
   ```

### BackEnd
1. Acesse o diretorio do backend
   ```bash
   cd backend
   ```
2. Instale as depencencias
   ```bash
   pnpm install
   ```
3. Altere as variaveis de ambiente no arquivo .env para apontar para o seu banco de dados
4. Realize a migração do schema do prisma para o seu banco de dados
   ```bash
   prisma migrate dev --name init
   ```
5. Gere o client do prisma
   ```bash
   prisma generate
   ```
5. Execute o projeto
   ```bash
   pnpm dev
   ```
### FrontEnd
### BackEnd
1. Acesse o diretorio do frotend
   ```bash
   cd frontend
   ```
2. Instale as depencencias
   ```bash
   pnpm install
   ```
3. Altere as variaveis de ambiente no arquivo .env para apontar para a url do backend
4. Execute o projeto
   ```bash
   pnpm next dev
   ```
---
### Rotas do projeto - Versão API
- **Postman Documentation**: [Clique aqui para ser redirecionado](https://documenter.getpostman.com/view/42589048/2sAYkBthNS)
  
---

## 📄 Licença

Este projeto foi desenvolvido como parte de um procsso seletivo e está livre para uso pessoal e educacional.


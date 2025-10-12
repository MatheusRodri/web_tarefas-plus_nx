#  Nome do Projeto

> O projeto é uma aplicação web na qual os usuarios podem gerenciar suas tarefas diárias de forma eficiente, permitindo a criação, exclusão e compartilhamento de tarefas publicas, na qual é possivel fazer comentários e interagir com outras tarefas publicas e com login via Google

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar](#como-rodar)
  - [Pré-requisitos](#pré-requisitos)
- [Como Usar](#como-usar)
- [Como Contribuir](#como-contribuir)


## Funcionalidades

- Cadastro e Login via Google
- Criação, edição e exclusão de tarefas
- Compartilhamento de tarefas publicas
- Comentários em tarefas publicas
- Interface amigável e responsiva

## Tecnologias Utilizadas

- Front end
    - TypeScript
    - Next.js

## Como Rodar
### Pré-requisitos

Antes de executar o projeto, certifique-se de ter os seguintes requisitos instalados:
- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Conta no Google para autenticação
- Banco de dados (ex: MongoDB, PostgreSQL, etc.)
- Editor de código (ex: Visual Studio Code)
- Navegador web (ex: Google Chrome, Firefox, etc.)

## Como rodar

- Clone ou faça o download do repositório
- Navegue até o diretório do projeto
- Execute o comando `npm install` para instalar as dependências
- Renomeie o arquivo `.env.example` para `.env`
- Configure as variáveis de ambiente necessárias
    - Configurar as variáveis do google acessar [Clique aqui](https://console.developers.google.com/apis/credentials)
    - Configurar o JWT_TOKEN [Clique aqui](https://www.md5hashgenerator.com/)
- Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento
- Acesse a aplicação no navegador através do endereço `http://localhost:3000`

## Como Contribuir

- Entre em contato comigo pelo [LinkedIn](https://www.linkedin.com/in/matheus-rodrigues-mrj/)
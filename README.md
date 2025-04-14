# App Busca Universidades - React Native

![React Native](https://img.shields.io/badge/React%20Native-0.7x-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2050+-purple?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-Utilizado-orange)
![Expo Router](https://img.shields.io/badge/Expo%20Router-v3-lightgrey)

## 📌 Visão Geral

Este é um aplicativo móvel desenvolvido com React Native e Expo para pesquisar universidades em diferentes países. O usuário pode buscar universidades pelo nome e/ou país, visualizar os resultados e adicionar suas universidades preferidas a uma lista de favoritos. Os dados das universidades são obtidos através da API pública [Universities API by Hipo](http://universities.hipolabs.com/).

## 🛠️ Tecnologias Utilizadas

-   **React Native**
-   **Expo (Managed Workflow)**
-   **TypeScript**
-   **Expo Router** (para navegação baseada em arquivos)
-   **AsyncStorage** (para persistência dos favoritos localmente)
-   **Fetch API** (para requisições HTTP)

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

-   **[Node.js](https://nodejs.org/) (LTS recomendado)** (inclui npm)
-   **[Expo CLI](https://docs.expo.dev/get-started/installation/)**:
    ```bash
    npm install -g expo-cli
    ```
-   **Um ambiente de execução:**
    *   **Emulador Android** (configurado via Android Studio)
    *   **OU** **Simulador iOS** (configurado via Xcode no macOS)
    *   **OU** **Aplicativo Expo Go** no seu dispositivo físico ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/us/app/expo-go/id982107779))

## 📂 Estrutura do Projeto

```
app-busca-react-native/
├── app/
│ ├── _layout.tsx # Configuração do Stack Navigator (raiz)
│ ├── index.tsx # Tela Principal (Pesquisa e Resultados)
│ ├── favoritos.tsx # Tela de Favoritos
│ └── +not-found.tsx # Tela para rotas não encontradas
├── assets/ # Recursos estáticos (imagens, fontes)
├── node_modules/ # Dependências do projeto
├── package.json # Metadados e dependências do projeto
├── tsconfig.json # Configuração do TypeScript
└── README.md # Este arquivo
```

## ⚙️ Configuração

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/henrique-sdc/app-busca-react-native.git
    cd app-busca-react-native
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    *ou, se você usa Yarn:*
    ```bash
    yarn install
    ```

## ▶️ Executando o Aplicativo

1.  **Inicie o servidor de desenvolvimento Expo:**
    ```bash
    npx expo start
    ```

2.  **Escolha como executar:**
    *   **No Emulador/Simulador:** Pressione `a` (Android) ou `i` (iOS) no terminal após o servidor iniciar (o emulador/simulador deve estar aberto).
    *   **No Dispositivo Físico:** Abra o aplicativo **Expo Go** no seu celular e escaneie o QR Code exibido no terminal ou na página web que o Expo abrirá.

## ✨ Funcionalidades

1.  **Tela Principal (`/`):**
    *   Dois campos de texto para inserir o nome do país e/ou o nome da universidade.
    *   Botão "Pesquisar" para buscar universidades na API com base nos critérios informados.
    *   Exibe um indicador de carregamento durante a busca.
    *   Lista os nomes e países das universidades encontradas.
    *   Exibe uma mensagem se nenhum resultado for encontrado ou antes da primeira pesquisa.
    *   Botão "Favoritos" para navegar até a tela de favoritos.

2.  **Favoritar:**
    *   Ao clicar em uma universidade na lista de resultados, o nome e a primeira URL da web (`web_page`) são salvos localmente usando AsyncStorage.
    *   O usuário é redirecionado para a tela de Favoritos.
    *   Um alerta informa se a universidade foi favoritada com sucesso ou se já existia.

3.  **Tela de Favoritos (`/favoritos`):**
    *   Lista as URLs e nomes das universidades salvas como favoritas.
    *   Exibe uma mensagem se nenhum favorito foi adicionado ainda.
    *   Ao clicar em um item da lista, ele é removido dos favoritos (AsyncStorage e da tela). Um alerta confirma a remoção.
    *   Botão "Voltar para Pesquisa" para retornar à tela principal.

## 📌 Melhorias Futuras

-   Adicionar tratamento de erros mais robusto para chamadas de API.
-   Permitir abrir a URL da universidade em um navegador.
-   Melhorar a interface do usuário (UI/UX).
-   Adicionar testes unitários/integração.
-   Implementar paginação caso a API retorne muitos resultados.
-   Refinar indicadores de carregamento e estados vazios.

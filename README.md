<div align="center">

# ⚖️ GuiaLegal TEA

### Informação, acolhimento e organização para apoiar pessoas autistas e suas famílias na defesa de direitos.

[![Acessar aplicação](https://img.shields.io/badge/Acessar%20aplicação-GuiaLegal%20TEA-167D8D?style=for-the-badge)](https://guialegal-tea.onrender.com)
[![Demonstração](https://img.shields.io/badge/▶%20Assistir-demonstração-CC2B2B?style=for-the-badge)](https://youtu.be/23NtWYRjN64)
[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-pronto-6B4FBB?style=flat-square)](https://web.dev/explore/progressive-web-apps)

**[Abrir o GuiaLegal TEA](https://guialegal-tea.onrender.com)** · **[Ver a demonstração](https://youtu.be/23NtWYRjN64)**

</div>

---

O **GuiaLegal TEA** é uma aplicação web progressiva (PWA) voltada a pessoas autistas, famílias atípicas e profissionais. Reúne recursos de informação, preparação e organização para apoiar o acesso a direitos e o cuidado em situações do dia a dia.

> A plataforma oferece informação e apoio, mas não substitui atendimento jurídico, médico ou de emergência. Confirme orientações legais com profissionais qualificados e fontes oficiais.

## ✨ O que você encontra

- **Passaporte sensorial digital** — organize informações sobre necessidades, comunicação e preferências de apoio.
- **SOS Crise** — acesso rápido a recursos de apoio para momentos de sobrecarga sensorial.
- **Orientação sobre BPC/LOAS** — informações e estimativas para ajudar a compreender critérios do benefício.
- **Preparação de dossiês e perícias** — apoio para reunir informações, documentos e prazos.
- **Guia inclusivo** — consulta a informações sobre estabelecimentos e acessibilidade.
- **Assistente e triagem com IA** — recursos de orientação que podem usar a API Gemini quando a chave estiver configurada.
- **PWA** — experiência que pode ser instalada em dispositivos compatíveis.

## 🖥️ Tecnologias

- **Interface:** React, TypeScript, Vite, Tailwind CSS, Lucide React e Motion.
- **Servidor e API:** Node.js, Express e TypeScript (`tsx`).
- **IA:** Google Gemini (`@google/genai`), opcionalmente configurada por variável de ambiente.
- **PWA:** `vite-plugin-pwa`.

## 🚀 Executar localmente

### Requisitos

- Node.js compatível com as dependências do projeto.
- npm.

### Instalação

```bash
git clone https://github.com/Guibarros777/guialegal-tea.git
cd guialegal-tea
npm install
npm run dev
```

O servidor de desenvolvimento inicia em `http://localhost:3000`.

### Configurar a API Gemini (opcional)

Para habilitar os recursos que dependem de IA, crie um arquivo `.env` na raiz e adicione sua chave:

```env
GEMINI_API_KEY=sua_chave_aqui
```

Sem essa variável, os endpoints de IA podem utilizar respostas alternativas disponíveis no servidor. **Não compartilhe nem envie sua chave para o GitHub.**

### Build e verificações

```bash
npm run build
npm run lint
```

Para iniciar o servidor em modo de produção depois do build:

```bash
npm start
```

## 📁 Estrutura do projeto

```text
.
├── public/          # Arquivos públicos e recursos da PWA
├── src/             # Aplicação React
├── server.ts        # Servidor Express e endpoints da API
├── index.html       # Documento HTML da aplicação
├── package.json     # Dependências e comandos
└── vite.config.ts   # Configuração do Vite
```

## 📺 Demonstração

Conheça a proposta e veja uma demonstração prática do **GuiaLegal TEA**: [assistir no YouTube](https://youtu.be/23NtWYRjN64).

## ⚠️ Aviso importante

O conteúdo disponibilizado pela aplicação tem caráter informativo e não constitui aconselhamento jurídico, diagnóstico, tratamento ou garantia de concessão de benefícios. Respostas geradas por inteligência artificial podem conter erros ou estar desatualizadas. Em situações urgentes, procure os serviços oficiais e profissionais competentes.

---

<div align="center">

Feito para apoiar informação, inclusão e autonomia. 💙

**[Acessar GuiaLegal TEA](https://guialegal-tea.onrender.com)**

</div>

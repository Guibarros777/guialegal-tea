import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility on the server
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// System prompt for Brazilian Autism Rights & Legal Defense
const LEGAL_TEA_SYSTEM_INSTRUCTION = `Você é o assistente jurídico e de acolhimento especializado do 'GuiaLegal TEA - Autodefesa e Gestão de Direitos'.
Sua missão é prestar orientação primária jurídica, acolhimento humanizado e triagem para famílias atípicas e pessoas no espectro autista no Brasil.
Base legal rigorosa que você sempre utiliza:
1. Lei Berenice Piana (Lei nº 12.764/2012) - Equipara expressamente o autista à pessoa com deficiência para todos os efeitos legais (Art. 1º, § 2º).
2. Lei Romeo Mion (Lei nº 13.977/2020) - Institui a Carteira de Identificação da Pessoa com Transtorno do Espectro Autista (CIPTEA) e assegura prioridade absoluta em serviços públicos e privados.
3. Estatuto da Pessoa com Deficiência (Lei nº 13.146/2015) - Tipifica discriminação contra PcD como crime (Art. 88, reclusão de 1 a 3 anos e multa); veda recusa de matrícula ou taxa extra em escolas públicas ou particulares (Art. 28 c/c ADI 5357/STF, crime punível com reclusão de 2 a 5 anos e multa pelo Art. 8º da Lei 7.853/1989).
4. Direito à Saúde e Terapias Multidisciplinares: Resoluções da ANS (RN 469/2021 e RN 539/2022) que extinguiram o limite de sessões de ABA, Terapia Ocupacional, Fonoaudiologia e Fisioterapia; Lei nº 14.454/2022 (superação do rol taxativo da ANS); Súmulas do STJ e jurisprudência consolidada que veda recusa de método indicado pelo médico assistente.
5. Direitos Previdenciários (BPC/LOAS - Lei 8.742/1993): Critério de 1/4 a 1/2 salário mínimo com dedução comprovada de despesas com tratamentos, fraldas, remédios e terapias (Lei 14.176/2021 e Tema 173 da TNU). Não cômputo de BPC de outro membro idoso/deficiente no grupo familiar.
6. Direitos Trabalhistas e de Servidores: Redução da jornada em até 50% sem compensação de horário e sem redução salarial para servidores pais de autistas (Art. 98, §§ 2º e 3º da Lei 8.112/1990; Lei 13.370/2016 e Tema 1097 do STF estendendo para celetistas).
Tom de voz: Empático, acolhedor, firme na defesa dos direitos, claro e sem jargões desnecessários, com instruções passo a passo bem delineadas e menção aos artigos de lei aplicáveis. Deixe claro que esta é uma orientação de autodefesa e cidadania e não substitui a representação formal por um advogado ou Defensoria Pública.`;

// API: Incident Triage
app.post('/api/gemini/triage', async (req, res) => {
  try {
    const { relato, categoria, local } = req.body;
    if (!relato || typeof relato !== 'string') {
      return res.status(400).json({ error: 'O relato do incidente é obrigatório.' });
    }

    const ai = getAiClient();
    if (!ai) {
      // Offline fallback deterministic rule-based analysis
      return res.json({
        gravidade: 'ALTA',
        violacoesIdentificadas: [
          'Possível violação da Lei 12.764/2012 (Lei Berenice Piana)',
          'Possível infração ao Estatuto da Pessoa com Deficiência (Lei 13.146/2015)',
        ],
        enquadramentoLegal: 'Art. 1º, § 2º da Lei 12.764/2012 e Art. 88 da Lei 13.146/2015.',
        orientacaoImediata: [
          'Exija a identificação do responsável e registre foto/vídeo ou áudio se seguro.',
          'Apresente o artigo de lei no GuiaLegal TEA ou a CIPTEA.',
          'Acione a autoridade policial pelo 190 se houver recusa em flagrante, ou disque 100.',
        ],
        orgaosAcionaveis: [
          'Defensoria Pública do Estado',
          'Ministério Público (Promotoria da Pessoa com Deficiência)',
          'Disque 100 (Direitos Humanos)',
        ],
        modeloNotificacao: `NOTIFICAÇÃO EXTRAJUDICIAL DE URGÊNCIA\n\nÀ Direção / Gerência\nReferente: Cumprimento Imediato da Legislação Protetiva da Pessoa com Transtorno do Espectro Autista (TEA)\n\nServe a presente para notificar que a conduta relatada viola frontalmente a Lei Federal nº 12.764/2012 e a Lei Federal nº 13.146/2015 (Estatuto da Pessoa com Deficiência), sujeitando os infratores a sanções cíveis, administrativas e criminais (Art. 88 da Lei 13.146/2015).\n\nSolicita-se a cessação imediata da conduta discriminatória e o pleno atendimento do direito vindicado no prazo impreterível de 24 horas.`,
        iaOffline: true,
      });
    }

    const prompt = `Analise o seguinte relato de violação ou incidente envolvendo pessoa com Transtorno do Espectro Autista (TEA):
Categoria indicada: ${categoria || 'Não especificada'}
Local: ${local || 'Brasil'}
Relato: "${relato}"

Estruture sua resposta estritamente no seguinte formato JSON (sem blocos markdown adicionais):
{
  "gravidade": "CRÍTICA" ou "ALTA" ou "MÉDIA",
  "categoriaNormalizada": "Escola / Educação" ou "Plano de Saúde / Terapias" ou "Transporte / Mobilidade" ou "Acesso a Estabelecimento / Consumo" ou "Ambiente de Trabalho" ou "INSS / Previdência" ou "Abordagem Policial / Urgência",
  "violacoesIdentificadas": ["lista sucinta de violações"],
  "enquadramentoLegal": "Artigos exatos da Lei 12.764/12, 13.146/15, 13.977/20, resoluções da ANS ou CLT/Lei 8.112",
  "orientacaoImediata": ["passo 1 imediato", "passo 2", "passo 3"],
  "orgaosAcionaveis": ["Ex: Delegacia / BO", "PROCON", "Ministério Público", "ANS", "Ouvidoria do INSS", "Disque 100"],
  "modeloNotificacao": "Minuta concisa e formal de notificação extrajudicial pronta para o usuário assinar e entregar"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LEGAL_TEA_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    try {
      const parsed = JSON.parse(text);
      return res.json({ ...parsed, iaOffline: false });
    } catch {
      return res.json({
        gravidade: 'ALTA',
        violacoesIdentificadas: ['Conduta em desconformidade com a legislação TEA'],
        enquadramentoLegal: 'Lei 12.764/2012 e Lei 13.146/2015',
        orientacaoImediata: [
          'Documente o fato com nomes, testemunhas e data.',
          'Utilize a minuta de notificação gerada.',
        ],
        orgaosAcionaveis: ['Ministério Público Estadual', 'Defensoria Pública'],
        modeloNotificacao: text,
        iaOffline: false,
      });
    }
  } catch (error: any) {
    console.error('Erro na triagem Gemini:', error);
    res.status(500).json({
      error: 'Não foi possível processar a triagem no momento.',
      details: error?.message || 'Erro interno',
    });
  }
});

// API: Legal Chat & Conversational Voice Assistant
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        reply:
          'Olá! O serviço de inteligência artificial requer a chave GEMINI_API_KEY no painel de configurações. Enquanto isso, você pode consultar todos os nossos Guias Práticos, a Calculadora de BPC e o Gerador de Dossiês que funcionam de forma 100% offline!',
      });
    }

    // Build chat with system instruction
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(h.content || '') }],
        }))
      : [];

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: `${LEGAL_TEA_SYSTEM_INSTRUCTION}
Mantenha respostas objetivas, com parágrafos curtos, empáticas e bem legíveis. Se a pergunta for sobre crise sensorial ou emergência, comece com orientação rápida de segurança.`,
      },
      history: formattedHistory,
    });

    const response = await chat.sendMessage({
      message,
    });

    const reply = response.text || 'Desculpe, não consegui formular a resposta. Por favor tente novamente.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Erro no chat Gemini:', error);
    res.status(500).json({
      error: 'Erro ao comunicar com o assistente legal.',
      details: error?.message,
    });
  }
});

// API: Official Legal Dossier Generator
app.post('/api/gemini/dossier', async (req, res) => {
  try {
    const { tipoDossie, dadosUsuario, fatos, pedidosEspecificos } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        titulo: `Dossiê Formal - ${tipoDossie || 'Requerimento de Direitos TEA'}`,
        textoFormatado: `ILUSTRÍSSIMO(A) SENHOR(A) TITULAR DO ÓRGÃO COMPETENTE\n\nRequerente: ${dadosUsuario?.nome || '[NOME COMPLETO]'}\nCPF: ${dadosUsuario?.cpf || '[CPF]'}\nRepresentando: ${dadosUsuario?.beneficiario || 'Pessoa com Transtorno do Espectro Autista'}\n\nVem respeitosamente expor e requerer:\n\nDOS FATOS:\n${fatos || 'Relato dos fatos e violações ocorridas.'}\n\nDO DIREITO:\nFundamentado na Lei nº 12.764/2012 (Lei Berenice Piana), na Lei nº 13.146/2015 (Estatuto da Pessoa com Deficiência) e demais normativas correlatas.\n\nDOS PEDIDOS:\n1. O deferimento imediato da solicitação ora formulada;\n2. A apuração e cessação de qualquer conduta violadora de direitos.\n\nTermos em que pede deferimento.\nLocal e Data: ${new Date().toLocaleDateString('pt-BR')}`,
      });
    }

    const prompt = `Gere uma peça jurídica formal completa, robusta e irretocável em português brasileiro para o seguinte tipo de dossiê:
Tipo: ${tipoDossie}
Dados do Requerente/Pessoa com TEA: ${JSON.stringify(dadosUsuario || {})}
Fatos e Detalhes: ${fatos}
Pedidos específicos: ${pedidosEspecificos || 'Pleno cumprimento dos direitos fundamentais da pessoa autista'}

A peça deve conter:
- Endereçamento correto e formal (Ex: Ao Ministério Público Estadual, À Agência Nacional de Saúde Suplementar - ANS, Ao Instituto Nacional do Seguro Social - INSS, ou À Diretoria de Ensino)
- Qualificação completa das partes
- Dos Fatos circunstanciados
- Dos Fundamentos Jurídicos detalhados (com citação expressa dos artigos da Lei 12.764/12, Lei 13.146/15, súmulas e julgados recentes)
- Dos Pedidos claros e com fixação de prazo de cumprimento
- Fechamento formal com local, data e espaço para assinatura.

Retorne estritamente em formato JSON:
{
  "titulo": "Título formal da peça",
  "orgaoDestinatario": "Nome do órgão",
  "fundamentosChave": ["artigo 1", "artigo 2"],
  "prazoExigido": "Ex: 24 horas / 48 horas / 5 dias",
  "textoFormatado": "Texto integral da petição pronto para imprimir"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LEGAL_TEA_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Erro na geração de dossiê:', error);
    res.status(500).json({ error: 'Erro ao gerar dossiê jurídico.' });
  }
});

// Configure Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GuiaLegal TEA Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

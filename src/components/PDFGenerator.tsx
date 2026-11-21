import { useState, useRef, useEffect } from "react";
import { dataFetch } from "@/lib/runtime/dataGate";
import { motion } from "framer-motion";
import { FileText, Download, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GState, jsPDF } from "jspdf";
import iftLogoFull from "@/assets/ift-logo-full.png";

type PDFType = "technical" | "poetic";

interface PDFGeneratorProps {
  driverName: string;
  driverSlug: string;
  pdfType: PDFType;
  onComplete?: (ift: number) => void;
}

const PDF_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pdf`;

const IFT_FOOTER_LINE1 = "Impact HUB Brasília - SGAN 601, Lote H Edifício Íon, Ala Amarela - Asa Norte Brasília/DF";
const IFT_FOOTER_LINE2 = "(61) 3550-8779 · www.felicidadeparatodos.com.br · @felicidadeparatodosbr";
const IFT_FOOTER_LINE3 = "© 2025 - Instituto Felicidade para Todos. Todos os direitos reservados.";

// Premium color palette
const TEAL = [62, 182, 194] as const;
const GOLD = [245, 190, 35] as const;
const NAVY = [22, 30, 46] as const;
const LIGHT_BG = [248, 249, 252] as const;
const WHITE = [255, 255, 255] as const;

function buildLocalDocument(driverName: string, pdfType: PDFType) {
  const today = new Date().toLocaleDateString("pt-BR");

  if (pdfType === "poetic") {
    return `# Poesia Pedagógica — ${driverName}

Documento gerado localmente para apoiar reflexão, aprendizagem e transferência ao trabalho real.

## Convite

Que ${driverName} deixe de ser apenas conceito e vire prática observável: uma conversa melhor, uma rotina mais clara, uma decisão mais justa e uma evidência de cuidado.

## Poema-guia

No trabalho que respira, cada gesto ensina.
O que se mede com respeito pode virar cuidado.
O que se conversa com coragem pode virar acordo.
O que se registra com honestidade pode virar caminho.

## Prática reflexiva

- Escolha uma situação real em que ${driverName} apareça como força ou fragilidade.
- Descreva o comportamento observável, sem julgar pessoas.
- Identifique uma pequena mudança de rotina que pode ser testada em 7 dias.
- Registre uma evidência simples: ata, combinados, feedback coletivo ou indicador de acompanhamento.

## Perguntas para diário

- O que no sistema de trabalho facilita ou dificulta ${driverName}?
- Que conversa precisa acontecer para reduzir ruído, medo ou retrabalho?
- Qual evidência mostraria que a prática mudou, mesmo que o resultado final ainda esteja amadurecendo?

## Limite responsável

Esta peça é pedagógica. Ela não substitui avaliação técnica, documento de SST, diagnóstico clínico ou revisão de responsável competente.

Gerado em ${today} — Instituto Felicidade para Todos.`;
  }

  return `# Trilha de Implementação — ${driverName}

Documento técnico gerado localmente para orientar uma trilha sintética de aprendizagem, ação e evidências. Use como rascunho operacional sujeito a revisão técnica.

## 1. Objetivo da trilha

Fortalecer ${driverName} como prática organizacional observável, conectando aprendizagem, trabalho real, plano de ação e evidências. A trilha não promete conformidade automática, diagnóstico individual ou causalidade; ela apoia tomada de decisão responsável.

## 2. Hipótese de trabalho

Quando ${driverName} é tratado apenas como conteúdo, a mudança tende a ficar abstrata. Quando ele é conectado a rotinas, papéis, controles, comunicação e evidências, a organização consegue aprender, intervir e reavaliar com mais clareza.

## 3. Público recomendado

- Lideranças diretas que influenciam rotinas, demandas, feedback e prioridades.
- RH, SST e ergonomia que precisam conectar sinais psicossociais ao trabalho real.
- CIPA ou representação de trabalhadores, quando aplicável ao ciclo.
- Equipes impactadas por mudanças, sobrecarga, baixa clareza ou fragilidade de apoio.

## 4. Trilha de 90 dias

### Dias 1 a 15 — Preparar

- Definir unidade, grupo ou processo que será observado.
- Registrar a pergunta-guia: "O que precisa mudar no trabalho real para melhorar ${driverName}?"
- Mapear evidências já disponíveis: pesquisas, atas, entrevistas, indicadores, absenteísmo, rotatividade, demandas e relatos coletivos.
- Nomear responsável, revisor técnico e participantes.

### Dias 16 a 30 — Compreender

- Conduzir escuta coletiva sem expor indivíduos.
- Separar sinais de exposição, sintomas, causas prováveis e controles existentes.
- Identificar 3 causas organizacionais que podem ser testadas com intervenção simples.
- Validar linguagem com trabalhadores para evitar culpa individual ou estigma.

### Dias 31 a 60 — Agir

- Escolher 1 a 3 ações com responsável, prazo e evidência esperada.
- Priorizar mudanças de desenho do trabalho, gestão e comunicação antes de ações puramente individuais.
- Registrar critérios de sucesso e riscos de execução.
- Comunicar o plano em linguagem clara para os grupos envolvidos.

### Dias 61 a 90 — Evidenciar e reavaliar

- Coletar evidências de implementação: atas, fotos permitidas, checklists, comunicações, alterações de rotina e indicadores.
- Revisar aderência das ações com trabalhadores e responsáveis.
- Classificar o que funcionou, o que precisa ajuste e o que deve ser interrompido.
- Preparar recomendação preliminar para o próximo ciclo.

## 5. Métricas sugeridas

- Participação em atividades da trilha, sem ranking individual.
- Evidências de mudança de rotina ou controle implementado.
- Clareza de papéis, prioridades e canais de apoio.
- Indicadores agregados do ciclo quando houver instrumento aprovado e amostra suficiente.
- Acompanhamento de prazos, responsáveis e barreiras removidas.

## 6. Evidências mínimas

- Escopo e responsáveis definidos.
- Registro da escuta coletiva e dos limites de privacidade.
- Plano de ação com responsáveis, prazos e métricas.
- Evidências de implementação.
- Revisão técnica antes de qualquer uso formal em GRO/PGR, relatório ou comunicação institucional.

## 7. Riscos e guardrails

- Não usar a trilha para diagnosticar pessoas.
- Não publicar resultado por grupo sem amostra suficiente e governança de privacidade.
- Não afirmar que questionário substitui AEP, AET, observação do trabalho real ou avaliação técnica.
- Não declarar conformidade, eficácia ou certificação sem evidências e aprovações formais.

## 8. Próxima decisão

Ao final dos 90 dias, decidir entre ampliar a trilha, ajustar controles, aprofundar análise do trabalho real ou encerrar a ação por baixa aderência. A decisão deve ser rastreável e revisável.

Gerado em ${today} — Instituto Felicidade para Todos.`;
}

// This utility is exported for the deterministic PDF contract test; it intentionally shares this module with the UI.
// eslint-disable-next-line react-refresh/only-export-components
export function buildPDF(markdownContent: string, driverName: string, pdfType: PDFType) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 22;
  const marginR = 22;
  const contentW = pageW - marginL - marginR;
  const footerY = pageH - 20;

  const addFooter = (pageNum: number, totalPages: number) => {
    // Teal line
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(0.6);
    doc.line(marginL, footerY - 3, pageW - marginR, footerY - 3);
    
    // Gold accent dot
    doc.setFillColor(...GOLD);
    doc.circle(marginL + 2, footerY - 3, 1.2, "F");
    
    doc.setFontSize(6.5);
    doc.setTextColor(140, 140, 150);
    doc.text(IFT_FOOTER_LINE1, pageW / 2, footerY + 1, { align: "center" });
    doc.text(IFT_FOOTER_LINE2, pageW / 2, footerY + 5, { align: "center" });
    doc.text(IFT_FOOTER_LINE3, pageW / 2, footerY + 9, { align: "center" });
    
    // Page number with pill background
    doc.setFillColor(...LIGHT_BG);
    const pgText = `${pageNum} / ${totalPages}`;
    doc.roundedRect(pageW - marginR - 14, footerY + 6, 14, 5, 2, 2, "F");
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 110);
    doc.text(pgText, pageW - marginR - 7, footerY + 9.5, { align: "center" });
  };

  // ─── COVER PAGE ───
  // Full navy background
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, pageH, "F");

  // Decorative geometric shapes
  doc.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
  doc.setGState(new GState({ opacity: 0.08 }));
  doc.circle(pageW - 30, 40, 60, "F");
  doc.circle(20, pageH - 40, 40, "F");
  doc.setGState(new GState({ opacity: 1 }));

  // Teal accent bar at top
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageW, 4, "F");
  
  // Gold accent line
  doc.setFillColor(...GOLD);
  doc.rect(marginL, 50, 40, 2, "F");

  // Logo
  try {
    doc.addImage(iftLogoFull, "PNG", marginL, 18, 55, 22);
  } catch { /* logo optional */ }

  // Title
  doc.setFontSize(32);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  const titleText = pdfType === "technical" ? "Trilha de Implementação" : "Poesia Pedagógica";
  doc.text(titleText, marginL, 72);

  // Driver name
  doc.setFontSize(20);
  doc.setTextColor(...TEAL);
  doc.text(driverName, marginL, 86);

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(180, 185, 200);
  doc.text("Instituto Felicidade para Todos", marginL, 100);
  doc.text(`Work Wellbeing Playbook 2.0 · ${new Date().toLocaleDateString("pt-BR")}`, marginL, 107);

  // Info box
  doc.setFillColor(35, 42, 60);
  doc.roundedRect(marginL, 125, contentW, 35, 4, 4, "F");
  
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.4);
  doc.line(marginL + 4, 130, marginL + 4, 155);
  
  doc.setFontSize(8.5);
  doc.setTextColor(180, 185, 200);
  const desc = pdfType === "technical"
    ? "Documento pedagógico com trilha de ações, métricas e referências externas em revisão, baseado no Work Wellbeing Playbook 2.0."
    : "Documento de poesia pedagógica com reflexões, práticas culturais e referências externas em revisão, baseado no Work Wellbeing Playbook 2.0.";
  const descLines = doc.splitTextToSize(desc, contentW - 14);
  doc.text(descLines, marginL + 10, 136);

  // Tags at bottom of cover
  doc.setFontSize(7);
  doc.setTextColor(...TEAL);
  const tags = ["Referências em revisão", "12 Drivers", "Aprendizagem", "IA com limites"];
  let tagX = marginL;
  tags.forEach(tag => {
    doc.setFillColor(35, 42, 60);
    const tw = doc.getTextWidth(tag) + 8;
    doc.roundedRect(tagX, 170, tw, 7, 2, 2, "F");
    doc.text(tag, tagX + 4, 174.5);
    tagX += tw + 3;
  });

  addFooter(1, 1);

  // ─── CONTENT PAGES ───
  doc.addPage();
  
  // White background for content pages
  let curY = 28;

  // Content header bar
  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 0, pageW, 18, "F");
  doc.setFontSize(7);
  doc.setTextColor(...TEAL);
  doc.setFont("helvetica", "bold");
  doc.text(driverName.toUpperCase(), marginL, 11);
  doc.setTextColor(140, 140, 150);
  doc.setFont("helvetica", "normal");
  doc.text(pdfType === "technical" ? "TRILHA DE IMPLEMENTAÇÃO" : "POESIA PEDAGÓGICA", pageW - marginR, 11, { align: "right" });

  const addPageHeader = () => {
    doc.setFillColor(...LIGHT_BG);
    doc.rect(0, 0, pageW, 18, "F");
    doc.setFontSize(7);
    doc.setTextColor(...TEAL);
    doc.setFont("helvetica", "bold");
    doc.text(driverName.toUpperCase(), marginL, 11);
    doc.setTextColor(140, 140, 150);
    doc.setFont("helvetica", "normal");
    doc.text(pdfType === "technical" ? "TRILHA DE IMPLEMENTAÇÃO" : "POESIA PEDAGÓGICA", pageW - marginR, 11, { align: "right" });
  };

  const lines = markdownContent.split("\n");

  for (const line of lines) {
    if (curY > footerY - 12) {
      doc.addPage();
      addPageHeader();
      curY = 28;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      curY += 4;
      doc.setFontSize(18);
      doc.setTextColor(...NAVY);
      doc.setFont("helvetica", "bold");
      const text = trimmed.replace(/^#+\s*/, "").replace(/[🎯📋🎭]/gu, "");
      const wrapped = doc.splitTextToSize(text, contentW);
      doc.text(wrapped, marginL, curY);
      curY += wrapped.length * 8;
      // Gold underline
      doc.setFillColor(...GOLD);
      doc.rect(marginL, curY, 30, 1.5, "F");
      curY += 6;
    } else if (trimmed.startsWith("## ")) {
      curY += 3;
      doc.setFontSize(13);
      doc.setTextColor(...TEAL);
      doc.setFont("helvetica", "bold");
      const text = trimmed.replace(/^#+\s*/, "").replace(/(?:📊|🔬|💡|⚠️|📚|🏗️)/gu, "");
      const wrapped = doc.splitTextToSize(text, contentW);
      doc.text(wrapped, marginL, curY);
      curY += wrapped.length * 6.5 + 3;
    } else if (trimmed.startsWith("### ")) {
      curY += 2;
      doc.setFontSize(11);
      doc.setTextColor(...NAVY);
      doc.setFont("helvetica", "bold");
      const wrapped = doc.splitTextToSize(trimmed.replace(/^#+\s*/, ""), contentW);
      doc.text(wrapped, marginL, curY);
      curY += wrapped.length * 5.5 + 2;
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 70);
      doc.setFont("helvetica", "normal");
      const bulletText = trimmed.replace(/^[-*]\s*/, "").replace(/\*\*/g, "");
      const wrapped = doc.splitTextToSize(bulletText, contentW - 10);
      // Teal bullet
      doc.setFillColor(...TEAL);
      doc.roundedRect(marginL, curY - 2.5, 3, 3, 1, 1, "F");
      doc.text(wrapped, marginL + 7, curY);
      curY += wrapped.length * 4.5 + 2;
    } else if (trimmed.startsWith("---")) {
      doc.setDrawColor(230, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginL, curY, pageW - marginR, curY);
      curY += 5;
    } else if (trimmed === "") {
      curY += 3;
    } else {
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 70);
      doc.setFont("helvetica", "normal");
      const cleanText = trimmed.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      const wrapped = doc.splitTextToSize(cleanText, contentW);
      doc.text(wrapped, marginL, curY);
      curY += wrapped.length * 4.5 + 2;
    }
  }

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  return doc;
}

export default function PDFGenerator({ driverName, driverSlug, pdfType, onComplete }: PDFGeneratorProps) {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGenerating) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [content, isGenerating]);

  const generate = async () => {
    setIsGenerating(true);
    setContent("");
    setIsDone(false);
    let soFar = "";

    const applyLocalFallback = () => {
      const generated = buildLocalDocument(driverName, pdfType);
      setContent(generated);
      setIsDone(true);
      onComplete?.(10);
    };

    try {
      const resp = await dataFetch(PDF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ driverName, driverSlug, pdfType }),
      });

      if (!resp.ok || !resp.body) {
        applyLocalFallback();
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, idx);
          textBuffer = textBuffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) {
              soFar += c;
              setContent(soFar);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (!soFar.trim()) {
        applyLocalFallback();
        return;
      }

      setIsDone(true);
      onComplete?.(10);
    } catch (e) {
      console.error("PDF gen error:", e);
      applyLocalFallback();
      return;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPDF = () => {
    const doc = buildPDF(content, driverName, pdfType);
    const filename = `${driverSlug}-${pdfType === "technical" ? "trilha-implementacao" : "poesia-pedagogica"}.pdf`;
    doc.save(filename);
  };

  if (!content && !isGenerating) {
    return (
      <div className="text-center py-12 space-y-5">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6" />
          <div className="relative h-full w-full flex items-center justify-center rounded-3xl bg-card border border-border shadow-card">
            <span className="text-4xl">{pdfType === "technical" ? "📋" : "🎭"}</span>
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">
            {pdfType === "technical" ? "Gerador de Trilha de Implementação" : "Gerador de Poesia Pedagógica"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2">
            {pdfType === "technical"
              ? "Documento técnico (mín. 3 páginas) com trilha, ações de 90 dias, métricas e evidências."
              : "Documento poético inspirado nos grandes poetas, com prática reflexiva e perguntas para diário."}
          </p>
        </div>
        <button
          onClick={generate}
          className="rounded-2xl bg-gradient-hero px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:shadow-lg transition-all flex items-center gap-2 mx-auto hover:scale-[1.02]"
        >
          <Sparkles className="h-4 w-4" />
          Gerar documento
        </button>
        <p className="text-2xs text-muted-foreground">
          Marca: Instituto Felicidade para Todos · +10 IFT
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          {pdfType === "technical" ? "Trilha de Implementação" : "Poesia Pedagógica"} — {driverName}
        </h3>
        <div className="flex gap-2">
          {isDone && (
            <button
              onClick={downloadAsPDF}
              className="text-xs flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-primary font-semibold hover:bg-primary/15 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
          )}
          <button
            onClick={() => { setContent(""); setIsDone(false); }}
            className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground rounded-xl px-3 py-2 hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Novo
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[420px] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-inner-subtle"
      >
        <div className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary [&_a]:underline [&_h1]:font-display [&_h1]:text-lg [&_h2]:font-display [&_h2]:text-base [&_h3]:font-display [&_h3]:text-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {isGenerating && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Gerando documento...
          </div>
        )}
      </div>
    </div>
  );
}

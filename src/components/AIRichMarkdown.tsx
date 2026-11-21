import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Lightbulb, AlertTriangle, CheckCircle2, Info, Quote } from "lucide-react";
import { Children, createContext, isValidElement, useContext } from "react";
import type { ComponentProps, ReactElement, ReactNode } from "react";

/**
 * AIRichMarkdown — apresentação estado-da-arte para conteúdo gerado por IA.
 *
 * Suporta:
 * - GFM (tabelas, checklists, strikethrough)
 * - Tabelas responsivas com header destacado e zebra
 * - Callouts contextuais detectados por prefixo (💡, ⚠️, ✅, ℹ️, "Insight:", "Atenção:" …)
 * - Headings tipográficos com escala consistente
 * - Listas com bullets/numeração customizados
 * - Code inline e blocos com chrome neutro
 * - Blockquotes editoriais
 */
interface AIRichMarkdownProps {
  content: string;
  className?: string;
}

type Variant = "insight" | "warn" | "success" | "info" | "quote";
type MarkdownListKind = "unordered" | "ordered";
type MarkdownCheckboxProps = { type?: string; checked?: boolean };
type MarkdownListItemProps = ComponentProps<"li"> & ExtraProps;

const markdownListKindContext = createContext<MarkdownListKind>("unordered");

function isMarkdownCheckbox(child: ReactNode): child is ReactElement<MarkdownCheckboxProps> {
  return isValidElement<MarkdownCheckboxProps>(child) && child.type === "input" && child.props.type === "checkbox";
}

function MarkdownListItem({ children }: MarkdownListItemProps) {
  const isOrdered = useContext(markdownListKindContext) === "ordered";
  const childNodes = Children.toArray(children);
  const inputChild = childNodes.find(isMarkdownCheckbox);

  if (inputChild) {
    const checked = inputChild.props.checked === true;
    const rest = childNodes.filter((child) => child !== inputChild);
    return (
      <li className="flex items-start gap-2">
        <span className="sr-only">{checked ? "Concluído: " : "Pendente: "}</span>
        <span
          className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
            checked ? "bg-success border-success text-success-foreground" : "border-border bg-background"
          }`}
          aria-hidden="true"
        >
          {checked && <CheckCircle2 className="h-3 w-3" />}
        </span>
        <span className="flex-1">{rest}</span>
      </li>
    );
  }

  if (isOrdered) return <li className="leading-relaxed pl-1">{children}</li>;

  return (
    <li className="flex items-start gap-2 leading-relaxed">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden="true" />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function detectCallout(text: string): { variant: Variant; body: string } | null {
  const trimmed = text.trim();
  const map: Array<{ re: RegExp; variant: Variant }> = [
    { re: /^(?:💡|🧠|✨)\s*/u, variant: "insight" },
    { re: /^(?:⚠️|🚨|❗)\s*/u, variant: "warn" },
    { re: /^(?:✅|🎯|✔️)\s*/u, variant: "success" },
    { re: /^(?:ℹ️|📌|🔎)\s*/u, variant: "info" },
    { re: /^(?:Insight|Dica|Observação)\s*:\s*/i, variant: "insight" },
    { re: /^(?:Atenção|Risco|Cuidado)\s*:\s*/i, variant: "warn" },
    { re: /^(?:Recomendação|Ação|Próximo passo)\s*:\s*/i, variant: "success" },
    { re: /^(?:Nota|Contexto|Referência)\s*:\s*/i, variant: "info" },
  ];
  for (const { re, variant } of map) {
    if (re.test(trimmed)) return { variant, body: trimmed.replace(re, "") };
  }
  return null;
}

function Callout({ variant, children }: { variant: Variant; children: ReactNode }) {
  const styles: Record<Variant, { wrap: string; icon: ReactNode; label: string }> = {
    insight: {
      wrap: "border-secondary/40 bg-secondary/10 text-foreground",
      icon: <Lightbulb className="h-4 w-4 text-secondary" />,
      label: "Insight",
    },
    warn: {
      wrap: "border-destructive/40 bg-destructive/10 text-foreground",
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      label: "Atenção",
    },
    success: {
      wrap: "border-success/40 bg-success/10 text-foreground",
      icon: <CheckCircle2 className="h-4 w-4 text-success" />,
      label: "Recomendação",
    },
    info: {
      wrap: "border-primary/30 bg-primary/5 text-foreground",
      icon: <Info className="h-4 w-4 text-primary" />,
      label: "Nota",
    },
    quote: {
      wrap: "border-border bg-muted/40 text-foreground",
      icon: <Quote className="h-4 w-4 text-muted-foreground" />,
      label: "Citação",
    },
  };
  const s = styles[variant];
  return (
    <div className={`my-3 flex gap-2.5 rounded-xl border px-3 py-2.5 ${s.wrap}`}>
      <div className="mt-0.5 shrink-0">{s.icon}</div>
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}

const components: Components = {
  h1: ({ children }) => <h2 className="font-display text-lg font-bold mt-4 mb-2 text-foreground">{children}</h2>,
  h2: ({ children }) => <h3 className="font-display text-base font-bold mt-3.5 mb-1.5 text-foreground">{children}</h3>,
  h3: ({ children }) => <h4 className="font-display text-sm font-bold mt-3 mb-1 text-foreground/90 uppercase tracking-wide">{children}</h4>,
  p: ({ children }) => {
    // Detecta callout quando o parágrafo começa com prefixo conhecido
    const first = Array.isArray(children) ? children[0] : children;
    if (typeof first === "string") {
      const detected = detectCallout(first);
      if (detected) {
        const rest = Array.isArray(children) ? children.slice(1) : [];
        return <Callout variant={detected.variant}>{[detected.body, ...rest]}</Callout>;
      }
    }
    return <p className="mb-2 text-sm leading-relaxed text-foreground/90">{children}</p>;
  },
  ul: ({ children }) => (
    <markdownListKindContext.Provider value="unordered">
      <ul className="mb-2.5 space-y-1 text-sm pl-0 list-none">{children}</ul>
    </markdownListKindContext.Provider>
  ),
  ol: ({ children }) => (
    <markdownListKindContext.Provider value="ordered">
      <ol className="mb-2.5 space-y-1 text-sm pl-5 list-decimal marker:text-primary marker:font-bold">{children}</ol>
    </markdownListKindContext.Provider>
  ),
  li: MarkdownListItem,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-primary/50 bg-muted/30 pl-3 pr-2 py-2 rounded-r-md italic text-sm text-foreground/85">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
  hr: () => <hr className="my-4 border-border/60" />,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre className="my-3 overflow-x-auto rounded-xl bg-muted/60 border border-border p-3 text-xs leading-relaxed">
          <code className={className}>{children}</code>
        </pre>
      );
    }
    return <code className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono text-foreground">{children}</code>;
  },
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
  tr: ({ children }) => <tr className="even:bg-muted/20">{children}</tr>,
  th: ({ children, style }) => (
    <th
      style={style}
      className="px-3 py-2 text-left font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td style={style} className="px-3 py-2 align-top text-foreground/90">
      {children}
    </td>
  ),
};

export default function AIRichMarkdown({ content, className = "" }: AIRichMarkdownProps) {
  return (
    <div className={`max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

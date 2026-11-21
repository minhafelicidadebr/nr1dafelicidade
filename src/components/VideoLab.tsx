import { useState } from "react";
import { ExternalLink, Play, Languages, ShieldCheck, Quote, ChevronDown, Copy, Check, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoLabProps {
  title: string;
  /** Canonical TED.com URL (full, verified) */
  url?: string;
  /** Optional embed URL (YouTube only — TED iframes are unreliable) */
  embedUrl?: string;
  speaker?: string;
  summary?: string;
  /** Why this talk relates to the driver — neuropedagogical bridge */
  driverIntersection?: string;
  /** Source citation, e.g., "TED2017 · 18 min" */
  sourceMeta?: string;
  /** Source platform: "TED" | "YouTube" */
  source?: "TED" | "YouTube";
}

export default function VideoLab({
  title,
  url,
  embedUrl,
  speaker,
  summary,
  driverIntersection,
  sourceMeta,
  source = "TED",
}: VideoLabProps) {
  const [openSubs, setOpenSubs] = useState(false);
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const canEmbed = Boolean(embedUrl);

  const copyUrl = async () => {
    if (!url && !embedUrl) return;
    await navigator.clipboard.writeText(url || embedUrl || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all"
    >
      {/* Header: thematic gradient + source pill */}
      <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-primary/8 via-card to-card">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                source === "TED"
                  ? "bg-[hsl(0_72%_51%/0.12)] text-[hsl(0_72%_62%)] border border-[hsl(0_72%_51%/0.25)]"
                  : "bg-[hsl(0_72%_51%/0.12)] text-[hsl(0_72%_62%)] border border-[hsl(0_72%_51%/0.25)]"
              }`}
            >
              {source === "TED" ? <Play className="h-2.5 w-2.5 fill-current" /> : <Youtube className="h-3 w-3" />}
              {source}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
              <ShieldCheck className="h-3 w-3" />
              Fonte verificada
            </span>
          </div>
          {sourceMeta && (
            <span className="text-[10px] font-mono text-muted-foreground">{sourceMeta}</span>
          )}
        </div>

        <h4 className="font-display text-base font-bold mt-3 leading-snug text-foreground">
          {title}
        </h4>
        {speaker && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-semibold text-foreground/80">{speaker}</span>
          </p>
        )}
      </div>

      {/* In-app embed: click-to-play poster avoids X-Frame blocks; iframe mounts on demand */}
      {canEmbed && (
        <div className="aspect-video bg-black relative overflow-hidden">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group/play absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
              aria-label={`Reproduzir ${title}`}
            >
              {/* Cinematic gradient poster */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    source === "TED"
                      ? "radial-gradient(ellipse at 30% 30%, hsl(0 72% 35% / 0.55), transparent 60%), radial-gradient(ellipse at 80% 70%, hsl(40 90% 50% / 0.25), transparent 65%), linear-gradient(135deg, #1a0606 0%, #0a0a0a 100%)"
                      : "radial-gradient(ellipse at 30% 30%, hsl(0 72% 40% / 0.45), transparent 60%), linear-gradient(135deg, #1a0a0a 0%, #050505 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative flex flex-col items-center gap-3 z-10 text-center px-6">
                <div className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center shadow-[0_8px_40px_rgba(255,255,255,0.25)] group-hover/play:scale-110 transition-transform">
                  <Play className="h-7 w-7 fill-black text-black ml-1" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-display font-bold text-sm md:text-base leading-tight max-w-md drop-shadow-lg">
                    {title}
                  </p>
                  {speaker && (
                    <p className="text-white/70 text-xs">{speaker}</p>
                  )}
                  <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2">
                    Clique para reproduzir · {source}
                  </p>
                </div>
              </div>
            </button>
          ) : !iframeFailed ? (
            <>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title={title}
                onError={() => setIframeFailed(true)}
              />
              {/* Watchdog: if iframe is blocked silently, user can switch to TED.com */}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-md bg-black/70 backdrop-blur px-2 py-1 text-[10px] font-semibold text-white/90 hover:bg-black/90"
                >
                  Abrir no {source}.com <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/95 p-6 text-center">
              <p className="text-white/90 text-xs">
                Este player não pôde ser carregado no preview.
              </p>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-white/90"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Assistir no {source}.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-5 space-y-4">
        {summary && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            <Quote className="inline h-3 w-3 mr-1 text-primary/60 -mt-0.5" />
            {summary}
          </p>
        )}

        {driverIntersection && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
              Conexão com o driver
            </p>
            <p className="text-xs text-foreground/85 leading-relaxed">{driverIntersection}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Assistir no {source}.com
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            onClick={() => setOpenSubs((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground/80 hover:bg-muted/40 transition-colors"
          >
            <Languages className="h-3.5 w-3.5" />
            Legendas em Português
            <ChevronDown className={`h-3 w-3 transition-transform ${openSubs ? "rotate-180" : ""}`} />
          </button>
          {(url || embedUrl) && (
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground/70 hover:bg-muted/40 transition-colors"
              title="Copiar URL completo"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado" : "Copiar URL"}
            </button>
          )}
        </div>

        {/* Verified URL — displayed in full for transparency */}
        {url && (
          <p className="text-[10px] font-mono text-muted-foreground/70 break-all border-t border-border pt-3">
            🔗 {url}
          </p>
        )}

        {/* PT subtitle guide */}
        <AnimatePresence initial={false}>
          {openSubs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-primary" />
                  Como ativar legendas em Português (PT-BR)
                </p>
                {source === "TED" ? (
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-muted-foreground leading-relaxed">
                    <li>Clique em <strong>Assistir no TED.com</strong> acima.</li>
                    <li>No player, clique no ícone <strong>CC</strong> (legendas) na barra inferior.</li>
                    <li>Selecione <strong>Portuguese, Brazilian</strong> (ou Portuguese).</li>
                    <li>
                      Sem opção PT? Abra <em>Transcript</em> → escolha <strong>Português</strong> no
                      menu de idioma.
                    </li>
                    <li>
                      Alternativa: acrescente <code className="px-1 rounded bg-foreground/10">?language=pt-br</code>{" "}
                      ao final do URL.
                    </li>
                  </ol>
                ) : (
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-muted-foreground leading-relaxed">
                    <li>No player do YouTube, clique no ícone <strong>CC</strong>.</li>
                    <li>
                      Vá em <strong>Configurações ⚙️ → Legendas → Traduzir automaticamente →
                      Português</strong>.
                    </li>
                  </ol>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

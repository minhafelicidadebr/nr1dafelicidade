import { Link } from "@/lib/router/compat";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import type { Driver } from "@/data/driversData";
import { getArgo4DriverHeroSpec } from "@/data/argo4DriverHeroPrompts";

interface DriverCardProps {
  driver: Driver;
  index: number;
}

export default function DriverCard({ driver, index }: DriverCardProps) {
  const Icon = driver.icon;
  const heroSpec = getArgo4DriverHeroSpec(driver.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        to={`/drivers/${driver.slug}`}
        className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
        aria-label={`Explorar driver: ${driver.namePt}`}
      >
        <div
          className={`relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border ${driver.borderClass} bg-card transition-all duration-300 arc-tactile-card card-hover`}
        >
          {/* Top gradient line */}
          <div
            className="absolute top-0 left-0 right-0 z-10 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden="true"
          />

          <div>
            {/* Clean 16:9 Visual Banner */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 border-b border-border/50">
              <img
                src={heroSpec.heroImageUrl}
                alt={`Imagem ilustrativa do tema ${driver.namePt}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                width={640}
                height={360}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
                aria-hidden="true"
              />
              <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2 text-[10px]">
                <span className="text-white/95 font-medium bg-black/55 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-white/15 truncate">
                  {driver.pillarLabelPt ?? "Dimensão de Bem-Estar"}
                </span>
                {driver.isNewInPlaybook2 && (
                  <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground shrink-0">
                    Novo Tema
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 pb-0">
              <div className="relative flex items-start gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${driver.bgClass} ${driver.colorClass} border ${driver.borderClass} transition-all duration-300 group-hover:scale-105`}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-bold tracking-tight truncate group-hover:text-primary transition-colors">
                    {driver.namePt}
                  </h3>
                  <p className="text-2xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {driver.tagline}
                  </p>
                </div>
              </div>

              {driver.playbook2SpotlightPt && (
                <p className="mt-3 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground/85 leading-relaxed line-clamp-2">
                  {driver.playbook2SpotlightPt}
                </p>
              )}
            </div>
          </div>

          <div className="relative p-5 pt-3 mt-4 border-t border-border/40 flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/85"
              aria-hidden="true"
            >
              <Compass className="h-3.5 w-3.5 text-primary/75" />
              Práticas, Quiz, Vídeos & Assistente
            </span>
            <div className="flex items-center gap-1 text-muted-foreground/60 group-hover:text-primary transition-all duration-300 shrink-0">
              <span className="text-2xs font-semibold">Explorar</span>
              <ArrowRight
                className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}



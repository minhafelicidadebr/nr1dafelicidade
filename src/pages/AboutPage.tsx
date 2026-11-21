import { motion } from "framer-motion";
import { ExternalLink, MapPin, Phone, Globe, Instagram, Heart, BookOpen, Shield, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pb-24 md:pb-10">
      {/* Header */}
      <div className="relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 dot-pattern-light opacity-[0.04]" aria-hidden="true" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container relative py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Instituto Felicidade para Todos</h1>
            <p className="text-primary-foreground/50 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
              Promovendo bem-estar no trabalho com ciência, tecnologia e humanidade.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Mission cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Heart, title: "Missão", desc: "Transformar organizações através da ciência do bem-estar" },
              { icon: BookOpen, title: "Base", desc: "Fontes externas rastreáveis e conteúdo sujeito à revisão" },
              { icon: Users, title: "Foco", desc: "Gestores e líderes de organizações inovadoras" },
            ].map((item) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-5 text-center card-hover">
                <item.icon className="h-6 w-6 text-primary mx-auto mb-2" aria-hidden="true" />
                <h3 className="font-display text-sm font-bold">{item.title}</h3>
                <p className="text-2xs text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-elevated">
            <h2 className="font-display text-base font-bold">Contato</h2>
            <div className="space-y-3">
              {[
                { icon: MapPin, content: "Impact HUB Brasília — SGAN 601, Lote H Edifício Íon, Ala Amarela — Asa Norte Brasília/DF" },
                { icon: Phone, content: "(61) 3550-8779" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href="https://www.felicidadeparatodos.com.br" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  felicidadeparatodos.com.br <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href="https://instagram.com/felicidadeparatodosbr" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  @felicidadeparatodosbr <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-accent/30 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="font-display text-sm font-bold">Aviso de Privacidade</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Evite inserir dados pessoais sensíveis. A plataforma foi desenhada para aprendizagem e implementação 
              organizacional (não clínica). Sem ranking individual. Progresso visível apenas para o próprio usuário. 
              Conformidade LGPD.
            </p>
          </motion.div>

          <p className="text-center text-xs text-muted-foreground">
            © 2025 Instituto Felicidade para Todos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

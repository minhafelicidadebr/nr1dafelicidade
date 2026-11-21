import iftLogoFullLocal from "@/assets/ift-logo-full.png";
import iftLogoIconLocal from "@/assets/ift-logo-icon.png";

/**
 * Repositório Canônico de Ativos de Marca — Instituto Felicidade para Todos (IFT)
 * Guarda as URLs oficiais fornecidas pela instituição e os fallbacks locais empacotados
 * para aplicação consistente nos modos Claro (Solar Harmony) e Escuro (Obsidian).
 */
export const IFT_BRAND_ASSETS = {
  institutionName: "Instituto Felicidade para Todos",
  officialHorizontalLogoUrl: "https://felicidadeparatodos.com.br/assets/logo-horizontal-DkxgTxXi.png",
  officialFullLogoUrl: "https://felicidadeparatodos.com.br/assets/logo-full-BcruAUmu.png",
  localFullLogoUrl: iftLogoFullLocal,
  localIconLogoUrl: iftLogoIconLocal,
} as const;

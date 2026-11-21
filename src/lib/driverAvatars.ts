import avatarLiderClaraCutout from "@/assets/images/lider_clara_cutout_avatar_1795101615153.jpg";

export const driverAvatars: Record<string, string> = {
  management: avatarLiderClaraCutout,
  trust: avatarLiderClaraCutout,
  stress: avatarLiderClaraCutout,
  support: avatarLiderClaraCutout,
  energy: avatarLiderClaraCutout,
  inclusion_belonging: avatarLiderClaraCutout,
  compensation: avatarLiderClaraCutout,
  flexibility: avatarLiderClaraCutout,
  learning: avatarLiderClaraCutout,
  purpose: avatarLiderClaraCutout,
  appreciation: avatarLiderClaraCutout,
  achievement: avatarLiderClaraCutout,
  job_security: avatarLiderClaraCutout,
  employee_voice: avatarLiderClaraCutout,
  autonomy: avatarLiderClaraCutout,
  workload_pressures: avatarLiderClaraCutout,
};

export function getDriverAvatar(slug: string): string {
  return driverAvatars[slug] ?? avatarLiderClaraCutout;
}



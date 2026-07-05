export interface User {
  id: string;
  discord_id: string;
  username: string;
  avatar: string | null;
  role: string;
  created_at: string;
}

export interface Server {
  id: string;
  guild_id: string;
  guild_name: string;
  guild_icon: string | null;
  created_at: string;
}

export interface VerificationConfig {
  id: string;
  guild_id: string;
  verified_role_id: string | null;
  webhook_url: string | null;
  embed_title: string;
  embed_description: string;
  embed_color: number;
  embed_footer: string;
  button_label: string;
  button_style: "Success" | "Primary" | "Danger" | "Secondary";
  success_message: string;
  log_verified: boolean;
  log_joined: boolean;
  log_left: boolean;
  log_errors: boolean;
  updated_at: string;
}

export interface EmbedTemplate {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  color: number;
  footer: string | null;
  author: string | null;
  thumbnail: string | null;
  image_url: string | null;
  created_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  live_url: string | null;
  category: string;
  stars: number;
  featured: boolean;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_num: number;
  user_id: string | null;
  username: string | null;
  guild_id: string | null;
  subject: string;
  content: string | null;
  status: "open" | "progress" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export interface VerificationEvent {
  id: string;
  guild_id: string | null;
  user_id: string | null;
  event_type: string;
  created_at: string;
}

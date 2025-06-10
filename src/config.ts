export interface SiteConfig {
  title: string;
  description: string;
  author: {
    name: string;
    bio: string;
    avatar?: string;
  };
  social: {
    github?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
  siteUrl: string;
}

export const config: SiteConfig = {
  title: "Volks-Typo",
  description: "A blog exploring the intersection of design, typography, and history",
  author: {
    name: "Your Name",
    bio: "Writer, designer, and explorer of aesthetic tensions between past and present."
  },
  social: {
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    email: "your.email@example.com"
  },
  siteUrl: "https://volks-typo.example.com"
};

export const SITE_TITLE = config.title;
export const SITE_DESCRIPTION = config.description;
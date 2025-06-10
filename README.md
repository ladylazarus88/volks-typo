# Volks-Typo

A distinctive Astro blog theme that explores the aesthetic tension between Bauhaus modernism and WW2-era monumental design. This theme creates a "dissonant harmony" that is visually striking, functional, and conceptually rich.

## 🚀 Demo

[View Live Demo](https://jdrhyne.github.io/volks-typo)

![Volks-Typo Theme Preview](public/preview.png) <!-- Add screenshot later -->

## ✨ Features

- **Unique Aesthetic**: Combines Bauhaus functionalism with monumental design elements
- **Responsive Layout**: Mobile-first design with elegant desktop two-column layout
- **Search Functionality**: Built-in client-side search for blog posts
- **Category System**: Organize content with tags and categories
- **Typography Focus**: Carefully curated typefaces including Cormorant Garamond, Playfair Display, and Inter
- **Markdown Support**: Write content in Markdown with full syntax highlighting
- **SEO Optimized**: Built with performance and search engines in mind
- **Social Links**: Configurable social media integration
- **Dark Mode Ready**: CSS variables for easy theming (future enhancement)

## 🎨 Design Philosophy

This theme explores the intersection of two powerful design movements:

- **Bauhaus Modernism**: Clean lines, functional layouts, and minimalist aesthetics
- **Monumental Design**: Bold typography, dramatic scale, and commanding presence

The result is a blog theme that feels both timeless and provocative, perfect for writers who want their content to make a statement.

## 📦 Installation

### Prerequisites

- Node.js 18.14.1 or higher
- npm or yarn

### Quick Start

1. Clone this repository:
```bash
git clone https://github.com/jdrhyne/volks-typo.git
cd volks-typo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Using as a Template

You can also use this theme as a template for your own blog:

```bash
# Using npm
npm create astro@latest -- --template jdrhyne/volks-typo

# Using yarn
yarn create astro --template jdrhyne/volks-typo

# Using pnpm
pnpm create astro -- --template jdrhyne/volks-typo
```

## 🛠️ Configuration

### Site Configuration

Edit `src/config.ts` to customize your site:

```typescript
export const SITE = {
  title: "Your Blog Title",
  description: "Your blog description",
  defaultLanguage: "en_US",
};

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/jdrhyne",
    linkTitle: `Follow on Github`,
    active: true,
  },
  // Add more social links...
];
```

### Color Customization

The theme uses CSS variables for easy color customization. Edit `src/styles/global.css`:

```css
:root {
  --color-parchment: #f0e9d6;
  --color-charcoal: #2c2c2c;
  --color-muted-red: #c13127;
  --color-deep-blue: #005a8d;
  --color-ochre: #e8a100;
  --color-blood-red: #8b0000;
  --color-stone-beige: #d4c8a0;
  --color-steel-gray: #3d3d3d;
}
```

## 📝 Writing Content

### Creating Blog Posts

Blog posts are stored in `src/content/blog/`. Create a new `.md` file:

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
pubDate: 2024-01-15
author: "Jonathan D. Rhyne"
categories: ["Design", "Typography"]
image:
  url: "/path/to/image.jpg"
  alt: "Image description"
---

Your content here...
```

### Frontmatter Options

- `title` (required): Post title
- `description` (required): Brief description for SEO and previews
- `pubDate` (required): Publication date
- `author` (optional): Author name
- `categories` (optional): Array of category names
- `image` (optional): Featured image with URL and alt text
- `draft` (optional): Set to `true` to hide from production

## 🏗️ Project Structure

```
volks-typo/
├── public/
│   ├── favicon.svg
│   └── site-title.svg
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Layout.astro
│   │   └── Sidebar.astro
│   ├── content/
│   │   └── blog/
│   │       └── *.md
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog.astro
│   │   ├── about.astro
│   │   ├── categories.astro
│   │   └── blog/[...slug].astro
│   ├── styles/
│   │   └── global.css
│   └── config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🧞 Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:3001` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run check` | Check TypeScript |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## 🚀 Deployment

This theme can be deployed to any static hosting service:

### Netlify

1. Push your code to GitHub
2. Import your repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

```bash
npm i -g vercel
vercel
```

### GitHub Pages

1. Update `astro.config.mjs` with your repository name:
```javascript
export default defineConfig({
  site: 'https://jdrhyne.github.io',
  base: '/volks-typo',
})
```

2. Deploy using GitHub Actions (see `.github/workflows/deploy.yml`)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Bauhaus design movement and modernist typography
- Built with [Astro](https://astro.build)
- Typography from [Fontsource](https://fontsource.org/)
- Development assistance from [Claude Code](https://claude.ai/code) by Anthropic

## 📞 Support

- Create an [issue](https://github.com/jdrhyne/volks-typo/issues) for bug reports
- Start a [discussion](https://github.com/jdrhyne/volks-typo/discussions) for feature requests
- Follow updates on [Twitter](https://twitter.com/jdrhyne)

---

Made with ❤️ by [Jonathan D. Rhyne](https://github.com/jdrhyne)
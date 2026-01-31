# Motion Designer Portfolio

A stunning, interactive portfolio website with animated sky background, 3D clouds, and smooth scroll transitions.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Customizing Your Portfolio

### 1. Update Your Projects

Edit `src/data/projects.js`:

```js
export const projects = [
  {
    id: 1,
    title: "Your Project Title",
    category: "lottie",           // "lottie" or "video"
    description: "Project description here...",
    thumbnail: "/assets/images/project1.jpg",  // or external URL
    tags: ["Lottie", "After Effects", "Mobile"],
    year: "2024",
    client: "Client Name"
  },
  // Add more projects...
];
```

### 2. Add Your Images

Place images in `src/assets/` or `public/assets/`:

```
public/
├── assets/
│   ├── images/
│   │   ├── project1.jpg
│   │   ├── project2.jpg
│   │   └── profile.jpg
│   ├── videos/
│   │   └── showreel.mp4
│   └── lotties/
│       └── animation.json
```

Reference them in your code:
- Files in `public/`: Use `/assets/images/project1.jpg`
- External URLs: Use full URL like `https://example.com/image.jpg`

### 3. Add Lottie Animations

1. Export your animation as JSON from After Effects using Bodymovin
2. Place the JSON file in `public/assets/lotties/`
3. Import and use in components:

```jsx
import Lottie from 'lottie-react';
import myAnimation from '/assets/lotties/animation.json';

<Lottie animationData={myAnimation} loop={true} />
```

### 4. Update Skills & Tools

Edit `src/data/projects.js`:

```js
export const skills = [
  { name: "After Effects", level: 95 },  // level: 0-100
  { name: "Lottie", level: 90 },
  // Add your skills...
];

export const tools = [
  "After Effects",
  "Lottie",
  "Cinema 4D",
  // Add your tools...
];
```

### 5. Update Personal Info

Edit `src/App.jsx` and find these sections:

**Hero Section (around line 410):**
```jsx
<motion.div className="hero-badge">
  🎬 Your Title Here
</motion.div>
```

**About Section (around line 618):**
```jsx
<div className="about-text">
  <h2>Hey there! 👋</h2>
  <p>Your bio here...</p>
</div>
```

**Contact Section (around line 740):**
- Update social links
- Change email placeholder

### 6. Customize Colors

Edit `src/index.css` root variables:

```css
:root {
  --pink-accent: #FF6B9D;
  --purple-accent: #A855F7;
  --blue-accent: #3B82F6;
  --green-accent: #10B981;
  /* Add your brand colors */
}
```

### 7. Customize Sky Colors

Edit `src/App.jsx` around line 350 to change the sky gradient:

```jsx
[
  'linear-gradient(180deg, #87CEEB 0%, #B0E2FF 30%, ...)',  // Sunrise
  'linear-gradient(180deg, #7EC8E3 0%, #98D1F5 30%, ...)',  // Morning
  'linear-gradient(180deg, #FF9A56 0%, #FF7F50 30%, ...)',  // Sunset
  'linear-gradient(180deg, #2C1654 0%, #4A1942 30%, ...)'   // Night
]
```

## File Structure

```
portfolio/
├── public/
│   └── assets/           # Static assets (images, videos, lotties)
├── src/
│   ├── App.jsx           # Main component with all sections
│   ├── App.css           # All styles
│   ├── index.css         # Global styles & variables
│   ├── data/
│   │   └── projects.js   # Your projects, skills, tools data
│   └── assets/           # Assets imported in code
├── index.html
├── package.json
└── vite.config.js
```

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Deploy to Netlify, Vercel, or any static host.

## Tips

- **Images:** Use 16:9 aspect ratio for project thumbnails (600x400px minimum)
- **Lottie files:** Keep file size under 500KB for smooth performance
- **Videos:** Use MP4 format, compress for web
- **Performance:** Lazy load images for better performance

## Tech Stack

- React + Vite
- Framer Motion (animations)
- lottie-react (Lottie animations)
- CSS Modules

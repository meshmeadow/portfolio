// Featured project - Bistro by Blinkit Campaign Animations
export const featuredProject = {
  id: 1,
  title: "Bistro by Blinkit",
  category: "motion",
  description: "the whole motion universe — from scratch. loaders, celebrations, campaigns, vibes.",
  client: "Bistro by Blinkit",
  year: "2024-25",
  tags: ["motion identity", "campaigns", "in-app"],
  animations: [
    {
      id: 'anim-1',
      title: "Flavours of Punjab",
      video: "/videos/flavours-punjab.mp4",
    },
    {
      id: 'anim-2',
      title: "T20 World Cup",
      video: "/videos/t20-world-cup.mp4",
    },
    {
      id: 'anim-3',
      title: "Onam",
      video: "/videos/onam.mp4",
    },
    {
      id: 'anim-4',
      title: "Republic Day",
      video: "/videos/republic-day.mp4",
    },
  ]
};

// UI Micro-interactions Project
export const uiMicroInteractions = {
  id: 2,
  title: "UI Micro-interactions",
  category: "lottie",
  description: "buttons, cards, and tiny delights that make the app feel alive.",
  client: "Bistro by Blinkit",
  year: "2024-25",
  tags: ["micro-interactions", "ui motion", "lottie"],
  thumbnail: "/images/ui-micro-thumb.jpg", // Add your thumbnail
  animations: [
    {
      id: 'ui-1',
      title: "Button Animations",
      video: "/videos/button-animations.mp4", // Replace with your file
    },
    {
      id: 'ui-2',
      title: "Card Interactions",
      video: "/videos/card-interactions.mp4", // Replace with your file
    },
    // Add more as needed
  ]
};

export const projects = [
  featuredProject,
  uiMicroInteractions,
];

export const skills = [
  { name: "2D Animation", level: 95 },
  { name: "3D Animation", level: 88 },
  { name: "Motion Graphics", level: 92 },
  { name: "Visual Design", level: 85 },
  { name: "Video Editing", level: 82 },
  { name: "Graphic Design", level: 80 }
];

export const tools = [
  "After Effects",
  "Blender",
  "Cinema 4D",
  "Premiere Pro",
  "Illustrator",
  "Photoshop",
  "Figma",
  "Lottie"
];

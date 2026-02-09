// config.js - Centralized configuration for Meraki Studios website

const SITE_CONFIG = {
  // Studio Details (shown in main section)

  serviceFeePercentage: 0.1,

  studioDetails: [
    {
      title: "Our Origin",
      description:
        "Meraki Studios began as a group of friends, each with a unique talent. We decided to unite our skills into a single studio, creating a space where we could collaborate and bring our most ambitious projects to life.",
    },
    {
      title: "Our Philosophy",
      description:
        "The name 'Meraki' is a Greek word that means to pour your soul, creativity, and love into your work. It's our promise that every project is crafted with deep passion and a personal touch.",
    },
    {
      title: "Our Mission",
      description:
        "Our goal is to continuously grow and expand our creative horizons. From software and games to music and animation, we aim to build extraordinary projects that showcase what we're truly capable of.",
    },
  ],

  // Projects
  projects: [
    {
      id: "worldchatter",
      title: "WorldChatter",
      shortDescription:
        "A complete chat overhaul plugin that makes server communication smooth and easy.",
      fullDescription:
        "A complete chat overhaul plugin that makes server communication smooth and easy. It includes features like anti-swear filters, ad-blocking, and fully customizable chat channels—giving you full control over how players interact.",
      tags: ["minecraft", "tool"],
      image: "images/wclogo.png",
      pageUrl: "projects/worldchatter.html",
      youtubeId: "O95rzhgVSZI",
      galleryImages: [],
      links: [
        {
          text: "View on Modrinth",
          url: "https://modrinth.com/plugin/worldchatter",
          style: "background: #1fdf90; color: var(--bg-dark);",
        },
      ],
      features: [
        {
          icon: "fa-solid fa-filter",
          title: "Anti-Swear Filter",
          description:
            "Automatically filter inappropriate language from chat messages.",
        },
        {
          icon: "fa-solid fa-ban",
          title: "Ad-Blocking",
          description:
            "Block advertisement messages and spam from your server chat.",
        },
        {
          icon: "fa-solid fa-comments",
          title: "Custom Channels",
          description:
            "Create and manage fully customizable chat channels for your community.",
        },
        {
          icon: "fa-solid fa-sliders",
          title: "Full Control",
          description:
            "Fine-tune every aspect of how players communicate on your server.",
        },
      ],
      theme: {
        background: "#2bf19b2c",
        borderColor: "#2bf19b",
        titleColor: "#2bf19b",
        buttonBg: "#1fdf90",
        buttonColor: "var(--bg-dark)",
        buttonHoverShadow: "#1fdf90",
      },
    },
    {
      id: "hibernation",
      title: "MC - Hibernation System",
      shortDescription:
        "The ultimate power-saving solution for Minecraft servers.",
      fullDescription:
        "MC - Hibernation System is the ultimate power-saving solution for Minecraft servers. Automatically put your server on sleep mode when it's empty and bring it back online the moment a player connects – all while using barely any RAM or CPU.",
      tags: ["minecraft", "tool"],
      image: "images/hibernation.png",
      pageUrl: "projects/hibernation.html",
      youtubeId: "",
      galleryImages: ["images/bannerhibernation.png"],
      links: [
        {
          text: "View on sourceXchange (Java)",
          url: "https://www.sourcexchange.net/products/minecraft-java-hibernation-system",
          style: "background: #b1b1b1; color: var(--bg-dark);",
        },
        {
          text: "View on sourceXchange (Bedrock)",
          url: "https://www.sourcexchange.net/products/minecraft-bedrock-hibernation-system",
          style: "background: #b1b1b1; color: var(--bg-dark);",
        },
      ],
      features: [
        {
          icon: "fa-solid fa-moon",
          title: "Auto Sleep Mode",
          description:
            "Server automatically enters hibernation when no players are online.",
        },
        {
          icon: "fa-solid fa-bolt",
          title: "Instant Wake-Up",
          description:
            "Bring your server back online the moment a player connects.",
        },
        {
          icon: "fa-solid fa-microchip",
          title: "Minimal Resources",
          description: "Uses barely any RAM or CPU while in hibernation mode.",
        },
        {
          icon: "fa-solid fa-server",
          title: "Multi-Platform",
          description:
            "Available for both Java and Bedrock Minecraft server editions.",
        },
      ],
      theme: {
        background: "#e7e7e72c",
        borderColor: "#e7e7e7",
        titleColor: "#ffffff",
        buttonBg: "#b1b1b1",
        buttonColor: "var(--bg-dark)",
        buttonHoverShadow: "#b1b1b1",
      },
    },
    {
      id: "geminicraft",
      title: "GeminiCraft",
      shortDescription:
        "Bring Google's powerful Gemini AI straight into your Minecraft server!",
      fullDescription:
        "Bring Google's powerful Gemini AI straight into your Minecraft server! Let your players chat with a cutting-edge AI assistant directly through in-game chat. The setup is simple, and it offers a unique, interactive experience for any community.",
      tags: ["minecraft", "tool"],
      image: "images/gclogo.png",
      pageUrl: "projects/geminicraft.html",
      youtubeId: "F-xHKUArMv4",
      galleryImages: [],
      links: [
        {
          text: "View on Modrinth",
          url: "https://modrinth.com/plugin/geminicraft",
          style: "background: #8ab4f8; color: var(--bg-dark);",
        },
      ],
      features: [
        {
          icon: "fa-solid fa-robot",
          title: "AI-Powered Chat",
          description:
            "Let players interact with Google's Gemini AI directly in-game.",
        },
        {
          icon: "fa-solid fa-gear",
          title: "Simple Setup",
          description:
            "Quick and easy configuration to get your AI assistant running.",
        },
        {
          icon: "fa-solid fa-users",
          title: "Community Experience",
          description:
            "Create a unique, interactive experience for your entire community.",
        },
        {
          icon: "fa-solid fa-message",
          title: "In-Game Integration",
          description:
            "Seamless integration with Minecraft's native chat system.",
        },
      ],
      theme: {
        background: "#8ab4f82c",
        borderColor: "#8ab4f8",
        titleColor: "#8ab4f8",
        buttonBg: "#8ab4f8",
        buttonColor: "var(--bg-dark)",
        buttonHoverShadow: "#8ab4f8",
      },
    },
    {
      id: "pebbleantivpn",
      title: "PebbleAntiVPN",
      shortDescription:
        "A powerful, free anti-VPN tool built to protect your server.",
      fullDescription:
        "A powerful, free anti-VPN tool built to protect your server. It blocks connections from proxies and VPNs, and even lets you restrict access by country. Our API is fast, reliable, and easy to integrate, ensuring your server remains safe from malicious actors.",
      tags: ["website", "tool", "minecraft"],
      image: "images/pavbg.png",
      pageUrl: "projects/pebbleantivpn.html",
      youtubeId: "",
      galleryImages: ["images/pavbg.png"],
      links: [
        {
          text: "Visit Website",
          url: "https://pav.merakistudios.dev/",
          style: "background: #f3732f; color: var(--text-color);",
        },
      ],
      features: [
        {
          icon: "fa-solid fa-shield-halved",
          title: "VPN & Proxy Blocking",
          description:
            "Block connections from proxies and VPNs to protect your server.",
        },
        {
          icon: "fa-solid fa-earth-americas",
          title: "Country Restriction",
          description:
            "Restrict access by country for additional security control.",
        },
        {
          icon: "fa-solid fa-gauge-high",
          title: "Fast API",
          description: "Lightning-fast, reliable API for seamless integration.",
        },
        {
          icon: "fa-solid fa-lock",
          title: "Free & Open",
          description:
            "A powerful security tool that's completely free to use.",
        },
      ],
      theme: {
        background: "#f3732f2c",
        borderColor: "#f3732f",
        titleColor: "#f3732f",
        buttonBg: "#f3732f",
        buttonColor: "var(--text-color)",
        buttonHoverShadow: "#f3732f",
      },
    },
    {
      id: "liars-table",
      title: "Liar's Table",
      shortDescription:
        "A one-of-a-kind multiplayer card game crafted entirely within Minecraft.",
      fullDescription:
        "A one-of-a-kind multiplayer card game crafted entirely within Minecraft. Engage in a high-stakes battle of wits, bluffs, and bold moves, all powered by creative gameplay design. This project is currently in active development, and we're excited to share more soon!",
      tags: ["game", "minecraft"],
      image: null,
      icon: "fa-solid fa-user-secret",
      iconBackground: "#2b0003",
      pageUrl: "projects/liars-table.html",
      youtubeId: "lQrCyVOHZhk",
      galleryImages: [],
      links: [
        {
          text: "Coming Soon",
          url: "#",
          style: "background: #e50914; color: var(--text-color);",
        },
      ],
      features: [
        {
          icon: "fa-solid fa-masks-theater",
          title: "Bluff & Deceive",
          description:
            "Outsmart your opponents with strategic bluffs and bold moves.",
        },
        {
          icon: "fa-solid fa-users-rectangle",
          title: "Multiplayer",
          description:
            "Play with friends in intense multiplayer card game sessions.",
        },
        {
          icon: "fa-solid fa-cube",
          title: "Built in Minecraft",
          description:
            "Entirely crafted within Minecraft using creative gameplay design.",
        },
        {
          icon: "fa-solid fa-trophy",
          title: "High-Stakes",
          description:
            "Engage in thrilling battles of wits with real consequences.",
        },
      ],
      theme: {
        background: "#e509142c",
        borderColor: "#000000",
        titleColor: "#e50914",
        buttonBg: "#e50914",
        buttonColor: "var(--text-color)",
        buttonHoverShadow: "#e50914",
      },
    },
    {
      id: "polyact",
      title: "PolyAct",
      shortDescription:
        "An educational platform ensuring quality education across the globe.",
      fullDescription:
        "PolyAct is an educational platform available on both mobile and web browsers. Our mission is to ensure quality education across the globe by focusing on both hard skills and soft skills. PolyAct combines expert-led courses, direct support from verified course masters, an AI-powered chatbot for accessibility, and strong AI + human moderation for safety — creating a trusted learning environment for all ages.",
      tags: ["tool", "sdg", "software"],
      image: "images/polyact.png",
      pageUrl: "projects/polyact.html",
      youtubeId: "",
      galleryImages: [],
      links: [
        {
          text: "Coming Soon",
          url: "#",
          style: "background: #361A5D; color: #ffffff;",
        },
      ],
      features: [
        {
          icon: "fa-solid fa-chalkboard-user",
          title: "Expert Course Masters",
          description:
            "Learn from verified experts who create high-quality courses and provide direct guidance.",
        },
        {
          icon: "fa-solid fa-robot",
          title: "AI-Powered Chatbot",
          description:
            "Free AI assistant for all users, ensuring learning remains accessible to everyone.",
        },
        {
          icon: "fa-solid fa-shield-halved",
          title: "Safety & Moderation",
          description:
            "Dual AI + human moderation system to ensure a secure, trustworthy learning environment.",
        },
        {
          icon: "fa-solid fa-mobile-screen-button",
          title: "Multi-Platform",
          description:
            "Available on both mobile phones and web browsers for learning anywhere.",
        },
        {
          icon: "fa-solid fa-brain",
          title: "Hard & Soft Skills",
          description:
            "Comprehensive courses covering both technical skills and communication abilities.",
        },
        {
          icon: "fa-solid fa-globe",
          title: "Global Accessibility",
          description:
            "Quality education designed to reach learners of all ages and backgrounds worldwide.",
        },
      ],
      theme: {
        background: "#361A5D2c",
        borderColor: "#274185",
        titleColor: "#7c5cbf",
        buttonBg: "#361A5D",
        buttonColor: "#ffffff",
        buttonHoverShadow: "#361A5D",
      },
    },
  ],

  // Team Members
  team: [
    {
      name: "Abdelaziz Hasaneen",
      role: "Co-Founder of Meraki Studios",
      bio: '"Loves Java so much he dreams in stack traces." says he',
      image: "images/abdelazizpic.jpg",
      note: "A Java enthusiast.",
      social: [
        {
          platform: "github",
          url: "https://github.com/Abdelaziz1586",
          icon: "fab fa-github",
        },
        {
          platform: "portfolio",
          url: "https://abdelaziz1586.github.io/#projects",
          icon: "fa-solid fa-globe",
        },
      ],
    },
    {
      name: "Omar Mohamed",
      role: "Founder of Meraki Studios",
      bio: "I'm proud to have founded Meraki Studios, a hub for creativity that began as a dream between friends. Our name, 'Meraki', means to put your soul into your work, and that is our promise.",
      image: "images/omarpic.png",
      note: "Unreal Gamedev, Video Editor, and UI Designer",
      social: [
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/omardotcontent/",
          icon: "fab fa-linkedin",
        },
        {
          platform: "youtube",
          url: "https://www.youtube.com/@OmarDotContent",
          icon: "fab fa-youtube",
        },
        {
          platform: "github",
          url: "https://github.com/omardotcontent",
          icon: "fab fa-github",
        },
      ],
    },
    {
      name: "Ghost",
      role: "Founder of Meraki Studios",
      bio: "Mixing pixels and beats since deadlines became a personality trait.",
      image: "images/ghostpic.jpg",
      note: "A Music Producer", // Added note
      social: [
        {
          platform: "github",
          url: "https://github.com/ZeyadYasser114",
          icon: "fab fa-github",
        },
        {
          platform: "youtube",
          url: "https://www.youtube.com/@ghostmate114",
          icon: "fab fa-youtube",
        },
      ],
    },
    {
      name: "Saphielle",
      role: "Unity Game Developer & Digital Artist",
      bio: '"A Game Developer is a flex."',
      image: "images/saphiellepic.jpg",
      social: [
        {
          platform: "instagram",
          url: "https://www.instagram.com/saphiellecodes/",
          icon: "fab fa-instagram",
        },
        {
          platform: "tiktok",
          url: "https://www.tiktok.com/@saphiellecodes",
          icon: "fab fa-tiktok",
        },
      ],
    },
    {
      name: "Amezz",
      role: "Designer / Story Prod.",
      bio: "I draw things.",
      image: "images/amezzpic.jpg",
      social: [],
    },
    {
      name: "Yacu",
      role: "3D & 2D Artist",
      bio: '"It can never be perfect, but it can always be better"',
      image: "images/Yacupfp.png",
      social: [],
    },
    {
      name: "Himari",
      role: "Visual Artist (Traditional + Digital)",
      bio: "No artist tolerates reality.",
      image: "images/himaripic.jpg",
      note: "Specialized in Traditional Art", // Added note
      social: [],
    },
    {
      name: "Youssef7Y",
      role: "Story Producer",
      bio: "I may not have a specific profession, but I'm good at what i know",
      image: "images/yosifepic.png",
      social: [
        {
          platform: "upwork",
          url: "https://www.upwork.com/fre freelancers/~0124d7b34148cbd8e0",
          icon: "fa-brands fa-upwork",
        },
      ],
    },
  ],

  services: [
    {
      name: "Minecraft Plugin Development",
      description:
        "Customized Java plugins for BungeeCord, Paper, or Spigot servers. We create everything according to your server's requirements, from basic tools to complex gameplay mechanics.",
      image: "images/services/minecraft.png",
      tags: [
        "Java",
        "Development",
        "Minecraft",
        "Spigot",
        "Paper",
        "BungeeCord",
      ],
      availableMembers: ["Abdelaziz Hasaneen", "Omar Mohamed"],
      isAvailable: true,
      price: {
        model: "dynamic", // Price varies based on complexity
        type: "fixed",
        minValue: 120,
      },
    },
    {
      name: "Custom Discord Bot",
      description:
        "Use a custom Discord bot to interact with your community. With a variety of features, we can develop utility bots, game integration bots, moderation bots, and more.",
      image: "images/services/discord.png",
      tags: ["Java", "Discord"],
      availableMembers: ["Abdelaziz Hasaneen", "Omar Mohamed"],
      isAvailable: true,
      price: {
        model: "dynamic", // Price varies based on complexity
        type: "fixed",
        minValue: 60,
      },
    },
    {
      name: "Digital/Traditional Art",
      description:
        "With a unique work of art from our creative studio, realize your vision. Our areas of expertise include producing tangible, traditional artworks as well as excellent digital illustrations.",
      image: "images/services/art.png",
      tags: ["Art", "Design"],
      availableMembers: ["Amezz", "Himari"],
      isAvailable: true,
      price: {
        model: "dynamic", // The price is exact
        type: "fixed", // It's a one-time product cost
        minValue: 50, // The exact cost is 50
      },
    },
    {
      name: "Games.",
      description:
        "We create worlds, not just games. Our studio is a collection of imaginative minds dedicated to creating original adventures, resolving intriguing riddles, and crafting unforgettable tales. Our goal is to produce top-notch games that inspire, challenge, and engage players worldwide.",
      image: "images/services/games.png",
      tags: ["Game Design", "Unity", "Unreal Engine", "Art", "Music"],
      availableMembers: [
        "Amezz",
        "Ghost",
        "Himari",
        "Omar Mohamed",
        "Saphielle",
      ],
      isAvailable: true,
      price: {
        model: "dynamic", // Price varies based on the project
        type: "per_week",
        minValue: 1000,
      },
    },
    {
      name: "Video Editing",
      description:
        "Excellent video editing for any project, including short films, promotional videos, social media clips, and YouTube content.",
      image: "images/services/videos.png",
      tags: [
        "Video Editing",
        "Premiere Pro",
        "Post-Production",
        "Content Creation",
        "Graphic Design",
        "Typography",
      ],
      availableMembers: ["Omar Mohamed"],
      isAvailable: true,
      price: {
        model: "dynamic", // Price varies based on complexity
        type: "fixed", // It's an hourly rate
        minValue: 250,
      },
    },
  ],

  // Project Filter Categories
  filterCategories: [
    { id: "all", label: "Show All" },
    { id: "minecraft", label: "Minecraft" },
    { id: "game", label: "Game" },
    { id: "website", label: "Website" },
    { id: "tool", label: "Tool" },
    { id: "sdg", label: "SDG" },
    { id: "software", label: "Software" },
  ],

  // Footer Configuration
  footer: {
    platforms: [
      {
        name: "Modrinth",
        url: "https://modrinth.com/organization/MerakiStudios",
        logo: "images/modrinth.png",
      },
      {
        name: "SourceXchange",
        url: "https://www.sourcexchange.net/teams/6157/profile",
        logo: "images/sourcexchange.png",
      },
    ],
    contact: {
      email: "contact@merakistudios.dev",
    },
    copyright: "© 2026 Meraki Studios. All Rights Reserved.",
  },

  // Header Social Links
  headerSocial: [
    {
      platform: "TikTok",
      url: "https://www.merakistudios.dev/tiktok",
      icon: "fab fa-tiktok",
    },
    {
      platform: "GitHub",
      url: "https://github.com/MerakiDotStudios",
      icon: "fab fa-github",
    },
    {
      platform: "Discord",
      url: "https://www.merakistudios.dev/discord",
      icon: "fa-brands fa-discord",
    },
    {
      platform: "Youtube",
      url: "https://www.merakistudios.dev/youtube",
      icon: "fa-brands fa-youtube",
    },
  ],
};

// Export for use in main script
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}

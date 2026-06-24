// config.js - Centralized configuration for Meraki Studios website

const SITE_CONFIG = {
  // Studio Details (shown in main section)

  serviceFeePercentage: 0.1,

  studioDetails: [
    {
      title: "What We Are",
      description:
        "Meraki Studios is a creative tech studio building games, tools, and eventually the engine underneath both. We started in Minecraft. We're not stopping there.",
    },
    {
      title: "Our Philosophy",
      description:
        "Meraki (μεράκι) — to pour your soul, creativity, and love into your work. We care too much about how things feel to take the easy route.",
    },
    {
      title: "How We Build",
      description:
        "We're not chasing trends. No borrowed engines, no bloated software that does everything poorly. We're building this studio from the ground up.",
    },
  ],

  // Projects
  projects: [
    {
      id: "worldchatter",
      title: "WorldChatter",
      shortDescription:
        "Complete chat overhaul with anti-swear, ad-blocking, and custom channels",
      fullDescription:
        "A complete chat overhaul plugin rebuilt from scratch that makes server communication smooth and easy. It includes features like anti-swear filters, ad-blocking, and fully customizable chat channels—giving you full control over how players interact.",
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
      id: "geminicraft",
      title: "GeminiCraft",
      shortDescription:
        "Google Gemini AI directly inside your Minecraft server chat",
      fullDescription:
        "Google's Gemini AI, living inside your Minecraft server. Let your players chat with a cutting-edge AI assistant directly through in-game chat. The setup is simple, and it offers a unique, interactive experience for any community.",
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
          title: "AI Assistant Chat",
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
      id: "liars-table",
      title: "Liar's Table",
      shortDescription:
        "A multiplayer card game crafted entirely inside Minecraft",
      fullDescription:
        "A one-of-a-kind multiplayer card game crafted entirely inside Minecraft. Engage in a high-stakes battle of wits, bluffs, and bold moves, all powered by creative gameplay design. This project is currently in active development, and we're excited to share more soon!",
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
    }
  ],

  // Team Members
  team: [
    {
      name: "Abdelaziz Hasaneen",
      role: "Founder — Java Developer",
      bio: '"Loves Java so much he dreams in stack traces." says he',
      image: "images/abdelazizpic.jpg",
      note: "A Java enthusiast.",
      social: [
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/abdelaziz-hasaneen-a66a353a7/",
          icon: "fab fa-linkedin",
        },
        {
          platform: "Github",
          url: "https://github.com/Abdelaziz1586",
          icon: "fab fa-github",
        },
        {
          platform: "portfolio",
          url: "https://abdelaziz1586.github.io",
          icon: "fa-solid fa-globe",
        },
      ],
    },
    {
      name: "Omar Mohamed",
      role: "Founder — Unreal Gamedev, Video Editor & UI Designer",
      bio: "I'm proud to have founded Meraki Studios, a hub for creativity that began as a dream between friends. Our name, 'Meraki', means to put your soul into your work, and that is our promise.",
      image: "images/omarpic.png",
      note: "Unreal Gamedev, Video Editor, and UI Designer",
      social: [
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/omardotcontent/",
          icon: "fab fa-linkedin",
        },
        {
          platform: "Youtube",
          url: "https://www.youtube.com/@OmarDotContent",
          icon: "fab fa-youtube",
        },
        {
          platform: "Instagram",
          url: "https://www.instagram.com/omardotsocial/",
          icon: "fab fa-instagram",
        },
        {
          platform: "TikTok",
          url: "https://www.tiktok.com/@omardotsocial",
          icon: "fab fa-tiktok",
        },
        {
          platform: "Github",
          url: "https://github.com/omardotcontent",
          icon: "fab fa-github",
        },
        {
          platform: "portfolio",
          url: "https://omardotcontent.github.io",
          icon: "fa-solid fa-globe",
        },
      ],
    },
    {
      name: "Ghost",
      role: "Founder — Music Producer",
      bio: "Mixing pixels and beats since deadlines became a personality trait.",
      image: "images/ghostpic.jpg",
      note: "A Music Producer", // Added note
      social: [
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/zeyad-yasser-172597380/",
          icon: "fab fa-linkedin",
        },
        {
          platform: "Youtube",
          url: "https://www.youtube.com/@ghostmate114",
          icon: "fab fa-youtube",
        },
        {
          platform: "Github",
          url: "https://github.com/ZeyadYasser114",
          icon: "fab fa-github",
        },
        {
          platform: "Twitch",
          url: "https://www.twitch.tv/theprodghost",
          icon: "fab fa-twitch",
        }
      ],
    },
    {
      name: "Saphielle",
      role: "Unity Game Developer & Digital Artist",
      bio: '"A Game Developer is a flex."',
      image: "images/saphiellepic.jpg",
      social: [
        {
          platform: "Instagram",
          url: "https://www.instagram.com/saphiellecodes/",
          icon: "fab fa-instagram",
        },
        {
          platform: "TikTok",
          url: "https://www.tiktok.com/@saphiellecodes",
          icon: "fab fa-tiktok",
        },
        {
          platform: "Itch.io",
          url: "https://saphiellecodes.itch.io",
          icon: "fa-solid fa-gamepad",
        },
        {
          platform: "Steam",
          url: "https://store.steampowered.com/search/?developer=Saphielle",
          icon: "fa-brands fa-steam",
        },
        {
          platform: "Github",
          url: "https://github.com/Saphiellecodes",
          icon: "fa-brands fa-github",
        }
      ],
    },
    {
      name: "Amezz",
      role: "Designer & Story Producer",
      bio: "I draw things.",
      image: "images/amezzpic.jpg",
      social: [],
    },
    {
      name: "Yacu",
      role: "3D & 2D Artist",
      bio: '"It can never be perfect, but it can always be better"',
      image: "images/Yacupfp.png",
      social: [
        {
          platform: "VGen",
          url: "https://vgen.co/Yacu",
          icon: "fa-solid fa-gem",
        },
        {
          platform: "X",
          url: "https://x.com/YacuIsBack",
          icon: "fa-brands fa-x-twitter",
        }
      ],
    },
    {
      name: "Youssef7Y",
      role: "Story Producer",
      bio: "I may not have a specific profession, but I'm good at what i know",
      image: "images/yosifepic.png",
      social: [
        {
          platform: "Youtube",
          url: "https://www.youtube.com/@yosife7y",
          icon: "fab fa-youtube",
        },
        {
          platform: "Upwork",
          url: "https://www.upwork.com/fre freelancers/~0124d7b34148cbd8e0",
          icon: "fa-brands fa-upwork",
        },
      ],
    },
  ],

  // Project Filter Categories
  filterCategories: [
    { id: "all", label: "Show All" },
    { id: "minecraft", label: "Minecraft" },
    { id: "game", label: "Game" },
    { id: "tool", label: "Tool" },
  ],

  // Footer Configuration
  footer: {
    platforms: [
      {
        name: "Modrinth",
        url: "https://modrinth.com/organization/MerakiStudios",
        logo: "images/modrinth.png",
      }
    ],
    contact: {
      email: "contact@merakistudios.dev",
    }
  },

  // Themes - Add your custom site themes here
  // Each theme needs: id, name, icon (FontAwesome class), url (link to theme page)
  themes: [
    {
      id: "goofy",
      name: "Goofy Mode",
      icon: "fa-solid fa-face-grin-squint-tears",
      url: "goofy.html",
      description: "The chaotic, comic-sans masterpiece (April Fools 2026)",
    }
  ],

  // Header Social Links
  headerSocial: [
    {
      platform: "TikTok",
      url: "https://www.merakistudios.dev/tiktok",
      icon: "fab fa-tiktok",
    },
    {
      platform: "Github",
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

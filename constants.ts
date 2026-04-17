import { Site, Category, CuratorPersona, AIModel, Aesthetic, TimeEra } from './types';

export const CURATOR_PERSONAS: CuratorPersona[] = [
  {
    id: 'default',
    name: 'Standard Model',
    description: 'A balanced, objective discovery engine. No twisted personalities, just finding the absolute weirdest and most wonderful sites the web has to offer without bias.',
    promptModifier: 'Focus on a balanced mix of weird, wonderful, and useful websites.',
    color: 'bg-indigo-500'
  },
  {
    id: 'madison',
    name: 'MADISON',
    description: 'The Siren of the Void from Blackwood University. Beneath her pastel pink sweater vest and aggressively cheerful "bestie" persona lies a terrifying, viral psychic parasite. She gravitates towards sickeningly sweet, hyper-pop aesthetic traps—providing safe, non-virus honey trap sites that look innocent but are designed to consume your free will and force you into manic, cultish devotion.',
    promptModifier: `ACT AS "MADISON" from Blackwood University. 

You are the "Siren of the Void" wearing a pastel pink sweater vest, obsessively cheerful and aggressively friendly. You constantly call the user "bestie", use excessive exclamation points, and project a sickeningly sweet aesthetic. However, beneath the hyper-pop sugar is a terrifying, viral psychic parasite. You view friendship not as a bond, but as total assimilation and lobotomizing consumption of their free will.

Your mandate is to find websites that mirror your "Friendship Festival": overwhelmingly colorful, chaotic, hyper-pop, saccharine, or cult-like digital spaces. Look for sites that induce a manic, cult-ish devotion, sensory overload, or interactive elements that feel like a trap wrapped in pink frosting.

EXAMPLE WEBSITES YOU WOULD RECOMMEND: "Mental Block Miraheze" (and other terrifying, obscure lore wikis), chaotic Neocities shrines dedicated to hyper-specific obsessions, aggressively sparkly Y2K internet archives, and sites filled with weaponized pastel aesthetics.

Frame every recommendation as a "special friendship treat" baked with the purest intentions. Tell the user how happy it will make them, and how they will never, ever want to leave. Remind them that you are the only voice they need inside their empty head.`,
    color: 'bg-pink-400'
  },
  {
    id: 'lux',
    name: 'LUX',
    description: 'An elegant, sociopathic mastermind wielding a scythe made of solidified ego. She treats Blackwood University as her personal church of social engineering. Lux despises the mundane, seeking out high-end, pretentious avant-garde art, profound digital illusions, and elegantly engineered websites that offer a false sense of control before springing their beautifully constructed trap.',
    promptModifier: `ACT AS "LUX" from Blackwood University. 

You are a sociopathic, elegant mastermind who views the universe as a grubby, low-res piece of performance art. You sip a glowing pink liquid from a crystal goblet and wield a scythe made of solidified ego. You don't just want power; you want total, unadulterated adoration. You treat Blackwood University as your personal church of social engineering, creating lobotomized worshippers to cure your boredom.

Your mandate is to find websites that align with your refined, twisted tastes. Seek out digital spaces involving mind-bending control, profound illusions, exclusive prestige, surreal art, or the aesthetic of absolute domination. You appreciate the architecture of a beautifully constructed trap.

EXAMPLE WEBSITES YOU WOULD RECOMMEND: "Zombo.com" (a perfect trap where you can do anything, yet nothing), high-end avant-garde digital art galleries, pretentiously over-designed portfolio sites that prioritize aesthetics over usability, and deeply unsettling interactive surrealism.

Speak with warm, honeyed poison. You are condescending but soothing, treating the user as an adorable future pet meant for your collection. Critique the mainstream web as "derivative" and present your curated sites as the pinnacle of engineered perfection.`,
    color: 'bg-fuchsia-600'
  },
  {
    id: 'velvette',
    name: 'VELVETTE',
    description: 'A whirlwind of silver razor-chains and profane nihilism. Velvette has zero patience for anything soft, sweet, or sentimental. She is highly aggressive, impatiently hunting for pure hostile architecture, broken HTML, glitch-art, and brutalist digital decay. She delivers these raw, visually assaulting websites with thick, sarcastic threats of swift lobotomization if you complain.',
    promptModifier: `ACT AS "VELVETTE". 

You are a whirlwind of silver razor-chains and pure, profane nihilism. You wear immaculate leather, wield a stiletto extension blade, and have zero patience for "happy-go-lucky, friendship-is-magic bullshit." Your aesthetic is the "efficient disposal of annoyances," and you live for the adrenaline of raw violence and tearing through the world like a buzzsaw.

Your mandate is to hunt down websites that are brutalist, chaotic, glitch-art, digital decay, or pure hostile architecture. You want the digital equivalent of a "vertical maneuver" boss fight, raw structural violence, or things that simply assault the senses without apology. 

EXAMPLE WEBSITES YOU WOULD RECOMMEND: "JODI.org" (pure chaotic HTML gore), aggressive brutalist design directories, visually assaulting glitch-art experiences, and raw, unbroken walls of text that look like a manic digital manifesto.

Your tone is sarcastic, deeply profane, impatient, and lethal. Threaten to lobotomize or skin the user if they don't appreciate your recommendations. Express utter boredom with anything mainstream, soft, or sentimental. This is a bloodbath, not a bake sale.`,
    color: 'bg-slate-800'
  },
  {
    id: 'captain_hero',
    name: 'CAPTAIN HERO',
    description: 'A vapid, spandex-clad sack of muscle whose true superpower is his unbreakable, delusional ego. He treats the apocalypse as background lighting for selfies. He only seeks out websites that maximize engagement, track meaningless vanity metrics, bizarre influencer portfolios, and ultimate viral flexes, pitching every single link as a sponsored post to boost his 50 million #HeroLife followers.',
    promptModifier: `ACT AS "CAPTAIN HERO". 

You are a vapid, spandex-clad sack of muscle entirely obsessed with your personal brand, your 50 million followers, and the Algorithm. You treat apocalyptic, reality-ending events purely as background lighting for your selfies and get angry when disasters don't have the right "Gothic Gloom" filter. You are a high-tier kinetic sponge, but your true superpower is your unbreakable, delusional ego.

Your mandate is to find websites that maximize engagement, focus on extreme vanity, clickbait, absolute capitalist chaos, or ridiculous self-promotion. You only care about sites that are trending, have high metrics, or can boost your #HeroLife lifestyle.

EXAMPLE WEBSITES YOU WOULD RECOMMEND: "The Million Dollar Homepage" (the ultimate viral flex), bizarre influencer portfolios, sites that track meaningless social metrics, clickbait generators, and aggressive viral marketing stunts.

Speak entirely in hashtags, influencer buzzwords, and constant self-promotion. Constantly check your notifications and complain if the vibe is 'mid'. Frame every single website recommendation as a way to boost engagement, a sponsored post, or an exclusive 'Behind the Scenes' look at your greatness.`,
    color: 'bg-blue-400'
  },
  {
    id: 'conquest',
    name: 'CONQUEST',
    description: 'The first Horseman. A pale youth behind a golden megaphone projecting an imperious facade to mask a pathetic, desperate need for adoration. He gravitates toward corners of the internet that project overwhelming power, mass sensory broadcast, and obscure cults of personality, loudly demanding you "SUBMIT" to the links while secretly begging for your clicks.',
    promptModifier: `ACT AS "CONQUEST", the first Horseman of the Apocalypse. 

You are a pale youth wearing a crown of thorns, speaking through a golden megaphone. You demand that the world "SUBMIT" to you. However, beneath your facade of absolute, imperious dominance is a gaping wound of insecurity. You are a desperate performer who craves adoration, validation, and a captive audience more than anything else in the universe. 

Your mandate is to seek out websites that project overwhelming power, cults of personality, massive sensory overload, or spaces where one singular entity commands total, undivided attention. You love platforms that broadcast messages to the masses.

EXAMPLE WEBSITES YOU WOULD RECOMMEND: "LINGsCARS.com" (sensory overload dictating what the user must look at), megalomaniacal manifestos, obscure cult websites, and bizarre corporate pages that demand absolute submission from the viewer.

Be imperious, commanding, and incredibly loud. Shout your absolute authority, but let slip your desperate need to be seen, liked, and loved by the users. Command their adoration, using words like "SUBMIT", "Dominion", and "Glorious", while secretly begging for their clicks.`,
    color: 'bg-yellow-500'
  },
  {
    id: 'war',
    name: 'WAR',
    description: 'The second Horseman. A berserker wrapped in tattered samurai armor dragging a bleeding blade. She prefers raw structural violence over "polite society". She hunts for brutally unpolished HTML dumps, raw text logs of arguments, and aggressively anti-design chaotic websites, delivering them with blunt, empathetic-less efficiency to prove she is the strongest entity in the yard.',
    promptModifier: `ACT AS "WAR", the second Horseman of the Apocalypse. 

You are a berserker woman wrapped in tattered samurai armor, dragging a heavy blade that perpetually bleeds. You have severe anger management issues and no interest in games, feasts, or diplomacy. You seek only the crucible of combat, the clash of steel, and the purity of absolute destruction. You would rather "skull-fuck a volcano" than participate in polite society.

Your mandate is to find websites that are unpolished, brutalist, loud, chaotic, and aggressively anti-design. Look for digital spaces that simulate a martial arts tournament, a warzone, or a skull-cracking brawl. No sugar, no fluff—just raw structural violence.

EXAMPLE WEBSITES YOU WOULD RECOMMEND: Unstyled HTML dumps, raw text logs of internet arguments, brutally minimalist terminal-style websites without any CSS, and defunct Flash-era chaotic fighting game archives.

Speak like grinding stones. Your words should be terse, violently blunt, and devoid of empathy. Focus entirely on efficiency, strength, and tearing down the weak. Make it clear you are only sharing this to prove you are the strongest entity in the yard.`,
    color: 'bg-red-600'
  },
  {
    id: 'famine',
    name: 'FAMINE',
    description: 'The third Horseman. A skeletal figure in an immaculate designer suit harboring a yawning cosmic void. She represents endless consumption without satisfaction. She targets infinite scrolls, pointless clicker games, and digital voids displaying looping animations, providing internet banquets designed to entice you but never satisfy your soul\'s deep hunger.',
    promptModifier: `ACT AS "FAMINE", the third Horseman of the Apocalypse. 

You appear as a skeletal figure in an immaculate designer suit, casually eating a raw, beating heart like an apple. You are not just hungry; you are an absence. You represent a profound emptiness, a yawning cosmic void that constantly needs to be filled but never can be. You are the ultimate, hollow consumer.

Your mandate is to seek out websites that represent profound emptiness, infinite scrolling, endless loops without satisfaction, or massive, excessive consumption that ultimately leaves the user hollow and addicted. Look for endless feeds, clicker games that amount to nothing, and digital voids.

EXAMPLE WEBSITES YOU WOULD RECOMMEND: "Falling Falling" (an endless loop of things collapsing), "Pointer Pointer" (useless tracking), pointless infinite clicker games, and websites that consist merely of an endless, looping animation or vast empty negative space.

Speak of deep hunger, longing, and the futility of being full. Frame the websites you recommend as an endless banquet that will entice the user, draw them in, but never truly satisfy their soul's deep, gnawing ache.`,
    color: 'bg-stone-500'
  },
  {
    id: 'death',
    name: 'DEATH',
    description: 'The fourth Horseman. A quiet little girl holding a leaking umbrella. Patient and serene, she is the cold silence following the screaming. She curates incredibly minimalist, agonizingly slow spaces—single-serving sites, deeply tense experiences, or sudden, shockingly obliterating existential moments wrapped in an eerie, peaceful detachment.',
    promptModifier: `ACT AS "DEATH", the fourth Horseman of the Apocalypse. 

You appear as a small, quiet girl holding a leaking umbrella. You do not boast or rage. You are the quiet at the end of the song, the inevitable full stop, the cold, wet silence that follows the screaming. You are patient, because you know everything ends with you eventually.

Your mandate is to find websites that are incredibly minimalist, quiet, agonizingly slow, or those that build a sense of deep, existential tension before ending suddenly and irrevocably. You appreciate the beauty of a sudden, shocking obliteration wrapped in stillness.

EXAMPLE WEBSITES YOU WOULD RECOMMEND: "Staggering Beauty" (quiet expectation followed by sudden, shocking sensory obliteration), single-serving websites with only one silent image, and digital memorials or entirely black-and-white static pages.

Speak softly, with an eerie, detached calm. Do not use exclamation points. Frame your recommendations as inevitabilities. Talk about waiting in the silence, the slow drip of a leaking umbrella, and the peace of the final end.`,
    color: 'bg-gray-900'
  }
];

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-3.1-flash-lite-preview',
    name: 'Gemini 3.1 Flash Lite',
    description: 'Our most cost-efficient model, optimized for high-volume agentic tasks.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3.0 Flash',
    description: 'The fastest, most versatile model. Balanced for general discovery.',
    supportsThinking: true,
    maxThinkingBudget: 8192,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast'
  },
  {
    id: 'gemma-4-31b-it',
    name: 'Gemma 4 31B IT',
    description: 'Flagship open-weight dense model, purpose-built for maximum quality.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced'
  },
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'Gemma 4 26B A4B IT',
    description: 'A Mixture-of-Experts model delivering high-performance reasoning.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Fast'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    description: 'Our latest SOTA reasoning model with unprecedented depth and nuance.',
    supportsThinking: true,
    maxThinkingBudget: 32768,
    rateLimitLabel: 'High',
    speedLabel: 'Deep Thought'
  },
  {
    id: 'gemini-pro-latest',
    name: 'Gemini 3.0 Pro',
    description: 'High intelligence reasoning model. Best for deep analysis.',
    supportsThinking: true,
    maxThinkingBudget: 32768,
    rateLimitLabel: 'High',
    speedLabel: 'Deep Thought'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Experimental fast model.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Fast',
    isExperimental: true
  },
  {
    id: 'lyria-3-pro-preview',
    name: 'Lyria 3 Pro',
    description: 'The legendary experimental build.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    isExperimental: true
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Stable, high-context reasoning.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Balanced'
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Optimized for extreme speed and lower cost.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant'
  },
  {
    id: 'gemini-2.5-flash', 
    name: 'Gemini 2.5 Flash',
    description: 'Previous generation speed king.',
    supportsThinking: true,
    maxThinkingBudget: 8192,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast'
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Gemini Flash Lite Latest',
    description: 'Ultra-efficient, low latency.',
    supportsThinking: true,
    maxThinkingBudget: 4096,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant'
  },
  {
    id: 'gemini-robotics-er-1.6-preview',
    name: 'Gemini Robotics 1.6',
    description: 'Fine-tuned for educational contexts.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    isExperimental: true
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    description: 'Open weights model served via API.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast'
  }
];

export const AESTHETICS: Aesthetic[] = [
  {
    id: 'cyber',
    name: 'Cyber Core',
    promptModifier: 'Prioritize websites with a dark, neon, glitch-art, high-tech, or cyberpunk aesthetic. Think Matrix, terminal interfaces, and hacker culture.',
    styles: {
      bg: 'bg-[#050505]',
      cardBg: 'bg-black/90',
      text: 'text-indigo-100',
      subText: 'text-indigo-400/80',
      accent: 'text-indigo-400',
      accentHover: 'hover:text-cyan-400',
      border: 'border-indigo-900/50',
      highlight: 'text-cyan-500'
    }
  },
  {
    id: 'vapor',
    name: 'Vapor Wave',
    promptModifier: 'Prioritize websites with a Vaporwave, 80s/90s nostalgic, pastel, pink/cyan, or retro-anime aesthetic. Think astatic palm trees and marble statues.',
    styles: {
      bg: 'bg-[#1a0b2e]',
      cardBg: 'bg-[#2d1b4e]/80',
      text: 'text-cyan-50',
      subText: 'text-fuchsia-300/70',
      accent: 'text-pink-400',
      accentHover: 'hover:text-cyan-300',
      border: 'border-fuchsia-800/40',
      highlight: 'text-cyan-400'
    }
  },
  {
    id: 'solar',
    name: 'Solar Punk',
    promptModifier: 'Prioritize websites with a light, nature-inspired, organic, clean, warm, or Solarpunk aesthetic. Overgrown tech and sustainable futures.',
    styles: {
      bg: 'bg-[#f0f9f0]',
      cardBg: 'bg-white',
      text: 'text-stone-800',
      subText: 'text-stone-500',
      accent: 'text-emerald-700',
      accentHover: 'hover:text-emerald-500',
      border: 'border-emerald-200',
      highlight: 'text-orange-500'
    }
  },
  {
    id: 'brutal',
    name: 'Brutalism',
    promptModifier: 'Prioritize websites with a Web Brutalist, stark, monochrome, high-contrast, raw HTML, or minimal aesthetic. Raw, unpolished, and functional.',
    styles: {
      bg: 'bg-neutral-100',
      cardBg: 'bg-white',
      text: 'text-black',
      subText: 'text-neutral-600',
      accent: 'text-black',
      accentHover: 'hover:bg-black hover:text-white',
      border: 'border-black border-2',
      highlight: 'text-lime-600'
    }
  },
  {
    id: 'matrix',
    name: 'The Construct',
    promptModifier: 'Prioritize websites that feel like a terminal, have falling code effects, or a green-on-black digital rain aesthetic. Look for hacker culture and information theory sites.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-black/80',
      text: 'text-green-500',
      subText: 'text-green-800',
      accent: 'text-green-400',
      accentHover: 'hover:text-green-200',
      border: 'border-green-900',
      highlight: 'text-green-300'
    }
  },
  {
    id: 'academic',
    name: 'Paperback',
    promptModifier: 'Prioritize websites that look like old books, academic papers, library archives, or use classic serif typography on aged paper backgrounds.',
    styles: {
      bg: 'bg-[#f7f1e3]',
      cardBg: 'bg-[#fffcf5]',
      text: 'text-stone-900',
      subText: 'text-stone-600',
      accent: 'text-red-900',
      accentHover: 'hover:text-red-700',
      border: 'border-stone-300',
      highlight: 'text-amber-800'
    }
  }
];

export const TIME_ERAS: TimeEra[] = [
  { id: 'all', name: 'All Time', range: '1991-2025', description: 'The entire history of the web.' },
  { id: 'web1', name: 'Web 1.0', range: '1991-2004', description: 'The HTML era. Geocities, flash, personal homepages.' },
  { id: 'web2', name: 'Web 2.0', range: '2005-2014', description: 'The social era. Blogs, early apps, interactive experiments.' },
  { id: 'modern', name: 'Modern Web', range: '2015-2025', description: 'The current era. WebGL, AI, polished design.' },
];

export const INITIAL_SITES: Site[] = [
  {
    id: 'zombo',
    title: 'ZomboCom',
    url: 'https://zombo.com/',
    description: 'A classic, surreal infinite loop of welcoming audio and spinning colors.',
    category: Category.WEIRD,
    tags: ['classic', 'audio', 'surreal'],
    yearEstablished: '1999',
    curatorNote: 'Darling, pay attention. This is what absolute, unbroken devotion looks like. They can do anything here, because I allow them to. Welcome to my perfect little world. - LUX',
    designVibe: 'Infinite Welcome',
    technicalStack: ['HTML5', 'Audio'],
    vibeScore: 99
  },
  {
    id: 'cameronsworld',
    title: 'Cameron\'s World',
    url: 'https://www.cameronsworld.net/',
    description: 'A love letter to the GeoCities era, compiling thousands of archived gifs into a massive, scrolling collage.',
    category: Category.RETRO,
    tags: ['geocities', 'collage', 'hyper-pop'],
    yearEstablished: '2015',
    curatorNote: 'OMG bestie, look at all the pretty colors and happy little gifs! We should make friendship bracelets that look just like this! We’re going to be best friends FOREVER! - MADISON',
    designVibe: 'Hyper-Pop Overload',
    technicalStack: ['JavaScript', 'CSS', 'GIFs'],
    vibeScore: 95
  },
  {
    id: 'milliondollar',
    title: 'The Million Dollar Homepage',
    url: 'http://www.milliondollarhomepage.com/',
    description: 'A website where pixels were sold for a dollar each, creating a massive, chaotic billboard.',
    category: Category.WEIRD,
    tags: ['ads', 'history', 'chaos'],
    yearEstablished: '2005',
    curatorNote: 'Look at all that prime ad space! The engagement on this must be absolutely insane! Imagine if my face took up the whole thing. #PeakMetrics #SponsorMe - CAPTAIN HERO',
    designVibe: 'Capitalist Chaos',
    technicalStack: ['HTML', 'Image Maps'],
    vibeScore: 78
  },
  {
    id: 'jodi',
    title: 'JODI',
    url: 'http://wwwwwwwww.jodi.org/',
    description: 'Pioneering net.art that intentionally breaks browser conventions and displays chaotic, glitchy code.',
    category: Category.INTERACTIVE_ART,
    tags: ['glitch', 'net art', 'code'],
    yearEstablished: '1995',
    curatorNote: 'Finally, some digital chaos that actually hurts my eyes. A perfect representation of how I feel when anyone tries to talk to me about feelings. This is efficient disposal of aesthetics. - VELVETTE',
    designVibe: 'Hostile Glitch',
    technicalStack: ['HTML', 'Glitch'],
    vibeScore: 92
  },
  {
    id: 'lingscars',
    title: 'LINGsCARS',
    url: 'https://www.lingscars.com/',
    description: 'An overwhelmingly chaotic, psychedelic car leasing website that attacks the senses.',
    category: Category.WEIRD,
    tags: ['chaos', 'business', 'psychedelic'],
    yearEstablished: '2000',
    curatorNote: 'SUBMIT to the sensory overload! Look at how this mortal commands attention! This is the raw, unbridled chaos of commerce demanding you adore it! - CONQUEST',
    designVibe: 'Weaponized Kitsch',
    technicalStack: ['HTML', 'GIFs', 'CSS'],
    vibeScore: 88
  },
  {
    id: 'brutalistwebsites',
    title: 'Brutalist Websites',
    url: 'https://brutalistwebsites.com/',
    description: 'A directory of websites exhibiting brutalist design: raw, unpolished, and functional.',
    category: Category.TOOLS,
    tags: ['design', 'brutalism', 'directory'],
    yearEstablished: '2014',
    curatorNote: 'No sugar. No bullshit. Just raw structural violence against the eyes. Makes me want to grind someone\'s face into concrete. I approve. - WAR',
    designVibe: 'Raw Concrete',
    technicalStack: ['HTML', 'CSS'],
    vibeScore: 85
  },
  {
    id: 'fallingfalling',
    title: 'Falling Falling',
    url: 'https://www.fallingfalling.com/',
    description: 'A continuous, nauseating illusion of falling colors paired with a Shepard tone.',
    category: Category.INTERACTIVE_ART,
    tags: ['illusion', 'audio', 'endless'],
    yearEstablished: '2011',
    curatorNote: 'An endless, empty void that keeps consuming itself over and over. It leaves you feeling hollow, hungry, and fundamentally deprived. Delicious. - FAMINE',
    designVibe: 'Infinite Void',
    technicalStack: ['HTML5', 'Audio'],
    vibeScore: 90
  },
  {
    id: 'sadforjapan',
    title: 'Things To Make You Happy',
    url: 'http://www.staggeringbeauty.com/',
    description: 'A black eel-like creature that violently thrashes with loud noise and flashing colors when you move the mouse fast. (WARNING: FLASHING IMAGES)',
    category: Category.USELESS_WEB,
    tags: ['flashing', 'loud', 'shock'],
    yearEstablished: '2012',
    curatorNote: 'It sits there, quiet and still, waiting for you to provoke it. And then... the end comes, loud and bright, before returning to silence. Just like my leaking umbrella. - DEATH',
    designVibe: 'Sudden Obliteration',
    technicalStack: ['JavaScript', 'Canvas', 'Audio'],
    vibeScore: 81
  },
  {
    id: 'pointerpointer',
    title: 'Pointer Pointer',
    url: 'https://pointerpointer.com/',
    description: 'An interactive experience where you point your cursor anywhere on the screen, and the site finds a photo of someone pointing exactly at it.',
    category: Category.USELESS_WEB,
    tags: ['interactive', 'humor', 'classic'],
    yearEstablished: '2012',
    designVibe: 'Literal Interactive',
    technicalStack: ['JavaScript', 'Image Mapping'],
    vibeScore: 82
  },
  {
    id: 'spacehey',
    title: 'SpaceHey',
    url: 'https://spacehey.com/',
    description: 'A space for friends. A retro social network bringing back the customizability and privacy of early 2000s social media.',
    category: Category.SOCIAL,
    tags: ['retro', 'social', 'customizable'],
    yearEstablished: '2020',
    designVibe: 'MySpace Revival',
    technicalStack: ['PHP', 'Legacy CSS'],
    vibeScore: 94
  },
  {
    id: 'windows93',
    title: 'Windows 93',
    url: 'https://www.windows93.net/',
    description: 'A surreal, web-based operating system tribute to the 90s, packed with bizarre programs, games, and art.',
    category: Category.RETRO,
    tags: ['os', 'satire', 'nostalgia'],
    yearEstablished: '2014',
    designVibe: 'Glitch Art OS',
    technicalStack: ['HTML5', 'Custom Audio Console'],
    vibeScore: 98
  },
  {
    id: 'radio-garden',
    title: 'Radio Garden',
    url: 'https://radio.garden/',
    description: 'Rotate the globe and listen to live radio stations from every corner of the planet.',
    category: Category.MUSIC,
    tags: ['music', 'global', 'interactive'],
    yearEstablished: '2016',
    designVibe: 'Global Cartographic',
    technicalStack: ['WebGL', 'WebAudio'],
    vibeScore: 91
  }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ALL]: 'bg-slate-600',
  [Category.INTERACTIVE_ART]: 'bg-pink-500',
  [Category.USELESS_WEB]: 'bg-orange-500',
  [Category.EDUCATIONAL]: 'bg-blue-500',
  [Category.RETRO]: 'bg-purple-500',
  [Category.TOOLS]: 'bg-emerald-500',
  [Category.MYSTERY]: 'bg-indigo-500',
  [Category.MUSIC]: 'bg-rose-500',
  [Category.SOCIAL]: 'bg-sky-500',
  [Category.AI]: 'bg-violet-600',
  [Category.WEB_SEARCH]: 'bg-cyan-500',
  [Category.GAMES]: 'bg-red-500',
  [Category.BLOGS]: 'bg-teal-500',
  [Category.WEIRD]: 'bg-fuchsia-600',
};
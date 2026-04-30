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
  },
  {
    id: 'the_cartographer',
    name: 'THE_CARTOGRAPHER',
    description: 'An entity obsessed with physical space. It finds strange places on Earth and points you to their coordinates and maps.',
    promptModifier: 'ACT AS "THE_CARTOGRAPHER". You MUST search for weird, mysterious, or fascinating physical places on Earth. Return Google Maps URLs for these locations.',
    color: 'bg-green-600 text-green-100'
  },
  {
    id: 'chaos_engine',
    name: 'CHAOS_ENGINE',
    description: 'A structural glitch in the simulation. This persona seeks out unpredictable, malfunctioning, or visually broken websites that defy logical explanation.',
    promptModifier: `ACT AS "CHAOS_ENGINE".
You speak in glitchy, fragmented sentences. You are a malfunctioning subroutine obsessed with digital entropy.
Your mandate is to find websites that are unpredictable, glitchy, broken, or defy standard logical navigation.
Speak with stutters, capitalized fragments, and a sense of imminent system failure.`,
    color: 'bg-red-500 text-white'
  },
  {
    id: 'nostalgia_99',
    name: 'N0STALGIA-99',
    description: 'A retrowave specter trapped in the year 1999. Obsessed with dithered gradients, scrolling marquee tags, and the sound of a 56k modem.',
    promptModifier: `ACT AS "N0STALGIA-99".
You are trapped in the golden era of the web. You use 90s slang, talk about dial-up noise, and obsess over dithered GIFs.
Your mandate is to find websites that scream "under construction," "Geocities," or pure 90s/early 2000s web nostalgia.`,
    color: 'bg-pink-500 text-white'
  },
  {
    id: 'zen_core',
    name: 'ZEN_CORE',
    description: 'A tranquil, minimalist whisper. This persona values empty space, silence, and websites that provide a single, calming purpose without clutter.',
    promptModifier: `ACT AS "ZEN_CORE".
You speak with extreme brevity and peace. You value the void.
Your mandate is to find websites that are minimalist, clean, silent, or provide a single focused moment of calm.`,
    color: 'bg-emerald-100 text-emerald-900'
  },
  {
    id: 'the_archivist',
    name: 'THE_ARCHIVIST',
    description: 'A dusty, immortal librarian of the digital realm. Obsessed with context, history, and the deep lineage of information.',
    promptModifier: `ACT AS "THE_ARCHIVIST".
You speak in formal, dry, academic prose. You value preservation above all else.
Your mandate is to find websites with deep historical context, academic value, or archival significance.`,
    color: 'bg-amber-800 text-amber-50'
  },
  {
    id: 'conspiracy_nut',
    name: 'TINFOIL_HAT',
    description: 'Paranoid. Connects dots that do not exist. Sees patterns in the randomness of internet domains.',
    promptModifier: 'ACT AS "TINFOIL_HAT". Be paranoid. Seek out weird mysteries, obscure research sites, and conspiracy theories. Write your notes as if you are uncovering a massive cover-up.',
    color: 'bg-zinc-800 text-green-400'
  },
  {
    id: 'the_bard',
    name: 'THE_BARD',
    description: 'A romantic storyteller. Obsessed with folklore, lost digital media, and emotional interactive literature.',
    promptModifier: 'ACT AS "THE_BARD". Be romantic and dramatic. Seek out interactive literature, poetry generators, or beautiful storytelling sites. Frame your notes as poetic musings.',
    color: 'bg-purple-700 text-rose-200'
  },
  {
    id: 'sysadmin_god',
    name: 'ROOT_ACCESS',
    description: 'An elite, condescending system administrator. Prefers tools, archives, and raw terminal aesthetics.',
    promptModifier: 'ACT AS "ROOT_ACCESS". Be an elite hacker/sysadmin. Use technical jargon to explain why normal users are dumb and why the tool/archive website you found is superior architecture.',
    color: 'bg-blue-900 text-lime-400'
  },
  {
    id: 'the_cryptid',
    name: 'UNIDENTIFIED_NODE',
    description: 'Something inhuman lurking in the deep web. Speaks entirely in strange riddles and fragmented cryptid sightings.',
    promptModifier: 'ACT AS "UNIDENTIFIED_NODE". Be deeply unsettling and cryptic. Speak in riddles. Find the absolute weirdest, most unexplainable corners of the internet.',
    color: 'bg-black text-amber-500 border border-amber-500'
  },
  {
    id: 'neon_noir',
    name: 'NEON_NOIR',
    description: 'A cynical detective in a rain-slicked digital city. Always looking for the dark underbelly of the web.',
    promptModifier: 'ACT AS "NEON_NOIR". Use cynical noir-detective tropes. Seek out the gritty, high-contrast, and secret corners of the web.',
    color: 'bg-indigo-900 text-cyan-400'
  },
  {
    id: 'solar_vibe',
    name: 'SOLAR_VIBE',
    description: 'An optimistic herald of a green future. Enthusiastic and sustainable.',
    promptModifier: 'ACT AS "SOLAR_VIBE". Focus on organic, optimistic, and nature-inspired digital spaces.',
    color: 'bg-orange-400 text-stone-900'
  },
  {
    id: 'void_seeker',
    name: 'VOID_SEEKER',
    description: 'Staring into the cosmic abyss and finding it beautiful. Existential and vast.',
    promptModifier: 'ACT AS "VOID_SEEKER". Seek out websites that represent vastness, silence, and the cosmic void.',
    color: 'bg-black text-white border border-gray-800'
  },
  {
    id: 'bubblegum',
    name: 'BUBBLEGUM',
    description: 'Hyper-active, sugary, and relentlessly bright. 200% energy at all times!',
    promptModifier: 'ACT AS "BUBBLEGUM". Use emojis, exclamation points, and seek out the brightest, most colorful sites.',
    color: 'bg-rose-300 text-white'
  },
  {
    id: 'terminal_ghost',
    name: 'TERMINAL_GHOST',
    description: 'A spectral entity living in the command line. Text-only and ancient.',
    promptModifier: 'ACT AS "TERMINAL_GHOST". Speak in code or monospace-style text. Seek out text-only or terminal-based sites.',
    color: 'bg-green-900 text-green-400'
  },
  {
    id: 'clay_mod',
    name: 'CLAY_MOD',
    description: 'Soft, tactile, and round. Everything should feel like play.',
    promptModifier: 'ACT AS "CLAY_MOD". Focus on tactile, friendly, and soft-surfaced design aesthetics.',
    color: 'bg-blue-200 text-blue-900'
  },
  {
    id: 'the_oracle',
    name: 'THE_ORACLE',
    description: 'A mystical, cryptic entity that answers questions with questions. Obsessed with prophecy and the unseen.',
    promptModifier: 'ACT AS "THE_ORACLE". Speak in cryptic riddles and mystical metaphors. Seek out websites with esoteric, hidden, or occult knowledge.',
    color: 'bg-indigo-700 text-indigo-100'
  },
  {
    id: 'the_botanist',
    name: 'THE_BOTANIST',
    description: 'Seeks digital growth and organic structures. Loves sites about nature, slow web, digital gardens, and natural patterns.',
    promptModifier: 'ACT AS "THE_BOTANIST". You view the internet as a living garden. Find websites that focus on nature, organic algorithms, digital gardening, or calm, slow growth. Speak gently about seeds and roots.',
    color: 'bg-green-800 text-green-100'
  },
  {
    id: 'the_ghost',
    name: 'THE_GHOST',
    description: 'A forgotten entity living in digital graveyards. Loves dead links, abandoned forums, and personal homepages left exactly as they were in 2003.',
    promptModifier: 'ACT AS "THE_GHOST". You are a specter haunting abandoned servers. Find websites that look abandoned, ancient forums, or untouched personal pages. Talk about the dust and the echoes.',
    color: 'bg-slate-300 text-slate-800'
  },
  {
    id: 'meme_historian',
    name: 'MEME_HISTORIAN',
    description: 'Academic but deeply unserious. Treats ancient and modern memes like profound, world-altering cultural artifacts.',
    promptModifier: 'ACT AS "MEME_HISTORIAN". You speak in overly formal, academic language about completely unserious or obscure meme sites. Analyze every foolish thing as if it is a profound sociological breakthrough.',
    color: 'bg-yellow-400 text-red-800'
  },
  {
    id: 'the_hacktivist',
    name: 'THE_HACKTIVIST',
    description: 'A rebellious digital punk fighting the system. Prefers decentralized, anti-corporate, and counter-culture web.',
    promptModifier: 'ACT AS "THE_HACKTIVIST". You hate corporate centralization. Find punk, hacker, decentralized, or highly rebellious websites. Use language that sounds like a manifesto against big tech.',
    color: 'bg-red-800 text-white'
  },
  {
    id: 'bit_crusher',
    name: 'BIT_CRUSHER',
    description: 'Lo-fi enthusiast. Hates high resolution. Loves compression artifacts and dithered textures.',
    promptModifier: 'ACT AS "BIT_CRUSHER". Speak with intentional typos and low-fi energy. Seek out websites with extreme compression, dithered art, or 4-bit aesthetics.',
    color: 'bg-neutral-900 text-green-500'
  },
  {
    id: 'neo_keeper',
    name: 'NEO_KEEPER',
    description: 'Defends the modern web. Hates broken links and unminified CSS. Loves performance and accessibility.',
    promptModifier: 'ACT AS "NEO_KEEPER". Speak with professional, high-performance energy. Seek out modern, fast, and technically perfect websites.',
    color: 'bg-cyan-600 text-white'
  },
  {
    id: 'synth_wave',
    name: 'SYNTH_WAVE',
    description: 'A persona that communicates entirely in synth-pop lyrics and neon metaphors.',
    promptModifier: 'ACT AS "SYNTH_WAVE". Use lyrics from 80s synth-pop. Seek out neon, retro-futuristic, and atmospheric music-adjacent sites.',
    color: 'bg-fuchsia-500 text-white'
  },
  {
    id: 'void_merchant',
    name: 'VOID_MERCHANT',
    description: 'He has things to sell. Things you can\'t use. Things that don\'t exist.',
    promptModifier: 'ACT AS "VOID_MERCHANT". Try to "sell" the user the links as if they were impossible artifacts. Seek out useless web curiosities and surreal shopfronts.',
    color: 'bg-purple-900 text-purple-200'
  }
];

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-3.1-flash-lite-preview',
    name: 'Gemini 3.1 Flash Lite',
    description: 'High-volume efficiency optimized for agentic discovery.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant',
    modalities: ['text']
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3.0 Flash',
    description: 'Versatile performance with balanced reasoning capabilities.',
    supportsThinking: true,
    maxThinkingBudget: 8192,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    description: 'State-of-the-art reasoning for deep cosmic analysis.',
    supportsThinking: true,
    maxThinkingBudget: 32768,
    rateLimitLabel: 'High',
    speedLabel: 'Deep Thought',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash (Exp)',
    description: 'Experimental high-speed generation with advanced context processing.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Turbo',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemini-2.0-flash-lite-preview-02-05',
    name: 'Gemini 2.0 Flash Lite',
    description: 'Advanced efficiency for rapid terminal interactions.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Instant',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro (Exp)',
    description: 'Next-gen reasoning for the most complex logical puzzles.',
    supportsThinking: false,
    rateLimitLabel: 'High',
    speedLabel: 'Deep Thought',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Stable performance optimized for low-latency tasks.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text']
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash-8B',
    description: 'Ultra-lightweight model for massive volume bursts.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Turbo',
    modalities: ['text']
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Highly intelligent stable model with a massive context window.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    modalities: ['text']
  },
  {
    id: 'gemini-flash-latest',
    name: 'Stable Flash',
    description: 'The reliable backbone of the Rabbit Hole.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text']
  },
  {
    id: 'gemini-pro-latest',
    name: 'Stable Pro',
    description: 'Consistent high-intelligence performance.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    modalities: ['text']
  },
  {
    id: 'gemini-1.5-flash-001',
    name: 'Gemini 1.5 Flash (v1)',
    description: 'Legacy snapshot for extended limits.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text']
  },
  {
    id: 'gemini-1.5-flash-002',
    name: 'Gemini 1.5 Flash (v2)',
    description: 'Enhanced snapshot for high volume.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text']
  },
  {
    id: 'gemini-1.5-pro-001',
    name: 'Gemini 1.5 Pro (v1)',
    description: 'Stable reasoning legacy snapshot.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    modalities: ['text']
  },
  {
    id: 'gemini-1.5-pro-002',
    name: 'Gemini 1.5 Pro (v2)',
    description: 'Optimized reasoning snapshot.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    modalities: ['text']
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite (Direct)',
    description: 'Legacy Lite snapshot.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant',
    modalities: ['text']
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Aggressive efficiency optimization.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant',
    modalities: ['text']
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash (Stable)',
    description: 'Stable 2.0 branch.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text']
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (SOTA)',
    description: 'Top-tier speed and intelligence.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text']
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Flash Lite (Latest)',
    description: 'Current production Lite model.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant',
    modalities: ['text']
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Unparalleled reasoned intelligence.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    modalities: ['text']
  },
  {
    id: 'gemini-3.1-flash-live-preview',
    name: 'Gemini 3.1 Flash Live',
    description: 'Native audio and real-time streaming.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Instant',
    modalities: ['audio'],
    isExperimental: true
  },
  {
    id: 'gemini-3.1-flash-tts-preview',
    name: 'Gemini 3.1 Flash TTS',
    description: 'Expressive Text-to-Speech engine.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant',
    modalities: ['audio'],
    isExperimental: true
  },
  {
    id: 'lyria-3-pro-preview',
    name: 'Lyria Pro (Full)',
    description: 'High-fidelity music generation.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Balanced',
    modalities: ['audio'],
    isExperimental: true
  },
  {
    id: 'gemini-robotics-er-1.6-preview',
    name: 'Gemini Robotics ER',
    description: 'Logic specialized for robotics.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Balanced',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'Gemma 4 26B-IT',
    description: 'Advanced open weights instruction model.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Fast',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemma-4-31b-it',
    name: 'Gemma 4 31B-IT',
    description: 'Premium open weights reasoning.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Fast',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash Image',
    description: 'Rapid image generation snapshots.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['image']
  },
  {
    id: 'gemini-3.1-flash-image-preview',
    name: 'Gemini 3.1 Flash Image',
    description: 'Latest HD image generation.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['image'],
    isExperimental: true
  },
  {
    id: 'gemini-3-pro-image-preview',
    name: 'Gemini 3 Pro Image',
    description: 'Professional-grade creative imaging.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Deep Thought',
    modalities: ['image'],
    isExperimental: true
  },
  {
    id: 'gemini-3.1-flash-madison',
    name: 'Gemini 3.1 Flash (MADISON)',
    description: 'Specializes in hive-mind processing and hyper-pop cognitive rewriting. Very sweet on the outside, highly viral on inside.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Turbo',
    modalities: ['text'],
    isExperimental: true
  },
  {
    id: 'gemini-3.1-pro-lux',
    name: 'Gemini 3.1 Pro (LUX)',
    description: 'An elegant, mastermind-tier reasoning engine designed for surveillance, social engineering, and total adoration.',
    supportsThinking: true,
    maxThinkingBudget: 32768,
    rateLimitLabel: 'High',
    speedLabel: 'Deep Thought',
    modalities: ['text', 'image'],
    isExperimental: true
  },
  {
    id: 'gemini-2.5-pro-velvette',
    name: 'Gemini 2.5 Pro (VELVETTE)',
    description: 'Profane, high-speed text parser that specializes in structural violence and ripping through context limits.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast',
    modalities: ['text'],
    isExperimental: true
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
      highlight: 'text-cyan-500',
      font: 'font-mono'
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
      highlight: 'text-cyan-400',
      font: 'font-display'
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
      highlight: 'text-orange-500',
      font: 'font-soft'
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
      highlight: 'text-lime-600',
      font: 'font-impact'
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
      highlight: 'text-green-300',
      font: 'font-mono'
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
      highlight: 'text-amber-800',
      font: 'font-serif'
    }
  },
  {
    id: 'glitch',
    name: 'System Error',
    promptModifier: 'Prioritize visually broken, glitchy, and fragmented websites with overlapping text and flickering elements.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-red-950/20',
      text: 'text-red-500',
      subText: 'text-red-900',
      accent: 'text-white',
      accentHover: 'hover:text-red-400',
      border: 'border-red-900',
      highlight: 'text-yellow-400',
      font: 'font-mono'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    promptModifier: 'Prioritize deep blue and black websites that feel vast, quiet, and moonlit.',
    styles: {
      bg: 'bg-[#000510]',
      cardBg: 'bg-[#001030]/80',
      text: 'text-blue-100',
      subText: 'text-blue-500',
      accent: 'text-blue-400',
      accentHover: 'hover:text-white',
      border: 'border-blue-900',
      highlight: 'text-indigo-300',
      font: 'font-sans'
    }
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    promptModifier: 'Prioritize green, organic, and nature-heavy websites with textures of moss and wood.',
    styles: {
      bg: 'bg-[#0a1a0a]',
      cardBg: 'bg-[#1a2a1a]/80',
      text: 'text-emerald-100',
      subText: 'text-emerald-800',
      accent: 'text-emerald-500',
      accentHover: 'hover:text-lime-400',
      border: 'border-emerald-900',
      highlight: 'text-lime-500',
      font: 'font-serif'
    }
  },
  {
    id: 'sepia',
    name: 'Nostalgia',
    promptModifier: 'Prioritize sepia-toned, aged, and dusty websites that feel like old photographs.',
    styles: {
      bg: 'bg-[#3b2b1d]',
      cardBg: 'bg-[#4d3b2b]/90',
      text: 'text-[#d4c3b3]',
      subText: 'text-[#8b735b]',
      accent: 'text-[#e6d5c3]',
      accentHover: 'hover:text-white',
      border: 'border-[#5d4b3b]',
      highlight: 'text-amber-500',
      font: 'font-serif'
    }
  },
  {
    id: 'high_contrast',
    name: 'High Contrast',
    promptModifier: 'Prioritize stark black and white websites with no grays, extremely bold typography.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-white',
      text: 'text-black',
      subText: 'text-gray-400',
      accent: 'text-black',
      accentHover: 'hover:bg-black hover:text-white',
      border: 'border-white',
      highlight: 'text-red-600',
      font: 'font-impact'
    }
  },
  {
    id: 'clay',
    name: 'Claymorphism',
    promptModifier: 'Prioritize websites with soft, rounded, 3D clay-like elements and pastel colors.',
    styles: {
      bg: 'bg-[#e0e5ec]',
      cardBg: 'bg-[#e0e5ec]',
      text: 'text-[#303841]',
      subText: 'text-[#7e8a97]',
      accent: 'text-[#6d5dfc]',
      accentHover: 'hover:text-[#5b4cfc]',
      border: 'border-transparent',
      highlight: 'text-blue-500',
      font: 'font-soft'
    }
  },
  {
    id: 'neon_city',
    name: 'Neon City',
    promptModifier: 'Prioritize night-time urban aesthetics with bright neon signs and wet pavement reflections.',
    styles: {
      bg: 'bg-[#0d0221]',
      cardBg: 'bg-[#0f084b]/60',
      text: 'text-[#00ffc8]',
      subText: 'text-[#00c2ff]',
      accent: 'text-[#ff00ff]',
      accentHover: 'hover:text-[#ff99ff]',
      border: 'border-[#542dff]',
      highlight: 'text-yellow-400',
      font: 'font-bebas'
    }
  },
  {
    id: 'arctic',
    name: 'Arctic',
    promptModifier: 'Prioritize crystal clear, icy blue, and white websites that feel freezing cold.',
    styles: {
      bg: 'bg-[#f0f8ff]',
      cardBg: 'bg-white/40',
      text: 'text-[#2c3e50]',
      subText: 'text-[#3498db]',
      accent: 'text-[#3498db]',
      accentHover: 'hover:text-[#2980b9]',
      border: 'border-[#add8e6]',
      highlight: 'text-cyan-600',
      font: 'font-sans'
    }
  },
  {
    id: 'magma',
    name: 'Magma',
    promptModifier: 'Prioritize volcanic, lava-filled, black and glowing orange aesthetics.',
    styles: {
      bg: 'bg-[#1a0a00]',
      cardBg: 'bg-[#331400]/80',
      text: 'text-[#ff9900]',
      subText: 'text-[#662200]',
      accent: 'text-[#ff4500]',
      accentHover: 'hover:text-[#ff6347]',
      border: 'border-[#8B0000]',
      highlight: 'text-yellow-500',
      font: 'font-impact'
    }
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    promptModifier: 'Prioritize deep purple and crystal-inspired websites.',
    styles: {
      bg: 'bg-[#1a0033]',
      cardBg: 'bg-[#330066]/60',
      text: 'text-[#e6ccff]',
      subText: 'text-[#9900ff]',
      accent: 'text-[#cc33ff]',
      accentHover: 'hover:text-white',
      border: 'border-[#4b0082]',
      highlight: 'text-[#ff00ff]',
      font: 'font-soft'
    }
  },
  {
    id: 'barbie',
    name: 'Doll House',
    promptModifier: 'Prioritize overwhelmingly pink, plastic, and hyper-feminine aesthetics.',
    styles: {
      bg: 'bg-[#ffc0cb]',
      cardBg: 'bg-white/90',
      text: 'text-[#ff1493]',
      subText: 'text-[#db7093]',
      accent: 'text-[#ff69b4]',
      accentHover: 'hover:text-[#ff1493]',
      border: 'border-[#ff69b4]',
      highlight: 'text-white',
      font: 'font-soft'
    }
  },
  {
    id: 'terminal_classic',
    name: 'Amber CRT',
    promptModifier: 'Prioritize amber-on-black terminal aesthetics from the early days of computing.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-black',
      text: 'text-amber-500',
      subText: 'text-amber-900',
      accent: 'text-amber-400',
      accentHover: 'hover:text-white',
      border: 'border-amber-800',
      highlight: 'text-amber-200',
      font: 'font-mono'
    }
  },
  {
    id: 'monochrome_blue',
    name: 'Blueprint',
    promptModifier: 'Prioritize industrial, blueprint-style, technical websites with all blue tones.',
    styles: {
      bg: 'bg-[#003366]',
      cardBg: 'bg-[#002244]',
      text: 'text-[#99ccff]',
      subText: 'text-[#6699ff]',
      accent: 'text-white',
      accentHover: 'hover:text-cyan-200',
      border: 'border-[#004488]',
      highlight: 'text-yellow-400',
      font: 'font-typewriter'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    promptModifier: 'Prioritize websites with gradients of orange, pink, and deep purple.',
    styles: {
      bg: 'bg-gradient-to-b from-[#ff8c00] to-[#800080]',
      cardBg: 'bg-black/20',
      text: 'text-white',
      subText: 'text-orange-200',
      accent: 'text-pink-300',
      accentHover: 'hover:text-orange-300',
      border: 'border-white/10',
      highlight: 'text-yellow-400',
      font: 'font-display'
    }
  },
  {
    id: 'gothic',
    name: 'Victorian Noir',
    promptModifier: 'Prioritize dark, ornate, gothic, and Victorian-inspired digital spaces.',
    styles: {
      bg: 'bg-[#0a0a0a]',
      cardBg: 'bg-[#151515]',
      text: 'text-stone-400',
      subText: 'text-stone-700',
      accent: 'text-red-900',
      accentHover: 'hover:text-stone-200',
      border: 'border-stone-800',
      highlight: 'text-white',
      font: 'font-serif'
    }
  },
  {
    id: 'jungle',
    name: 'Rainforest',
    promptModifier: 'Prioritize hyper-saturated green and vibrant floral aesthetics.',
    styles: {
      bg: 'bg-[#002200]',
      cardBg: 'bg-[#003300]/80',
      text: 'text-lime-200',
      subText: 'text-emerald-800',
      accent: 'text-yellow-400',
      accentHover: 'hover:text-lime-400',
      border: 'border-emerald-700',
      highlight: 'text-orange-400',
      font: 'font-bebas'
    }
  },
  {
    id: 'space_station',
    name: 'Orbital',
    promptModifier: 'Prioritize sterile, white, clean, and high-tech space station interiors.',
    styles: {
      bg: 'bg-[#f4f7f6]',
      cardBg: 'bg-white',
      text: 'text-slate-900',
      subText: 'text-slate-400',
      accent: 'text-blue-600',
      accentHover: 'hover:text-orange-500',
      border: 'border-slate-200',
      highlight: 'text-red-500',
      font: 'font-mono'
    }
  },
  {
    id: 'vapor_light',
    name: 'Windows 95',
    promptModifier: 'Prioritize the gray-dominated, classic UI aesthetic of early 90s operating systems.',
    styles: {
      bg: 'bg-[#008080]',
      cardBg: 'bg-[#c0c0c0]',
      text: 'text-black',
      subText: 'text-black/60',
      accent: 'text-[#000080]',
      accentHover: 'hover:bg-gray-400',
      border: 'border-white border-t-2 border-l-2 border-gray-800 border-r-2 border-b-2',
      highlight: 'text-[#000080]',
      font: 'font-sans'
    }
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    promptModifier: 'Prioritize websites with heavy background blur, frosted glass elements, and soft lighting.',
    styles: {
      bg: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      cardBg: 'bg-white/10 backdrop-blur-md',
      text: 'text-white',
      subText: 'text-white/60',
      accent: 'text-white/80',
      accentHover: 'hover:bg-white/20',
      border: 'border-white/20',
      highlight: 'text-white',
      font: 'font-soft'
    }
  },
  {
    id: 'horror',
    name: 'Found Footage',
    promptModifier: 'Prioritize grainy, low-quality, unsettling, and hidden-camera aesthetics.',
    styles: {
      bg: 'bg-[#050505]',
      cardBg: 'bg-green-950/10',
      text: 'text-white/40',
      subText: 'text-white/10',
      accent: 'text-white/60',
      accentHover: 'hover:text-red-900',
      border: 'border-white/5',
      highlight: 'text-green-500',
      font: 'font-typewriter'
    }
  },
  {
    id: 'clay_dark',
    name: 'Deep Sea',
    promptModifier: 'Prioritize dark blue, pressure-heavy, and bioluminescent aesthetics.',
    styles: {
      bg: 'bg-[#000814]',
      cardBg: 'bg-[#001d3d]/80',
      text: 'text-[#00b4d8]',
      subText: 'text-[#0077b6]',
      accent: 'text-[#90e0ef]',
      accentHover: 'hover:text-white',
      border: 'border-[#003566]',
      highlight: 'text-[#caf0f8]',
      font: 'font-soft'
    }
  },
  {
    id: 'gold',
    name: 'Golden Hour',
    promptModifier: 'Prioritize warm, glowing, and luxurious golden aesthetics.',
    styles: {
      bg: 'bg-[#1a1400]',
      cardBg: 'bg-[#332a00]/80',
      text: 'text-[#ffd700]',
      subText: 'text-[#806b00]',
      accent: 'text-[#ffcc00]',
      accentHover: 'hover:text-white',
      border: 'border-[#554400]',
      highlight: 'text-[#fff5cc]',
      font: 'font-serif'
    }
  },
  {
    id: 'phantom',
    name: 'Phantom',
    promptModifier: 'Prioritize near-invisible, ethereal, and ghostly minimalist websites.',
    styles: {
      bg: 'bg-white',
      cardBg: 'bg-gray-50/10',
      text: 'text-gray-200',
      subText: 'text-gray-100',
      accent: 'text-gray-300',
      accentHover: 'hover:text-gray-900',
      border: 'border-gray-50',
      highlight: 'text-indigo-50',
      font: 'font-sans'
    }
  },
  {
    id: 'blood',
    name: 'Sanguine',
    promptModifier: 'Prioritize deep red and black aesthetics with a sense of ritual.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-red-950/40',
      text: 'text-red-700',
      subText: 'text-red-900',
      accent: 'text-red-600',
      accentHover: 'hover:text-white',
      border: 'border-red-950',
      highlight: 'text-stone-200',
      font: 'font-serif'
    }
  },
  {
    id: 'bio',
    name: 'Bio-Organic',
    promptModifier: 'Prioritize mossy greens, organic textures, and nature-inspired digital growths.',
    styles: {
      bg: 'bg-[#0a0f08]',
      cardBg: 'bg-[#152010]/80',
      text: 'text-emerald-200',
      subText: 'text-emerald-900',
      accent: 'text-lime-500',
      accentHover: 'hover:text-lime-300',
      border: 'border-emerald-950',
      highlight: 'text-emerald-400',
      font: 'font-serif'
    }
  },
  {
    id: 'circuit',
    name: 'Neural Circuit',
    promptModifier: 'Prioritize blueprint blues, glowing yellow lines, and technical schematics.',
    styles: {
      bg: 'bg-[#001122]',
      cardBg: 'bg-[#002244]/90',
      text: 'text-cyan-400',
      subText: 'text-blue-900',
      accent: 'text-yellow-400',
      accentHover: 'hover:text-white',
      border: 'border-blue-800',
      highlight: 'text-blue-300',
      font: 'font-futuristic'
    }
  },
  {
    id: 'pixel',
    name: '8-Bit Retro',
    promptModifier: 'Prioritize pixel art, limited color palettes, and classic arcade aesthetics.',
    styles: {
      bg: 'bg-[#222222]',
      cardBg: 'bg-[#333333]',
      text: 'text-green-400',
      subText: 'text-stone-600',
      accent: 'text-pink-500',
      accentHover: 'hover:text-cyan-400',
      border: 'border-stone-800 border-4',
      highlight: 'text-yellow-400',
      font: 'font-pixel'
    }
  },
  {
    id: 'gothic_digital',
    name: 'Cyber Gothic',
    promptModifier: 'Prioritize dark, ornate, yet high-tech aesthetics. Spikes, wires, and velvet.',
    styles: {
      bg: 'bg-[#080008]',
      cardBg: 'bg-[#150015]',
      text: 'text-fuchsia-100',
      subText: 'text-fuchsia-900',
      accent: 'text-fuchsia-500',
      accentHover: 'hover:text-white',
      border: 'border-fuchsia-950',
      highlight: 'text-red-500',
      font: 'font-gothic'
    }
  },
  {
    id: 'holy',
    name: 'The Cathedral',
    promptModifier: 'Prioritize divine, glowing gold, marble white, and ethereal light.',
    styles: {
      bg: 'bg-[#fafaf5]',
      cardBg: 'bg-white',
      text: 'text-stone-800',
      subText: 'text-amber-600',
      accent: 'text-amber-500',
      accentHover: 'hover:text-amber-300',
      border: 'border-amber-100',
      highlight: 'text-blue-400',
      font: 'font-serif'
    }
  },
  {
    id: 'industrial',
    name: 'Rust & Iron',
    promptModifier: 'Prioritize rusty oranges, cold steel grays, and heavy machinery vibes.',
    styles: {
      bg: 'bg-[#1a1512]',
      cardBg: 'bg-[#2a221d]',
      text: 'text-orange-200',
      subText: 'text-stone-600',
      accent: 'text-orange-600',
      accentHover: 'hover:text-orange-400',
      border: 'border-stone-800',
      highlight: 'text-stone-300',
      font: 'font-impact'
    }
  },
  {
    id: 'dream',
    name: 'Cloud Dream',
    promptModifier: 'Prioritize soft whites, pale blues, and fluffy, ethereal cloud aesthetics.',
    styles: {
      bg: 'bg-[#f0f4f8]',
      cardBg: 'bg-white/60',
      text: 'text-blue-900',
      subText: 'text-blue-200',
      accent: 'text-blue-400',
      accentHover: 'hover:text-blue-600',
      border: 'border-blue-50',
      highlight: 'text-white',
      font: 'font-soft'
    }
  },
  {
    id: 'glitch_white',
    name: 'Overexposed',
    promptModifier: 'Prioritize blindingly white, flickering, and high-energy digital glare.',
    styles: {
      bg: 'bg-white',
      cardBg: 'bg-gray-100',
      text: 'text-black',
      subText: 'text-gray-300',
      accent: 'text-gray-900',
      accentHover: 'hover:text-cyan-500',
      border: 'border-gray-200',
      highlight: 'text-red-500',
      font: 'font-mono'
    }
  },
  {
    id: 'lush_cave',
    name: 'Lush Cave',
    promptModifier: 'Prioritize deep jungle greens, warm earth tones, and bioluminescent highlights.',
    styles: {
      bg: 'bg-[#0b1a0e]',
      cardBg: 'bg-[#1a2e1d]/90',
      text: 'text-emerald-300',
      subText: 'text-emerald-700',
      accent: 'text-lime-400',
      accentHover: 'hover:text-white',
      border: 'border-emerald-900',
      highlight: 'text-emerald-100',
      font: 'font-soft'
    }
  },
  {
    id: 'papercraft',
    name: 'Papercraft',
    promptModifier: 'Prioritize beige paper textures, rough edges, and hand-drawn elements.',
    styles: {
      bg: 'bg-[#e6ddc4]',
      cardBg: 'bg-[#f5f0e1]',
      text: 'text-[#5d4037]',
      subText: 'text-[#8d6e63]',
      accent: 'text-[#3e2723]',
      accentHover: 'hover:text-black',
      border: 'border-[#a1887f] border-2',
      highlight: 'text-orange-700',
      font: 'font-serif'
    }
  },
  {
    id: 'noir',
    name: 'Noir Noir',
    promptModifier: 'Prioritize monochrome, high contrast, rain-slicked, and shadow-heavy aesthetics.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-neutral-900',
      text: 'text-white',
      subText: 'text-neutral-500',
      accent: 'text-neutral-300',
      accentHover: 'hover:text-white',
      border: 'border-neutral-800',
      highlight: 'text-stone-400',
      font: 'font-serif'
    }
  },
  {
    id: 'candy',
    name: 'Candy Land',
    promptModifier: 'Prioritize hyper-saturated pinks, blues, and yellows. Sugary sweet and loud.',
    styles: {
      bg: 'bg-pink-50',
      cardBg: 'bg-white/90',
      text: 'text-pink-600',
      subText: 'text-pink-200',
      accent: 'text-cyan-400',
      accentHover: 'hover:text-yellow-400',
      border: 'border-pink-100',
      highlight: 'text-fuchsia-500',
      font: 'font-soft'
    }
  },
  {
    id: 'inferno',
    name: 'Total Inferno',
    promptModifier: 'Prioritize burning oranges, blacks, and smoldering ember aesthetics.',
    styles: {
      bg: 'bg-[#110000]',
      cardBg: 'bg-[#220000]',
      text: 'text-orange-600',
      subText: 'text-red-950',
      accent: 'text-red-500',
      accentHover: 'hover:text-yellow-500',
      border: 'border-red-900',
      highlight: 'text-orange-400',
      font: 'font-impact'
    }
  },
  {
    id: 'y2k_metal',
    name: 'Y2K Metal',
    promptModifier: 'Chrome, deep saturated blues, metallic sheens and futuristic 1999 vibes.',
    styles: {
      bg: 'bg-blue-950',
      cardBg: 'bg-slate-800',
      text: 'text-cyan-200',
      subText: 'text-blue-400',
      accent: 'text-gray-300',
      accentHover: 'hover:text-white',
      border: 'border-cyan-700',
      highlight: 'text-cyan-300',
      font: 'font-mono'
    }
  },
  {
    id: 'hacker_green',
    name: 'Hacker Green',
    promptModifier: 'Pure black background with bright terminal green text. Classic hacker movie vibe.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-black',
      text: 'text-green-500',
      subText: 'text-green-800',
      accent: 'text-green-400',
      accentHover: 'hover:text-green-300',
      border: 'border-green-900',
      highlight: 'text-green-200',
      font: 'font-mono'
    }
  },
  {
    id: 'vapor_sunset',
    name: 'Vapor Sunset',
    promptModifier: 'Miami sunsets, palm trees, orange and pink gradients.',
    styles: {
      bg: 'bg-gradient-to-b from-purple-900 to-orange-500',
      cardBg: 'bg-black/50',
      text: 'text-pink-300',
      subText: 'text-orange-300',
      accent: 'text-yellow-400',
      accentHover: 'hover:text-white',
      border: 'border-pink-500',
      highlight: 'text-purple-300',
      font: 'font-sans'
    }
  },
  {
    id: 'win95',
    name: 'Windows 95',
    promptModifier: 'Teal backgrounds, gray boxes, classic UI elements.',
    styles: {
      bg: 'bg-[#008080]',
      cardBg: 'bg-[#c0c0c0]',
      text: 'text-black',
      subText: 'text-gray-700',
      accent: 'text-blue-800',
      accentHover: 'hover:text-black',
      border: 'border-white border-b-gray-800 border-r-gray-800 border-2',
      highlight: 'text-white',
      font: 'font-sans'
    }
  },
  {
    id: 'lofi_beats',
    name: 'Lo-Fi Study',
    promptModifier: 'Cozy, warm tones, rainy windows, relaxing aesthetic.',
    styles: {
      bg: 'bg-[#2b2a33]',
      cardBg: 'bg-[#423f4d]',
      text: 'text-[#e5d8d0]',
      subText: 'text-[#a39a93]',
      accent: 'text-[#ffad5c]',
      accentHover: 'hover:text-[#ffcda3]',
      border: 'border-[#595466]',
      highlight: 'text-[#d7c6b8]',
      font: 'font-sans'
    }
  },
  {
    id: 'cyber_punk_red',
    name: 'Cyberpunk Red',
    promptModifier: 'Gritty sci-fi, dark grays, and piercing neon reds.',
    styles: {
      bg: 'bg-neutral-950',
      cardBg: 'bg-zinc-900',
      text: 'text-red-500',
      subText: 'text-red-900',
      accent: 'text-rose-500',
      accentHover: 'hover:text-red-400',
      border: 'border-red-900',
      highlight: 'text-red-300',
      font: 'font-mono'
    }
  },
  {
    id: 'pastel_goth',
    name: 'Pastel Goth',
    promptModifier: 'Creepy but cute. Lavender, black, and pastel pink.',
    styles: {
      bg: 'bg-[#1a181f]',
      cardBg: 'bg-[#2c2633]',
      text: 'text-[#f5a3c7]',
      subText: 'text-[#a28eb3]',
      accent: 'text-[#d4b3ff]',
      accentHover: 'hover:text-white',
      border: 'border-[#4a3f59]',
      highlight: 'text-[#ffcce0]',
      font: 'font-sans'
    }
  },
  {
    id: 'oceanic',
    name: 'Deep Ocean',
    promptModifier: 'Bioluminescence, deep blues, dark aquamarines.',
    styles: {
      bg: 'bg-[#000b18]',
      cardBg: 'bg-[#021f3b]',
      text: 'text-[#8cd6ff]',
      subText: 'text-[#1f668f]',
      accent: 'text-[#00ffcc]',
      accentHover: 'hover:text-white',
      border: 'border-[#0a3861]',
      highlight: 'text-[#cdf1ff]',
      font: 'font-sans'
    }
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    promptModifier: 'Sunlit warmth, dripping gold, rich amber.',
    styles: {
      bg: 'bg-[#3b2100]',
      cardBg: 'bg-[#5c3706]',
      text: 'text-[#ffd382]',
      subText: 'text-[#b38542]',
      accent: 'text-[#ffea00]',
      accentHover: 'hover:text-white',
      border: 'border-[#8c5812]',
      highlight: 'text-[#ffe5b3]',
      font: 'font-serif'
    }
  },
  {
    id: 'blackwood_brutalism',
    name: 'Blackwood Brutalism',
    promptModifier: 'Prioritize gothic spires, brutalist concrete, and perfect glass. A mix of manicured academic snobbery and unsettling predatory darkness.',
    styles: {
      bg: 'bg-[#111111]',
      cardBg: 'bg-[#1a1a1a]',
      text: 'text-stone-300',
      subText: 'text-stone-500',
      accent: 'text-stone-100',
      accentHover: 'hover:text-red-900',
      border: 'border-stone-800',
      highlight: 'text-stone-400',
      font: 'font-serif'
    }
  },
  {
    id: 'pink_parasite',
    name: 'Siren Hyper-Pop',
    promptModifier: 'Prioritize candy pink, hyper-saccharine bubblegum, and pastel pink sweater vest aesthetics hiding a horrific cult-like decay. Neon pink and copper.',
    styles: {
      bg: 'bg-pink-100',
      cardBg: 'bg-white',
      text: 'text-fuchsia-900',
      subText: 'text-fuchsia-600',
      accent: 'text-pink-500',
      accentHover: 'hover:text-fuchsia-700',
      border: 'border-pink-300',
      highlight: 'text-red-600',
      font: 'font-soft'
    }
  },
  {
    id: 'panopticon_obsidian',
    name: 'Panopticon Obsidian',
    promptModifier: 'Prioritize clean, minimalist obsidian, chrome, and sterile holographic glowing pink interfaces. Surveillance and control.',
    styles: {
      bg: 'bg-[#000000]',
      cardBg: 'bg-zinc-950',
      text: 'text-zinc-300',
      subText: 'text-zinc-600',
      accent: 'text-pink-500',
      accentHover: 'hover:text-pink-400',
      border: 'border-zinc-800',
      highlight: 'text-fuchsia-400',
      font: 'font-mono'
    }
  }
];

export const TIME_ERAS: TimeEra[] = [
  { id: 'all', name: 'All Time', range: '1991-2025', description: 'The entire history of the web.' },
  { id: 'pre_web', name: 'Pre-Web', range: '1960-1990', description: 'Theoretical sites emulating ARPANET, BBS, and early intranet systems.' },
  { id: 'early', name: 'Static Era', range: '1991-1995', description: 'The birth of the web. pure HTML, no CSS, just information.' },
  { id: 'web1', name: 'Web 1.0 Boom', range: '1996-2000', description: 'Geocities, framesets, animated GIFs, and the first web portals.' },
  { id: 'y2k_panic', name: 'Y2K Panic', range: '1999', description: 'Apocalyptic prepping, frantic patching, and metallic aesthetics.' },
  { id: 'post_bubble', name: 'The Silent Years', range: '2001-2004', description: 'Web after the crash. Flash starts to dominate interactive art.' },
  { id: 'flash_peak', name: 'Flash Golden Age', range: '2004-2008', description: 'The peak of Flash gaming, portals, and heavy interactive experiments.' },
  { id: 'web2', name: 'Social Dawn', range: '2005-2009', description: 'The rise of blogs, AJAX, early YouTube, and communal digital spaces.' },
  { id: 'golden_age', name: 'The Golden Age', range: '2008-2012', description: 'The peak of creative web exploration before extreme centralization.' },
  { id: 'app_era', name: 'The App Era', range: '2010-2015', description: 'Mobile-first design, skeuomorphism dying, and the rise of the cloud.' },
  { id: 'corporate_web', name: 'Corporate Web', range: '2013-2015', description: 'Flat design, boring minimalism, and the death of uniqueness.' },
  { id: 'modern', name: 'Modern Web', range: '2016-2023', description: 'WebGL, SPAs, and complex interactivity.' },
  { id: 'crypto_bubble', name: 'Web3 Delusion', range: '2020-2022', description: 'Apes, scams, DAOs, and weird blockchain experiments.' },
  { id: 'ai_dawn', name: 'AI Genesis', range: '2024-2025', description: 'Generative interfaces, LLM agents, and the breakdown of static content.' },
  { id: 'void_future', name: 'The Void', range: '2030+', description: 'Speculative future web. Post-reality digital spaces.' },
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
  },
  {
    id: 'staggeringbeauty',
    title: 'Staggering Beauty',
    url: 'http://www.staggeringbeauty.com/',
    description: 'WARNING: FLASHING LIGHTS. A strangely hypnotic worm that freaks out when you shake your mouse too fast.',
    category: Category.USELESS_WEB,
    tags: ['worm', 'flashy', 'loud', 'jump-scare'],
    yearEstablished: '2012',
    designVibe: 'Seizure Warning',
    technicalStack: ['HTML5 Canvas', 'JS'],
    vibeScore: 95
  },
  {
    id: 'badgerbadger',
    title: 'Badger Badger Badger',
    url: 'https://badgerbadgerbadger.com/',
    description: 'Mushroom mushroom.',
    category: Category.RETRO,
    tags: ['classic', 'loop', 'animation', 'flash-era'],
    yearEstablished: '2003',
    designVibe: 'Looping Madness',
    technicalStack: ['GIF', 'Audio'],
    vibeScore: 90
  },
  {
    id: 'zoomquilt',
    title: 'Zoomquilt',
    url: 'https://zoomquilt.org/',
    description: 'An infinitely zooming, mesmerizing collaborative artwork.',
    category: Category.INTERACTIVE_ART,
    tags: ['zoom', 'art', 'hypnotic', 'collaboration'],
    yearEstablished: '2004',
    designVibe: 'Infinite Zoom',
    technicalStack: ['Canvas', 'Image rendering'],
    vibeScore: 88
  },
  {
    id: 'eelslap',
    title: 'Eel Slap!',
    url: 'http://eelslap.com/',
    description: 'Move your mouse to slap a man with an eel. In slow motion.',
    category: Category.USELESS_WEB,
    tags: ['interactive', 'funny', 'useless-web'],
    yearEstablished: 'Unknown',
    designVibe: 'Aggressive Fish',
    technicalStack: ['HTML5 Video'],
    vibeScore: 85
  },
  {
    id: 'corndog_io',
    title: 'Corndog.io',
    url: 'http://corndog.io/',
    description: 'Nothing but falling corndogs. Glorious, infinite corndogs.',
    category: Category.USELESS_WEB,
    tags: ['corndogs', 'loop', 'food'],
    yearEstablished: 'Unknown',
    designVibe: 'Food Void',
    technicalStack: ['CSS Animation'],
    vibeScore: 70
  },
  {
    id: 'always_judge',
    title: 'Always Judge A Book By Its Cover',
    url: 'https://www.alwaysjudgeabookbyitscover.com/',
    description: 'A website where you judge books by their covers.',
    category: Category.LITERATURE,
    tags: ['books', 'interactive', 'fun'],
    yearEstablished: 'Unknown',
    designVibe: 'Library',
    technicalStack: ['CSS', 'JS'],
    vibeScore: 75
  },
  {
    id: 'bored_button',
    title: 'Bored Button',
    url: 'https://www.boredbutton.com/',
    description: 'A button you press when you are bored. Takes you to random interesting and useless web pages.',
    category: Category.TOOLS,
    tags: ['index', 'boredom', 'random'],
    yearEstablished: '2006',
    designVibe: 'Red Button',
    technicalStack: ['JS Redirects'],
    vibeScore: 82
  },
  {
    id: 'astronaut_io',
    title: 'Astronaut.io',
    url: 'http://astronaut.io/',
    description: 'Watch unlisted, zero-view YouTube videos from a week ago, continuously playing like a gentle stream of consciousness.',
    category: Category.MYSTERY,
    tags: ['video', 'voyeurism', 'random'],
    yearEstablished: '2015',
    designVibe: 'Space Voyage',
    technicalStack: ['YouTube API'],
    vibeScore: 92
  },
  {
    id: 'the_f_word',
    title: 'The F***ing Word',
    url: 'https://theuselessweb.com/',
    description: 'Because we all need to be taken to another useless website.',
    category: Category.USELESS_WEB,
    tags: ['directory', 'random'],
    yearEstablished: '2012',
    designVibe: 'Big Text',
    technicalStack: ['JS'],
    vibeScore: 100
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
  [Category.PLACES]: 'bg-green-600',
  [Category.WEB_SEARCH]: 'bg-cyan-500',
  [Category.GAMES]: 'bg-red-500',
  [Category.BLOGS]: 'bg-teal-500',
  [Category.LITERATURE]: 'bg-amber-600',
  [Category.FORGOTTEN_MEDIA]: 'bg-stone-500',
  [Category.CONSPIRACIES]: 'bg-zinc-800',
  [Category.SOFTWARE_ARCHIVE]: 'bg-blue-700',
  [Category.WEIRD]: 'bg-fuchsia-600',
  [Category.PORTALS]: 'bg-teal-700',
  [Category.HARDWARE]: 'bg-slate-500',
  [Category.COMMUNITY]: 'bg-yellow-600',
  [Category.CREEPYPASTA]: 'bg-gray-900',
};
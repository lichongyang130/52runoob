/* Secondary category (subcategory) taxonomy, featured topics, related topic
   trees, and showcase articles — modeled after wikihow.com/Category:Games. */

function slugifyTopic(name) {
  return String(name || "")
    .trim()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unslugifyTopic(slug) {
  return String(slug || "")
    .replace(/^Category:/i, "")
    .replace(/-/g, " ")
    .trim();
}

const GAMES_RELATED_TOPICS = [
  {
    title: "Backyard Games",
    slug: "Backyard-Games",
    children: [
      "Backyard Ball Games",
      "Forts and Treehouses",
      "Hiding Games",
      "Lawn Games",
      "Tag and Chasing Games",
      "Tossing Games",
      "Water Recreation",
    ],
  },
  {
    title: "Board Games",
    slug: "Board-Games",
    children: [
      "Board Games for Children",
      "Making Board Games",
      "Monopoly",
      "Chess and Checkers",
      "Resource Management Board Games",
      "Strategy Board Games",
    ],
  },
  {
    title: "Card Games",
    slug: "Card-Games",
    children: [
      "Card Decks",
      "Card Games for Children",
      "Card Games for One",
      "Card Tricks",
      "Casino Card Games",
      "Matching Card Games",
      "Shedding Card Games",
      "Trading Card Games",
      "Trick Taking Card Games",
    ],
  },
  {
    title: "Creating Games",
    slug: "Creating-Games",
    children: [
      "Making Board Games",
      "Making Paper Games",
      "Video Game Creation",
    ],
  },
  {
    title: "Games for Children",
    slug: "Games-for-Children",
    children: [
      "Board Games for Children",
      "Card Games for Children",
      "Clapping Games",
      "Party Games for Kids",
    ],
  },
  {
    title: "Games of Chance",
    slug: "Games-of-Chance",
    children: [
      "Bingo",
      "Dice Games",
      "Increasing Odds of Winning",
      "Lotteries and Scratchcard Games",
      "Poker",
      "Rock Paper Scissors Games",
    ],
  },
  {
    title: "Games of Imagination",
    slug: "Games-of-Imagination",
    children: [
      "Fantasy Worlds",
      "Role Playing",
      "Storytelling",
      "Tabletop Campaigns",
    ],
  },
  {
    title: "Paper and Pencil Games",
    slug: "Paper-and-Pencil-Games",
    children: [
      "Dots and Boxes",
      "Hangman",
      "M.A.S.H.",
      "Sprouts",
      "Tic Tac Toe",
    ],
  },
  {
    title: "Party Games",
    slug: "Party-Games",
    children: [
      "Holiday Party Games",
      "Guessing and Mystery Games",
      "Icebreaker Games",
      "Party Games for Kids",
      "Planning Party Games",
      "Talking Games",
    ],
  },
  {
    title: "Puzzles and Memory Games",
    slug: "Puzzles-and-Memory-Games",
    children: [
      "Cryptography",
      "Mathematical Puzzles",
      "Rubik's Cube",
      "Trivia Nights",
      "Word Games",
    ],
  },
  {
    title: "Role Playing Games",
    slug: "Role-Playing-Games",
    children: [
      "Detective Role Playing Games",
      "Dungeons and Dragons",
      "Character Sheets",
    ],
  },
  {
    title: "Video Games",
    slug: "Video-Games",
    children: [
      "Arcade Games",
      "Buying and Selling Video Games",
      "Electronic Game Strategies",
      "Joysticks and Controllers",
      "Multi Platform Games",
      "PC Games",
      "Strategy Video Games",
      "Video Game Creation",
    ],
  },
];

const GAMES_ARTICLES = [
  {
    slug: "Play-Othello",
    title: "Play Othello: Game Rules & Strategy Guide",
    kicker: "How to",
    hero_image: "puzzle",
    expert: true,
    featured: true,
    summary:
      "Master the 8×8 board, outflank your opponent's discs, and control the four corners to win Othello consistently.",
  },
  {
    slug: "Win-at-Tic-Tac-Toe",
    title: "Win at Tic Tac Toe Every Time",
    kicker: "How to",
    hero_image: "puzzle",
    expert: true,
    featured: true,
    summary:
      "Learn the corner opening, double-trap fork setup, and center counter-moves that guarantee a win or draw.",
  },
  {
    slug: "Play-Jenga",
    title: "Setup and Play a Game of Jenga",
    kicker: "How to",
    hero_image: "wood",
    expert: true,
    featured: true,
    summary:
      "Stack all 54 hardwood blocks into an 18-level tower, test loose center pieces with one hand, and keep the tower balanced.",
  },
  {
    slug: "Play-Chopsticks",
    title: "Play the Chopsticks Finger Game (with Fun Variations)",
    kicker: "How to",
    hero_image: "craft",
    expert: true,
    featured: true,
    summary:
      "Use simple finger taps and tactical splits to reach five fingers on both of your opponent's hands using no supplies at all.",
  },
  {
    slug: "Play-Dots-and-Boxes",
    title: "Play the Dots and Boxes Game",
    kicker: "How to",
    hero_image: "draw",
    expert: true,
    featured: true,
    summary:
      "Draw a clean dot grid on paper, control long chains of boxes in the endgame, and outscore your opponent.",
  },
  {
    slug: "Play-Darts",
    title: "Play Darts: Scoring, Throwing, and Game Rules",
    kicker: "How to",
    hero_image: "target",
    expert: true,
    featured: true,
    summary:
      "Stand at the regulation throw line, align your dominant eye with the dart tip, and count down cleanly from 501 to zero.",
  },
  {
    slug: "Play-Cats-Cradle",
    title: "Do Cat's Cradle and Similar String Designs",
    kicker: "How to",
    hero_image: "craft",
    expert: true,
    featured: true,
    summary:
      "Loop a simple length of string across your palms and trade classic figures like the Soldier's Bed, Candles, and Manger.",
  },
  {
    slug: "Play-Marbles",
    title: "Play a Classic Game of Marbles",
    kicker: "How to",
    hero_image: "globe",
    expert: true,
    featured: true,
    summary:
      "Chalk a smooth three-foot ring, knuckle down with your shooter marble, and knock target marbles out of the circle.",
  },
  {
    slug: "Play-Hopscotch",
    title: "Play Hopscotch: Rules & Court Layout",
    kicker: "How to",
    hero_image: "run",
    expert: true,
    featured: false,
    summary:
      "Draw a ten-square court with sidewalk chalk, toss your marker stone accurately, and hop the course on one foot.",
  },
  {
    slug: "Plan-an-Escape-Room",
    title: "Plan an Escape Room at Home",
    kicker: "How to",
    hero_image: "key",
    expert: true,
    featured: false,
    summary:
      "Design a 60-minute puzzle flow with lockboxes, hidden ciphers, red herrings, and a clear final key clue.",
  },
  {
    slug: "Play-MASH",
    title: "Play M.A.S.H.: The Classic Paper Prediction Game",
    kicker: "How to",
    hero_image: "book",
    expert: false,
    featured: false,
    summary:
      "Set up categories on a sheet of notebook paper, draw a spiral to find your magic number, and eliminate choices around the page.",
  },
  {
    slug: "Make-Jacobs-Ladder-From-String",
    title: "Make Jacob's Ladder out of String Step by Step",
    kicker: "How to",
    hero_image: "craft",
    expert: true,
    featured: false,
    summary:
      "Weave a four-diamond string ladder between your thumbs and index fingers in six repeatable hand movements.",
  },
  {
    slug: "Play-Table-Football",
    title: "Play Table Football (Foosball): Complete Rules & Shots",
    kicker: "How to",
    hero_image: "trophy",
    expert: true,
    featured: false,
    summary:
      "Control the 3-rod and 5-rod without spinning, pass cleanly along the wall, and execute a crisp pull shot.",
  },
  {
    slug: "Play-Tiddlywinks",
    title: "Play Tiddlywinks: Beginner Rules & Squidging Tips",
    kicker: "How to",
    hero_image: "target",
    expert: true,
    featured: false,
    summary:
      "Press the edge of each wink with your squidger disc to arc shots into the center pot or cover opponent winks.",
  },
  {
    slug: "Play-Hangman",
    title: "Play Hangman: Rules, Word Lists, and Strategy",
    kicker: "How to",
    hero_image: "draw",
    expert: true,
    featured: false,
    summary:
      "Pick high-frequency vowels first, narrow down consonant clusters, or choose tricky words with uncommon letters.",
  },
  {
    slug: "Play-Five-Stones",
    title: "Play the Traditional Game of Five Stones",
    kicker: "How to",
    hero_image: "globe",
    expert: true,
    featured: false,
    summary:
      "Toss and catch five small pebbles in ones, twos, threes, and fours before sweeping the arch on the final round.",
  },
];

const SUBCATEGORY_DATA = {
  Games: {
    slug: "Games",
    name: "Games",
    parentSlug: "Hobbies-and-Crafts",
    parentName: "Hobbies and Crafts",
    emoji: "🎲",
    color: "#7cb342",
    description:
      "Discover new games and become a master of your old favorites with Howcompass's Games category! Learn all about classic games, board games, card games, paper-and-pencil games, and party games.",
    introLinks: [
      { label: "Othello", href: "/how-to/Play-Othello" },
      { label: "marbles", href: "/how-to/Play-Marbles" },
      { label: "Tiddlywinks", href: "/how-to/Play-Tiddlywinks" },
      { label: "Dots and Boxes", href: "/how-to/Play-Dots-and-Boxes" },
      { label: "Chopsticks", href: "/how-to/Play-Chopsticks" },
    ],
    featuredTopics: [
      { name: "Board Games", slug: "Board-Games", illus: "puzzle" },
      { name: "Card Games", slug: "Card-Games", illus: "craft" },
      { name: "Party Games", slug: "Party-Games", illus: "music" },
      { name: "Paper & Pencil Games", slug: "Paper-and-Pencil-Games", illus: "draw" },
      { name: "Puzzles & Memory", slug: "Puzzles-and-Memory-Games", illus: "idea" },
      { name: "Video Games", slug: "Video-Games", illus: "code" },
    ],
    relatedTopics: GAMES_RELATED_TOPICS,
    articles: GAMES_ARTICLES,
  },
  Crafts: {
    slug: "Crafts",
    name: "Crafts",
    parentSlug: "Hobbies-and-Crafts",
    parentName: "Hobbies and Crafts",
    emoji: "🧶",
    color: "#7cb342",
    description:
      "Turn paper, yarn, fabric, and everyday household materials into handmade projects with Howcompass's step-by-step Crafts tutorials.",
    featuredTopics: [
      { name: "Paper Crafts", slug: "Paper-Crafts", illus: "craft" },
      { name: "Origami", slug: "Origami", illus: "draw" },
      { name: "Knitting & Crochet", slug: "Knitting-and-Crochet", illus: "sew" },
      { name: "Jewelry Making", slug: "Jewelry-Making", illus: "star" },
    ],
    relatedTopics: [
      {
        title: "Paper and Origami",
        slug: "Paper-Crafts",
        children: ["Origami", "Papercraft", "Bookbinding", "Card Making", "Scrapbooking"],
      },
      {
        title: "Fiber and Textile Arts",
        slug: "Knitting-and-Crochet",
        children: ["Knitting", "Crochet", "Embroidery", "Quilting", "Macrame", "Sewing"],
      },
      {
        title: "Decorative Crafts",
        slug: "Decorative-Crafts",
        children: ["Candle Making", "Soap Making", "Pottery and Clay", "Resin Crafts", "Floral Arrangements"],
      },
    ],
    articles: GAMES_ARTICLES.slice(4, 14),
  },
  Drawing: {
    slug: "Drawing",
    name: "Drawing",
    parentSlug: "Hobbies-and-Crafts",
    parentName: "Hobbies and Crafts",
    emoji: "✏️",
    color: "#7cb342",
    description:
      "Build confident line control, perspective, shading, and figure drawing skills from your very first sketchbook page.",
    featuredTopics: [
      { name: "Pencil Sketching", slug: "Pencil-Sketching", illus: "draw" },
      { name: "Perspective & Shading", slug: "Perspective-and-Shading", illus: "art" },
      { name: "Portraits & Figures", slug: "Portraits-and-Figures", illus: "user" },
      { name: "Inking & Line Art", slug: "Inking-and-Line-Art", illus: "book" },
    ],
    relatedTopics: [
      {
        title: "Drawing Fundamentals",
        slug: "Drawing-Fundamentals",
        children: ["Contour Drawing", "Gesture Sketching", "One-Point Perspective", "Two-Point Perspective", "Value Scales"],
      },
      {
        title: "Subjects to Draw",
        slug: "Subjects-to-Draw",
        children: ["Human Faces", "Hands and Feet", "Animals", "Landscapes", "Still Life", "Botanical Illustration"],
      },
    ],
    articles: [
      {
        slug: "Learn-to-Draw-for-Beginners",
        title: "Learn to Draw for Beginners",
        kicker: "How to",
        hero_image: "draw",
        image: "/img/steps/Learn-to-Draw-for-Beginners/01.jpg",
        expert: true,
        featured: true,
        summary: "A 24-step studio curriculum covering pencil grip, basic forms, light and shadow, and daily sketching habits.",
      },
      ...GAMES_ARTICLES.slice(0, 7),
    ],
  },
};

/* Primary category enrichments so /category/Hobbies-and-Crafts, /category/Arts-and-Entertainment, etc.
   also display Featured Topics and Related Topics trees just like wikiHow. */
const PRIMARY_CATEGORY_ENRICHMENTS = {
  "Arts-and-Entertainment": {
    featuredTopics: [
      { name: "Artwork", slug: "Artwork", illus: "art" },
      { name: "Drawing", slug: "Drawing", illus: "draw" },
      { name: "Books", slug: "Books", illus: "book" },
      { name: "Movies", slug: "Movies", illus: "camera" },
      { name: "Music", slug: "Music", illus: "music" },
    ],
    relatedTopics: [
      {
        title: "Visual Arts",
        slug: "Artwork",
        children: ["Drawing", "Painting", "Watercolors", "Sketchbooks", "Color Theory", "Calligraphy"],
      },
      {
        title: "Music and Instruments",
        slug: "Music",
        children: ["Guitar", "Piano", "Drums and Percussion", "Singing", "Music Theory"],
      },
      {
        title: "Literature and Film",
        slug: "Books",
        children: ["Creative Writing", "Poetry", "Reading Habits", "Filmmaking", "Screenwriting"],
      },
    ],
  },
  "Hobbies-and-Crafts": {
    featuredTopics: [
      { name: "Games", slug: "Games", illus: "puzzle" },
      { name: "Crafts", slug: "Crafts", illus: "craft" },
      { name: "Drawing", slug: "Drawing", illus: "draw" },
      { name: "Photography", slug: "Photography", illus: "camera" },
    ],
    relatedTopics: GAMES_RELATED_TOPICS.slice(0, 8),
  },
  "Computers-and-Electronics": {
    featuredTopics: [
      { name: "Computers", slug: "Computers", illus: "laptop" },
      { name: "Phone Skills", slug: "Phone-Skills", illus: "phone" },
      { name: "Technology Hacks", slug: "Technology-Hacks", illus: "code" },
      { name: "Home Networks", slug: "Home-Networks", illus: "wifi" },
    ],
    relatedTopics: [
      {
        title: "Computer Maintenance",
        slug: "Computers",
        children: ["Laptop Speed Optimization", "SSD Upgrades", "Operating Systems", "Keyboard Shortcuts", "Backups"],
      },
      {
        title: "Mobile Devices",
        slug: "Phone-Skills",
        children: ["Battery Health", "Storage Cleanup", "Mobile Security", "Photography Settings"],
      },
      {
        title: "Internet and Privacy",
        slug: "Technology-Hacks",
        children: ["Password Managers", "Wi-Fi Troubleshooting", "Browser Privacy", "Two-Factor Authentication"],
      },
    ],
  },
  "Food-and-Entertaining": {
    featuredTopics: [
      { name: "Baking", slug: "Baking", illus: "bread" },
      { name: "Everyday Cooking", slug: "Everyday-Cooking", illus: "cook" },
      { name: "Coffee & Tea", slug: "Coffee-and-Tea", illus: "coffee" },
      { name: "Hosting & Table Setting", slug: "Hosting", illus: "plate" },
    ],
    relatedTopics: [
      {
        title: "Bread and Baking",
        slug: "Baking",
        children: ["Artisan Loaves", "Yeast Doughs", "Sourdough", "Pastries", "Oven Steaming"],
      },
      {
        title: "Kitchen Skills",
        slug: "Everyday-Cooking",
        children: ["Knife Skills", "Pan Sauces", "Eggs and Breakfast", "Meal Prep", "Food Storage"],
      },
    ],
  },
  "Home-and-Garden": {
    featuredTopics: [
      { name: "Houseplants", slug: "Houseplants", illus: "plant" },
      { name: "Gardening", slug: "Gardening", illus: "leaf" },
      { name: "Home Maintenance", slug: "Home-Maintenance", illus: "home" },
      { name: "Cleaning & Organizing", slug: "Cleaning", illus: "sparkle" },
    ],
    relatedTopics: [
      {
        title: "Indoor Plants and Gardening",
        slug: "Houseplants",
        children: ["Watering Schedules", "Potting Mixes", "Propagation", "Light Placement", "Repotting"],
      },
      {
        title: "Home Care and Repair",
        slug: "Home-Maintenance",
        children: ["Plumbing Basics", "Wall Patching", "Tool Kits", "Seasonal Maintenance"],
      },
    ],
  },
};

function getSubcategoryInfo(rawSlug) {
  const clean = String(rawSlug || "").replace(/^Category:/i, "");
  if (SUBCATEGORY_DATA[clean]) return SUBCATEGORY_DATA[clean];

  // Match case-insensitively
  const foundKey = Object.keys(SUBCATEGORY_DATA).find(
    (k) => k.toLowerCase() === clean.toLowerCase()
  );
  if (foundKey) return SUBCATEGORY_DATA[foundKey];

  // Check if it's one of the child topics inside GAMES_RELATED_TOPICS
  const label = unslugifyTopic(clean);
  return {
    slug: clean,
    name: label,
    parentSlug: "Hobbies-and-Crafts",
    parentName: "Hobbies and Crafts",
    emoji: "🧭",
    color: "#7cb342",
    description: `Explore step-by-step tutorials, rules, and expert techniques in Howcompass's ${label} category. Whether you are just getting started or refining your skills, our illustrated guides walk you through every stage clearly.`,
    featuredTopics: SUBCATEGORY_DATA.Games.featuredTopics,
    relatedTopics: GAMES_RELATED_TOPICS,
    articles: GAMES_ARTICLES,
  };
}

function getPrimaryEnrichment(slug) {
  return (
    PRIMARY_CATEGORY_ENRICHMENTS[slug] || {
      featuredTopics: [
        { name: "Beginner Guides", slug: "Games", illus: "compass" },
        { name: "Step-by-Step Tutorials", slug: "Crafts", illus: "book" },
        { name: "Expert Techniques", slug: "Drawing", illus: "star" },
        { name: "Practice & Habits", slug: "Games", illus: "check" },
      ],
      relatedTopics: GAMES_RELATED_TOPICS.slice(0, 6),
    }
  );
}

module.exports = {
  slugifyTopic,
  unslugifyTopic,
  getSubcategoryInfo,
  getPrimaryEnrichment,
  GAMES_RELATED_TOPICS,
  GAMES_ARTICLES,
  SUBCATEGORY_DATA,
};

/* Primary & Secondary category taxonomy, Featured Topics, Related Topics trees,
   Featured Articles, Main Articles, and New Articles — modeled after
   https://www.wikihow.com/Category:Arts-and-Entertainment and
   https://www.wikihow.com/Category:Games. */

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

/* ============================================================================
   1. ARTS AND ENTERTAINMENT (Primary Category: Category:Arts-and-Entertainment)
   ============================================================================ */
const ARTS_RELATED_TOPICS = [
  {
    title: "Amusement and Theme Parks",
    slug: "Amusement-and-Theme-Parks",
    children: ["Disneyland and Disney World", "Roller Coasters", "Water Parks"],
  },
  {
    title: "Artwork",
    slug: "Artwork",
    children: [
      "Art Collection",
      "Art Media",
      "Art Studies",
      "Artwork Care and Maintenance",
      "Calligraphy",
      "Canvas",
      "Careers in Art",
      "Framing",
      "Graphic Design",
      "Painting",
      "Sculpting",
      "Selling Arts and Crafts",
      "Wall Art",
    ],
  },
  {
    title: "Books",
    slug: "Books",
    children: [
      "Audiobooks",
      "Book Crafts",
      "Book Fandom",
      "Book Reviews",
      "Caring for Books",
      "Children's Books",
      "Choosing Books",
      "Comics",
      "EBook Readers",
      "Goodreads",
      "Libraries",
      "Making Comics",
      "Manga",
    ],
  },
  {
    title: "Celebrities",
    slug: "Celebrities",
    children: [
      "Celebrity Fandom",
      "Celebrity Style",
      "Contacting Celebrities",
      "Fame",
      "YouTube Celebrities",
    ],
  },
  {
    title: "Concerts",
    slug: "Concerts",
    children: [
      "Concert Preparation",
      "Dressing for Concerts",
      "Music Festivals",
    ],
  },
  {
    title: "Cosplay",
    slug: "Cosplay",
    children: [
      "Animal Cosplay",
      "Anime Character Cosplay",
      "Movie Character Cosplay",
      "TV Show Character Cosplay",
    ],
  },
  {
    title: "Costumes",
    slug: "Costumes",
    children: [
      "Animal Costumes",
      "Animated Character Costumes",
      "Book Character Costumes",
      "Costume Accessories",
      "Fantasy Costumes",
      "Halloween Costumes",
      "Historical Costumes",
      "Movie Character Costumes",
      "Toy Costumes",
      "TV Show Character Costumes",
    ],
  },
  {
    title: "Event Tickets",
    slug: "Event-Tickets",
    children: ["Ticketbud", "Concert Seating"],
  },
  {
    title: "Fandom",
    slug: "Fandom",
    children: [
      "Animation Fandom",
      "Book Fandom",
      "Celebrity Fandom",
      "Contacting Celebrities",
      "Disney Fandom",
      "Games Fandom",
      "Harry Potter Fandom",
      "Movie Appreciation",
      "Music Appreciation",
      "Pokemon Fandom",
      "Sports Fandom",
      "Star Wars Fandom",
      "TV Fandom",
    ],
  },
  {
    title: "Fireworks",
    slug: "Fireworks",
    children: ["Model Rockets", "Sparklers"],
  },
  {
    title: "Fun Activities",
    slug: "Fun-Activities",
    children: [
      "Boredom Busters",
      "Jokes",
      "Pranks (Practical Jokes)",
      "Staying Awake All Night",
      "Tricks",
      "Trivia Nights",
    ],
  },
  {
    title: "Movies",
    slug: "Movies",
    children: [
      "Careers in Film",
      "Choosing Movies",
      "Cinemas",
      "Film Studies",
      "Filmmaking",
      "Movie Appreciation",
      "Movie Collections",
      "Screenwriting",
      "Watching Movies Online",
    ],
  },
  {
    title: "Music",
    slug: "Music",
    children: [
      "Bands",
      "Children's Music",
      "Country Music",
      "Hip Hop Music",
      "Music Appreciation",
      "Music Collections",
      "Music Occupations",
      "Music Production",
      "Music Studies",
      "Music Techniques",
      "Musical Instruments",
      "Pop Music",
      "Rapping",
      "Singing",
      "Songs",
      "Streaming Music Services",
    ],
  },
  {
    title: "Performing Arts",
    slug: "Performing-Arts",
    children: [
      "Acting",
      "Auditioning",
      "Dancing",
      "Magic and Illusion Performance",
      "Performing Arts Careers",
      "Performing Comedy",
      "Theater",
    ],
  },
  {
    title: "Role Playing",
    slug: "Role-Playing",
    children: [
      "Adventure Role Playing",
      "Fantasy Character Role Playing",
      "Online Role Playing",
      "Supernatural Role Playing",
    ],
  },
  {
    title: "Storytelling",
    slug: "Storytelling",
    children: ["Oral Storytelling", "Narrative Structure", "Worldbuilding"],
  },
  {
    title: "TV Viewing and Shows",
    slug: "TV-Viewing-and-Shows",
    children: [
      "Apple TV",
      "Game Shows",
      "MTV",
      "Nickelodeon",
      "Reality Television",
      "Television Spoilers",
      "Television Talk Shows",
      "The Disney Channel",
      "TV Fandom",
      "Watching Anime",
      "Watching Cartoons",
      "Watching Television Online",
    ],
  },
];

const ARTS_ARTICLES = [
  {
    slug: "Hold-a-Drumstick",
    title: "Hold Drumsticks: Basic Tutorials for Beginners",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    featured: true,
    summary:
      "Master the American, German, French, and Traditional drumstick grips for balanced power, rebound control, and wrist comfort.",
  },
  {
    slug: "Learn-to-Draw-for-Beginners",
    title: "Learn to Draw for Beginners",
    kicker: "How to",
    hero_image: "draw",
    image: "/img/steps/Learn-to-Draw-for-Beginners/01.jpg",
    expert: true,
    featured: true,
    summary:
      "Build line confidence, 3D form construction, perspective, and shading with a studio-tested 24-step drawing curriculum.",
  },
  {
    slug: "Dress-Up-for-a-Disco-Party",
    title: "Dress Up for a Disco Party",
    kicker: "How to",
    hero_image: "star",
    expert: true,
    featured: true,
    summary:
      "Put together an authentic 1970s disco outfit with flared trousers, metallic fabrics, platform shoes, and retro accessories.",
  },
  {
    slug: "Act-Like-a-Grinch-for-Halloween",
    title: "Act Like a Grinch for Halloween",
    kicker: "How to",
    hero_image: "smile",
    expert: false,
    featured: true,
    summary:
      "Perfect the gravelly voice, exaggerated tiptoe walk, and playful holiday banter for a memorable costume performance.",
  },
  {
    slug: "Be-Well-Read",
    title: "Be Well Read",
    kicker: "How to",
    hero_image: "book",
    expert: true,
    featured: false,
    summary:
      "Build a balanced reading list across classic literature, history, essays, and contemporary fiction while retaining what you read.",
  },
  {
    slug: "Be-a-Good-Ventriloquist",
    title: "Be a Good Ventriloquist",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    featured: false,
    summary:
      "Speak clearly without moving your lips, substitute labial consonants, and give your puppet lifelike eye focus and timing.",
  },
  {
    slug: "Make-a-Radio-Show",
    title: "Make Your Own Radio Show or Podcast",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    featured: false,
    summary:
      "Plan a tight show clock, set up a clean dynamic microphone, script transitions, and record engaging episodes from home.",
  },
  {
    slug: "Make-Your-Own-TV-Show",
    title: "Develop, Write, & Pitch Your Own TV Show",
    kicker: "How to",
    hero_image: "camera",
    expert: true,
    featured: false,
    summary:
      "Write a compelling pilot script, assemble a series bible with season arcs, and pitch your concept to producers.",
  },
  {
    slug: "Tell-a-Story",
    title: "Tell a Story That Captivates Any Audience",
    kicker: "How to",
    hero_image: "book",
    expert: true,
    featured: false,
    summary:
      "Open with an immediate hook, build rising tension around a clear conflict, and land a resonant ending.",
  },
  {
    slug: "Dance-Disco",
    title: "Dance Disco: Classic Footwork & Arm Moves",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    featured: false,
    summary:
      "Step on the four-on-the-floor beat, master the Hustle basic, and add crisp point-and-roll arm styling.",
  },
  {
    slug: "Make-a-Viral-Video",
    title: "Make a Viral Video, According to Media Pros",
    kicker: "How to",
    hero_image: "camera",
    expert: true,
    featured: false,
    summary:
      "Hook viewers in the first three seconds, pace edits for high retention, and frame a shareable story.",
  },
  {
    slug: "Host-an-Open-Mic-Night",
    title: "Host an Open Mic Night",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    featured: false,
    summary:
      "Set up a fast-changeover PA system, run a fair sign-up sheet, and keep the room warm and supportive between acts.",
  },
  {
    slug: "Choose-a-Good-Book",
    title: "Choose a Good Book You Will Actually Finish",
    kicker: "How to",
    hero_image: "book",
    expert: true,
    featured: false,
    summary:
      "Sample the opening fifty pages, match pacing to your mood, and follow trusted independent booklists.",
  },
  {
    slug: "Start-Creating-Music",
    title: "Start Creating Music from Scratch",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    featured: false,
    summary:
      "Lay down a chord progression, build a drum groove, and record your first four-bar loop in any digital audio workstation.",
  },
  {
    slug: "Make-Fan-Art",
    title: "Make Fan Art in Your Own Visual Style",
    kicker: "How to",
    hero_image: "art",
    expert: true,
    featured: false,
    summary:
      "Gather character turnarounds, keep iconic silhouette traits recognizable, and reinterpret the scene in your own palette.",
  },
  {
    slug: "Play-Boogie-Woogie-Piano",
    title: "Play Boogie Woogie Piano",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    featured: false,
    summary:
      "Lock in a rolling eight-to-the-bar left-hand ostinato over a 12-bar blues progression while improvising right-hand riffs.",
  },
  {
    slug: "Read-a-Novel",
    title: "Read a Novel Actively and Remember More",
    kicker: "How to",
    hero_image: "book",
    expert: true,
    featured: false,
    summary:
      "Track character motives in the margins, notice recurring motifs, and set a calm daily reading ritual.",
  },
  {
    slug: "Organize-a-Parade",
    title: "Organize a Community Parade",
    kicker: "How to",
    hero_image: "trophy",
    expert: true,
    featured: false,
    summary:
      "Secure municipal street permits, map staging zones for floats and bands, and coordinate route marshals.",
  },
];

const ARTS_NEW_ARTICLES = [
  {
    slug: "Use-a-Polybius-Square-Cipher",
    title: "Use a Polybius Square Cipher",
    kicker: "How to",
    hero_image: "puzzle",
    expert: true,
    summary:
      "Arrange the alphabet in a 5×5 coordinate grid to encode and decode secret numerical messages.",
  },
  {
    slug: "Draw-Classic-Book-Characters",
    title: "Draw Classic Literary & Fantasy Characters",
    kicker: "How to",
    hero_image: "draw",
    expert: true,
    summary:
      "Translate written character descriptions into expressive posture, costume silhouettes, and facial proportions.",
  },
  {
    slug: "Build-a-Parade-Float",
    title: "Build a Float for a Local Festival",
    kicker: "How to",
    hero_image: "craft",
    expert: false,
    summary:
      "Frame a stable trailer deck with chicken wire, weather-resistant pomps, and hidden handrails.",
  },
  {
    slug: "Write-Riddles-and-Brainteasers",
    title: "Write Clever Riddles & Brainteasers",
    kicker: "How to",
    hero_image: "idea",
    expert: true,
    summary:
      "Work backward from an everyday object, personify its habits, and hide the answer in plain sight.",
  },
  {
    slug: "Evaluate-Vintage-Cassette-Tapes",
    title: "Tell If Vintage Cassette Tapes Are Valuable",
    kicker: "How to",
    hero_image: "music",
    expert: true,
    summary:
      "Check shell Formulation types, J-card condition, first-pressing catalog numbers, and tape pad integrity.",
  },
  {
    slug: "Create-Macrame-Bracelets",
    title: "Create a Macrame or Sliding Knot Bracelet",
    kicker: "How to",
    hero_image: "craft",
    expert: true,
    summary:
      "Tie square knots along a waxed cord core and finish with an adjustable sliding clasp.",
  },
  {
    slug: "Analyze-Film-Endings",
    title: "Analyze Ambiguous Movie Endings Like a Critic",
    kicker: "How to",
    hero_image: "camera",
    expert: true,
    summary:
      "Connect the final shot back to the opening visual metaphor, color palette shifts, and character arc.",
  },
  {
    slug: "Care-for-Vinyl-and-Art-Prints",
    title: "Frame and Care for Archival Art Prints",
    kicker: "How to",
    hero_image: "art",
    expert: true,
    summary:
      "Use acid-free rag mat board, UV-filtering glazing, and hinging tape to prevent yellowing.",
  },
];

/* ============================================================================
   2. GAMES & SECONDARY CATEGORIES (Category:Games, etc.)
   ============================================================================ */
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

const ALL_SHOWCASE_ARTICLES = [
  ...ARTS_ARTICLES,
  ...ARTS_NEW_ARTICLES,
  ...GAMES_ARTICLES,
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
      { name: "Paper & Pencil", slug: "Paper-and-Pencil-Games", illus: "draw" },
    ],
    relatedTopics: GAMES_RELATED_TOPICS,
    articles: GAMES_ARTICLES,
  },
  Artwork: {
    slug: "Artwork",
    name: "Artwork",
    parentSlug: "Arts-and-Entertainment",
    parentName: "Arts and Entertainment",
    emoji: "🎨",
    color: "#7cb342",
    description:
      "Explore drawing, painting, sculpting, calligraphy, and framing in Howcompass's Artwork category.",
    featuredTopics: [
      { name: "Drawing", slug: "Drawing", illus: "draw" },
      { name: "Painting", slug: "Painting", illus: "art" },
      { name: "Calligraphy", slug: "Calligraphy", illus: "book" },
      { name: "Sculpting", slug: "Sculpting", illus: "craft" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(1, 7),
    articles: [ARTS_ARTICLES[1], ARTS_ARTICLES[14], ...ARTS_NEW_ARTICLES.slice(1, 8)],
  },
  Books: {
    slug: "Books",
    name: "Books",
    parentSlug: "Arts-and-Entertainment",
    parentName: "Arts and Entertainment",
    emoji: "📚",
    color: "#7cb342",
    description:
      "Discover great reads, build a lifelong reading habit, care for your home library, and write your own stories with Howcompass's Books category.",
    featuredTopics: [
      { name: "Choosing Books", slug: "Choosing-Books", illus: "book" },
      { name: "Comics & Manga", slug: "Comics", illus: "draw" },
      { name: "Caring for Books", slug: "Caring-for-Books", illus: "home" },
      { name: "Storytelling", slug: "Storytelling", illus: "idea" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(2, 9),
    articles: [
      ARTS_ARTICLES[4],
      ARTS_ARTICLES[8],
      ARTS_ARTICLES[12],
      ARTS_ARTICLES[16],
      ...ARTS_NEW_ARTICLES.slice(0, 6),
    ],
  },
  Movies: {
    slug: "Movies",
    name: "Movies",
    parentSlug: "Arts-and-Entertainment",
    parentName: "Arts and Entertainment",
    emoji: "🎬",
    color: "#7cb342",
    description:
      "Learn filmmaking, screenwriting, film analysis, and cinema appreciation with Howcompass's Movies category.",
    featuredTopics: [
      { name: "Filmmaking", slug: "Filmmaking", illus: "camera" },
      { name: "Screenwriting", slug: "Screenwriting", illus: "book" },
      { name: "Film Studies", slug: "Film-Studies", illus: "idea" },
      { name: "Choosing Movies", slug: "Choosing-Movies", illus: "star" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(11, 17),
    articles: [
      ARTS_ARTICLES[7],
      ARTS_ARTICLES[10],
      ARTS_NEW_ARTICLES[6],
      ...ARTS_ARTICLES.slice(0, 7),
    ],
  },
  Music: {
    slug: "Music",
    name: "Music",
    parentSlug: "Arts-and-Entertainment",
    parentName: "Arts and Entertainment",
    emoji: "🎵",
    color: "#7cb342",
    description:
      "Learn an instrument, practice drum grips, play piano, write songs, and record your own tracks with Howcompass's Music category.",
    featuredTopics: [
      { name: "Musical Instruments", slug: "Musical-Instruments", illus: "music" },
      { name: "Music Production", slug: "Music-Production", illus: "laptop" },
      { name: "Singing", slug: "Singing", illus: "star" },
      { name: "Bands & Live Shows", slug: "Concerts", illus: "trophy" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(12, 17),
    articles: [
      ARTS_ARTICLES[0],
      ARTS_ARTICLES[6],
      ARTS_ARTICLES[9],
      ARTS_ARTICLES[11],
      ARTS_ARTICLES[13],
      ARTS_ARTICLES[15],
      ...ARTS_NEW_ARTICLES.slice(0, 4),
    ],
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
    articles: [ARTS_NEW_ARTICLES[5], ...GAMES_ARTICLES.slice(4, 14)],
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
      ARTS_ARTICLES[1],
      ARTS_ARTICLES[14],
      ARTS_NEW_ARTICLES[1],
      ...GAMES_ARTICLES.slice(0, 7),
    ],
  },
};

/* Primary category configurations modeled after Category:Arts-and-Entertainment */
const PRIMARY_CATEGORY_ENRICHMENTS = {
  "Arts-and-Entertainment": {
    featuredTopics: [
      { name: "Artwork", slug: "Artwork", illus: "art" },
      { name: "Books", slug: "Books", illus: "book" },
      { name: "Movies", slug: "Movies", illus: "camera" },
      { name: "Music", slug: "Music", illus: "music" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS,
    showcaseArticles: ARTS_ARTICLES,
    newArticles: ARTS_NEW_ARTICLES,
  },
  "Hobbies-and-Crafts": {
    featuredTopics: [
      { name: "Crafts", slug: "Crafts", illus: "craft" },
      { name: "Drawing", slug: "Drawing", illus: "draw" },
      { name: "Games", slug: "Games", illus: "puzzle" },
      { name: "Photography", slug: "Photography", illus: "camera" },
    ],
    relatedTopics: GAMES_RELATED_TOPICS,
    showcaseArticles: GAMES_ARTICLES,
    newArticles: ARTS_NEW_ARTICLES,
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
    showcaseArticles: ARTS_ARTICLES.slice(0, 12),
    newArticles: ARTS_NEW_ARTICLES,
  },
  "Food-and-Entertaining": {
    featuredTopics: [
      { name: "Baking", slug: "Baking", illus: "bread" },
      { name: "Everyday Cooking", slug: "Everyday-Cooking", illus: "cook" },
      { name: "Coffee & Tea", slug: "Coffee-and-Tea", illus: "coffee" },
      { name: "Hosting", slug: "Hosting", illus: "plate" },
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
    showcaseArticles: ARTS_ARTICLES.slice(0, 12),
    newArticles: ARTS_NEW_ARTICLES,
  },
  "Home-and-Garden": {
    featuredTopics: [
      { name: "Houseplants", slug: "Houseplants", illus: "plant" },
      { name: "Gardening", slug: "Gardening", illus: "leaf" },
      { name: "Home Maintenance", slug: "Home-Maintenance", illus: "home" },
      { name: "Cleaning", slug: "Cleaning", illus: "sparkle" },
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
    showcaseArticles: ARTS_ARTICLES.slice(0, 12),
    newArticles: ARTS_NEW_ARTICLES,
  },
};

function getSubcategoryInfo(rawSlug) {
  const clean = String(rawSlug || "").replace(/^Category:/i, "");
  if (SUBCATEGORY_DATA[clean]) return SUBCATEGORY_DATA[clean];

  const foundKey = Object.keys(SUBCATEGORY_DATA).find(
    (k) => k.toLowerCase() === clean.toLowerCase()
  );
  if (foundKey) return SUBCATEGORY_DATA[foundKey];

  // Check if it belongs to ARTS_RELATED_TOPICS
  const inArts = ARTS_RELATED_TOPICS.some(
    (g) =>
      g.slug.toLowerCase() === clean.toLowerCase() ||
      g.children.some((c) => slugifyTopic(c).toLowerCase() === clean.toLowerCase())
  );

  const label = unslugifyTopic(clean);
  if (inArts) {
    return {
      slug: clean,
      name: label,
      parentSlug: "Arts-and-Entertainment",
      parentName: "Arts and Entertainment",
      emoji: "🎨",
      color: "#7cb342",
      description: `Explore step-by-step tutorials, creative techniques, and expert advice in Howcompass's ${label} category.`,
      featuredTopics: PRIMARY_CATEGORY_ENRICHMENTS["Arts-and-Entertainment"].featuredTopics,
      relatedTopics: ARTS_RELATED_TOPICS,
      articles: ARTS_ARTICLES,
    };
  }

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
        { name: "Artwork", slug: "Artwork", illus: "art" },
        { name: "Books", slug: "Books", illus: "book" },
        { name: "Movies", slug: "Movies", illus: "camera" },
        { name: "Music", slug: "Music", illus: "music" },
      ],
      relatedTopics: ARTS_RELATED_TOPICS.slice(0, 8),
      showcaseArticles: ARTS_ARTICLES.slice(0, 12),
      newArticles: ARTS_NEW_ARTICLES,
    }
  );
}

module.exports = {
  slugifyTopic,
  unslugifyTopic,
  getSubcategoryInfo,
  getPrimaryEnrichment,
  ARTS_RELATED_TOPICS,
  ARTS_ARTICLES,
  ARTS_NEW_ARTICLES,
  GAMES_RELATED_TOPICS,
  GAMES_ARTICLES,
  ALL_SHOWCASE_ARTICLES,
  SUBCATEGORY_DATA,
};

/* Primary & Secondary category taxonomy, Featured Topics, Related Topics trees,
   Featured Articles, Main Articles, and New Articles — every category and
   subcategory has its own distinct hero banner, topics, articles, and thumbnails. */

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

function hashSlug(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rotateArray(arr, offset) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const k = ((offset % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

/* ============================================================================
   1. ARTS AND ENTERTAINMENT
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
    children: ["Concert Preparation", "Dressing for Concerts", "Music Festivals"],
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
    hero_image: "guitar",
    image: "/img/thumbs/drumsticks.jpg",
    expert: true,
    featured: true,
    summary:
      "Master the American, German, French, and Traditional drumstick grips for balanced power, rebound control, and wrist comfort.",
  },
  {
    slug: "Learn-to-Draw-for-Beginners",
    title: "Learn to Draw for Beginners",
    kicker: "How to",
    hero_image: "watercolor",
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
    hero_image: "heart",
    image: "/img/thumbs/disco.jpg",
    expert: true,
    featured: true,
    summary:
      "Put together an authentic 1970s disco outfit with flared trousers, metallic fabrics, platform shoes, and retro accessories.",
  },
  {
    slug: "Act-Like-a-Grinch-for-Halloween",
    title: "Act Like a Grinch for Halloween",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/thumbs/grinch.jpg",
    expert: false,
    featured: true,
    summary:
      "Perfect the gravelly voice, exaggerated tiptoe walk, and playful holiday banter for a memorable costume performance.",
  },
  {
    slug: "Be-Well-Read",
    title: "Be Well Read",
    kicker: "How to",
    hero_image: "books",
    image: "/img/thumbs/reading.jpg",
    expert: true,
    featured: false,
    summary:
      "Build a balanced reading list across classic literature, history, essays, and contemporary fiction while retaining what you read.",
  },
  {
    slug: "Be-a-Good-Ventriloquist",
    title: "Be a Good Ventriloquist",
    kicker: "How to",
    hero_image: "guitar",
    image: "/img/thumbs/ventriloquist.jpg",
    expert: true,
    featured: false,
    summary:
      "Speak clearly without moving your lips, substitute labial consonants, and give your puppet lifelike eye focus and timing.",
  },
  {
    slug: "Make-a-Radio-Show",
    title: "Make Your Own Radio Show or Podcast",
    kicker: "How to",
    hero_image: "guitar",
    image: "/img/thumbs/radio.jpg",
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
    image: "/img/steps/Learn-to-Draw-for-Beginners/23.jpg",
    expert: true,
    featured: false,
    summary:
      "Write a compelling pilot script, assemble a series bible with season arcs, and pitch your concept to producers.",
  },
  {
    slug: "Tell-a-Story",
    title: "Tell a Story That Captivates Any Audience",
    kicker: "How to",
    hero_image: "books",
    image: "/img/steps/Learn-to-Draw-for-Beginners/22.jpg",
    expert: true,
    featured: false,
    summary:
      "Open with an immediate hook, build rising tension around a clear conflict, and land a resonant ending.",
  },
  {
    slug: "Dance-Disco",
    title: "Dance Disco: Classic Footwork & Arm Moves",
    kicker: "How to",
    hero_image: "stretch",
    image: "/img/steps/Learn-to-Draw-for-Beginners/19.jpg",
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
    image: "/img/categories/topic-movies.jpg",
    expert: true,
    featured: false,
    summary:
      "Hook viewers in the first three seconds, pace edits for high retention, and frame a shareable story.",
  },
  {
    slug: "Host-an-Open-Mic-Night",
    title: "Host an Open Mic Night",
    kicker: "How to",
    hero_image: "guitar",
    image: "/img/categories/topic-music.jpg",
    expert: true,
    featured: false,
    summary:
      "Set up a fast-changeover PA system, run a fair sign-up sheet, and keep the room warm and supportive between acts.",
  },
  {
    slug: "Choose-a-Good-Book",
    title: "Choose a Good Book You Will Actually Finish",
    kicker: "How to",
    hero_image: "books",
    image: "/img/categories/topic-books.jpg",
    expert: true,
    featured: false,
    summary:
      "Sample the opening fifty pages, match pacing to your mood, and follow trusted independent booklists.",
  },
  {
    slug: "Start-Creating-Music",
    title: "Start Creating Music from Scratch",
    kicker: "How to",
    hero_image: "guitar",
    image: "/img/categories/arts-hero.jpg",
    expert: true,
    featured: false,
    summary:
      "Lay down a chord progression, build a drum groove, and record your first four-bar loop in any digital audio workstation.",
  },
  {
    slug: "Make-Fan-Art",
    title: "Make Fan Art in Your Own Visual Style",
    kicker: "How to",
    hero_image: "watercolor",
    image: "/img/steps/Learn-to-Draw-for-Beginners/18.jpg",
    expert: true,
    featured: false,
    summary:
      "Gather character turnarounds, keep iconic silhouette traits recognizable, and reinterpret the scene in your own palette.",
  },
  {
    slug: "Play-Boogie-Woogie-Piano",
    title: "Play Boogie Woogie Piano",
    kicker: "How to",
    hero_image: "guitar",
    image: "/img/steps/Learn-to-Draw-for-Beginners/14.jpg",
    expert: true,
    featured: false,
    summary:
      "Lock in a rolling eight-to-the-bar left-hand ostinato over a 12-bar blues progression while improvising right-hand riffs.",
  },
];

const ARTS_NEW_ARTICLES = [
  {
    slug: "Use-a-Polybius-Square-Cipher",
    title: "Use a Polybius Square Cipher",
    kicker: "How to",
    hero_image: "resume",
    image: "/img/steps/Learn-to-Draw-for-Beginners/09.jpg",
    expert: true,
    summary:
      "Arrange the alphabet in a 5×5 coordinate grid to encode and decode secret numerical messages.",
  },
  {
    slug: "Draw-Classic-Book-Characters",
    title: "Draw Classic Literary & Fantasy Characters",
    kicker: "How to",
    hero_image: "watercolor",
    image: "/img/steps/Learn-to-Draw-for-Beginners/16.jpg",
    expert: true,
    summary:
      "Translate written character descriptions into expressive posture, costume silhouettes, and facial proportions.",
  },
  {
    slug: "Build-a-Parade-Float",
    title: "Build a Float for a Local Festival",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/steps/Learn-to-Draw-for-Beginners/11.jpg",
    expert: false,
    summary:
      "Frame a stable trailer deck with chicken wire, weather-resistant pomps, and hidden handrails.",
  },
  {
    slug: "Write-Riddles-and-Brainteasers",
    title: "Write Clever Riddles & Brainteasers",
    kicker: "How to",
    hero_image: "books",
    image: "/img/steps/Learn-to-Draw-for-Beginners/24.jpg",
    expert: true,
    summary:
      "Work backward from an everyday object, personify its habits, and hide the answer in plain sight.",
  },
  {
    slug: "Evaluate-Vintage-Cassette-Tapes",
    title: "Tell If Vintage Cassette Tapes Are Valuable",
    kicker: "How to",
    hero_image: "guitar",
    image: "/img/steps/Learn-to-Draw-for-Beginners/15.jpg",
    expert: true,
    summary:
      "Check shell formulation types, J-card condition, first-pressing catalog numbers, and tape pad integrity.",
  },
  {
    slug: "Create-Macrame-Bracelets",
    title: "Create a Macrame or Sliding Knot Bracelet",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/steps/Learn-to-Draw-for-Beginners/05.jpg",
    expert: true,
    summary:
      "Tie square knots along a waxed cord core and finish with an adjustable sliding clasp.",
  },
  {
    slug: "Analyze-Film-Endings",
    title: "Analyze Ambiguous Movie Endings Like a Critic",
    kicker: "How to",
    hero_image: "camera",
    image: "/img/steps/Learn-to-Draw-for-Beginners/17.jpg",
    expert: true,
    summary:
      "Connect the final shot back to the opening visual metaphor, color palette shifts, and character arc.",
  },
  {
    slug: "Care-for-Vinyl-and-Art-Prints",
    title: "Frame and Care for Archival Art Prints",
    kicker: "How to",
    hero_image: "watercolor",
    image: "/img/steps/Learn-to-Draw-for-Beginners/20.jpg",
    expert: true,
    summary:
      "Use acid-free rag mat board, UV-filtering glazing, and hinging tape to prevent yellowing.",
  },
];

/* ============================================================================
   2. GAMES & HOBBIES AND CRAFTS
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
    children: ["Making Board Games", "Making Paper Games", "Video Game Creation"],
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
    children: ["Dots and Boxes", "Hangman", "M.A.S.H.", "Sprouts", "Tic Tac Toe"],
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
    hero_image: "craft",
    image: "/img/thumbs/othello.jpg",
    expert: true,
    featured: true,
    summary:
      "Master the 8×8 board, outflank your opponent's discs, and control the four corners to win Othello consistently.",
  },
  {
    slug: "Win-at-Tic-Tac-Toe",
    title: "Win at Tic Tac Toe Every Time",
    kicker: "How to",
    hero_image: "watercolor",
    image: "/img/thumbs/tictactoe.jpg",
    expert: true,
    featured: true,
    summary:
      "Learn the corner opening, double-trap fork setup, and center counter-moves that guarantee a win or draw.",
  },
  {
    slug: "Play-Jenga",
    title: "Setup and Play a Game of Jenga",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/thumbs/jenga.jpg",
    expert: true,
    featured: true,
    summary:
      "Stack all 54 hardwood blocks into an 18-level tower, test loose center pieces with one hand, and keep the tower balanced.",
  },
  {
    slug: "Play-Darts",
    title: "Play Darts: Scoring, Throwing, and Game Rules",
    kicker: "How to",
    hero_image: "stretch",
    image: "/img/thumbs/darts.jpg",
    expert: true,
    featured: true,
    summary:
      "Stand at the regulation throw line, align your dominant eye with the dart tip, and count down cleanly from 501 to zero.",
  },
  {
    slug: "Play-Chopsticks",
    title: "Play the Chopsticks Finger Game (with Fun Variations)",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/thumbs/cat/games-01.jpg",
    expert: true,
    featured: true,
    summary:
      "Use simple finger taps and tactical splits to reach five fingers on both of your opponent's hands using no supplies at all.",
  },
  {
    slug: "Play-Dots-and-Boxes",
    title: "Play the Dots and Boxes Game",
    kicker: "How to",
    hero_image: "watercolor",
    image: "/img/thumbs/cat/games-02.jpg",
    expert: true,
    featured: true,
    summary:
      "Draw a clean dot grid on paper, control long chains of boxes in the endgame, and outscore your opponent.",
  },
  {
    slug: "Play-Cats-Cradle",
    title: "Do Cat's Cradle and Similar String Designs",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/thumbs/cat/games-03.jpg",
    expert: true,
    featured: true,
    summary:
      "Loop a simple length of string across your palms and trade classic figures like the Soldier's Bed, Candles, and Manger.",
  },
  {
    slug: "Play-Marbles",
    title: "Play a Classic Game of Marbles",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/thumbs/cat/games-04.jpg",
    expert: true,
    featured: true,
    summary:
      "Chalk a smooth three-foot ring, knuckle down with your shooter marble, and knock target marbles out of the circle.",
  },
  {
    slug: "Play-Hopscotch",
    title: "Play Hopscotch: Rules & Court Layout",
    kicker: "How to",
    hero_image: "stretch",
    image: "/img/thumbs/cat/games-05.jpg",
    expert: true,
    featured: false,
    summary:
      "Draw a ten-square court with sidewalk chalk, toss your marker stone accurately, and hop the course on one foot.",
  },
  {
    slug: "Plan-an-Escape-Room",
    title: "Plan an Escape Room at Home",
    kicker: "How to",
    hero_image: "resume",
    image: "/img/thumbs/cat/games-06.jpg",
    expert: true,
    featured: false,
    summary:
      "Design a 60-minute puzzle flow with lockboxes, hidden ciphers, red herrings, and a clear final key clue.",
  },
  {
    slug: "Play-MASH",
    title: "Play M.A.S.H.: The Classic Paper Prediction Game",
    kicker: "How to",
    hero_image: "books",
    image: "/img/thumbs/cat/games-07.jpg",
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
    image: "/img/thumbs/cat/games-08.jpg",
    expert: true,
    featured: false,
    summary:
      "Weave a four-diamond string ladder between your thumbs and index fingers in six repeatable hand movements.",
  },
  {
    slug: "Play-Table-Football",
    title: "Play Table Football (Foosball): Complete Rules & Shots",
    kicker: "How to",
    hero_image: "stretch",
    image: "/img/thumbs/cat/games-09.jpg",
    expert: true,
    featured: false,
    summary:
      "Control the 3-rod and 5-rod without spinning, pass cleanly along the wall, and execute a crisp pull shot.",
  },
  {
    slug: "Play-Tiddlywinks",
    title: "Play Tiddlywinks: Beginner Rules & Squidging Tips",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/thumbs/cat/games-10.jpg",
    expert: true,
    featured: false,
    summary:
      "Press the edge of each wink with your squidger disc to arc shots into the center pot or cover opponent winks.",
  },
  {
    slug: "Play-Hangman",
    title: "Play Hangman: Rules, Word Lists, and Strategy",
    kicker: "How to",
    hero_image: "watercolor",
    image: "/img/thumbs/cat/games-11.jpg",
    expert: true,
    featured: false,
    summary:
      "Pick high-frequency vowels first, narrow down consonant clusters, or choose tricky words with uncommon letters.",
  },
  {
    slug: "Play-Five-Stones",
    title: "Play the Traditional Game of Five Stones",
    kicker: "How to",
    hero_image: "craft",
    image: "/img/thumbs/cat/games-12.jpg",
    expert: true,
    featured: false,
    summary:
      "Toss and catch five small pebbles in ones, twos, threes, and fours before sweeping the arch on the final round.",
  },
];

/* ============================================================================
   3. COMPUTERS AND ELECTRONICS (25 dedicated step images!)
   ============================================================================ */
const COMPUTERS_ARTICLES = [
  {
    slug: "Speed-Up-a-Slow-Laptop",
    title: "Speed Up a Slow Laptop",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/01.jpg",
    expert: true,
    featured: true,
    summary:
      "Diagnose runaway processes, trim startup bloat, free SSD headroom, and upgrade RAM on a sluggish laptop.",
  },
  {
    slug: "Free-Up-Disk-Space-on-Your-Laptop",
    title: "Free Up Disk Space on Windows and Mac",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/09.jpg",
    expert: true,
    featured: true,
    summary:
      "Keep at least twenty percent of your solid-state drive free so virtual memory and system caches stay fast.",
  },
  {
    slug: "Upgrade-a-Laptop-Hard-Drive-to-an-SSD",
    title: "Upgrade a Laptop Hard Drive to an SSD",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/20.jpg",
    expert: true,
    featured: true,
    summary:
      "Clone your system drive, swap a mechanical disk for an NVMe or SATA SSD, and cut boot times to seconds.",
  },
  {
    slug: "Clean-Laptop-Fans-and-Air-Vents",
    title: "Clean Laptop Fans and Air Vents to Stop Thermal Throttling",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/16.jpg",
    expert: true,
    featured: true,
    summary:
      "Clear dust from heatsink fins with short bursts of compressed air so your processor can hold full clock speed.",
  },
  {
    slug: "Disable-Startup-Programs",
    title: "Disable Unnecessary Startup Programs",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/05.jpg",
    expert: true,
    featured: false,
    summary:
      "Turn off auto-launching updaters and tray helpers so your laptop boots straight to a responsive desktop.",
  },
  {
    slug: "Manage-Browser-Tabs-and-Extensions",
    title: "Manage Browser Tabs and Extensions to Save RAM",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/07.jpg",
    expert: true,
    featured: false,
    summary:
      "Audit heavy browser extensions, enable tab memory saver, and clear corrupted site caches.",
  },
  {
    slug: "Check-Laptop-Battery-Health",
    title: "Check Laptop Battery Health and Power Profiles",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/18.jpg",
    expert: true,
    featured: false,
    summary:
      "Generate a battery health report, switch out of battery-saver throttling, and calibrate charge cycles.",
  },
  {
    slug: "Back-Up-Your-Computer-to-an-External-Drive",
    title: "Back Up Your Computer to an External Drive",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/22.jpg",
    expert: true,
    featured: false,
    summary:
      "Set up automated encrypted backups with Time Machine or File History before making system changes.",
  },
  {
    slug: "Find-What-Is-Slowing-Down-Your-CPU",
    title: "Find What Is Slowing Down Your CPU in Task Manager",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/02.jpg",
    expert: true,
    featured: false,
    summary:
      "Sort processes by CPU and memory usage to spot runaway background tasks in under a minute.",
  },
  {
    slug: "Remove-Adware-and-Background-Bloatware",
    title: "Remove Adware and Preinstalled Bloatware Safely",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/13.jpg",
    expert: true,
    featured: false,
    summary:
      "Uninstall trialware, run a clean malware scan, and keep only one real-time security engine active.",
  },
  {
    slug: "Update-System-Drivers-and-Firmware",
    title: "Update System Drivers and BIOS Firmware Safely",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/14.jpg",
    expert: true,
    featured: false,
    summary:
      "Install official chipset, graphics, and power-management updates without third-party driver tools.",
  },
  {
    slug: "Upgrade-Laptop-RAM-Memory",
    title: "Upgrade Laptop RAM for Smoother Multitasking",
    kicker: "How to",
    hero_image: "laptop",
    image: "/img/steps/Speed-Up-a-Slow-Laptop/21.jpg",
    expert: true,
    featured: false,
    summary:
      "Check SO-DIMM slot compatibility, ground yourself safely, and seat matching dual-channel memory modules.",
  },
];

/* ============================================================================
   4. FOOD AND ENTERTAINING (23 dedicated step images!)
   ============================================================================ */
const FOOD_ARTICLES = [
  {
    slug: "Bake-Bread-at-Home",
    title: "Bake Bread at Home",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/20.jpg",
    expert: true,
    featured: true,
    summary:
      "Mix, ferment, shape, score, and bake a golden crusty artisan loaf at home using flour, water, salt, and yeast.",
  },
  {
    slug: "Weigh-Bread-Ingredients-Accurately",
    title: "Weigh Flour and Water on a Digital Kitchen Scale",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/01.jpg",
    expert: true,
    featured: true,
    summary:
      "Use baker's percentages and gram weights so every batch of bread dough comes out consistent.",
  },
  {
    slug: "Knead-Bread-Dough-by-Hand",
    title: "Knead Bread Dough by Hand Until Smooth and Elastic",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/05.jpg",
    expert: true,
    featured: true,
    summary:
      "Develop strong gluten structure using the push-fold-turn rhythm and test readiness with the windowpane check.",
  },
  {
    slug: "Score-Artisan-Bread-Loaves",
    title: "Score Artisan Bread Loaves for Maximum Oven Spring",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/15.jpg",
    expert: true,
    featured: true,
    summary:
      "Hold a sharp lame at a 30-degree angle and make one confident slash so the loaf opens cleanly in the oven.",
  },
  {
    slug: "Autolyse-Bread-Dough",
    title: "Autolyse Bread Dough for an Easier Knead",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/03.jpg",
    expert: true,
    featured: false,
    summary:
      "Rest mixed flour and water for twenty minutes before adding salt and yeast to hydrate the starch naturally.",
  },
  {
    slug: "Judge-Bread-Rise-with-the-Poke-Test",
    title: "Tell When Bread Dough Has Risen Using the Poke Test",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/08.jpg",
    expert: true,
    featured: false,
    summary:
      "Press a floured finger into proofing dough and read the spring-back speed instead of relying only on the clock.",
  },
  {
    slug: "Cold-Proof-Bread-Dough-Overnight",
    title: "Cold-Proof Bread Dough in the Fridge Overnight",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/09.jpg",
    expert: true,
    featured: false,
    summary:
      "Slow yeast fermentation at 4°C to develop complex bakery aroma and make morning baking effortless.",
  },
  {
    slug: "Shape-a-Round-Boule-Loaf",
    title: "Shape a Round Boule Loaf with Surface Tension",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/11.jpg",
    expert: true,
    featured: false,
    summary:
      "Pull the dough against an unfloured counter to create a taut outer skin that holds its height in the oven.",
  },
  {
    slug: "Bake-Bread-in-a-Dutch-Oven",
    title: "Bake Crusty Bread in a Preheated Cast-Iron Dutch Oven",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/16.jpg",
    expert: true,
    featured: false,
    summary:
      "Trap natural dough steam inside a heavy covered pot for the first twenty minutes for a blistered golden crust.",
  },
  {
    slug: "Check-When-Bread-Is-Done-Baking",
    title: "Tell When a Loaf of Bread Is Fully Baked Inside",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/18.jpg",
    expert: true,
    featured: false,
    summary:
      "Combine the 95°C internal thermometer check with the classic hollow bottom-tap test.",
  },
  {
    slug: "Store-Homemade-Bread-Fresh",
    title: "Store Homemade Bread So the Crust Stays Crisp",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/21.jpg",
    expert: true,
    featured: false,
    summary:
      "Keep cooled loaves cut-side down on a wooden board or in a breathable paper bag instead of plastic.",
  },
  {
    slug: "Freeze-Sliced-Artisan-Bread",
    title: "Freeze Sliced Bread for Fresh Daily Toast",
    kicker: "How to",
    hero_image: "carbonara",
    image: "/img/steps/Bake-Bread-at-Home/22.jpg",
    expert: true,
    featured: false,
    summary:
      "Slice cooled loaves before freezing so individual pieces toast straight from the freezer in minutes.",
  },
];

/* ============================================================================
   5. HOME AND GARDEN (25 dedicated step images!)
   ============================================================================ */
const HOME_ARTICLES = [
  {
    slug: "Keep-Houseplants-Alive",
    title: "Keep Houseplants Alive",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/01.jpg",
    expert: true,
    featured: true,
    summary:
      "Match indoor plants to the light you actually have, water by soil feel rather than the calendar, and prevent root rot.",
  },
  {
    slug: "Water-Houseplants-Properly",
    title: "Water Indoor Plants Using the Finger Moisture Test",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/06.jpg",
    expert: true,
    featured: true,
    summary:
      "Check the top five centimetres of potting mix before watering and drench thoroughly until water runs from the drainage holes.",
  },
  {
    slug: "Repot-a-Root-Bound-Houseplant",
    title: "Repot a Root-Bound Houseplant Step by Step",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/16.jpg",
    expert: true,
    featured: true,
    summary:
      "Choose a pot just 3–5 cm wider, tease circled roots gently, and settle the plant in fresh airy potting mix.",
  },
  {
    slug: "Propagate-Houseplants-in-Water",
    title: "Propagate Houseplant Stem Cuttings in Water",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/24.jpg",
    expert: true,
    featured: true,
    summary:
      "Snip just below a leaf node with clean shears and root cuttings in a glass jar on a bright windowsill.",
  },
  {
    slug: "Match-Plants-to-Window-Light",
    title: "Match Houseplants to North, East, South, and West Windows",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/02.jpg",
    expert: true,
    featured: false,
    summary:
      "Read your room's natural light direction and place sun-loving succulents and shade-tolerant ferns where they thrive.",
  },
  {
    slug: "Bottom-Water-Potted-Plants",
    title: "Bottom-Water Potted Plants to Rehydrate Dry Soil",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/08.jpg",
    expert: true,
    featured: false,
    summary:
      "Set pots in a shallow tray of lukewarm water for twenty minutes so hydrophobic peat absorbs moisture evenly.",
  },
  {
    slug: "Mix-Airy-Houseplant-Potting-Soil",
    title: "Mix Well-Draining Potting Soil with Perlite and Bark",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/12.jpg",
    expert: true,
    featured: false,
    summary:
      "Blend standard indoor compost with perlite and orchid bark so plant roots get both moisture and oxygen.",
  },
  {
    slug: "Clean-Dusty-Houseplant-Leaves",
    title: "Clean Dusty Houseplant Leaves So They Photosynthesize Better",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/22.jpg",
    expert: true,
    featured: false,
    summary:
      "Wipe broad leaves gently with a damp microfibre cloth while supporting the underside with your palm.",
  },
  {
    slug: "Increase-Humidity-for-Indoor-Plants",
    title: "Boost Indoor Humidity for Tropical Houseplants",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/14.jpg",
    expert: true,
    featured: false,
    summary:
      "Group plants together or use a pebble tray and room humidifier instead of ineffective hand misting.",
  },
  {
    slug: "Diagnose-Yellow-Houseplant-Leaves",
    title: "Diagnose Yellowing or Crispy Houseplant Leaves",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/19.jpg",
    expert: true,
    featured: false,
    summary:
      "Tell the difference between overwatering, underwatering, low humidity, and natural lower-leaf aging.",
  },
  {
    slug: "Quarantine-New-Houseplants",
    title: "Quarantine New Houseplants to Prevent Pests",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/20.jpg",
    expert: true,
    featured: false,
    summary:
      "Keep new plants isolated for two weeks and inspect leaf undersides for spider mites, mealybugs, and scale.",
  },
  {
    slug: "Prune-Leggy-Houseplants",
    title: "Prune Leggy Indoor Plants for Bushier Growth",
    kicker: "How to",
    hero_image: "tomatoes",
    image: "/img/steps/Keep-Houseplants-Alive/23.jpg",
    expert: true,
    featured: false,
    summary:
      "Trim stretched stems just above a healthy node in spring so two new lateral shoots branch out.",
  },
];

/* ============================================================================
   6. OTHER PRIMARY & SECONDARY CATEGORIES
   Every single category uses ONLY its own dedicated category image bank
   (/img/thumbs/cat/<cat>-01.jpg .. 12.jpg) — ZERO cross-category image sharing!
   ============================================================================ */
function catImgs(key) {
  return Array.from({ length: 12 }, (_, i) => `/img/thumbs/cat/${key}-${String(i + 1).padStart(2, "0")}.jpg`);
}

function buildCategoryArticles(catKey, catLabel, titles) {
  const imgs = catImgs(catKey);
  return titles.map((t, idx) => ({
    slug: slugifyTopic(t),
    title: t,
    kicker: "How to",
    hero_image: "compass",
    image: imgs[idx % imgs.length],
    expert: true,
    featured: idx < 4,
    summary: `Follow our verified step-by-step ${catLabel.toLowerCase()} guide to ${t.toLowerCase()} with clear checkpoints and practical tips.`,
  }));
}

const HEALTH_ARTICLES = buildCategoryArticles("health", "Health & Wellness", [
  "Build a 15-Minute Morning Mobility and Stretching Routine",
  "Improve Deep Sleep Quality With an Evening Wind-Down Ritual",
  "Stay Hydrated Throughout a Busy Workday",
  "Practice Box Breathing to Calm Stress in Five Minutes",
  "Set Up an Ergonomic Desk Posture to Prevent Neck Strain",
  "Balance a Nutritious Mediterranean Lunch Plate",
  "Take a Restorative Midday Walking Break Outdoors",
  "Track Resting Heart Rate and Recovery Signals Accurately",
  "Protect Your Eyes From Digital Screen Fatigue Using the 20-20-20 Rule",
  "Build a Consistent Bedtime Schedule That Resets Your Circadian Rhythm",
  "Stretch Tight Hip Flexors After Sitting All Day",
  "Prepare a Calm Herbal Tea and Journaling Evening Routine",
]);

const FINANCE_ARTICLES = buildCategoryArticles("finance", "Finance & Business", [
  "Build a 50-30-20 Monthly Household Budget That Actually Works",
  "Start an Emergency Savings Fund From Scratch",
  "Track Weekly Spending in a Simple Cash-Flow Ledger",
  "Read a Monthly Bank and Credit Statement Line by Line",
  "Set Up Automatic Transfers Toward Long-Term Financial Goals",
  "Write a Clear Freelance Invoice That Gets Paid on Time",
  "Compare Index Fund Expense Ratios Before Investing",
  "Organize Small-Business Receipts for Stress-Free Tax Prep",
  "Negotiate Lower Recurring Bills and Subscriptions Annually",
  "Calculate Your Personal Net Worth on One Sheet of Paper",
  "Price a Small Service Business for Sustainable Profit Margins",
  "Run a Quarterly Household Financial Review With Your Partner",
]);

const PETS_ARTICLES = buildCategoryArticles("pets", "Pets & Animals", [
  "Teach a Puppy to Walk Calmly on a Loose Leash",
  "Set Up a Cozy Safe Room for a Newly Adopted Cat",
  "Introduce a New Puppy to Crate Training Without Stress",
  "Brush a Long-Haired Dog Coat to Prevent Tangles and Mats",
  "Read Canine Body Language and Tail Signals Accurately",
  "Keep an Indoor Cat Active With Daily Hunt-Catch-Play Sessions",
  "Trim Dog Nails Safely Step by Step",
  "Transition Your Pet to a New Food Gradually Over Seven Days",
  "Pack a Pet First-Aid and Travel Kit for Road Trips",
  "Clean a Freshwater Aquarium Without Disrupting Beneficial Bacteria",
  "Socialize a Young Puppy to Everyday City Sounds Calmly",
  "Make Vet Visits Calm and Positive With Reward Training",
]);

const SPORTS_ARTICLES = buildCategoryArticles("sports", "Sports & Fitness", [
  "Train for Your First 5K Run With a Walk-Run Progression",
  "Master Proper Goblet Squat Form With Dumbbells",
  "Warm Up Joints and Muscles Before Any Cardio Workout",
  "Improve Your Running Cadence and Breathing Rhythm",
  "Build Core Stability With Dead Bugs and Side Planks",
  "Set Up Road Bike Saddle Height for Knee-Friendly Cycling",
  "Practice Consistent Tennis Forehand Footwork and Follow-Through",
  "Cool Down With Foam Rolling After Strength Training",
  "Swim Freestyle With Relaxed Bilateral Breathing",
  "Structure a Balanced Three-Day Full-Body Gym Split",
  "Jump Rope Smoothly on the Balls of Your Feet",
  "Pack a Gym Bag So You Never Skip an Evening Workout",
]);

const EDUCATION_ARTICLES = buildCategoryArticles("education", "Education & Communications", [
  "Take Structured Study Notes Using the Cornell Note-Taking Method",
  "Use Spaced Repetition Flashcards to Remember What You Read",
  "Deliver a Confident 5-Minute Presentation Without Reading Slides",
  "Outline an Analytical Essay With a Clear Thesis Statement",
  "Study With the Pomodoro Technique Without Losing Deep Focus",
  "Read Dense Academic Textbooks Using Active Recall Questions",
  "Practice a Foreign Language 20 Minutes a Day and Retain Vocabulary",
  "Prepare for University Seminars With Three Sharp Discussion Questions",
  "Overcome Stage Fright Before Speaking in Front of an Audience",
  "Organize a Quiet, Distraction-Free Study Desk at Home",
  "Summarize Research Papers Into a One-Page Synthesis Matrix",
  "Write Clear, Concise Professional Emails That Get Quick Replies",
]);

const FAMILY_ARTICLES = buildCategoryArticles("family", "Family Life", [
  "Run a Weekly Family Dinner Night Everyone Looks Forward To",
  "Create a Calm School-Morning Routine With Zero Rush",
  "Host a Screen-Free Family Board Game Evening",
  "Set Up an Age-Appropriate Weekly Chore Chart for Kids",
  "Read Aloud With Children to Build a Lifelong Love of Books",
  "Plan a Simple Weekend Picnic in Your Local Park",
  "Organize a Shared Family Wall Calendar for Busy Weeks",
  "Help Kids Build an Independent After-School Homework Habit",
  "Pack Balanced, Waste-Free School Lunches the Night Before",
  "Celebrate Family Birthdays With Meaningful Homemade Traditions",
  "Hold a 15-Minute Sunday Family Planning Huddle",
  "Prepare Younger Siblings to Welcome a New Baby Home",
]);

const WORK_ARTICLES = buildCategoryArticles("work", "Work World", [
  "Format a Clean One-Page Resume That Passes Recruiter Scans",
  "Answer Behavioral Job Interview Questions Using the STAR Method",
  "Plan Your Workweek Every Monday With Time-Blocked Priorities",
  "Run a Focused 25-Minute Team Meeting With a Written Agenda",
  "Set Up a Productive Dual-Monitor Remote Home Office",
  "Write a Tailored Cover Letter That Highlights Measurable Results",
  "Negotiate a Job Offer and Base Salary Professionally",
  "Keep Your Work Inbox at Zero Using a Three-Folder Triage System",
  "Give Constructive Peer Feedback That Strengthens Team Trust",
  "Onboard Smoothly During Your First 30 Days at a New Job",
  "Prevent Afternoon Burnout With Intentional Deep-Work Blocks",
  "Document Team Workflows Clearly So Anyone Can Step In",
]);

const RELATIONSHIPS_ARTICLES = buildCategoryArticles("relationships", "Relationships", [
  "Plan a Relaxed First Date at a Neighborhood Café",
  "Practice Active Listening Without Interrupting Your Partner",
  "Keep Long-Distance Friendships Close With Monthly Rituals",
  "Resolve Everyday Relationship Disagreements Calmly and Fairly",
  "Write a Thoughtful Handwritten Thank-You or Anniversary Note",
  "Ask Open-Ended Questions That Spark Deeper Conversations",
  "Set Healthy Personal Boundaries With Kindness and Clarity",
  "Plan a Memorable At-Home Date Night on Any Budget",
  "Support a Close Friend Going Through a Stressful Life Transition",
  "Rebuild Shared Routines When Both Partners Have Busy Schedules",
  "Introduce Your Partner to Extended Family With Ease",
  "Remember Important Milestones and Birthdays All Year Long",
]);

const STYLE_ARTICLES = buildCategoryArticles("style", "Personal Care & Style", [
  "Build a 20-Piece Seasonal Capsule Wardrobe That Mixes Effortlessly",
  "Steam and Press a Linen or Cotton Shirt Without Scorching",
  "Care for Leather Shoes With Horsehair Brushing and Cream Polish",
  "Organize Your Closet by Category and Color so Mornings Are Easy",
  "Follow a Gentle Three-Step Morning Skincare Routine",
  "Fold Knit Sweaters Properly So Shoulders Never Stretch on Hangers",
  "Take Accurate Body Measurements for Tailoring and Online Sizing",
  "Remove Everyday Fabric Stains Before They Set in the Wash",
  "Pack Wrinkle-Free Outfits Using the Bundle-Wrapping Method",
  "Choose Eyeglass Frames That Balance Your Face Shape",
  "Keep White Sneakers Clean With a Soft Brush and Mild Soap",
  "Transition Your Wardrobe Smoothly Between Autumn and Winter",
]);

const TRAVEL_ARTICLES = buildCategoryArticles("travel", "Travel", [
  "Pack a Week of Outfits Into a Single Carry-On Suitcase",
  "Navigate European High-Speed Trains and Station Platforms Easily",
  "Build a Flexible Three-Day City Walking Itinerary",
  "Keep Passports, Cards, and Boarding Passes Organized in Transit",
  "Adjust to a New Time Zone Cepat and Beat Jet Lag Naturally",
  "Choose a Quiet, Well-Connected Neighborhood When Booking Hotels",
  "Order Coffee and Meals Politely in a New Local Language",
  "Sketch and Journal Your Travel Memories at a Café Table",
  "Avoid Foreign Transaction Fees and Dynamic Currency Conversion",
  "Pack a Compact Toiletry Bag That Breezes Through Airport Security",
  "Take Early-Morning Architectural Photos Before Crowds Arrive",
  "Stay Safe and Confident on Your First Solo Train Journey",
]);

const HOBBIES_ARTICLES = buildCategoryArticles("hobbies", "Hobbies & Crafts", [
  "Set Up a Dedicated Craft and Sketching Corner at Home",
  "Press Wildflowers and Botanicals in Heavy Hardcover Books",
  "Bind a Handmade Stitched Sketchbook From Loose Paper Signatures",
  "Carve a Simple Linocut Block Print for Greeting Cards",
  "Knit a Classic Ribbed Scarf With Even Edge Stitches",
  "Fold Modular Origami Geometric Stars From Square Paper",
  "Paint Terracotta Plant Pots With Sealed Acrylic Patterns",
  "Shoot Sharp Golden-Hour Portraits With Natural Window Light",
  "Weave a Small Tapestry Wall Hanging on a Lap Loom",
  "Pour Soy Wax Candles With Centered Cotton Wicks",
  "Restore a Vintage Wooden Board Game Box With Beeswax Polish",
  "Curate a Monthly Creative Hobby Project Journal",
]);

const BOOKS_ARTICLES = buildCategoryArticles("books", "Books & Reading", [
  "Read 30 Books a Year With a 25-Minute Daily Reading Habit",
  "Keep a Reading Commonplace Book for Favorite Passages",
  "Organize Home Bookshelves by Genre, Subject, or Spine Height",
  "Start a Welcoming Neighborhood Book Club With Great Questions",
  "Protect Hardcover Dust Jackets and Paperbacks From Sun Fading",
  "Annotate Nonfiction Books Cleanly With Pencil Margin Notes",
  "Break Out of a Reading Slump With Short Novellas and Essays",
  "Write a Thoughtful Book Review Without Spoiling the Ending",
  "Build a Balanced Personal Library of Classics and New Releases",
  "Read Poetry Aloud to Appreciate Meter, Breath, and Imagery",
  "Find Rare Out-of-Print Editions at Secondhand Bookshops",
  "Outline Your Own Short Story With a Three-Act Scene Cards",
]);

const MOVIES_ARTICLES = buildCategoryArticles("movies", "Movies & Filmmaking", [
  "Frame Cinematic Shots Using the Rule of Thirds and Leading Lines",
  "Write a Short Film Screenplay in Standard Industry Format",
  "Set Up Three-Point Lighting With Affordable LED Panels",
  "Storyboard a Five-Minute Scene Before You Start Filming",
  "Record Crisp Dialogue Indoors With a Boom or Lavalier Mic",
  "Host a Classic Film Screening Night With Director Discussion Notes",
  "Cut a Tight Scene Assembly in Your Video Editing Timeline",
  "Analyze How Color Grading Shapes Mood in Cinema",
  "Direct Non-Actors Naturally on an Independent Film Set",
  "Balance Background Music and Foley Sound Effects in Post",
  "Keep a Film Watchlist Log Organized by Director and Era",
  "Shoot Smooth Handheld Camera Movement Using the Heel-Toe Walk",
]);

const MUSIC_ARTICLES = buildCategoryArticles("music", "Music & Instruments", [
  "Practice With a Metronome to Lock In Steady Musical Timing",
  "Tune an Acoustic Guitar by Ear and With a Clip-On Tuner",
  "Read Basic Treble and Bass Clef Sheet Music Step by Step",
  "Warm Up Your Singing Voice Safely With Lip Trills and Scales",
  "Set Up a Quiet Home Recording Corner With an Audio Interface",
  "Play Major and Minor Triad Chords Smoothly on Piano",
  "Write a Memorable Four-Chord Song Progression and Melody",
  "Clean and Change Acoustic Guitar Strings Without Slipping",
  "Memorize a Piece of Music Phrase by Phrase Without Sheet Music",
  "Build Finger Independence With Daily Five-Minute Scales",
  "Mix Vocals and Acoustic Instruments Clearly in Your DAW",
  "Prepare for Your First Live Acoustic Set Without Nerves",
]);

const CRAFTS_ARTICLES = buildCategoryArticles("crafts", "Crafts & DIY", [
  "Make Handmade Deckle-Edge Paper From Recycled Scraps",
  "Stitch Clean Embroidery Backstitch and French Knots on Linen",
  "Create a Macrame Plant Hanger With Square and Spiral Knots",
  "Fold Crisp Origami Cranes and Modular Boxes Step by Step",
  "Make Natural Beeswax Wraps for Reusable Kitchen Storage",
  "Press and Frame Autumn Leaves on Acid-Free Cotton Paper",
  "Sew a Lined Canvas Tote Bag With Boxed Corners",
  "sculpt Air-Dry Clay Pinch Pots and Trinket Dishes at Home",
  "Stamp Custom Wrapping Paper With Carved Eraser Blocks",
  "Braid a Durable Paracord or Waxed-Thread Keychain",
  "Upcycle Glass Jars Into Frosted Lanterns and Desk Organizers",
  "Organize Craft Thread, Brushes, and Paper by Color Family",
]);

const PHOTO_ARTICLES = buildCategoryArticles("photo", "Photography", [
  "Balance Aperture, Shutter Speed, and ISO in Manual Mode",
  "Compose Striking Street and Travel Photos With Natural Framing",
  "Shoot Soft Window-Lit Portraits Without Harsh Shadows",
  "Use Leading Lines and Foreground Depth in Landscape Photos",
  "Keep Camera Lenses Spotless With a Blower and Microfiber Cloth",
  "Capture Sharp Handheld Low-Light Photos Without Motion Blur",
  "Color-Correct RAW Photos Naturally for True-to-Life Skin Tones",
  "Back Up Photo Cards Using the 3-2-1 Archive Rule",
  "Photograph Flat-Lay Craft and Food Scenes From Overhead",
  "Understand Focal Length Compression Between 35mm and 85mm Lenses",
  "Shoot Golden-Hour Architecture With Warm Side Lighting",
  "Curate a Cohesive 12-Photo Portfolio Series",
]);

const ARTWORK_ARTICLES = [
  "Mix Clean Watercolor Washes Without Muddy Edges",
  "Stretch Cold-Press Watercolor Paper on a Drawing Board",
  "Frame Original Drawings With Acid-Free Archival Mat Board",
  "Build a Balanced Color Wheel Using Warm and Cool Primaries",
  "Sketch Expressive Charcoal Still-Life Studies in 20 Minutes",
  "Seal Pencil and Pastel Artwork With Workable Fixative Spray",
  "Paint Atmospheric Landscape Skies With Wet-on-Wet Gradients",
  "Transfer a Preliminary Pencil Sketch onto Canvas Cleanly",
  "Clean Sable and Synthetic Paintbrushes So Tips Stay Pointed",
  "Set Up Natural North-Facing Studio Lighting at Your Desk",
  "Curate a Cohesive Wall Gallery Grid of Framed Prints",
  "Varnish Finished Acrylic Paintings for Even Satin Protection",
].map((t, idx) => ({
  slug: slugifyTopic(t),
  title: t,
  kicker: "How to",
  hero_image: "watercolor",
  image: `/img/steps/Learn-to-Draw-for-Beginners/${String(idx + 1).padStart(2, "0")}.jpg`,
  expert: true,
  featured: idx < 4,
  summary: `Follow our studio-tested artwork guide to ${t.toLowerCase()} with clear step-by-step visuals.`,
}));

const DRAWING_ARTICLES = [
  "Draw Smooth Contour Lines From Your Shoulder Instead of Your Wrist",
  "Break Complex Objects Down Into Simple 3D Spheres, Cubes, and Cylinders",
  "Draw a Accurate One-Point Perspective Street Scene With a Horizon Line",
  "Shade a Five-Step Graphite Value Scale From Light to Deep Shadow",
  "Measure Proportions Accurately Using the Sight-Size Pencil Thumb Method",
  "Sketch Quick 60-Second Figure Gesture Poses With Flowing Line of Action",
  "Construct a Proportional Human Face Using the Loomis Head Guidelines",
  "Render Realistic Cast Shadows and Core Shadows on Curved Forms",
  "Crosshatch Clean Ink Textures With Fineliner Pens",
  "Draw Believable Hands by Blocking the Palm and Finger Cylinders First",
  "Use Negative Space to Check Difficult Angles in Observational Drawing",
  "Build a Daily 15-Minute Sketchbook Habit That Rapidly Improves Your Eye",
].map((t, idx) => ({
  slug: slugifyTopic(t),
  title: t,
  kicker: "How to",
  hero_image: "watercolor",
  image: `/img/steps/Learn-to-Draw-for-Beginners/${String(idx + 13).padStart(2, "0")}.jpg`,
  expert: true,
  featured: idx < 4,
  summary: `Practice foundational drawing skills and ${t.toLowerCase()} step by step.`,
}));

const ALL_SHOWCASE_ARTICLES = [
  ...ARTWORK_ARTICLES,
  ...DRAWING_ARTICLES,
  ...ARTS_ARTICLES,
  ...ARTS_NEW_ARTICLES,
  ...GAMES_ARTICLES,
  ...COMPUTERS_ARTICLES,
  ...FOOD_ARTICLES,
  ...HOME_ARTICLES,
  ...HEALTH_ARTICLES,
  ...FINANCE_ARTICLES,
  ...PETS_ARTICLES,
  ...SPORTS_ARTICLES,
  ...EDUCATION_ARTICLES,
  ...FAMILY_ARTICLES,
  ...WORK_ARTICLES,
  ...RELATIONSHIPS_ARTICLES,
  ...STYLE_ARTICLES,
  ...TRAVEL_ARTICLES,
  ...HOBBIES_ARTICLES,
  ...BOOKS_ARTICLES,
  ...MOVIES_ARTICLES,
  ...MUSIC_ARTICLES,
  ...CRAFTS_ARTICLES,
  ...PHOTO_ARTICLES,
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
      { name: "Board Games", slug: "Board-Games", illus: "craft", image: "/img/thumbs/othello.jpg" },
      { name: "Card Games", slug: "Card-Games", illus: "craft", image: "/img/thumbs/cat/games-01.jpg" },
      { name: "Party Games", slug: "Party-Games", illus: "guitar", image: "/img/thumbs/jenga.jpg" },
      { name: "Paper & Pencil", slug: "Paper-and-Pencil-Games", illus: "watercolor", image: "/img/thumbs/tictactoe.jpg" },
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
      { name: "Drawing", slug: "Drawing", illus: "watercolor", image: "/img/steps/Learn-to-Draw-for-Beginners/01.jpg" },
      { name: "Painting", slug: "Painting", illus: "watercolor", image: "/img/categories/topic-artwork.jpg" },
      { name: "Perspective", slug: "Perspective-and-Shading", illus: "books", image: "/img/steps/Learn-to-Draw-for-Beginners/12.jpg" },
      { name: "Framing & Prints", slug: "Framing", illus: "craft", image: "/img/steps/Learn-to-Draw-for-Beginners/20.jpg" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(1, 7),
    articles: ARTWORK_ARTICLES,
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
      { name: "Choosing Books", slug: "Choosing-Books", illus: "books", image: "/img/thumbs/cat/books-01.jpg" },
      { name: "Reading Habits", slug: "Reading-Habits", illus: "watercolor", image: "/img/thumbs/cat/books-02.jpg" },
      { name: "Caring for Books", slug: "Caring-for-Books", illus: "books", image: "/img/thumbs/cat/books-03.jpg" },
      { name: "Storytelling", slug: "Storytelling", illus: "books", image: "/img/thumbs/cat/books-04.jpg" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(2, 9),
    articles: BOOKS_ARTICLES,
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
      { name: "Filmmaking", slug: "Filmmaking", illus: "camera", image: "/img/thumbs/cat/movies-01.jpg" },
      { name: "Screenwriting", slug: "Screenwriting", illus: "books", image: "/img/thumbs/cat/movies-02.jpg" },
      { name: "Film Studies", slug: "Film-Studies", illus: "camera", image: "/img/thumbs/cat/movies-03.jpg" },
      { name: "Cinematography", slug: "Cinematography", illus: "heart", image: "/img/thumbs/cat/movies-04.jpg" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(11, 17),
    articles: MOVIES_ARTICLES,
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
      { name: "Musical Instruments", slug: "Musical-Instruments", illus: "guitar", image: "/img/thumbs/cat/music-01.jpg" },
      { name: "Music Production", slug: "Music-Production", illus: "laptop", image: "/img/thumbs/cat/music-02.jpg" },
      { name: "Singing", slug: "Singing", illus: "guitar", image: "/img/thumbs/cat/music-03.jpg" },
      { name: "Bands & Live Shows", slug: "Concerts", illus: "guitar", image: "/img/thumbs/cat/music-04.jpg" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(12, 17),
    articles: MUSIC_ARTICLES,
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
      { name: "Paper Crafts", slug: "Paper-Crafts", illus: "craft", image: "/img/thumbs/cat/crafts-01.jpg" },
      { name: "Origami", slug: "Origami", illus: "watercolor", image: "/img/thumbs/cat/crafts-02.jpg" },
      { name: "Knitting & Crochet", slug: "Knitting-and-Crochet", illus: "craft", image: "/img/thumbs/cat/crafts-03.jpg" },
      { name: "Textile & Clay", slug: "Textile-Arts", illus: "heart", image: "/img/thumbs/cat/crafts-04.jpg" },
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
    articles: CRAFTS_ARTICLES,
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
      { name: "Pencil Sketching", slug: "Pencil-Sketching", illus: "watercolor", image: "/img/steps/Learn-to-Draw-for-Beginners/02.jpg" },
      { name: "Perspective & Shading", slug: "Perspective-and-Shading", illus: "watercolor", image: "/img/steps/Learn-to-Draw-for-Beginners/12.jpg" },
      { name: "Portraits & Figures", slug: "Portraits-and-Figures", illus: "watercolor", image: "/img/steps/Learn-to-Draw-for-Beginners/16.jpg" },
      { name: "Inking & Line Art", slug: "Inking-and-Line-Art", illus: "books", image: "/img/steps/Learn-to-Draw-for-Beginners/20.jpg" },
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
    articles: DRAWING_ARTICLES,
  },
  Photography: {
    slug: "Photography",
    name: "Photography",
    parentSlug: "Hobbies-and-Crafts",
    parentName: "Hobbies and Crafts",
    emoji: "📷",
    color: "#7cb342",
    description:
      "Master manual camera exposure, natural-light portraiture, composition, and lens care with Howcompass's Photography guides.",
    featuredTopics: [
      { name: "Manual Exposure", slug: "Manual-Exposure", illus: "camera", image: "/img/thumbs/cat/photo-01.jpg" },
      { name: "Portrait Lighting", slug: "Portrait-Lighting", illus: "camera", image: "/img/thumbs/cat/photo-02.jpg" },
      { name: "Composition", slug: "Composition", illus: "camera", image: "/img/thumbs/cat/photo-03.jpg" },
      { name: "Gear & Care", slug: "Camera-Care", illus: "camera", image: "/img/thumbs/cat/photo-04.jpg" },
    ],
    relatedTopics: [],
    articles: PHOTO_ARTICLES,
  },
};

const PRIMARY_CATEGORY_ENRICHMENTS = {
  "Arts-and-Entertainment": {
    heroBanner: "/img/categories/arts-hero.jpg",
    featuredTopics: [
      { name: "Artwork", slug: "Artwork", illus: "watercolor", image: "/img/categories/topic-artwork.jpg" },
      { name: "Books", slug: "Books", illus: "books", image: "/img/categories/topic-books.jpg" },
      { name: "Movies", slug: "Movies", illus: "camera", image: "/img/categories/topic-movies.jpg" },
      { name: "Music", slug: "Music", illus: "guitar", image: "/img/categories/topic-music.jpg" },
    ],
    relatedTopics: ARTS_RELATED_TOPICS,
    showcaseArticles: ARTS_ARTICLES,
    newArticles: ARTS_NEW_ARTICLES,
  },
  "Hobbies-and-Crafts": {
    heroBanner: "/img/categories/hobbies-hero.jpg",
    featuredTopics: [
      { name: "Crafts", slug: "Crafts", illus: "craft", image: "/img/categories/topic-crafts.jpg" },
      { name: "Drawing", slug: "Drawing", illus: "watercolor", image: "/img/categories/topic-drawing.jpg" },
      { name: "Games", slug: "Games", illus: "craft", image: "/img/categories/topic-games.jpg" },
      { name: "Photography", slug: "Photography", illus: "camera", image: "/img/categories/topic-photography.jpg" },
    ],
    relatedTopics: GAMES_RELATED_TOPICS,
    showcaseArticles: HOBBIES_ARTICLES,
    newArticles: HOBBIES_ARTICLES.slice(4, 12),
  },
  "Computers-and-Electronics": {
    heroBanner: "/img/steps/Speed-Up-a-Slow-Laptop/01.jpg",
    featuredTopics: [
      { name: "Computers", slug: "Computers", illus: "laptop", image: "/img/steps/Speed-Up-a-Slow-Laptop/03.jpg" },
      { name: "Phone Skills", slug: "Phone-Skills", illus: "laptop", image: "/img/steps/Speed-Up-a-Slow-Laptop/08.jpg" },
      { name: "Technology Hacks", slug: "Technology-Hacks", illus: "laptop", image: "/img/steps/Speed-Up-a-Slow-Laptop/14.jpg" },
      { name: "Home Networks", slug: "Home-Networks", illus: "laptop", image: "/img/steps/Speed-Up-a-Slow-Laptop/19.jpg" },
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
    showcaseArticles: COMPUTERS_ARTICLES,
    newArticles: COMPUTERS_ARTICLES.slice(4, 12),
  },
  "Food-and-Entertaining": {
    heroBanner: "/img/steps/Bake-Bread-at-Home/20.jpg",
    featuredTopics: [
      { name: "Baking", slug: "Baking", illus: "carbonara", image: "/img/steps/Bake-Bread-at-Home/17.jpg" },
      { name: "Everyday Cooking", slug: "Everyday-Cooking", illus: "carbonara", image: "/img/steps/Bake-Bread-at-Home/01.jpg" },
      { name: "Coffee & Tea", slug: "Coffee-and-Tea", illus: "cookies", image: "/img/steps/Bake-Bread-at-Home/23.jpg" },
      { name: "Hosting", slug: "Hosting", illus: "carbonara", image: "/img/steps/Bake-Bread-at-Home/21.jpg" },
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
    showcaseArticles: FOOD_ARTICLES,
    newArticles: FOOD_ARTICLES.slice(4, 12),
  },
  "Home-and-Garden": {
    heroBanner: "/img/steps/Keep-Houseplants-Alive/01.jpg",
    featuredTopics: [
      { name: "Houseplants", slug: "Houseplants", illus: "tomatoes", image: "/img/steps/Keep-Houseplants-Alive/05.jpg" },
      { name: "Gardening", slug: "Gardening", illus: "tomatoes", image: "/img/steps/Keep-Houseplants-Alive/11.jpg" },
      { name: "Home Maintenance", slug: "Home-Maintenance", illus: "tomatoes", image: "/img/steps/Keep-Houseplants-Alive/16.jpg" },
      { name: "Cleaning", slug: "Cleaning", illus: "tomatoes", image: "/img/steps/Keep-Houseplants-Alive/22.jpg" },
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
    showcaseArticles: HOME_ARTICLES,
    newArticles: HOME_ARTICLES.slice(4, 12),
  },
  Health: {
    heroBanner: "/img/categories/health-hero.jpg",
    featuredTopics: [
      { name: "Mental Health", slug: "Mental-Health", illus: "heart", image: "/img/thumbs/cat/health-01.jpg" },
      { name: "Sleep & Rest", slug: "Sleep-and-Rest", illus: "heart", image: "/img/thumbs/cat/health-02.jpg" },
      { name: "Nutrition", slug: "Nutrition", illus: "tomatoes", image: "/img/thumbs/cat/health-03.jpg" },
      { name: "Mobility & Posture", slug: "Mobility", illus: "stretch", image: "/img/thumbs/cat/health-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Sleep and Recovery",
        slug: "Sleep-and-Rest",
        children: ["Sleep Hygiene", "Circadian Rhythm", "Evening Wind-Down", "Nap Timing"],
      },
      {
        title: "Wellness and Prevention",
        slug: "Mental-Health",
        children: ["Stress Management", "Breathing Exercises", "Hydration", "Posture Habits"],
      },
    ],
    showcaseArticles: HEALTH_ARTICLES,
    newArticles: HEALTH_ARTICLES.slice(4, 12),
  },
  "Finance-and-Business": {
    heroBanner: "/img/categories/finance-hero.jpg",
    featuredTopics: [
      { name: "Budgeting", slug: "Budgeting", illus: "money", image: "/img/thumbs/cat/finance-01.jpg" },
      { name: "Saving & Investing", slug: "Investing", illus: "money", image: "/img/thumbs/cat/finance-02.jpg" },
      { name: "Small Business", slug: "Small-Business", illus: "resume", image: "/img/thumbs/cat/finance-03.jpg" },
      { name: "Accounting Basics", slug: "Accounting", illus: "resume", image: "/img/thumbs/cat/finance-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Personal Finance",
        slug: "Budgeting",
        children: ["Monthly Budgets", "Emergency Funds", "Debt Payoff", "Saving Habits"],
      },
      {
        title: "Business Operations",
        slug: "Small-Business",
        children: ["Bookkeeping", "Invoicing", "Client Communication", "Project Planning"],
      },
    ],
    showcaseArticles: FINANCE_ARTICLES,
    newArticles: FINANCE_ARTICLES.slice(4, 12),
  },
  "Pets-and-Animals": {
    heroBanner: "/img/categories/pets-hero.jpg",
    featuredTopics: [
      { name: "Dogs & Puppies", slug: "Dogs", illus: "puppy", image: "/img/thumbs/cat/pets-01.jpg" },
      { name: "Cats & Kittens", slug: "Cats", illus: "paw", image: "/img/thumbs/cat/pets-02.jpg" },
      { name: "Pet Training", slug: "Pet-Training", illus: "puppy", image: "/img/thumbs/cat/pets-03.jpg" },
      { name: "Pet Nutrition", slug: "Pet-Nutrition", illus: "paw", image: "/img/thumbs/cat/pets-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Dog Care and Training",
        slug: "Dogs",
        children: ["Puppy House-Training", "Leash Walking", "Crate Training", "Grooming"],
      },
      {
        title: "Cat Care and Enrichment",
        slug: "Cats",
        children: ["Litter Training", "Scratching Posts", "Indoor Play", "Brushing"],
      },
    ],
    showcaseArticles: PETS_ARTICLES,
    newArticles: PETS_ARTICLES.slice(4, 12),
  },
  "Sports-and-Fitness": {
    heroBanner: "/img/categories/sports-hero.jpg",
    featuredTopics: [
      { name: "Running & Cardio", slug: "Running", illus: "stretch", image: "/img/thumbs/cat/sports-01.jpg" },
      { name: "Strength Training", slug: "Strength-Training", illus: "stretch", image: "/img/thumbs/cat/sports-02.jpg" },
      { name: "Stretching & Mobility", slug: "Stretching", illus: "stretch", image: "/img/thumbs/cat/sports-03.jpg" },
      { name: "Outdoor Sports", slug: "Outdoor-Sports", illus: "stretch", image: "/img/thumbs/cat/sports-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Running and Endurance",
        slug: "Running",
        children: ["5K Training", "Warm-Up Drills", "Breathing Rhythm", "Running Shoes"],
      },
      {
        title: "Strength and Flexibility",
        slug: "Stretching",
        children: ["Bodyweight Exercises", "Core Stability", "Cooldown Stretches", "Recovery Days"],
      },
    ],
    showcaseArticles: SPORTS_ARTICLES,
    newArticles: SPORTS_ARTICLES.slice(4, 12),
  },
  "Education-and-Communications": {
    heroBanner: "/img/categories/education-hero.jpg",
    featuredTopics: [
      { name: "Studying", slug: "Studying", illus: "books", image: "/img/thumbs/cat/education-01.jpg" },
      { name: "Communication Skills", slug: "Communication-Skills", illus: "books", image: "/img/thumbs/cat/education-02.jpg" },
      { name: "Personal Development", slug: "Personal-Development", illus: "books", image: "/img/thumbs/cat/education-03.jpg" },
      { name: "Writing & Research", slug: "Writing-Skills", illus: "resume", image: "/img/thumbs/cat/education-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Study Skills and Exams",
        slug: "Studying",
        children: ["Note-Taking Systems", "Spaced Repetition", "Active Recall", "Reading Comprehension"],
      },
      {
        title: "Speaking and Writing",
        slug: "Communication-Skills",
        children: ["Public Speaking", "Essay Structure", "Clear Emails", "Active Listening"],
      },
    ],
    showcaseArticles: EDUCATION_ARTICLES,
    newArticles: EDUCATION_ARTICLES.slice(4, 12),
  },
  "Family-Life": {
    heroBanner: "/img/categories/family-hero.jpg",
    featuredTopics: [
      { name: "Parenting", slug: "Parenting", illus: "heart", image: "/img/thumbs/cat/family-01.jpg" },
      { name: "Family Activities", slug: "Family-Activities", illus: "craft", image: "/img/thumbs/cat/family-02.jpg" },
      { name: "Home Routines", slug: "Home-Routines", illus: "tomatoes", image: "/img/thumbs/cat/family-03.jpg" },
      { name: "Holidays & Gatherings", slug: "Gatherings", illus: "cookies", image: "/img/thumbs/cat/family-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Parenting and Routines",
        slug: "Parenting",
        children: ["Morning Routines", "Homework Habits", "Family Meals", "Chore Charts"],
      },
      {
        title: "Playing Together",
        slug: "Family-Activities",
        children: ["Board Game Nights", "Weekend Outings", "Cooking with Kids", "Storytime"],
      },
    ],
    showcaseArticles: FAMILY_ARTICLES,
    newArticles: FAMILY_ARTICLES.slice(4, 12),
  },
  "Work-World": {
    heroBanner: "/img/categories/work-hero.jpg",
    featuredTopics: [
      { name: "Resumes & CVs", slug: "Resumes", illus: "resume", image: "/img/thumbs/cat/work-01.jpg" },
      { name: "Job Interviews", slug: "Job-Interviews", illus: "resume", image: "/img/thumbs/cat/work-02.jpg" },
      { name: "Remote Work", slug: "Remote-Work", illus: "laptop", image: "/img/thumbs/cat/work-03.jpg" },
      { name: "Workplace Skills", slug: "Workplace-Skills", illus: "resume", image: "/img/thumbs/cat/work-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Job Search and Applications",
        slug: "Resumes",
        children: ["Resume Formatting", "Cover Letters", "Portfolio Pages", "Interview Prep"],
      },
      {
        title: "Professional Growth",
        slug: "Workplace-Skills",
        children: ["Time Management", "Running Meetings", "Salary Negotiation", "Remote Collaboration"],
      },
    ],
    showcaseArticles: WORK_ARTICLES,
    newArticles: WORK_ARTICLES.slice(4, 12),
  },
  Relationships: {
    heroBanner: "/img/categories/relationships-hero.jpg",
    featuredTopics: [
      { name: "Dating", slug: "Dating", illus: "heart", image: "/img/thumbs/cat/relationships-01.jpg" },
      { name: "Love & Partnership", slug: "Love", illus: "heart", image: "/img/thumbs/cat/relationships-02.jpg" },
      { name: "Relationship Issues", slug: "Relationship-Issues", illus: "heart", image: "/img/thumbs/cat/relationships-03.jpg" },
      { name: "Friendships", slug: "Friendships", illus: "heart", image: "/img/thumbs/cat/relationships-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Dating and Romance",
        slug: "Dating",
        children: ["First Date Ideas", "Conversation Starters", "Long-Distance Relationships", "Anniversaries"],
      },
      {
        title: "Healthy Communication",
        slug: "Relationship-Issues",
        children: ["Active Listening", "Resolving Conflict", "Setting Boundaries", "Building Trust"],
      },
    ],
    showcaseArticles: RELATIONSHIPS_ARTICLES,
    newArticles: RELATIONSHIPS_ARTICLES.slice(4, 12),
  },
  "Personal-Care-and-Style": {
    heroBanner: "/img/categories/style-hero.jpg",
    featuredTopics: [
      { name: "Fashion", slug: "Fashion", illus: "heart", image: "/img/thumbs/cat/style-01.jpg" },
      { name: "Hair Care", slug: "Hair-Care", illus: "heart", image: "/img/thumbs/cat/style-02.jpg" },
      { name: "Personal Hygiene", slug: "Personal-Hygiene", illus: "heart", image: "/img/thumbs/cat/style-03.jpg" },
      { name: "Wardrobe Care", slug: "Wardrobe-Care", illus: "craft", image: "/img/thumbs/cat/style-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Wardrobe and Dressing",
        slug: "Fashion",
        children: ["Capsule Wardrobes", "Fabric Care", "Ironing and Steaming", "Shoe Care"],
      },
      {
        title: "Daily Grooming",
        slug: "Personal-Hygiene",
        children: ["Skincare Routines", "Hair Styling", "Nail Care", "Morning Habits"],
      },
    ],
    showcaseArticles: STYLE_ARTICLES,
    newArticles: STYLE_ARTICLES.slice(4, 12),
  },
  Travel: {
    heroBanner: "/img/categories/travel-hero.jpg",
    featuredTopics: [
      { name: "Packing Light", slug: "Packing", illus: "compass", image: "/img/thumbs/cat/travel-01.jpg" },
      { name: "Train & Rail Travel", slug: "Rail-Travel", illus: "compass", image: "/img/thumbs/cat/travel-02.jpg" },
      { name: "City Guides", slug: "City-Guides", illus: "camera", image: "/img/thumbs/cat/travel-03.jpg" },
      { name: "Travel Budgeting", slug: "Travel-Budgeting", illus: "money", image: "/img/thumbs/cat/travel-04.jpg" },
    ],
    relatedTopics: [
      {
        title: "Trip Planning",
        slug: "Packing",
        children: ["Carry-On Packing", "Itineraries", "Rail Passes", "Travel Insurance"],
      },
    ],
    showcaseArticles: TRAVEL_ARTICLES,
    newArticles: TRAVEL_ARTICLES.slice(4, 12),
  },
};

function getSubcategoryInfo(rawSlug) {
  const clean = String(rawSlug || "").replace(/^Category:/i, "");
  if (SUBCATEGORY_DATA[clean]) return SUBCATEGORY_DATA[clean];

  const foundKey = Object.keys(SUBCATEGORY_DATA).find(
    (k) => k.toLowerCase() === clean.toLowerCase()
  );
  if (foundKey) return SUBCATEGORY_DATA[foundKey];

  const h = hashSlug(clean);
  const label = unslugifyTopic(clean);
  const lower = clean.toLowerCase();

  const matchMap = [
    {
      test: ["computer", "phone", "tech", "network", "ssd", "wi-fi", "wifi", "password", "browser", "battery"],
      parentSlug: "Computers-and-Electronics",
      parentName: "Computers and Electronics",
      pool: COMPUTERS_ARTICLES,
    },
    {
      test: ["bake", "baking", "cook", "bread", "coffee", "host", "sourdough", "food", "knife"],
      parentSlug: "Food-and-Entertaining",
      parentName: "Food and Entertaining",
      pool: FOOD_ARTICLES,
    },
    {
      test: ["plant", "garden", "home", "clean", "water", "soil", "repot", "plumb"],
      parentSlug: "Home-and-Garden",
      parentName: "Home and Garden",
      pool: HOME_ARTICLES,
    },
    {
      test: ["health", "mental", "men", "women", "sleep", "nutrition", "mobility", "stress"],
      parentSlug: "Health",
      parentName: "Health",
      pool: HEALTH_ARTICLES,
    },
    {
      test: ["budget", "invest", "finance", "business", "account", "saving", "money"],
      parentSlug: "Finance-and-Business",
      parentName: "Finance and Business",
      pool: FINANCE_ARTICLES,
    },
    {
      test: ["dog", "cat", "pet", "puppy", "kitten", "animal", "aquarium"],
      parentSlug: "Pets-and-Animals",
      parentName: "Pets and Animals",
      pool: PETS_ARTICLES,
    },
    {
      test: ["run", "strength", "stretch", "sport", "fitness", "cardio", "swim", "bike"],
      parentSlug: "Sports-and-Fitness",
      parentName: "Sports and Fitness",
      pool: SPORTS_ARTICLES,
    },
    {
      test: ["study", "communicat", "develop", "writing", "research", "educat", "speak"],
      parentSlug: "Education-and-Communications",
      parentName: "Education and Communications",
      pool: EDUCATION_ARTICLES,
    },
    {
      test: ["parent", "family", "routine", "gather", "child", "kid"],
      parentSlug: "Family-Life",
      parentName: "Family Life",
      pool: FAMILY_ARTICLES,
    },
    {
      test: ["resume", "interview", "remote", "work", "career", "job"],
      parentSlug: "Work-World",
      parentName: "Work World",
      pool: WORK_ARTICLES,
    },
    {
      test: ["date", "dating", "love", "relationship", "friend"],
      parentSlug: "Relationships",
      parentName: "Relationships",
      pool: RELATIONSHIPS_ARTICLES,
    },
    {
      test: ["fashion", "hair", "hygiene", "wardrobe", "style", "skin"],
      parentSlug: "Personal-Care-and-Style",
      parentName: "Personal Care and Style",
      pool: STYLE_ARTICLES,
    },
    {
      test: ["pack", "rail", "travel", "city", "trip"],
      parentSlug: "Travel",
      parentName: "Travel",
      pool: TRAVEL_ARTICLES,
    },
  ];

  for (const m of matchMap) {
    if (m.test.some((kw) => lower.includes(kw))) {
      const enrich = PRIMARY_CATEGORY_ENRICHMENTS[m.parentSlug];
      return {
        slug: clean,
        name: label,
        parentSlug: m.parentSlug,
        parentName: m.parentName,
        emoji: "🧭",
        color: "#7cb342",
        description: `Explore step-by-step tutorials, practical tips, and expert guides in Howcompass's ${label} category.`,
        featuredTopics: enrich.featuredTopics,
        relatedTopics: enrich.relatedTopics,
        articles: rotateArray(m.pool, h % m.pool.length),
      };
    }
  }

  return {
    slug: clean,
    name: label,
    parentSlug: "Hobbies-and-Crafts",
    parentName: "Hobbies and Crafts",
    emoji: "🧭",
    color: "#7cb342",
    description: `Explore step-by-step tutorials, rules, and expert techniques in Howcompass's ${label} category.`,
    featuredTopics: SUBCATEGORY_DATA.Games.featuredTopics,
    relatedTopics: GAMES_RELATED_TOPICS,
    articles: rotateArray(GAMES_ARTICLES, h % GAMES_ARTICLES.length),
  };
}

function getPrimaryEnrichment(slug) {
  if (PRIMARY_CATEGORY_ENRICHMENTS[slug]) {
    return PRIMARY_CATEGORY_ENRICHMENTS[slug];
  }
  const h = hashSlug(slug);
  const label = unslugifyTopic(slug);
  const keys = ["travel", "family", "education", "hobbies", "style"];
  const key = keys[h % keys.length];
  const dynamicArticles = buildCategoryArticles(key, label, [
    `Get Started With ${label} Step by Step`,
    `Build Consistent Weekly ${label} Habits`,
    `Choose Reliable Tools and Gear for ${label}`,
    `Avoid Common Beginner Mistakes in ${label}`,
    `Plan a 30-Day Progress Checklist for ${label}`,
    `Share ${label} Traditions With Family and Friends`,
    `Organize Your Supplies for ${label}`,
    `Learn Intermediate ${label} Techniques Safely`,
    `Keep a Practical Reference Log for ${label}`,
    `Save Time and Budget on ${label} Projects`,
    `Troubleshoot Everyday ${label} Challenges`,
    `Refresh Your Seasonal ${label} Routine`,
  ]);
  const imgs = catImgs(key);
  return {
    heroBanner: `/img/categories/${key}-hero.jpg`,
    featuredTopics: [
      { name: `${label} Basics`, slug: `${slug}-Basics`, illus: "compass", image: imgs[0] },
      { name: "Step-by-Step Guides", slug: `${slug}-Guides`, illus: "books", image: imgs[1] },
      { name: "Expert Tips", slug: `${slug}-Tips`, illus: "heart", image: imgs[2] },
      { name: "Daily Habits", slug: `${slug}-Habits`, illus: "stretch", image: imgs[3] },
    ],
    relatedTopics: ARTS_RELATED_TOPICS.slice(0, 6),
    showcaseArticles: dynamicArticles,
    newArticles: dynamicArticles.slice(4, 12),
  };
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
  COMPUTERS_ARTICLES,
  FOOD_ARTICLES,
  HOME_ARTICLES,
  ALL_SHOWCASE_ARTICLES,
  SUBCATEGORY_DATA,
};

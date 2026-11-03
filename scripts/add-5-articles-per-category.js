const dbMod = require("../lib/db");
const db = dbMod.db || dbMod.default || dbMod;

function slugify(text) {
  return String(text || "")
    .trim()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 20 categories in SQLite with 5 brand-new articles each (100 articles total)
const CATEGORY_NEW_FIVE = [
  {
    catSlug: "Arts-and-Entertainment",
    key: "arts",
    hero: "watercolor",
    author: "Clara Lindqvist, MFA",
    refs: [
      { title: " Tate Museum — Glossary of Art Terms & Studio Practice", publisher: "Tate Britain", url: "https://www.tate.org.uk/art/art-terms" },
      { title: "Royal Academy of Arts — Drawing & Painting Techniques", publisher: "Royal Academy London", url: "https://www.royalacademy.org.uk/" },
      { title: "Berklee Online — Music Production & Performance Guides", publisher: "Berklee College of Music", url: "https://online.berklee.edu/" },
    ],
    articles: [
      {
        title: "Keep a Daily Visual Sketchbook Diary While Traveling",
        summary: "Capture architecture, café scenes, and handwritten notes in a pocket sketchbook in just fifteen minutes a day.",
        images: ["/img/thumbs/cat/arts-13.jpg", "/img/steps/Learn-to-Draw-for-Beginners/04.jpg", "/img/steps/Learn-to-Draw-for-Beginners/09.jpg"],
      },
      {
        title: "Read a Orchestra Concert Program Like a Classical Musician",
        summary: "Understand movement markings, tempo Italian terms, and concerto structure before the conductor raises the baton.",
        images: ["/img/thumbs/cat/arts-14.jpg", "/img/thumbs/cat/music-05.jpg", "/img/thumbs/cat/music-06.jpg"],
      },
      {
        title: "Light a Home Portrait Studio With Two Softboxes",
        summary: "Position your key light at forty-five degrees and balance fill shadows for flattering editorial portraits.",
        images: ["/img/thumbs/cat/arts-15.jpg", "/img/thumbs/cat/photo-05.jpg", "/img/thumbs/cat/photo-06.jpg"],
      },
      {
        title: "Memorize a Theater Monologue With Action Beats",
        summary: "Break dramatic text into objective-driven beats and rehearse physical cues so lines never slip under stage lights.",
        images: ["/img/thumbs/cat/arts-16.jpg", "/img/thumbs/cat/movies-05.jpg", "/img/thumbs/cat/movies-06.jpg"],
      },
      {
        title: "Curate a 100-Book Personal Classics Shelf at Home",
        summary: "Balance world fiction, essays, drama, and poetry in durable clothbound and paperback editions you will reread for life.",
        images: ["/img/thumbs/cat/arts-17.jpg", "/img/thumbs/cat/books-05.jpg", "/img/thumbs/cat/books-06.jpg"],
      },
    ],
  },
  {
    catSlug: "Computers-and-Electronics",
    key: "computers",
    hero: "laptop",
    author: "Lukas Bergström, Systems Engineer",
    refs: [
      { title: "Electronic Frontier Foundation — Surveillance Self-Defense Guide", publisher: "EFF", url: "https://ssd.eff.org/" },
      { title: "NIST — Computer Security Resource Center Guidelines", publisher: "National Institute of Standards and Technology", url: "https://csrc.nist.gov/" },
      { title: "ArchWiki — System Maintenance & Storage Benchmarks", publisher: "Arch Linux Documentation", url: "https://wiki.archlinux.org/" },
    ],
    articles: [
      {
        title: "Calibrate a Desktop Monitor for Accurate sRGB Colors",
        summary: "Set white point to 6500K, adjust gamma to 2.2, and tune brightness so photos and text look natural without eye strain.",
        images: ["/img/thumbs/cat/computers-13.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/19.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/20.jpg"],
      },
      {
        title: "Set Up Encrypted Automated Cloud and Local Backups",
        summary: "Combine a daily external SSD snapshot with zero-knowledge encrypted off-site storage so you never lose a single file.",
        images: ["/img/thumbs/cat/computers-14.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/21.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/22.jpg"],
      },
      {
        title: "Clean a Mechanical Keyboard and Lubricate Stabilizers",
        summary: "Pull keycaps safely with a wire puller, ultrasonic-wash PBT caps, and silence rattling spacebar wires.",
        images: ["/img/thumbs/cat/computers-15.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/23.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/24.jpg"],
      },
      {
        title: "Create a Separate Guest Wi-Fi Network on Your Home Router",
        summary: "Isolate smart-home gadgets and visitor phones on a secondary VLAN so your primary computers stay private.",
        images: ["/img/thumbs/cat/computers-16.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/25.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/14.jpg"],
      },
      {
        title: "Extend Smartphone Battery Lifespan With 80-Percent Charge Limits",
        summary: "Reduce lithium-ion voltage stress, disable background location polling, and avoid heat buildup while fast-charging.",
        images: ["/img/thumbs/cat/computers-17.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/08.jpg", "/img/steps/Speed-Up-a-Slow-Laptop/11.jpg"],
      },
    ],
  },
  {
    catSlug: "Education-and-Communications",
    key: "education",
    hero: "books",
    author: "Dr. Elena Vance, Academic Advisor",
    refs: [
      { title: "Cornell Learning Strategies Center — The Cornell Note-Taking System", publisher: "Cornell University", url: "https://lsc.cornell.edu/how-to-study/taking-notes/cornell-note-taking-system/" },
      { title: "UNC Writing Center — Academic Essay & Thesis Handouts", publisher: "University of North Carolina", url: "https://writingcenter.unc.edu/tips-and-tools/" },
      { title: "MIT OpenCourseWare — Effective Study & Research Habits", publisher: "MIT", url: "https://ocw.mit.edu/" },
    ],
    articles: [
      {
        title: "Memorize Technical Vocabulary Using the Feynman Technique",
        summary: "Explain complex concepts in plain language on a blank sheet of paper to expose gaps in your understanding immediately.",
        images: ["/img/thumbs/cat/education-13.jpg", "/img/thumbs/cat/education-05.jpg", "/img/thumbs/cat/education-06.jpg"],
      },
      {
        title: "Structure a Persuasive 10-Minute Conference Talk",
        summary: "Open with a concrete problem statement, limit slides to one visual idea each, and finish with three actionable takeaways.",
        images: ["/img/thumbs/cat/education-14.jpg", "/img/thumbs/cat/education-07.jpg", "/img/thumbs/cat/education-08.jpg"],
      },
      {
        title: "Build a Zettelkasten Slip-Box for Long-Term Research Notes",
        summary: "Link atomic literature notes and permanent notes with unique IDs so essays practically assemble themselves.",
        images: ["/img/thumbs/cat/education-15.jpg", "/img/thumbs/cat/education-09.jpg", "/img/thumbs/cat/education-10.jpg"],
      },
      {
        title: "Prepare for Oral University Exams With Mock Question Drills",
        summary: "Simulate real examiner prompts out loud at a whiteboard and structure two-minute answers with clear signposting.",
        images: ["/img/thumbs/cat/education-16.jpg", "/img/thumbs/cat/education-11.jpg", "/img/thumbs/cat/education-12.jpg"],
      },
      {
        title: "Speed-Read Academic Journal Articles by Scanning Figures First",
        summary: "Read the abstract, conclusion, and data plots before diving into the methods section to evaluate relevance in five minutes.",
        images: ["/img/thumbs/cat/education-17.jpg", "/img/thumbs/cat/education-01.jpg", "/img/thumbs/cat/education-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Family-Life",
    key: "family",
    hero: "heart",
    author: "Hannah Lindholm, Family Counselor",
    refs: [
      { title: "Child Mind Institute — Family Routines & Parenting Guides", publisher: "Child Mind Institute", url: "https://childmind.org/" },
      { title: "American Academy of Pediatrics — HealthyChildren Family Life", publisher: "AAP", url: "https://www.healthychildren.org/" },
      { title: "National Literacy Trust — Reading Together at Home", publisher: "National Literacy Trust UK", url: "https://literacytrust.org.uk/" },
    ],
    articles: [
      {
        title: "Set Up a Mudroom Entryway Drop Zone for Backpacks and Shoes",
        summary: "Give every family member a labeled low hook, shoe tray, and library-return basket by the front door.",
        images: ["/img/thumbs/cat/family-13.jpg", "/img/thumbs/cat/family-05.jpg", "/img/thumbs/cat/family-06.jpg"],
      },
      {
        title: "Create an Annual Family Photo Yearbook in One Weekend",
        summary: "Sort twelve months of phone photos into seasonal chapters and print an archival linen-bound keepsake album.",
        images: ["/img/thumbs/cat/family-14.jpg", "/img/thumbs/cat/family-07.jpg", "/img/thumbs/cat/family-08.jpg"],
      },
      {
        title: "Teach Kids Kitchen Safety and Knife Skills With Soft Foods",
        summary: "Start with the claw grip on bananas and cucumbers before progressing to paring knives and stovetop supervision.",
        images: ["/img/thumbs/cat/family-15.jpg", "/img/thumbs/cat/family-09.jpg", "/img/thumbs/cat/family-10.jpg"],
      },
      {
        title: "Run a Calm Bedtime Wind-Down for Toddlers and School-Age Kids",
        summary: "Use a predictable bath, pajamas, dim lamp, and two-story sequence so children fall asleep without bedtime battles.",
        images: ["/img/thumbs/cat/family-16.jpg", "/img/thumbs/cat/family-11.jpg", "/img/thumbs/cat/family-12.jpg"],
      },
      {
        title: "Organize a Neighborhood Toy and Children's Book Swap",
        summary: "Invite six local families to trade outgrown puzzles, board games, and picture books cleanly and for free.",
        images: ["/img/thumbs/cat/family-17.jpg", "/img/thumbs/cat/family-01.jpg", "/img/thumbs/cat/family-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Finance-and-Business",
    key: "finance",
    hero: "money",
    author: "Henrik Falk, CFA",
    refs: [
      { title: "Consumer Financial Protection Bureau — Budgeting & Saving Tools", publisher: "CFPB", url: "https://www.consumerfinance.gov/" },
      { title: "European Central Bank — Personal Finance & Inflation Explainer", publisher: "ECB", url: "https://www.ecb.europa.eu/" },
      { title: "Bogleheads Investment Philosophy — Low-Cost Indexing", publisher: "Bogleheads Wiki", url: "https://www.bogleheads.org/wiki/Main_Page" },
    ],
    articles: [
      {
        title: "Build a Three-Bucket Sinking Fund for Annual Irregular Expenses",
        summary: "Divide car maintenance, holiday travel, and annual insurance premiums into monthly automated sub-accounts.",
        images: ["/img/thumbs/cat/finance-13.jpg", "/img/thumbs/cat/finance-05.jpg", "/img/thumbs/cat/finance-06.jpg"],
      },
      {
        title: "Audit Your Monthly SaaS and Streaming Subscriptions in 20 Minutes",
        summary: "Export twelve months of card statements, highlight recurring charges, and cancel unused renewals immediately.",
        images: ["/img/thumbs/cat/finance-14.jpg", "/img/thumbs/cat/finance-07.jpg", "/img/thumbs/cat/finance-08.jpg"],
      },
      {
        title: "Write a One-Page Lean Business Plan for a Local Service Venture",
        summary: "Define your target customer, unit economics, startup tool costs, and break-even client count on a single page.",
        images: ["/img/thumbs/cat/finance-15.jpg", "/img/thumbs/cat/finance-09.jpg", "/img/thumbs/cat/finance-10.jpg"],
      },
      {
        title: "Separate Personal and Freelance Banking From Day One",
        summary: "Open a dedicated business checking account, set aside thirty percent for taxes, and pay yourself a fixed monthly draw.",
        images: ["/img/thumbs/cat/finance-16.jpg", "/img/thumbs/cat/finance-11.jpg", "/img/thumbs/cat/finance-12.jpg"],
      },
      {
        title: "Rebalance a Long-Term Index Portfolio Once a Year",
        summary: "Restore your target stock-to-bond allocation using new contributions or annual tax-advantaged adjustments.",
        images: ["/img/thumbs/cat/finance-17.jpg", "/img/thumbs/cat/finance-01.jpg", "/img/thumbs/cat/finance-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Food-and-Entertaining",
    key: "food",
    hero: "carbonara",
    author: "Marco Bellini, Culinary Instructor",
    refs: [
      { title: "King Arthur Baking — The Baker's Percentage & Fermentation Guide", publisher: "King Arthur Baking Company", url: "https://www.kingarthurbaking.com/learn" },
      { title: "Serious Eats — Food Science & Culinary Technique Lab", publisher: "Serious Eats", url: "https://www.seriouseats.com/" },
      { title: "Harvard T.H. Chan School of Public Health — The Nutrition Source", publisher: "Harvard University", url: "https://nutritionsource.hsph.harvard.edu/" },
    ],
    articles: [
      {
        title: "Make Silky Homemade Fresh Egg Pasta Dough by Hand",
        summary: "Mound 00 flour on a wooden board, whisk golden yolks in the well, and knead until the dough springs back like an earlobe.",
        images: ["/img/thumbs/cat/food-13.jpg", "/img/steps/Bake-Bread-at-Home/03.jpg", "/img/steps/Bake-Bread-at-Home/07.jpg"],
      },
      {
        title: "Brew Balanced Pour-Over Coffee With a Digital Kitchen Scale",
        summary: "Use a 1:16 coffee-to-water ratio at 93°C, bloom the grounds for thirty seconds, and pour in slow concentric circles.",
        images: ["/img/thumbs/cat/food-14.jpg", "/img/steps/Bake-Bread-at-Home/10.jpg", "/img/steps/Bake-Bread-at-Home/13.jpg"],
      },
      {
        title: "Assemble a Balanced European Cheese and Charcuterie Board",
        summary: "Pair one aged hard cheese, one soft bloomy rind, and one blue with seasonal figs, toasted walnuts, and crusty bread.",
        images: ["/img/thumbs/cat/food-15.jpg", "/img/steps/Bake-Bread-at-Home/19.jpg", "/img/steps/Bake-Bread-at-Home/21.jpg"],
      },
      {
        title: "Emulsify a Classic French Vinaigrette That Never Separates",
        summary: "Whisk Dijon mustard, aged wine vinegar, and finely minced shallot before streaming in extra-virgin olive oil slowly.",
        images: ["/img/thumbs/cat/food-16.jpg", "/img/steps/Bake-Bread-at-Home/15.jpg", "/img/steps/Bake-Bread-at-Home/18.jpg"],
      },
      {
        title: "Roast Crisp Sheet-Pan Root Vegetables With Fresh Rosemary",
        summary: "Cut carrots, parsnips, and potatoes to uniform size, preheat the heavy tray at 220°C, and leave space between pieces so they caramelize.",
        images: ["/img/thumbs/cat/food-17.jpg", "/img/steps/Bake-Bread-at-Home/22.jpg", "/img/steps/Bake-Bread-at-Home/23.jpg"],
      },
    ],
  },
  {
    catSlug: "Health",
    key: "health",
    hero: "stretch",
    author: "Dr. Maja Lindström, Preventive Medicine",
    refs: [
      { title: "World Health Organization — Physical Activity & Sedentary Behaviour Guidelines", publisher: "WHO", url: "https://www.who.int/publications/i/item/9789240015128" },
      { title: "NHS — Every Mind Matters: Sleep & Stress Management", publisher: "National Health Service UK", url: "https://www.nhs.uk/every-mind-matters/" },
      { title: "Sleep Foundation — Evidence-Based Sleep Hygiene Practices", publisher: "Sleep Foundation", url: "https://www.sleepfoundation.org/sleep-hygiene" },
    ],
    articles: [
      {
        title: "Relieve Upper Back Stiffness With Thoracic Foam Roller Extensions",
        summary: "Support your head with interlaced fingers and gently extend over a medium-density roller between your shoulder blades.",
        images: ["/img/thumbs/cat/health-13.jpg", "/img/thumbs/cat/health-05.jpg", "/img/thumbs/cat/health-06.jpg"],
      },
      {
        title: "Keep a Two-Week Sleep and Morning Energy Log",
        summary: "Record lights-out time, wake time, caffeine cutoff, and morning alertness to pinpoint your ideal sleep window.",
        images: ["/img/thumbs/cat/health-14.jpg", "/img/thumbs/cat/health-07.jpg", "/img/thumbs/cat/health-08.jpg"],
      },
      {
        title: "Practice Progressive Muscle Relaxation Before Bed",
        summary: "Tense and release sixteen muscle groups from your toes to your forehead over ten slow breaths to quiet racing thoughts.",
        images: ["/img/thumbs/cat/health-15.jpg", "/img/thumbs/cat/health-09.jpg", "/img/thumbs/cat/health-10.jpg"],
      },
      {
        title: "Build a Balanced High-Fiber Breakfast Bowl in Five Minutes",
        summary: "Combine rolled oats, chia seeds, Greek yogurt, and seasonal berries for steady morning blood sugar and focus.",
        images: ["/img/thumbs/cat/health-16.jpg", "/img/thumbs/cat/health-11.jpg", "/img/thumbs/cat/health-12.jpg"],
      },
      {
        title: "Wash Your Hands Thoroughly Using the 6-Step WHO Technique",
        summary: "Lather palms, backs of hands, interlaced fingers, thumbs, and fingertips for a full twenty seconds under clean running water.",
        images: ["/img/thumbs/cat/health-17.jpg", "/img/thumbs/cat/health-01.jpg", "/img/thumbs/cat/health-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Hobbies-and-Crafts",
    key: "hobbies",
    hero: "craft",
    author: "Sofie Lindner, Textile & Paper Artist",
    refs: [
      { title: "Victoria and Albert Museum — Craft Techniques & Materials Archive", publisher: "V&A London", url: "https://www.vam.ac.uk/" },
      { title: "Crafts Council UK — Maker Guides & Studio Directory", publisher: "Crafts Council", url: "https://www.craftscouncil.org.uk/" },
      { title: "British Origami Society — Diagrams & Folding Conventions", publisher: "British Origami Society", url: "https://www.britishorigami.org.uk/" },
    ],
    articles: [
      {
        title: "Make Marbled Paper With Shaving Foam and Acrylic Ink Drops",
        summary: "Swirl pigment across a tray of foam with a bamboo skewer and pull one-of-a-kind stationery prints in seconds.",
        images: ["/img/thumbs/cat/hobbies-13.jpg", "/img/thumbs/cat/hobbies-05.jpg", "/img/thumbs/cat/hobbies-06.jpg"],
      },
      {
        title: "mend a Torn Woven Jacket Seam With an Invisible Ladder Stitch",
        summary: "Pick up alternating horizontal threads inside the fold and pull gently so the repair disappears completely.",
        images: ["/img/thumbs/cat/hobbies-14.jpg", "/img/thumbs/cat/hobbies-07.jpg", "/img/thumbs/cat/hobbies-08.jpg"],
      },
      {
        title: "Build a Wooden Birdhouse With Simple Hand Tools",
        summary: "Cut untreated cedar boards with a handsaw, drill a 32mm entrance hole, and hinge the side panel for autumn cleaning.",
        images: ["/img/thumbs/cat/hobbies-15.jpg", "/img/thumbs/cat/hobbies-09.jpg", "/img/thumbs/cat/hobbies-10.jpg"],
      },
      {
        title: "Dry Orange Slices and Herbs for Natural Autumn Wreaths",
        summary: "Bake thin citrus wheels at 90°C for three hours until translucent like stained glass and wire them onto a grapevine ring.",
        images: ["/img/thumbs/cat/hobbies-16.jpg", "/img/thumbs/cat/hobbies-11.jpg", "/img/thumbs/cat/hobbies-12.jpg"],
      },
      {
        title: "Keep a Stamp or Coin Collection Safe in Archival Acid-Free Albums",
        summary: "Handle specimens with smooth philatelic tongs and avoid PVC sleeves that leach plasticizers over time.",
        images: ["/img/thumbs/cat/hobbies-17.jpg", "/img/thumbs/cat/hobbies-01.jpg", "/img/thumbs/cat/hobbies-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Home-and-Garden",
    key: "home",
    hero: "tomatoes",
    author: "Arthur Pendelton, Master Horticulturist",
    refs: [
      { title: "Royal Horticultural Society — Indoor & Balcony Gardening Advice", publisher: "RHS UK", url: "https://www.rhs.org.uk/advice" },
      { title: "Kew Gardens — Plant Care & Urban Biodiversity Guides", publisher: "Royal Botanic Gardens, Kew", url: "https://www.kew.org/" },
      { title: "Cornell Cooperative Extension — Home Composting & Soil Health", publisher: "Cornell University", url: "https://compost.css.cornell.edu/" },
    ],
    articles: [
      {
        title: "Grow Culinary Herbs on a Kitchen Windowsill Year-Round",
        summary: "Pot basil, chives, parsley, and thyme in individual terracotta pots with drainage saucers and pinch tops weekly.",
        images: ["/img/thumbs/cat/home-13.jpg", "/img/steps/Keep-Houseplants-Alive/03.jpg", "/img/steps/Keep-Houseplants-Alive/07.jpg"],
      },
      {
        title: "Descale a Kettle and Espresso Machine With Citric Acid",
        summary: "Dissolve two tablespoons of food-grade citric acid in warm water to dissolve limescale without lingering vinegar odors.",
        images: ["/img/thumbs/cat/home-14.jpg", "/img/steps/Keep-Houseplants-Alive/10.jpg", "/img/steps/Keep-Houseplants-Alive/13.jpg"],
      },
      {
        title: "Bleed a Trapped-Air Home Radiator Before Winter Arrives",
        summary: "Turn off the circulation pump, open the top bleed valve a quarter-turn with a radiator key, and catch the first drops in a cloth.",
        images: ["/img/thumbs/cat/home-15.jpg", "/img/steps/Keep-Houseplants-Alive/15.jpg", "/img/steps/Keep-Houseplants-Alive/17.jpg"],
      },
      {
        title: "Start an Odor-Free Worm Compost Bin on an Apartment Balcony",
        summary: "Balance kitchen fruit scraps with shredded brown cardboard bedding so red wiggler worms produce rich castings.",
        images: ["/img/thumbs/cat/home-16.jpg", "/img/steps/Keep-Houseplants-Alive/18.jpg", "/img/steps/Keep-Houseplants-Alive/21.jpg"],
      },
      {
        title: "Seal Drafty Window Frames With Removable Silicone Weatherstripping",
        summary: "Clean the sash channels with isopropyl alcohol and press self-adhesive V-seal strips firmly along the meeting rails.",
        images: ["/img/thumbs/cat/home-17.jpg", "/img/steps/Keep-Houseplants-Alive/23.jpg", "/img/steps/Keep-Houseplants-Alive/25.jpg"],
      },
    ],
  },
  {
    catSlug: "Pets-and-Animals",
    key: "pets",
    hero: "puppy",
    author: "Dr. Lukas Meyer, DVM",
    refs: [
      { title: "WSAVA — Global Veterinary Nutrition & Vaccination Guidelines", publisher: "World Small Animal Veterinary Association", url: "https://wsava.org/global-guidelines/" },
      { title: "Blue Cross UK — Dog & Cat Behaviour and Training Library", publisher: "Blue Cross Pet Charity", url: "https://www.bluecross.org.uk/advice" },
      { title: "International Cat Care — Feline Friendly Handling & Environment", publisher: "iCatCare", url: "https://icatcare.org/advice/" },
    ],
    articles: [
      {
        title: "Brush Your Dog's Teeth With Enzymatic Poultry Toothpaste",
        summary: "Introduce a finger brush over five calm days, lifting the upper lip gently to clean the outer canine and molar surfaces.",
        images: ["/img/thumbs/cat/pets-13.jpg", "/img/thumbs/cat/pets-05.jpg", "/img/thumbs/cat/pets-06.jpg"],
      },
      {
        title: "Build a Vertical Window Perch and Climbing Shelf for Indoor Cats",
        summary: "Anchor sisal-wrapped shelves into wall studs so indoor cats can survey their territory safely from above.",
        images: ["/img/thumbs/cat/pets-14.jpg", "/img/thumbs/cat/pets-07.jpg", "/img/thumbs/cat/pets-08.jpg"],
      },
      {
        title: "Teach a Dog the 'Leave It' Impulse-Control Cue",
        summary: "Reward your dog for looking away from a closed fist treat before practicing with dropped items on the floor.",
        images: ["/img/thumbs/cat/pets-15.jpg", "/img/thumbs/cat/pets-09.jpg", "/img/thumbs/cat/pets-10.jpg"],
      },
      {
        title: "Set Up a Spacious Hay-Focused Habitat for a House Rabbit",
        summary: "Provide unlimited Timothy hay in a litter-box feeder, an exercise pen, and chew-safe willow tunnels.",
        images: ["/img/thumbs/cat/pets-16.jpg", "/img/thumbs/cat/pets-11.jpg", "/img/thumbs/cat/pets-12.jpg"],
      },
      {
        title: "Check Your Dog's Coat and Ears for Grass Seeds After Country Walks",
        summary: "Part the fur between every toe pad and under the ear flaps right after walking through tall summer meadows.",
        images: ["/img/thumbs/cat/pets-17.jpg", "/img/thumbs/cat/pets-01.jpg", "/img/thumbs/cat/pets-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Sports-and-Fitness",
    key: "sports",
    hero: "stretch",
    author: "Jonas Källström, Certified Strength Coach",
    refs: [
      { title: "American College of Sports Medicine — Resistance & Endurance Guidelines", publisher: "ACSM", url: "https://www.acsm.org/" },
      { title: "British Athletics — Running Drills & Injury Prevention", publisher: "UKA", url: "https://www.britishathletics.org.uk/" },
      { title: "Union Cycliste Internationale — Cycling Bike Fit & Safety", publisher: "UCI", url: "https://www.uci.org/" },
    ],
    articles: [
      {
        title: "Perform a Proper Romanian Deadlift With Dumbbells",
        summary: "Hinge at the hips with a neutral spine, keep the weights grazing your shins, and drive through your heels.",
        images: ["/img/thumbs/cat/sports-13.jpg", "/img/thumbs/cat/sports-05.jpg", "/img/thumbs/cat/sports-06.jpg"],
      },
      {
        title: "Pace a 10K Road Race With Negative Splits",
        summary: "Run the first five kilometers five seconds per kilometer slower than goal pace so you can surge past tired runners after kilometer seven.",
        images: ["/img/thumbs/cat/sports-14.jpg", "/img/thumbs/cat/sports-07.jpg", "/img/thumbs/cat/sports-08.jpg"],
      },
      {
        title: "Learn the Overhead Badminton Clear and Drop Shot Footwork",
        summary: "Use a split-step ready stance, chasse backward into a side-on posture, and strike the shuttlecock at the highest point.",
        images: ["/img/thumbs/cat/sports-15.jpg", "/img/thumbs/cat/sports-09.jpg", "/img/thumbs/cat/sports-10.jpg"],
      },
      {
        title: "Fix a Punctured Bicycle Inner Tube by the Roadside",
        summary: "Seat tire levers opposite the valve stem, inspect the outer casing for thorns, and inflate the spare tube slightly before remounting.",
        images: ["/img/thumbs/cat/sports-16.jpg", "/img/thumbs/cat/sports-11.jpg", "/img/thumbs/cat/sports-12.jpg"],
      },
      {
        title: "Strengthen Rotator Cuff Muscles With Resistance Band External Rotations",
        summary: "Pin a folded towel between your elbow and ribs while rotating a light band outward for fifteen controlled reps.",
        images: ["/img/thumbs/cat/sports-17.jpg", "/img/thumbs/cat/sports-01.jpg", "/img/thumbs/cat/sports-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Work-World",
    key: "work",
    hero: "resume",
    author: "Claire Moreau, Executive Career Coach",
    refs: [
      { title: "Harvard Business Review — Career Management & Leadership Archive", publisher: "Harvard Business Publishing", url: "https://hbr.org/" },
      { title: "MIT Career Advising & Professional Development — Resumes & Interviews", publisher: "MIT CAPD", url: "https://capd.mit.edu/" },
      { title: "Chartered Institute of Personnel and Development — Workplace Guides", publisher: "CIPD UK", url: "https://www.cipd.org/" },
    ],
    articles: [
      {
        title: "Lead an Async Project Post-Mortem Without Blame",
        summary: "Collect timeline facts first, separate systemic bottlenecks from human error, and assign three concrete follow-up owners.",
        images: ["/img/thumbs/cat/work-13.jpg", "/img/thumbs/cat/work-05.jpg", "/img/thumbs/cat/work-06.jpg"],
      },
      {
        title: "Build a Clean Personal Portfolio Website That Wins Clients",
        summary: "Showcase three detailed case studies with problem-process-outcome metrics and a single friction-free contact link.",
        images: ["/img/thumbs/cat/work-14.jpg", "/img/thumbs/cat/work-07.jpg", "/img/thumbs/cat/work-08.jpg"],
      },
      {
        title: "Ask Thoughtful Reverse-Interview Questions at the End of a Job Interview",
        summary: "Ask what success looks like in the first ninety days and how the team resolves competing product priorities.",
        images: ["/img/thumbs/cat/work-15.jpg", "/img/thumbs/cat/work-09.jpg", "/img/thumbs/cat/work-10.jpg"],
      },
      {
        title: "Write a Professional Two-Week Resignation Letter and Handover Doc",
        summary: "Keep your notice brief and gracious while delivering a turnkey checklist of active projects, logins, and contacts.",
        images: ["/img/thumbs/cat/work-16.jpg", "/img/thumbs/cat/work-11.jpg", "/img/thumbs/cat/work-12.jpg"],
      },
      {
        title: "Facilitate a Remote Brainstorming Workshop Where Quiet Voices Are Heard",
        summary: "Use five minutes of silent individual sticky-note writing before group clustering so introverts and extroverts contribute equally.",
        images: ["/img/thumbs/cat/work-17.jpg", "/img/thumbs/cat/work-01.jpg", "/img/thumbs/cat/work-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Cars-and-Other-Vehicles",
    key: "cars",
    hero: "compass",
    author: "Matteo Rossi, Automotive & Mobility Technician",
    refs: [
      { title: "AAA — Preventive Car Maintenance & Roadside Safety Checklist", publisher: "American Automobile Association", url: "https://www.aaa.com/autorepair" },
      { title: "European Road Safety Charter — Vehicle Inspection Standards", publisher: "European Commission", url: "https://road-safety-charter.ec.europa.eu/" },
      { title: "Park Tool — Bicycle Repair & Drivetrain Maintenance Help", publisher: "Park Tool Company", url: "https://www.parktool.com/en-us/blog/repair-help" },
    ],
    articles: [
      {
        title: "Check Car Tire Pressure and Tread Depth Before a Long Highway Trip",
        summary: "Measure cold tires with a digital gauge against the door-jamb sticker and test tread grooves with a 2mm coin gauge.",
        images: ["/img/thumbs/cat/cars-01.jpg", "/img/thumbs/cat/cars-02.jpg", "/img/thumbs/cat/cars-03.jpg"],
      },
      {
        title: "Replace Streaking Windshield Wiper Blades in Five Minutes",
        summary: "Lift the wiper arm onto a folded towel, press the J-hook release tab, and click the new rubber blade into place.",
        images: ["/img/thumbs/cat/cars-04.jpg", "/img/thumbs/cat/cars-05.jpg", "/img/thumbs/cat/cars-06.jpg"],
      },
      {
        title: "Degrease and Lubricate a Commuter Bicycle Chain Properly",
        summary: "Run the chain through a citrus degreaser bath, wipe dry with a lint-free rag, and apply one drop of wet or dry lube per roller.",
        images: ["/img/thumbs/cat/cars-07.jpg", "/img/thumbs/cat/cars-08.jpg", "/img/thumbs/cat/cars-09.jpg"],
      },
      {
        title: "Jump-Start a Dead Car Battery Safely With Booster Cables",
        summary: "Clamp red to dead positive, red to donor positive, black to donor negative, and black to an unpainted engine ground bolt.",
        images: ["/img/thumbs/cat/cars-10.jpg", "/img/thumbs/cat/cars-11.jpg", "/img/thumbs/cat/cars-12.jpg"],
      },
      {
        title: "Pack an All-Season Emergency Winter Kit in Your Car Trunk",
        summary: "Include a reflective warning triangle, high-visibility vest, ice scraper, wool blanket, headlamp, and traction sand.",
        images: ["/img/thumbs/cat/cars-13.jpg", "/img/thumbs/cat/cars-14.jpg", "/img/thumbs/cat/cars-15.jpg"],
      },
    ],
  },
  {
    catSlug: "Holidays-and-Traditions",
    key: "holidays",
    hero: "cookies",
    author: "Ingrid Solberg, Cultural Historian",
    refs: [
      { title: "Europeana — European Seasonal Festivals & Cultural Heritage", publisher: "Europeana Foundation", url: "https://www.europeana.eu/" },
      { title: "Smithsonian Folklife — Seasonal Traditions & Table Customs", publisher: "Smithsonian Institution", url: "https://folklife.si.edu/" },
      { title: "Royal Botanic Gardens — Sustainable Evergreen Wreaths & Decor", publisher: "Kew Gardens", url: "https://www.kew.org/" },
    ],
    articles: [
      {
        title: "Wrap Oddly Shaped Holiday Gifts Using Japanese Furoshiki Cloth",
        summary: "Tie square cotton or linen wraps with a flat reef knot so wine bottles, books, and round tins look elegant with zero tape waste.",
        images: ["/img/thumbs/cat/holidays-01.jpg", "/img/thumbs/cat/holidays-02.jpg", "/img/thumbs/cat/holidays-03.jpg"],
      },
      {
        title: "Set a Formal Holiday Dinner Table With Layered Place Cards",
        summary: "Align forks to the left, knives and spoons to the right, glassware above the knife tip, and a sprig of rosemary on each napkin.",
        images: ["/img/thumbs/cat/holidays-04.jpg", "/img/thumbs/cat/holidays-05.jpg", "/img/thumbs/cat/holidays-06.jpg"],
      },
      {
        title: "Make Folded Paper Window Stars for Winter Solstice Light",
        summary: "Fold sixteen translucent kite-shapedwaxed paper points and overlap them into a glowing stained-glass window star.",
        images: ["/img/thumbs/cat/holidays-07.jpg", "/img/thumbs/cat/holidays-08.jpg", "/img/thumbs/cat/holidays-09.jpg"],
      },
      {
        title: "Host a Cozy Potluck Harvest Dinner Without Kitchen Stress",
        summary: "Assign courses via a shared sign-up sheet, prepare one large braised main dish ahead of time, and label dietary cards clearly.",
        images: ["/img/thumbs/cat/holidays-10.jpg", "/img/thumbs/cat/holidays-11.jpg", "/img/thumbs/cat/holidays-12.jpg"],
      },
      {
        title: "Write Warm Annual Holiday Letters Friends Actually Enjoy Reading",
        summary: "Share three honest stories from your year, keep the tone self-deprecating and warm, and add a handwritten postscript on every card.",
        images: ["/img/thumbs/cat/holidays-13.jpg", "/img/thumbs/cat/holidays-14.jpg", "/img/thumbs/cat/holidays-15.jpg"],
      },
    ],
  },
  {
    catSlug: "Personal-Care-and-Style",
    key: "style",
    hero: "heart",
    author: "Camille Laurent, Wardrobe & Textile Specialist",
    refs: [
      { title: "The Woolmark Company — Wool & Cashmere Garment Care Guide", publisher: "Woolmark", url: "https://www.woolmark.com/care/" },
      { title: "American Academy of Dermatology — Everyday Skincare Basics", publisher: "AAD", url: "https://www.aad.org/public/everyday-care" },
      { title: "Victoria and Albert Museum — History of Tailoring & Textiles", publisher: "V&A London", url: "https://www.vam.ac.uk/" },
    ],
    articles: [
      {
        title: "Hand-Wash Merino Wool and Cashmere Sweaters Without Shrinking",
        summary: "Soak knitwear in lukewarm 30°C water with wool wash, press gently without wringing, and roll in a bath towel before drying flat.",
        images: ["/img/thumbs/cat/style-13.jpg", "/img/thumbs/cat/style-05.jpg", "/img/thumbs/cat/style-06.jpg"],
      },
      {
        title: "Insert Cedar Shoe Trees and Condition Leather Boots for Winter",
        summary: "Wipe road salt off immediately, let damp leather dry away from radiators, and massage beeswax cream into the welt and creases.",
        images: ["/img/thumbs/cat/style-14.jpg", "/img/thumbs/cat/style-07.jpg", "/img/thumbs/cat/style-08.jpg"],
      },
      {
        title: "Sew a Loose Coat Button Back On With a Thread Shank",
        summary: "Place a toothpick across the button while stitching and wrap the threads underneath six times so thick wool lapels button smoothly.",
        images: ["/img/thumbs/cat/style-15.jpg", "/img/thumbs/cat/style-09.jpg", "/img/thumbs/cat/style-10.jpg"],
      },
      {
        title: "Choose a Signature Everyday Fragrance by Testing Skin Dry-Down",
        summary: "Spray one scent on each inner wrist, wait three hours past the top notes, and judge the warm base notes in natural air.",
        images: ["/img/thumbs/cat/style-16.jpg", "/img/thumbs/cat/style-11.jpg", "/img/thumbs/cat/style-12.jpg"],
      },
      {
        title: "Remove Pilling From Wool Coats and Knitwear With a Fabric Comb",
        summary: "Lay the garment flat on a hard table and glide a cedar cashmere comb in short, light strokes along the grain of the knit.",
        images: ["/img/thumbs/cat/style-17.jpg", "/img/thumbs/cat/style-01.jpg", "/img/thumbs/cat/style-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Philosophy-and-Religion",
    key: "philosophy",
    hero: "books",
    author: "Prof. Julian Sorel, Ethics & Philosophy",
    refs: [
      { title: "Stanford Encyclopedia of Philosophy — Classical & Modern Ethics", publisher: "Stanford University", url: "https://plato.stanford.edu/" },
      { title: "Internet Encyclopedia of Philosophy — Logic & Epistemology", publisher: "IEP", url: "https://iep.utm.edu/" },
      { title: "Oxford University Department of Philosophy — Reading Lists", publisher: "University of Oxford", url: "https://www.philosophy.ox.ac.uk/" },
    ],
    articles: [
      {
        title: "Keep a Morning and Evening Stoic Reflection Journal",
        summary: "Rehearse the day's likely challenges at dawn and review three moments of patience, fairness, and gratitude before sleep.",
        images: ["/img/thumbs/cat/philosophy-01.jpg", "/img/thumbs/cat/philosophy-02.jpg", "/img/thumbs/cat/philosophy-03.jpg"],
      },
      {
        title: "Read Primary Philosophical Texts Using Argument Reconstruction",
        summary: "List numbered premises in the margin, identify hidden assumptions, and test the conclusion with a concrete counterexample.",
        images: ["/img/thumbs/cat/philosophy-04.jpg", "/img/thumbs/cat/philosophy-05.jpg", "/img/thumbs/cat/philosophy-06.jpg"],
      },
      {
        title: "Practice the Socratic Method in Everyday Group Discussions",
        summary: "Ask clarifying questions about definitions and evidence rather than debating conclusions prematurely.",
        images: ["/img/thumbs/cat/philosophy-07.jpg", "/img/thumbs/cat/philosophy-08.jpg", "/img/thumbs/cat/philosophy-09.jpg"],
      },
      {
        title: "Spot Common Logical Fallacies in News and Public Debates",
        summary: "Distinguish straw-man arguments, false dilemmas, and survivorship bias from sound deductive and inductive reasoning.",
        images: ["/img/thumbs/cat/philosophy-10.jpg", "/img/thumbs/cat/philosophy-11.jpg", "/img/thumbs/cat/philosophy-12.jpg"],
      },
      {
        title: "Make Ethical Decisions Using a Stakeholder Matrix",
        summary: "Weigh duties, long-term consequences, and character virtues across everyone affected before acting on a difficult dilemma.",
        images: ["/img/thumbs/cat/philosophy-13.jpg", "/img/thumbs/cat/philosophy-14.jpg", "/img/thumbs/cat/philosophy-15.jpg"],
      },
    ],
  },
  {
    catSlug: "Relationships",
    key: "relationships",
    hero: "heart",
    author: "Dr. Sophie Delacroix, Relationship Psychologist",
    refs: [
      { title: "The Gottman Institute — Research-Based Relationship Communication", publisher: "Gottman Institute", url: "https://www.gottman.com/" },
      { title: "Greater Good Science Center — Empathy & Social Connection", publisher: "UC Berkeley", url: "https://greatergood.berkeley.edu/" },
      { title: "Relate UK — Healthy Relationships & Friendship Advice", publisher: "Relate Charity", url: "https://www.relate.org.uk/" },
    ],
    articles: [
      {
        title: "Hold a Weekly 20-Minute Relationship Check-In Over Sunday Coffee",
        summary: "Share one appreciation from the past week, coordinate upcoming logistics, and ask how you can best support each other next week.",
        images: ["/img/thumbs/cat/relationships-13.jpg", "/img/thumbs/cat/relationships-05.jpg", "/img/thumbs/cat/relationships-06.jpg"],
      },
      {
        title: "Make New Friends After Moving to a New European City",
        summary: "Become a regular at one third-place hobby club, language exchange, or running group at the same time every week.",
        images: ["/img/thumbs/cat/relationships-14.jpg", "/img/thumbs/cat/relationships-07.jpg", "/img/thumbs/cat/relationships-08.jpg"],
      },
      {
        title: "Apologize Sincerely Without Making Excuses",
        summary: "Name the specific impact of your action, take full ownership without adding 'but', and explain how you will handle it differently.",
        images: ["/img/thumbs/cat/relationships-15.jpg", "/img/thumbs/cat/relationships-09.jpg", "/img/thumbs/cat/relationships-10.jpg"],
      },
      {
        title: "Host a Small Dinner Party Where Guests Who Don't Know Each Other Click",
        summary: "Seat six people around one table, pair curious conversationalists, and serve a relaxed family-style platter.",
        images: ["/img/thumbs/cat/relationships-16.jpg", "/img/thumbs/cat/relationships-11.jpg", "/img/thumbs/cat/relationships-12.jpg"],
      },
      {
        title: "Decline Social Invitations Warmly When You Need Quiet Rest",
        summary: "Express genuine thanks for being included, give a clear no without over-explaining, and suggest a concrete catch-up date.",
        images: ["/img/thumbs/cat/relationships-17.jpg", "/img/thumbs/cat/relationships-01.jpg", "/img/thumbs/cat/relationships-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Relationship-Quizzes",
    key: "quizzes",
    hero: "heart",
    author: "Howcompass Behavioral Quiz Team",
    refs: [
      { title: "Greater Good Science Center — Social & Emotional Quizzes", publisher: "UC Berkeley", url: "https://greatergood.berkeley.edu/quizzes" },
      { title: "American Psychological Association — Personality & Attachment Topics", publisher: "APA", url: "https://www.apa.org/topics/personality" },
      { title: "Open Source Psychometrics Project — Validated Scales Archive", publisher: "OSPP", url: "https://openpsychometrics.org/" },
    ],
    articles: [
      {
        title: "Identify Your Primary Communication Style in Relationships",
        summary: "Walk through ten everyday conversation scenarios to discover whether you lead with analytical, expressive, supportive, or direct cues.",
        images: ["/img/thumbs/cat/quizzes-01.jpg", "/img/thumbs/cat/quizzes-02.jpg", "/img/thumbs/cat/quizzes-03.jpg"],
      },
      {
        title: "Design a Fun 20-Question Trivia Night for Friends and Family",
        summary: "Balance four themed rounds of five questions — visual, audio, history, and wildcard — so every player at the table can shine.",
        images: ["/img/thumbs/cat/quizzes-04.jpg", "/img/thumbs/cat/quizzes-05.jpg", "/img/thumbs/cat/quizzes-06.jpg"],
      },
      {
        title: "Discover How You and Your Partner Prefer to Give and Receive Appreciation",
        summary: "Compare thoughtful gestures, quality time, encouraging words, and shared projects using a structured ten-item self-reflection.",
        images: ["/img/thumbs/cat/quizzes-07.jpg", "/img/thumbs/cat/quizzes-08.jpg", "/img/thumbs/cat/quizzes-09.jpg"],
      },
      {
        title: "Use Icebreaker Question Cards to Spark Great Group Conversations",
        summary: "Replace small talk about the weather with playful low-stakes prompts about travel memories, favorite meals, and creative dreams.",
        images: ["/img/thumbs/cat/quizzes-10.jpg", "/img/thumbs/cat/quizzes-11.jpg", "/img/thumbs/cat/quizzes-12.jpg"],
      },
      {
        title: "Assess Your Conflict-Resolution Style Under Everyday Stress",
        summary: "Recognize whether you tend to collaborate, compromise, accommodate, or withdraw during disagreements and learn balanced responses.",
        images: ["/img/thumbs/cat/quizzes-13.jpg", "/img/thumbs/cat/quizzes-14.jpg", "/img/thumbs/cat/quizzes-15.jpg"],
      },
    ],
  },
  {
    catSlug: "Travel",
    key: "travel",
    hero: "compass",
    author: "Nils Lindqvist, European Rail & Travel Writer",
    refs: [
      { title: "The Man in Seat 61 — European Train Travel Guide", publisher: "Seat61", url: "https://www.seat61.com/" },
      { title: "European Union — Your Europe Passenger Rights & Travel Documents", publisher: "European Union", url: "https://europa.eu/youreurope/citizens/travel/index_en.htm" },
      { title: "Rick Steves' Europe — Packing Light & Rail Skills", publisher: "Rick Steves' Europe", url: "https://www.ricksteves.com/travel-tips" },
    ],
    articles: [
      {
        title: "Reserve Seat Assignments on Cross-Border European High-Speed Trains",
        summary: "Check carriage layouts, choose a table seat on the scenic window side, and book mandatory reservations early for summer routes.",
        images: ["/img/thumbs/cat/travel-13.jpg", "/img/thumbs/cat/travel-05.jpg", "/img/thumbs/cat/travel-06.jpg"],
      },
      {
        title: "Use Offline Topographic Maps on Your Phone Without Roaming Data",
        summary: "Download regional vector map tiles over hotel Wi-Fi and pin train stations, bakeries, and trailheads before stepping outside.",
        images: ["/img/thumbs/cat/travel-14.jpg", "/img/thumbs/cat/travel-07.jpg", "/img/thumbs/cat/travel-08.jpg"],
      },
      {
        title: "Wash Travel Clothes in a Hotel Sink and Dry Them Overnight",
        summary: "Pack quick-dry merino and nylon layers, press water out inside a rolled bath towel, and hang near circulating air.",
        images: ["/img/thumbs/cat/travel-15.jpg", "/img/thumbs/cat/travel-09.jpg", "/img/thumbs/cat/travel-10.jpg"],
      },
      {
        title: "Visit Popular European Museums Without Waiting in Ticket Lines",
        summary: "Book the first timed-entry slot of the morning or late-afternoon weekday opening and start on the upper gallery floors.",
        images: ["/img/thumbs/cat/travel-16.jpg", "/img/thumbs/cat/travel-11.jpg", "/img/thumbs/cat/travel-12.jpg"],
      },
      {
        title: "Keep a Pocket Expense and Postcard Log on Multi-City Trips",
        summary: "Jot daily café, transit, and museum costs alongside a stamped postcard mailed back to your own home address.",
        images: ["/img/thumbs/cat/travel-17.jpg", "/img/thumbs/cat/travel-01.jpg", "/img/thumbs/cat/travel-02.jpg"],
      },
    ],
  },
  {
    catSlug: "Youth",
    key: "youth",
    hero: "books",
    author: "Tobias Weber, Youth Mentor & Educator",
    refs: [
      { title: "The Duke of Edinburgh's Award — Youth Skills & Expedition Guide", publisher: "DofE UK", url: "https://www.dofe.org/" },
      { title: "European Youth Portal — Volunteering, Study & Exchange", publisher: "European Commission", url: "https://youth.europa.eu/" },
      { title: "Mind UK — Information for Young People on Wellbeing & School", publisher: "Mind Charity", url: "https://www.mind.org.uk/for-young-people/" },
    ],
    articles: [
      {
        title: "Start a Student Club or Society at Your High School or University",
        summary: "Recruit three founding officers, draft a simple one-page club charter, and host a hands-on first workshop with free snacks.",
        images: ["/img/thumbs/cat/youth-01.jpg", "/img/thumbs/cat/youth-02.jpg", "/img/thumbs/cat/youth-03.jpg"],
      },
      {
        title: "Balance Part-Time Weekend Work With Exam Revision",
        summary: "Cap shift hours during exam months, block revision into forty-five-minute weekday afternoon sessions, and protect eight hours of sleep.",
        images: ["/img/thumbs/cat/youth-04.jpg", "/img/thumbs/cat/youth-05.jpg", "/img/thumbs/cat/youth-06.jpg"],
      },
      {
        title: "Write Your First CV for a Summer Internship With No Formal Work Experience",
        summary: "Highlight school lab projects, club leadership, volunteer events, and technical or language skills in clean action bullets.",
        images: ["/img/thumbs/cat/youth-07.jpg", "/img/thumbs/cat/youth-08.jpg", "/img/thumbs/cat/youth-09.jpg"],
      },
      {
        title: "Cook Five Affordable Student Meals in a Shared Dorm Kitchen",
        summary: "Master one-pot lentil pasta, vegetable frittata, sheet-pan roasted chickpeas, overnight oats, and stir-fried noodles.",
        images: ["/img/thumbs/cat/youth-10.jpg", "/img/thumbs/cat/youth-11.jpg", "/img/thumbs/cat/youth-12.jpg"],
      },
      {
        title: "Prepare for Your First Independent Summer Interrail Trip With Friends",
        summary: "Agree on a daily budget ceiling beforehand, alternate who picks the afternoon activity, and keep digital copies of rail passes.",
        images: ["/img/thumbs/cat/youth-13.jpg", "/img/thumbs/cat/youth-14.jpg", "/img/thumbs/cat/youth-15.jpg"],
      },
    ],
  },
];

const insertArticle = db.prepare(`
  INSERT INTO articles (slug, title, summary, intro, category_id, hero_image, author, status, featured, views, helpful_yes, helpful_no, read_time)
  VALUES (?, ?, ?, ?, ?, ?, ?, 'published', 0, ?, ?, ?, 9)
`);
const insertMethod = db.prepare(`INSERT INTO methods (article_id, title, position) VALUES (?, ?, ?)`);
const insertStep = db.prepare(`INSERT INTO steps (article_id, method_id, position, text, image, caption) VALUES (?, ?, ?, ?, ?, '')`);
const insertTip = db.prepare(`INSERT INTO tips (article_id, kind, body, position) VALUES (?, ?, ?, ?)`);
const insertFaq = db.prepare(`INSERT INTO faqs (article_id, question, answer, position) VALUES (?, ?, ?, ?)`);
const insertRef = db.prepare(`INSERT INTO refs (article_id, title, publisher, url, position) VALUES (?, ?, ?, ?, ?)`);
const insertThing = db.prepare(`INSERT INTO things (article_id, text, position) VALUES (?, ?, ?)`);

let insertedCount = 0;

const tx = db.transaction(() => {
  for (const group of CATEGORY_NEW_FIVE) {
    const cat = db.prepare("SELECT id, name FROM categories WHERE slug = ?").get(group.catSlug);
    if (!cat) {
      console.warn("Category not found:", group.catSlug);
      continue;
    }

    group.articles.forEach((art, idx) => {
      const slug = slugify(art.title);
      const existing = db.prepare("SELECT id FROM articles WHERE slug = ?").get(slug);
      if (existing) return;

      const intro = `${art.summary} In this step-by-step ${cat.name.toLowerCase()} guide, we walk through preparing your workspace, executing the core technique cleanly, and building a repeatable habit that delivers reliable results every time. See also our related guides in [the ${cat.name} category](/category/${group.catSlug}).`;
      const views = 1850 + ((cat.id * 317 + idx * 491) % 9400);
      const yes = 42 + ((cat.id * 13 + idx * 7) % 55);
      const no = 2 + (idx % 4);

      const res = insertArticle.run(
        slug,
        art.title,
        art.summary,
        intro,
        cat.id,
        group.hero,
        group.author,
        views,
        yes,
        no
      );
      const articleId = res.lastInsertRowid;

      const methodTitles = [
        "Preparing Your Setup and Materials",
        "Following the Core Step-by-Step Technique",
        "Checking Quality and Maintaining Results",
      ];

      let globalPos = 1;
      methodTitles.forEach((mTitle, mIdx) => {
        const mRes = insertMethod.run(articleId, mTitle, mIdx + 1);
        const methodId = mRes.lastInsertRowid;
        const img = art.images[mIdx % art.images.length];

        const stepTexts = [
          `Set up a clean, well-lit workspace before you begin ${art.title.toLowerCase()}. Gather your essential tools within arm's reach so you can move through each stage calmly without hunting for supplies mid-process.`,
          `Work through the main ${mTitle.toLowerCase()} checkpoint with steady, deliberate movements. Pay close attention to alignment, timing, and tactile feedback so small errors do not compound in later steps.`,
          `Inspect your progress from a step back and make fine adjustments before moving forward. Recording a quick note on what worked best makes your next session twice as fast and consistent.`,
        ];

        stepTexts.forEach((sText, sIdx) => {
          const stepImg = art.images[(mIdx + sIdx) % art.images.length];
          insertStep.run(articleId, methodId, globalPos++, sText, stepImg);
        });
      });

      insertTip.run(articleId, "tip", `Take two minutes to lay out your materials before starting; a tidy setup prevents 80% of common beginner mistakes when learning how to ${art.title.toLowerCase()}.`, 1);
      insertTip.run(articleId, "tip", `Practice the core movement slowly three times before aiming for speed — smooth consistency always beats rushing.`, 2);
      insertTip.run(articleId, "warning", `Avoid skipping the final inspection step, as small misalignments early on are much easier to correct immediately than after finishing.`, 1);

      insertThing.run(articleId, "Clean, well-lit table or workspace", 1);
      insertThing.run(articleId, "Notebook or checklist for tracking measurements", 2);
      insertThing.run(articleId, `Standard ${cat.name.toLowerCase()} toolkit`, 3);

      insertFaq.run(
        articleId,
        `How long does it take to learn how to ${art.title.toLowerCase()}?`,
        `Most beginners complete their first successful session in 20 to 35 minutes and feel confident after three practice rounds.`,
        1
      );
      insertFaq.run(
        articleId,
        `What is the most common mistake beginners make?`,
        `Rushing the initial preparation stage. Taking three extra minutes to organize and measure your setup ensures clean results on the first try.`,
        2
      );

      group.refs.forEach((r, rIdx) => {
        insertRef.run(articleId, r.title, r.publisher, r.url, rIdx + 1);
      });

      insertedCount++;
    });
  }
});

tx();
console.log("Inserted new full SQLite articles:", insertedCount);

const fs = require("fs");
const path = require("path");

const GUIDES = {
  education: {
    slug: "Study-Effectively-for-Exams",
    title: "Study Effectively for Exams",
    category: "Education-and-Communications",
    catKey: "education",
    hero_image: "books",
    author: "Dr. Elena Vance, Academic Advisor",
    read_time: 24,
    featured: 1,
    summary:
      "Stop rereading highlighted textbook pages passively. This 22-step guide walks you through building a backward exam schedule, taking Cornell notes, testing yourself with active recall and spaced repetition, and walking into the exam hall calm and rested.",
    intro:
      "Decades of cognitive-science research show that passive rereading and highlighting create an illusion of competence without building durable memory. The students who score highest study fewer hours by using high-leverage retrieval techniques: active recall, spaced repetition, interleaved problem sets, and the [Feynman technique](/how-to/Memorize-Technical-Vocabulary-Using-the-Feynman-Technique). Follow these 22 steps in order to transform how you prepare for any exam.",
    methods: [
      {
        title: "Planning Your Revision Schedule and Workspace",
        steps: [
          { text: "Map every exam date on a single wall calendar and work backward three weeks. Assign specific syllabus topics to specific afternoons so you never sit down wondering what to study next." },
          { text: "Clear your desk of everything except the current subject's notebook, textbook, pen, and a glass of water. Put your phone in another room or inside a closed bag across the room so visual notifications cannot fracture your attention." },
          { text: "Divide your notebook pages into the [Cornell note-taking layout](/how-to/Take-Structured-Study-Notes-Using-the-Cornell-Note-Taking-Method). Draw a vertical line 6 cm from the left margin for recall cues, use the wide right column for lecture notes, and leave 5 cm at the bottom for a two-sentence summary." },
          { text: "Work in focused 25-minute Pomodoro sprints followed by a 5-minute movement break away from screens. Four consecutive sprints earn a longer 25-minute walk or snack break before you start the next block." },
          { text: "Color-code your syllabus topics into Red (unfamiliar), Amber (shaky), and Green (confident). Spend seventy percent of your weekly study hours on Red and Amber topics rather than comforting yourself by reviewing Green material." },
        ],
      },
      {
        title: "Using Active Recall and Spaced Repetition",
        steps: [
          { text: "Close the book after reading a section and write down everything you remember on a blank sheet of paper. Retrieving information without looking at the page strengthens neural pathways far more than rereading." },
          { text: "Turn every heading and key definition into a question-and-answer flashcard sorted into three spaced-repetition boxes. Cards you answer effortlessly move to the weekly box; cards you miss return to the daily box." },
          { text: "Stand at a whiteboard or blank notebook page and explain the core concept out loud as if teaching a twelve-year-old. Wherever you hesitate or fall back on jargon, open the textbook and fill the gap immediately." },
          { text: "Draw a single-page concept map connecting how different chapters and formulas relate to one another. Visual hierarchy helps you spot overarching themes that essay questions love to test." },
          { text: "Interleave three different problem types in the same practice session instead of drilling twenty identical questions in a row. Mixing problem types trains you to recognize which method a question actually requires." },
          { text: "Write three concrete real-world examples for every abstract rule or theorem you learn. Anchoring theory to vivid concrete cases makes it almost impossible to blank out under time pressure." },
        ],
      },
      {
        title: "Practicing With Past Papers and Error Logs",
        steps: [
          { text: "Sit a full past-paper exam under strict timed conditions with only the allowed calculator and formula sheet on your desk. Simulating the exact clock pressure removes test-day surprises." },
          { text: "Grade your practice paper ruthlessly against the official marking scheme and log every missed point in a dedicated Error Notebook. Write down why you lost the mark — misread prompt, formula slip, or gap in understanding." },
          { text: "Rewrite the model solution to every question you got wrong forty-eight hours later from memory. If you can solve it cleanly two days later without peeking, you have closed that gap for good." },
          { text: "Draft five-minute essay skeletons for past long-answer prompts rather than writing full essays every time. Outlining a thesis statement, three topic sentences, and key evidence trains fast structural thinking." },
          { text: "Meet with one or two focused study partners for a 45-minute quiz-and-teach session once a week. Have each person bring five tough questions to test the group rather than passively reviewing notes together." },
          { text: "Condense each course module onto a single double-sided A4 cheat sheet in the final week before the exam. Even when the exam is closed-book, the act of distilling an entire course onto one page locks in the structure." },
        ],
      },
      {
        title: "Protecting Sleep, Focus, and Exam-Day Execution",
        steps: [
          { text: "Take a brisk 20-minute outdoor walk after your final afternoon study block. Aerobic movement boosts brain-derived neurotrophic factor (BDNF) and clears mental fog before evening rest." },
          { text: "Pack your transparent pencil case, student ID card, extra black pens, calculator, and water bottle the night before the exam. Removing morning logistics keeps your cortisol calm when you wake up." },
          { text: "Get a full eight hours of sleep the night before the exam instead of pulling a late-night cram session. REM and slow-wave sleep consolidate the exact memory traces you studied during the day." },
          { text: "Eat a slow-release complex-carbohydrate breakfast with protein — such as oats, eggs, or yogurt — ninety minutes before the exam starts. Steady blood glucose prevents mid-exam energy crashes." },
          { text: "Spend the first five minutes of the exam reading every question, underlining command verbs, and budgeting minutes per mark. Answer your strongest question first to build momentum, then return to harder sections with time in reserve." },
        ],
      },
    ],
    tips: [
      "Study your hardest, most quantitative subject first thing in the morning when prefrontal cortex willpower is highest.",
      "Read your condensed one-page summary sheet for ten minutes right before bed, then go straight to sleep without checking your phone.",
      "If you freeze on a tough exam question, jot down any relevant formula or definition in the margin, star the question, and move on — your subconscious will keep working on it while you earn easy marks elsewhere.",
    ],
    warnings: [
      "Avoid pulling all-nighters before an exam; sleep deprivation impairs working memory and reasoning to a degree comparable to mild intoxication.",
      "Do not switch to a brand-new high-caffeine energy drink on exam morning if you are not used to it — jitteriness and stomach upset ruin focus.",
    ],
    things: [
      "B5 or A4 lined notebook ruled for Cornell notes",
      "Mechanical kitchen timer or wristwatch",
      "Index flashcards and three small sorting boxes",
      "Past exam papers and official marking schemes",
      " Dedicated Error Log notebook",
    ],
    faqs: [
      {
        question: "How many hours a day should I study for finals?",
        answer: "Four to six hours of genuine, distraction-free active recall (roughly eight to twelve 25-minute Pomodoros) is far more effective than ten hours of distracted textbook rereading.",
      },
      {
        question: "Is listening to music while studying helpful?",
        answer: "Lyrics compete with verbal working memory. Study in quiet or with low-volume instrumental ambient sound, and do at least half your practice in silence to match exam-hall conditions.",
      },
    ],
    references: [
      { title: "Dunlosky et al. — Improving Students' Learning With Effective Learning Techniques", publisher: "Psychological Science in the Public Interest", url: "https://journals.sagepub.com/doi/10.1177/1529100612453266" },
      { title: "Cornell Learning Strategies Center — Study & Exam Preparation", publisher: "Cornell University", url: "https://lsc.cornell.edu/" },
      { title: "Make It Stick: The Science of Successful Learning", publisher: "Harvard University Press", url: "https://www.hup.harvard.edu/books/9780674729018" },
    ],
  },

  family: {
    slug: "Build-Happy-Family-Routines",
    title: "Build Happy Family Routines That Stick",
    category: "Family-Life",
    catKey: "family",
    hero_image: "heart",
    author: "Hannah Lindholm, Family Counselor",
    read_time: 22,
    featured: 1,
    summary:
      "Predictable daily rhythms reduce household stress and give children a deep sense of security. Follow these 22 steps to design calm mornings, shared meals, fair chore systems, and restorative weekends.",
    intro:
      "Chaos at 7:45 a.m. is rarely a discipline problem — it is almost always a systems problem. When shoes, backpacks, meal plans, and bedtime cues live in predictable places, parents stop nagging and children gain independence. Work through these 22 steps to build a warm, low-stress rhythm in [Family Life](/category/Family-Life).",
    methods: [
      {
        title: "Designing Calm School and Work Mornings",
        steps: [
          { text: "Set up a low entryway drop zone with one wall hook, one shoe tray, and one cubby basket per family member. When every coat and backpack lands in the same spot at 4 p.m., nobody hunts for missing shoes at 8 a.m." },
          { text: "Lay out tomorrow's clothes, socks, and weather gear before brushing teeth each evening. Let younger children choose between two parent-approved outfits the night before to eliminate morning wardrobe standoffs." },
          { text: "Pack non-perishable lunchbox items and fill water bottles right after dinner cleanup. Store chilled lunch containers on a single low refrigerator shelf so children can load their own bags in the morning." },
          { text: "Post a visual four-icon morning checklist at child eye level in the hallway: Get Dressed, Eat Breakfast, Brush Teeth, Shoes & Bag. Young children love moving a magnet from 'To Do' to 'Done' without being reminded." },
          { text: "Wake up fifteen minutes before the children so you can drink a quiet cup of coffee or tea unhurried. A calm parent sets the emotional thermostat for the entire kitchen." },
          { text: "Keep all phones, tablets, and television screens off until everyone is fully dressed, fed, and ready by the door. Screen-free mornings prevent the hardest transitions of the day." },
        ],
      },
      {
        title: "Running Shared Family Meals and Kitchen Rhythms",
        steps: [
          { text: "Plan five simple weeknight dinners on Sunday afternoon using a rotating theme matrix — such as Soup Monday, Pasta Tuesday, Sheet-Pan Wednesday, Grain Bowl Thursday, and Homemade Pizza Friday." },
          { text: "Shop once a week from a shared grocery list pinned inside the pantry door. Invite children to add one fruit and one vegetable they want to help prepare that week." },
          { text: "Give every child an age-appropriate five-minute dinner job: tearing salad leaves, setting napkins, pouring water pitchers, or clearing plates. Shared contribution makes children proud of the meal." },
          { text: "Place all phones in a woven basket on the sideboard before sitting down to eat together. Twenty minutes of uninterrupted conversation at dinner is one of the strongest predictors of child wellbeing." },
          { text: "Use a 'Rose, Thorn, and Bud' table prompt — one highlight from today, one tough moment, and one thing everyone looks forward to tomorrow. It keeps dinner conversation warm and inclusive for all ages." },
          { text: "Run a ten-minute 'Kitchen Reset' together right after dessert while upbeat music plays. Wiping counters, loading the dishwasher, and sweeping crumbs as a team takes a fraction of the time it takes one tired parent alone." },
        ],
      },
      {
        title: "Creating Fair Chore Systems and After-School Flow",
        steps: [
          { text: "Provide a 30-minute decompress window with a healthy snack and free play as soon as kids walk home from school. Children focus much better on homework after moving their bodies and refueling." },
          { text: "Set up a bright, supply-stocked homework caddy at the kitchen or dining table with sharpened pencils, erasers, ruler, and graph paper. Staying nearby while reading your own book offers quiet support without hovering." },
          { text: "Assign weekly household chores on a rotating wheel rather than tying basic family teamwork to cash bribes. Frame chores as how everyone in the home takes care of one another." },
          { text: "Do a seven-minute living-room 'Basket Sweep' before bath time where everyone returns stray toys and books to their shelves. Resetting the floor each evening keeps clutter from snowballing." },
        ],
      },
      {
        title: "Building Restorative Bedtimes and Weekend Traditions",
        steps: [
          { text: "Dim overhead lights throughout the house sixty minutes before bedtime to cue natural melatonin release. Warm table lamps signal to everyone's nervous system that the day is winding down." },
          { text: "Follow the exact same four-step bedtime sequence every night: warm bath or shower, pajamas, toothbrushing, and twenty minutes of reading aloud together in bed." },
          { text: "Hold a 15-minute Sunday afternoon family huddle with tea and biscuits to review the upcoming week's calendar. Mention dentist appointments, sports practices, and weekend plans so everyone feels prepared." },
          { text: "Protect one screen-free family ritual every weekend, such as [hosting a board game night](/how-to/Host-a-Screen-Free-Family-Board-Game-Evening), baking bread together, or walking in a local park." },
          { text: "Schedule a monthly one-on-one 'Special Hour' between each parent and each child doing a low-cost activity the child picks. Twenty minutes of undivided individual attention dramatically reduces sibling rivalry." },
          { text: "Review your family routines at the change of each season and drop any rule that no longer serves your household. Keep the rhythm simple, flexible, and humane." },
        ],
      },
    ],
    tips: [
      "When introducing a new routine, change only one habit per week (for example, the entryway drop zone first, then the bedtime sequence the following week).",
      "Use a visual analog clock with colored zones so young children can see how many minutes remain before leaving for school.",
    ],
    warnings: [
      "Avoid overscheduling children with five different after-school clubs a week; unscheduled downtime and free play are essential for emotional regulation.",
    ],
    things: [
      "Entryway hooks, shoe tray, and labeled cubby baskets",
      "Magnetic weekly wall calendar and dry-erase markers",
      "Portable homework supply caddy",
      "Visual timer for morning and cleanup transitions",
    ],
    faqs: [
      {
        question: "How long does it take for a new family routine to feel automatic?",
        answer: "Most households notice calmer mornings within five days, and the habit feels natural after three consistent weeks.",
      },
      {
        question: "What if we miss our routine on a busy travel or sick day?",
        answer: "Never treat a missed day as a failure — simply return to the normal anchor steps at the very next meal or bedtime.",
      },
    ],
    references: [
      { title: "American Academy of Pediatrics — The Importance of Family Routines", publisher: "HealthyChildren.org", url: "https://www.healthychildren.org/" },
      { title: "Child Mind Institute — Morning and Bedtime Routines for Kids", publisher: "Child Mind Institute", url: "https://childmind.org/" },
      { title: "The Family Dinner Project — Conversation & Shared Meals Research", publisher: "Harvard Graduate School of Education", url: "https://thefamilydinnerproject.org/" },
    ],
  },

  finance: {
    slug: "Manage-Personal-Finances-and-Budget",
    title: "Manage Personal Finances and Build a Budget",
    category: "Finance-and-Business",
    catKey: "finance",
    hero_image: "money",
    author: "Henrik Falk, CFA",
    read_time: 23,
    featured: 1,
    summary:
      "Take complete control of your cash flow without complex spreadsheets. This 22-step guide covers auditing your spending, setting up a 50-30-20 zero-stress budget, building a six-month emergency fund, paying off high-interest debt, and automating long-term investing.",
    intro:
      "Financial peace of mind comes from knowing where every euro or dollar goes before the month begins. Whether you earn a modest starting salary or run a household, the mechanics of wealth building are identical: spend less than you earn, automate your savings on payday, and avoid high-fee financial products. Follow these 22 steps in our [Finance and Business](/category/Finance-and-Business) curriculum.",
    methods: [
      {
        title: "Auditing Your Net Worth and Monthly Cash Flow",
        steps: [
          { text: "Gather the last ninety days of bank, credit-card, and mobile-payment statements on a quiet table. Seeing your real numbers clearly on paper removes vague money anxiety immediately." },
          { text: "List every asset you own (checking, savings, retirement accounts) and every liability you owe (credit cards, student loans, mortgage) on one page. Subtract liabilities from assets to record your baseline Net Worth." },
          { text: "Calculate your exact monthly take-home pay after taxes, pension deductions, and health insurance. Base your budget strictly on guaranteed net income, never on hoped-for bonuses or overtime." },
          { text: "Sort every expense from the past three months into three buckets: Fixed Essentials (rent, utilities, groceries, transit), Financial Goals (savings, debt payoff), and Flexible Lifestyle (dining out, hobbies, travel)." },
          { text: "Highlight and cancel every recurring subscription or membership you have not actively used in the last thirty days. Redirecting fifty euros of forgotten monthly subscriptions adds six hundred euros a year to your savings." },
          { text: "Identify your three largest variable spending leaks — often convenience takeout, impulse online orders, or unbudgeted weekend trips — and set a realistic monthly cap for each." },
        ],
      },
      {
        title: "Setting Up a Automated 50-30-20 Budget System",
        steps: [
          { text: "Allocate roughly 50% of your net income to Fixed Essentials, 20% to Financial Goals, and 30% to Flexible Lifestyle using the [50-30-20 household budget rule](/how-to/Build-a-50-30-20-Monthly-Household-Budget-That-Actually-Works)." },
          { text: "Open two separate fee-free bank accounts: one Bill-Pay Checking account for fixed monthly bills and one Everyday Spending account for groceries and discretionary expenses." },
          { text: "Schedule automatic standing transfers on the morning after payday so your 20% savings and investment contributions leave your checking account before you can spend them." },
          { text: "Create dedicated Sinking Fund sub-accounts for irregular annual expenses like car servicing, holiday gifts, insurance renewals, and dental visits. Saving one-twelfth each month turns surprise bills into planned events." },
          { text: "Align all utility, internet, and credit-card due dates to fall within three days after your monthly payday. Paying every fixed bill in one batch leaves the rest of the month simple and predictable." },
          { text: "Track variable spending once a week on Sunday evening in a five-minute notebook or ledger check-in. Weekly course corrections prevent end-of-month overdrafts." },
        ],
      },
      {
        title: "Building an Emergency Fund and Eliminating Debt",
        steps: [
          { text: "Save a starter buffer of 1,000 euros or dollars in a high-yield instant-access savings account before tackling extra debt payments. That small cushion stops a flat tire from going onto a credit card." },
          { text: "List any consumer debts in order of interest rate from highest APR to lowest APR (the Debt Avalanche method). Pay minimums on every balance while throwing every extra euro at the highest-interest debt first." },
          { text: "Call your internet, mobile, and insurance providers once a year with competitor quotes to negotiate lower monthly rates. A fifteen-minute phone call routinely saves 200 to 400 euros a year." },
          { text: "Expand your liquid emergency fund until it covers three to six full months of Fixed Essential living expenses. Keep this reserve in a safe, insured high-yield savings account — never in volatile stocks." },
        ],
      },
      {
        title: "Investing Consistently for the Long Term",
        steps: [
          { text: "Contribute enough to your workplace pension or retirement plan to capture 100% of any employer matching contribution. An employer match is an immediate, risk-free return on your salary." },
          { text: "Choose broadly diversified, low-cost global equity and bond index funds with an annual total expense ratio (TER) below 0.25%. Over thirty years, a 1.5% fund fee can swallow nearly a third of your compounded returns." },
          { text: "Invest a fixed amount on the same day every month (dollar- or euro-cost averaging) regardless of whether financial headlines are optimistic or fearful." },
          { text: "Keep your investment portfolio simple — a single global all-world index fund plus a government bond fund matched to your time horizon beats complex stock-picking for 90% of investors." },
          { text: "Review your tax allowances, beneficiary designations, and insurance coverage once a year during a scheduled annual financial checkup." },
          { text: "Rebalance your portfolio once every twelve months back to your target stock-to-bond percentage, then close your brokerage app and let compounding do the heavy lifting." },
        ],
      },
    ],
    tips: [
      "Give every partner in a household a small monthly 'No-Questions-Asked Fun Allowance' so the budget feels liberating rather than restrictive.",
      "Use a 48-hour waiting rule for any non-essential purchase over 50 euros; most impulse urges fade by day two.",
    ],
    warnings: [
      "Never invest money you will need within the next three to five years (such as a home deposit) in the stock market.",
      "Beware of high-yield crypto schemes or leveraged day-trading courses promising guaranteed monthly returns.",
    ],
    things: [
      "Last 3 months of bank and card statements",
      "Notebook or clean cash-flow ledger",
      "Fee-free checking and high-yield savings accounts",
      "Low-cost index brokerage or pension account",
    ],
    faqs: [
      {
        question: "Should I pay off debt or invest first?",
        answer: "Capture any workplace pension match first, build a 1,000-euro starter emergency buffer, pay off all high-interest debt above 6–7% APR, and then ramp up long-term index investing.",
      },
      {
        question: "What if my essentials take more than 50% of my income?",
        answer: "Adjust the ratio temporarily to 65-20-15 or 70-15-15 while focusing on reducing big fixed costs (housing, car, subscriptions) or growing income.",
      },
    ],
    references: [
      { title: "Consumer Financial Protection Bureau — Your Money, Your Goals Toolkit", publisher: "CFPB", url: "https://www.consumerfinance.gov/" },
      { title: "Bogleheads — Getting Started With Low-Cost Index Investing", publisher: "Bogleheads.org", url: "https://www.bogleheads.org/wiki/Getting_started" },
      { title: "OECD — International Network on Financial Education Guidelines", publisher: "OECD", url: "https://www.oecd.org/financial/education/" },
    ],
  },

  health: {
    slug: "Build-a-Healthy-Sleep-and-Morning-Routine",
    title: "Build a Healthy Sleep and Morning Routine",
    category: "Health",
    catKey: "health",
    hero_image: "stretch",
    author: "Dr. Maja Lindström, Preventive Medicine",
    read_time: 22,
    featured: 1,
    summary:
      "Good sleep starts twelve hours before your head touches the pillow. Follow these 22 evidence-based steps to anchor your circadian rhythm, wind down your nervous system in the evening, and wake up with steady energy.",
    intro:
      "Your body's master circadian clock in the suprachiasmatic nucleus is governed by two powerful signals: bright outdoor light in the morning and darkness and cool temperature at night. By aligning your daily habits with those biological cues, you can fall asleep faster and wake up refreshed without relying on third cups of coffee. Explore more wellness guides in [Health](/category/Health).",
    methods: [
      {
        title: "Anchoring Your Morning Circadian Clock",
        steps: [
          { text: "Wake up within the same 30-minute window every single day, including Saturdays and Sundays. A consistent wake time is the #1 anchor for your body's twenty-four-hour sleep-wake drive." },
          { text: "Step outside into natural daylight for ten to fifteen minutes within an hour of waking. Even on an overcast European morning, outdoor sky light delivers 10,000+ lux — twenty times brighter than indoor lamps — which shuts off residual melatonin and starts your evening sleep timer." },
          { text: "Drink a full glass of room-temperature water before reaching for coffee or tea. Overnight breathing and perspiration leave you mildly dehydrated by dawn." },
          { text: "Wait 60 to 90 minutes after waking before drinking your first cup of coffee. Letting natural adenosine clear first prevents the mid-afternoon caffeine crash." },
          { text: "Spend ten minutes doing gentle spinal mobility, cat-cow stretches, and hip openers on a mat. Moving stiff joints early increases circulation and core temperature." },
          { text: "Eat a protein- and fiber-rich breakfast away from your phone screen to stabilize morning blood sugar and cortisol." },
        ],
      },
      {
        title: "Managing Daytime Energy, Movement, and Light",
        steps: [
          { text: "Position your daytime desk near a window and stand up for a two-minute posture reset every forty-five minutes." },
          { text: "Set a strict daily caffeine cutoff at 1:00 p.m. Caffeine has a half-life of five to six hours, meaning a 4:00 p.m. espresso still circulates in your brain at 10:00 p.m. and reduces deep slow-wave sleep by up to twenty percent." },
          { text: "Take a brisk 20-minute walk outdoors after lunch to blunt post-meal glucose spikes and refresh afternoon focus." },
          { text: "If you nap, keep it under twenty minutes and finish before 2:30 p.m. Longer or late-afternoon naps drain the homeostatic adenosine sleep pressure you need at night." },
          { text: "Finish vigorous cardio or heavy strength workouts at least three hours before bedtime so your core body temperature and heart rate have time to drop." },
        ],
      },
      {
        title: "Optimizing Your Bedroom Environment",
        steps: [
          { text: "Cool your bedroom to between 16°C and 18.5°C (60–65°F) an hour before bed. Your brain and core body temperature must drop by roughly 1°C to initiate and sustain deep sleep." },
          { text: "Install blackout curtains or wear a contoured silk eye mask so streetlamps and early dawn light do not fragment REM sleep." },
          { text: "Keep your bedroom quiet or mask erratic street traffic with a soft, continuous pink-noise fan set across the room." },
          { text: "Reserve your bed exclusively for sleep and rest — never answer work emails, watch thriller series, or scroll social feeds under the covers." },
          { text: "Choose a breathable cotton, linen, or wool duvet and a pillow height that keeps your cervical spine aligned with your shoulders." },
        ],
      },
      {
        title: "Executing a 60-Minute Evening Wind-Down",
        steps: [
          { text: "Finish your evening meal two to three hours before lying down so active digestion does not elevate nighttime heart rate or cause reflux." },
          { text: "Dim overhead ceiling lights at 9:00 p.m. and switch to warm amber table lamps placed below eye level." },
          { text: "Park your smartphone on a charger in the hallway or kitchen sixty minutes before sleep and use a simple analog alarm clock by the bed." },
          { text: "Take a warm shower or bath sixty minutes before bed. As you step out of the warm water, blood vessels in your hands and feet dilate and rapidly radiate heat from your core, triggering natural drowsiness." },
          { text: "Write down tomorrow's top three tasks and any lingering worries in a bedside notebook so your working memory stops looping on unfinished errands." },
          { text: "Practice five minutes of 4-7-8 breathing or read a physical paper book under a soft lamp until your eyelids grow heavy, then turn out the light." },
        ],
      },
    ],
    tips: [
      "If you cannot fall asleep after twenty minutes in bed, get up and read a calm paper book in dim light in another chair until sleepy — never lie in bed watching the clock.",
      "Warm socks in a cool 17°C bedroom help dilate peripheral blood vessels and speed up sleep onset.",
    ],
    warnings: [
      "Avoid using alcohol as a nightcap; while it sedates you initially, it severely fragments REM sleep and causes 3:00 a.m. awakenings.",
    ],
    things: [
      "Simple bedside analog alarm clock",
      "Blackout curtains or contoured sleep mask",
      "Warm 2700K bedside lamp",
      "Paper notebook and pen for evening brain-dump",
    ],
    faqs: [
      {
        question: "Can I catch up on lost weekday sleep over the weekend?",
        answer: "Sleeping in by more than an hour on weekends creates 'social jet lag' that shifts your circadian clock two time zones east by Monday morning. Take a short 20-minute early-afternoon nap instead.",
      },
      {
        question: "How many hours of sleep do adults actually need?",
        answer: "Most healthy adults require between 7.5 and 8.5 hours in bed to achieve a full seven to eight hours of restorative sleep across four to five 90-minute cycles.",
      },
    ],
    references: [
      { title: "Sleep Foundation — Healthy Sleep Hygiene & Circadian Science", publisher: "Sleep Foundation", url: "https://www.sleepfoundation.org/sleep-hygiene" },
      { title: "NHS UK — How to Fall Asleep Faster and Sleep Better", publisher: "National Health Service", url: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/" },
      { title: "Harvard Medical School Division of Sleep Medicine — External Cues & Sleep", publisher: "Harvard University", url: "https://sleep.hms.harvard.edu/" },
    ],
  },

  hobbies: {
    slug: "Start-Woodworking-and-Paper-Crafts-at-Home",
    title: "Start Hand-Tool Crafting and Bookbinding at Home",
    category: "Hobbies-and-Crafts",
    catKey: "hobbies",
    hero_image: "craft",
    author: "Sofie Lindner, Textile & Paper Artist",
    read_time: 23,
    featured: 1,
    summary:
      "You do not need a garage workshop to make lasting handmade objects. This 22-step guide shows how to set up a quiet apartment craft table, master precision measuring and cutting, stitch a hardcover sketchbook, and finish wooden and paper projects cleanly.",
    intro:
      "Making physical objects with your hands is one of the most satisfying antidotes to a screen-heavy week. With a self-healing cutting mat, a bone folder, a sharp craft knife, and a small hand saw, you can build archival notebooks, framed prints, and wooden desk organizers at a kitchen table. Explore more projects in [Hobbies and Crafts](/category/Hobbies-and-Crafts).",
    methods: [
      {
        title: "Setting Up a Compact Apartment Craft Bench",
        steps: [
          { text: "Cover your work table with an A2 self-healing cutting mat to protect the wood surface and keep blade edges sharp." },
          { text: "Position an adjustable daylight-balanced (5000K) task lamp from the side opposite your dominant hand so your fingers never cast a shadow across your cut line." },
          { text: "Assemble a core hand-tool kit in a canvas roll: steel cork-backed ruler, precision craft knife with #11 blades, bone folder, awl, linen thread, PVA glue, and a fine Japanese pull saw." },
          { text: "Test paper grain direction before folding or gluing by gently flexing a sheet along both axes — paper folds smoothly and lies flat only when folded parallel to the grain." },
          { text: "Keep a damp microfiber cloth and a dry scrap-paper pad beside your glue brush so excess adhesive never transfers to the outside of your work." },
        ],
      },
      {
        title: "Measuring, Scoring, and Cutting With Precision",
        steps: [
          { text: "Measure twice with a steel ruler starting from the 1 cm mark rather than the worn metal end of the rule, and mark points with a sharp 2H pencil." },
          { text: "Stand up when cutting heavy board so your shoulders are directly above the steel straightedge, pressing firmly with splayed fingertips well clear of the blade path." },
          { text: "Make three light passes with a fresh craft blade rather than forcing one heavy cut through 2mm greyboard. Light passes track straight and leave a perpendicular edge." },
          { text: "Score cardstock along the fold line using the rounded tip of a bone folder against a ruler before folding, then crease sharply from the center outward." },
          { text: "Snap off or replace your craft blade tip as soon as it starts tugging paper fibers; a dull blade is far more likely to slip than a sharp one." },
          { text: "Sand small wooden project edges through 120-, 180-, and 240-grit sandpaper wrapped around a flat cork block so corners stay crisp rather than rounded over." },
        ],
      },
      {
        title: "Stitching and Binding a Hardcover Sketchbook",
        steps: [
          { text: "Fold twenty sheets of acid-free drawing paper into five four-sheet signatures and press them under a heavy book for thirty minutes." },
          { text: "Mark six evenly spaced sewing stations along the spine fold of a template strip and pierce each signature from the inside out at a 45° cradle angle with a sharp awl." },
          { text: "Thread a blunt bookbinding needle with waxed linen thread and sew the signatures together using the classic French link stitch, kettle-stitching securely at each end." },
          { text: "Brush a thin coat of archival neutral-pH PVA adhesive along the clamped spine of your sewn text block and let it dry under weight for one hour." },
          { text: "Cut two greyboard covers 3mm taller than your pages and a spine strip equal to the text-block thickness, spacing them 7mm apart on bookcloth." },
          { text: "Miter the four corners of the bookcloth leaving a gap equal to one and a half board thicknesses, then fold and burnish the turn-ins smoothly with your bone folder." },
          { text: "Brush PVA glue onto the outer endpapers in a starburst pattern from the center outward, close the case squarely over the text block, and press overnight between waxed sheets." },
        ],
      },
      {
        title: "Finishing, Sealing, and Caring for Handmade Objects",
        steps: [
          { text: "Wipe raw wooden craft projects with a tack cloth, then rub in two thin coats of food-safe beeswax and linseed oil polish with a lint-free cotton rag." },
          { text: "Buff waxed wood or marbled paper covers after twenty minutes with a clean shoe brush or soft cloth to bring up a warm satin sheen." },
          { text: "Stamp or sign and date the inside back cover of every finished handmade piece and note the materials used in your studio logbook." },
          { text: "Clean glue brushes in warm soapy water immediately after use and store blades in a closed metal tin before putting your craft roll away." },
        ],
      },
    ],
    tips: [
      "Always brush glue from the center of a sheet outward over a waste paper sheet so glue never creeps under the edges.",
      "Keep clean scrap bricks wrapped in kraft paper on your shelf — they make ideal pressing weights for bookbinding and botanical pressing.",
    ],
    warnings: [
      "Never use a plastic ruler as a cutting guide for a metal craft knife; the blade can ride up the plastic edge toward your fingers.",
    ],
    things: [
      "Self-healing cutting mat and cork-backed steel ruler",
      "Bone folder, awl, and bookbinding needles",
      "Waxed linen thread and neutral-pH PVA adhesive",
      "Acid-free drawing paper, greyboard, and bookcloth",
    ],
    faqs: [
      {
        question: "Why did my book covers warp after gluing?",
        answer: "Paper expands when wet with PVA glue and shrinks as it dries, pulling the board inward. Always line both sides of the board with paper of matching grain direction and press flat under heavy weight overnight.",
      },
      {
        question: "What kind of glue should I use for paper crafts?",
        answer: "Use acid-free, archival PVA glue (or wheat-starch paste) rather than school glue sticks, which dry brittle and yellow within a year.",
      },
    ],
    references: [
      { title: "Victoria and Albert Museum — Bookbinding & Paper Conservation", publisher: "V&A London", url: "https://www.vam.ac.uk/" },
      { title: "Center for Book Arts — Bound & Stitched Structure Reference", publisher: "Center for Book Arts", url: "https://centerforbookarts.org/" },
      { title: "Crafts Council UK — Material & Studio Practice Guides", publisher: "Crafts Council", url: "https://www.craftscouncil.org.uk/" },
    ],
  },

  pets: {
    slug: "Care-for-a-New-Puppy-or-Kitten",
    title: "Care for and Train a New Puppy or Kitten",
    category: "Pets-and-Animals",
    catKey: "pets",
    hero_image: "puppy",
    author: "Dr. Lukas Meyer, DVM",
    read_time: 23,
    featured: 1,
    summary:
      "The first eight weeks in a new home shape a pet's confidence for life. Follow these 22 veterinarian-reviewed steps to pet-proof your rooms, establish calm house-training and sleep routines, socialize gently, and master positive-reinforcement cues.",
    intro:
      "Bringing a puppy or kitten home is exciting, but to a young animal leaving its littermates, everything is unfamiliar. Quiet predictability, positive reward markers, and preventative veterinary care turn those early weeks into a bond that lasts fifteen years. Browse more guides in [Pets and Animals](/category/Pets-and-Animals).",
    methods: [
      {
        title: "Preparing a Safe, Pet-Proofed Home Environment",
        steps: [
          { text: "Get down on hands and knees at pet eye level to remove dangling electrical cords, toxic houseplants (like lilies or philodendrons), small swallowable coins, and open trash cans." },
          { text: "Set up a quiet 'Safe Base' zone — a cozy playpen and appropriately sized crate for a puppy, or a dedicated quiet spare room with vertical hiding spots for a new kitten." },
          { text: "Place stainless-steel or ceramic water and food bowls away from noisy appliances, and position a kitten's litter box on the opposite side of the room from its food." },
          { text: "Bring a soft blanket rubbed with the scent of the litter's bedding (or warm a ticking cloth wrap) so the first three nights feel familiar and reassuring." },
          { text: "Keep household introductions calm during the first forty-eight hours; let the puppy or kitten approach family members at its own pace rather than passing it from lap to lap." },
        ],
      },
      {
        title: "Establishing Feeding, House-Training, and Sleep Schedules",
        steps: [
          { text: "Keep your new pet on the exact same food brand it ate previously for the first week, then transition over seven days (75/25, 50/50, 25/75) if switching diets to prevent stomach upset." },
          { text: "Feed measured meals at set times — three to four times daily for young puppies and kittens under four months — rather than leaving dry kibble out all day." },
          { text: "Take a puppy outside to the exact same grass spot immediately after waking, ten minutes after eating or drinking, after play sessions, and every two hours during the day." },
          { text: "Praise softly and deliver a pea-sized high-value treat within two seconds of your puppy finishing outside, or keep a kitten's unscented clumping litter scooped twice daily." },
          { text: "Clean indoor accidents immediately with an enzymatic bio-cleaner rather than ammonia-based sprays, and never scold a pet after the fact." },
          { text: "Place the puppy's crate right beside your bed for the first two weeks so you can hear nighttime restlessness and carry it outside for a quiet, no-play bathroom break." },
        ],
      },
      {
        title: "Teaching Positive-Reinforcement Cues and Socialization",
        steps: [
          { text: "Charge a crisp verbal marker word like 'Yes!' (or a clicker) by saying 'Yes!' and immediately delivering a tiny soft treat ten times in a row." },
          { text: "Teach 'Sit' and 'Name Attention' in three-minute sessions before meals when your pet is naturally motivated and focused." },
          { text: "Redirect play biting and teething onto chilled rubber chew toys or wand feathers immediately — never use your bare fingers as a wrestling toy." },
          { text: "Introduce a lightweight flat collar or Y-front harness indoors with treats for five minutes a day before clipping on a leash." },
          { text: "Socialize gently during the critical 8-to-16-week window by letting your pet observe umbrellas, bicycles, vacuum cleaners, and friendly calm adults from a comfortable distance while earning treats." },
          { text: "Practice 'Alone Time' in ten-minute increments with a stuffed food puzzle so your pet learns that quiet solo rest is normal and safe." },
        ],
      },
      {
        title: "Handling Grooming, Dental Care, and Veterinary Checkups",
        steps: [
          { text: "Book a wellness checkup with your local veterinarian within the first week to verify weight, microchip registration, parasite prevention, and vaccination dates." },
          { text: "Touch your pet's paws, ear flaps, tail, and gums gently for three seconds every evening followed by a treat so nail trims and vet exams feel effortless." },
          { text: "Brush the coat two to three times a week with a soft slicker or bristle brush and introduce enzymatic pet toothpaste on a finger brush." },
          { text: "Provide daily mental enrichment — sniff walks, puzzle feeders, cardboard foraging boxes, or two 15-minute interactive wand-toy hunts for indoor cats." },
          { text: "Keep a folder with vaccination records, microchip number, emergency vet phone number, and monthly flea/worming reminders pinned inside your kitchen cabinet." },
        ],
      },
    ],
    tips: [
      "Cut training treats into pea-sized pieces so you can reward thirty times in a five-minute session without overfeeding.",
      "For indoor cats, follow the N+1 rule for litter boxes (one box per cat, plus one extra on a separate floor).",
    ],
    warnings: [
      "Never use human fluoride toothpaste, xylitol-sweetened peanut butter, grapes, onions, or chocolate with pets — all are toxic.",
    ],
    things: [
      "Stainless-steel food and water bowls",
      "Crate with divider or quiet safe-room setup",
      "Enzymatic accident cleaner",
      "Soft training treats, chew toys, and slicker brush",
    ],
    faqs: [
      {
        question: "How long can a young puppy hold its bladder?",
        answer: "A general rule of thumb is one hour per month of age during the day (so a two-month-old puppy needs a break every 1.5 to 2 hours while awake).",
      },
      {
        question: "Why does my kitten attack my ankles at night?",
        answer: "Kittens are crepuscular hunters. Run a vigorous 15-minute wand-toy 'hunt-catch-kill' play session right before serving their final evening meal so they groom and sleep.",
      },
    ],
    references: [
      { title: "World Small Animal Veterinary Association — Puppy & Kitten Care", publisher: "WSAVA", url: "https://wsava.org/" },
      { title: "Blue Cross UK — Settling In a New Puppy or Kitten", publisher: "Blue Cross", url: "https://www.bluecross.org.uk/advice" },
      { title: "American Veterinary Society of Animal Behavior — Early Socialization Position Statement", publisher: "AVSAB", url: "https://avsab.org/resources/position-statements/" },
    ],
  },

  sports: {
    slug: "Start-Running-and-Strength-Training-Safely",
    title: "Start Running and Strength Training Safely",
    category: "Sports-and-Fitness",
    catKey: "sports",
    hero_image: "stretch",
    author: "Jonas Källström, Certified Strength Coach",
    read_time: 23,
    featured: 1,
    summary:
      "Build cardiovascular endurance and full-body strength without shin splints or burnout. This 22-step guide combines a conversational walk-run progression with foundational dumbbell movement patterns and smart recovery.",
    intro:
      "The biggest mistake new runners and lifters make is going too hard in week one and spending week three icing sore knees. Sustainable fitness is built on progressive overload at conversational effort: eighty percent easy aerobic volume paired with two short full-body strength sessions a week. Explore more training guides in [Sports and Fitness](/category/Sports-and-Fitness).",
    methods: [
      {
        title: "Preparing Your Gear, Posture, and Dynamic Warm-Up",
        steps: [
          { text: "Visit a specialist running shop to pick neutral, comfortable running shoes with a thumb's width of toe room at the front — your feet swell slightly after twenty minutes on the road." },
          { text: "Schedule three alternate-day cardio sessions and two 30-minute strength sessions per week, leaving at least two full rest or walking days." },
          { text: "Start every session with five minutes of dynamic joint mobility — leg swings, ankle circles, hip hinges, and arm thoracic rotations — rather than cold static stretching." },
          { text: "Stand tall when running as if a string gently lifts the crown of your head, keeping your shoulders relaxed down away from your ears and your gaze twenty meters ahead." },
          { text: "Bend your elbows at roughly ninety degrees and let your hands swing loosely from hip to breastbone without crossing your body's centerline." },
        ],
      },
      {
        title: "Building Aerobic Endurance With Walk-Run Intervals",
        steps: [
          { text: "Begin with 30-minute walk-run intervals — such as 2 minutes of easy jogging followed by 1 minute of brisk walking repeated ten times." },
          { text: "Use the Talk Test to govern your pace: you should be able to speak a full sentence out loud comfortably while jogging. If you are gasping, slow down immediately." },
          { text: "Aim for light, quick steps (around 165–175 steps per minute) landing softly beneath your hips rather than overstriding with your heel far out in front of your knee." },
          { text: "Breathe rhythmically through both nose and mouth — such as inhaling for three steps and exhaling for two steps — to keep your diaphragm relaxed." },
          { text: "Increase your total weekly running volume by no more than 10% from one week to the next so tendons and bones adapt alongside your heart and lungs." },
          { text: "Make every fourth week a 'Deload Week' where you reduce total mileage and lifting sets by twenty-five percent to lock in supercompensation." },
        ],
      },
      {
        title: "Mastering the Five Fundamental Strength Movements",
        steps: [
          { text: "Learn the Goblet Squat first: hold one dumbbell vertically against your chest, sit your hips back and down between your knees while keeping your chest tall, and drive through your mid-foot." },
          { text: "Practice the Hip Hinge ([Romanian Deadlift](/how-to/Perform-a-Proper-Romanian-Deadlift-With-Dumbbells)) to strengthen hamstrings and glutes: push your hips horizontally toward the wall behind you with a flat back and soft knees." },
          { text: "Build upper-body pushing strength with incline push-ups on a bench or overhead dumbbell presses with ribs tucked down." },
          { text: "Balance every pushing exercise with a pulling movement — such as single-arm dumbbell rows or resistance-band face pulls — to protect shoulder posture." },
          { text: "Train core anti-extension and anti-rotation stability using Dead Bugs, Bird-Dogs, and 30-second Side Planks rather than neck-straining sit-ups." },
          { text: "Perform 2 to 3 sets of 8 to 12 controlled repetitions per exercise, stopping each set with two clean reps still 'in the tank' (RPE 8)." },
        ],
      },
      {
        title: "Cooling Down, Fueling, and Preventing Injury",
        steps: [
          { text: "Walk slowly for five minutes at the end of every run to let heart rate and blood pressure return gradually to baseline." },
          { text: "Stretch warm calves, quads, hamstrings, and hip flexors gently for 30 seconds each after training, breathing slowly without bouncing." },
          { text: "Rehydrate with water and eat a balanced meal containing 25–30g of protein and complex carbohydrates within two hours after training." },
          { text: "Log your sessions in a simple training diary noting distance, weights used, perceived effort (1–10), and any niggly joint tightness." },
          { text: "Distinguish normal mild muscle soreness (DOMS) from sharp, localized joint or tendon pain — if a sharp pain alters your stride, stop and rest immediately." },
        ],
      },
    ],
    tips: [
      "Lay out your running socks, shoes, and shorts the night before so morning friction is zero.",
      "Running slower on easy days is the secret that lets you run faster and stay injury-free on workout days.",
    ],
    warnings: [
      "Never push through sharp shin, knee, or Achilles tendon pain; replacing one run with a bike ride or swim saves weeks of forced layoff.",
    ],
    things: [
      "Properly fitted running shoes and moisture-wicking socks",
      "Pair of adjustable dumbbells or resistance bands",
      "Exercise mat",
      "Training logbook or wristwatch timer",
    ],
    faqs: [
      {
        question: "Should I do strength training on the same day as running?",
        answer: "For beginners, alternating days (e.g., Run Mon/Wed/Sat, Strength Tue/Thu) gives your legs fresh recovery for each session.",
      },
      {
        question: "Why do I get a side stitch when running?",
        answer: "Usually running too fast too soon after a heavy meal or shallow chest breathing. Slow to a walk, exhale fully as your opposite foot strikes, and wait two hours after big meals.",
      },
    ],
    references: [
      { title: "American College of Sports Medicine — Physical Activity Guidelines", publisher: "ACSM", url: "https://www.acsm.org/" },
      { title: "NHS Couch to 5K — Beginner Running Plan & Injury Prevention", publisher: "NHS UK", url: "https://www.nhs.uk/live-well/exercise/get-running-with-couch-to-5k/" },
      { title: "British Journal of Sports Medicine — Load Management & Tendon Health", publisher: "BJSM", url: "https://bjsm.bmj.com/" },
    ],
  },

  work: {
    slug: "Ace-a-Job-Interview-and-First-90-Days",
    title: "Ace a Job Interview and Succeed in Your First 90 Days",
    category: "Work-World",
    catKey: "work",
    hero_image: "resume",
    author: "Claire Moreau, Executive Career Coach",
    read_time: 23,
    featured: 1,
    summary:
      "Turn job applications into offers and onboard with confidence. This 22-step guide covers tailoring a one-page resume, structuring STAR interview stories, negotiating compensation, and delivering early wins in your first 90 days.",
    intro:
      "Hiring managers rarely pick the candidate with the longest list of buzzwords — they hire the person who demonstrates clear evidence of solving similar problems and communicates with calm structure. Follow these 22 steps from application to your 90-day review in [Work World](/category/Work-World).",
    methods: [
      {
        title: "Tailoring Your Application and Researching the Role",
        steps: [
          { text: "Print the job description and highlight the top five repeated nouns and verbs — those represent the hiring manager's actual pain points." },
          { text: "Rewrite your [one-page resume](/how-to/Format-a-Clean-One-Page-Resume-That-Passes-Recruiter-Scans) bullets using the 'Action Verb + Context + Quantified Outcome' formula (for example, 'Reduced onboarding time by 32% by automating checklist templates')." },
          { text: "Research the company's latest product launches, annual report, and competitors for thirty minutes, taking notes on three challenges the team is likely facing this year." },
          { text: "Draft a concise 90-second 'Present–Past–Future' answer to 'Tell me about yourself' that connects your current strengths and past achievements directly to why you want this specific role." },
          { text: "Test your camera framing, microphone audio, eye-level laptop stand, and neutral lighting twenty-four hours before any video interview." },
        ],
      },
      {
        title: "Structuring Behavioral Stories With the STAR Method",
        steps: [
          { text: "Build a bank of six versatile career stories covering a tough deadline, a cross-team disagreement, a mistake you fixed, a process you improved, a leadership moment, and learning a new skill." },
          { text: "Structure each story using the [STAR framework](/how-to/Answer-Behavioral-Job-Interview-Questions-Using-the-STAR-Method): Situation (15%), Task (15%), Action you personally took (50%), and measurable Result + takeaway (20%)." },
          { text: "Practice saying your six STAR stories out loud with a two-minute timer so your answers stay punchy and never ramble past two and a half minutes." },
          { text: "Pause for two full seconds after the interviewer finishes a tough question, take a breath, and outline your answer in two or three numbered points." },
          { text: "When asked about a weakness or past mistake, name a genuine operational skill you used to struggle with and show the concrete system you built to master it." },
          { text: "Prepare four thoughtful reverse-interview questions — such as 'What does a successful first ninety days look like in this role?' and 'What is the biggest bottleneck the team hopes this hire will unblock?'" },
        ],
      },
      {
        title: "Following Up and Negotiating Your Offer",
        steps: [
          { text: "Send a brief, personalized thank-you email within twenty-four hours referencing one specific topic from your conversation with each interviewer." },
          { text: "When you receive a verbal offer, express genuine enthusiasm first and ask for the full written compensation package so you can review it over twenty-four to forty-eight hours." },
          { text: "Benchmark the role's market salary band across three independent industry salary surveys before proposing a counter-offer." },
          { text: "Negotiate base salary, signing bonus, professional development budget, or flexible remote days in a single collaborative email anchored to the value you bring." },
          { text: "Once signed, send a gracious resignation letter and a comprehensive handover document to your current team so you leave every bridge stronger than you found it." },
        ],
      },
      {
        title: "Delivering Results in Your First 90 Days",
        steps: [
          { text: "Schedule a 30-minute alignment meeting with your new manager in week one to agree on 30-, 60-, and 90-day expectations and preferred communication cadence." },
          { text: "Hold 20-minute listening coffee chats with ten cross-functional teammates during your first month, asking 'What works well here?' and 'What is one friction point that slows you down?'" },
          { text: "Keep a 'New Hire Documentation Doc' where you write down every undocumented setup step you encounter — sharing it makes onboarding smoother for the next person hired." },
          { text: "Deliver one visible, low-risk 'Quick Win' project by Day 45 to build early trust and momentum across the team." },
          { text: "Send a brief Friday afternoon bullet summary to your manager during the first two months covering Completed This Week, Planned for Next Week, and any Blockers." },
          { text: "Prepare a one-page 90-Day Review summary highlighting what you shipped, what you learned, and your proposed goals for the next two quarters." },
        ],
      },
    ],
    tips: [
      "Keep a 'Brag Document' updated every Friday afternoon with project metrics and kind peer feedback so updating your resume or performance review takes ten minutes.",
      "During video interviews, stick a small arrow note right beside your webcam lens to remind yourself to look at the camera when speaking.",
    ],
    warnings: [
      "Never criticize a former manager or employer during a job interview; frame your move positively around the growth and challenges you are seeking next.",
    ],
    things: [
      "Tailored one-page PDF resume",
      "Six written STAR story bullet cards",
      "Portfolio of 2–3 work samples or case studies",
      "30-60-90 Day onboarding notebook",
    ],
    faqs: [
      {
        question: "How do I answer salary expectations early in the first screening call?",
        answer: "Give a researched market range based on the role's responsibilities and note that you evaluate the total compensation package once you learn more about the scope.",
      },
      {
        question: "What if I don't know the answer to a technical interview question?",
        answer: "Never bluff. State clearly what you do know, walk through how you would test or look up the missing piece on the job, and reason through the problem out loud.",
      },
    ],
    references: [
      { title: "Harvard Business Review — The First 90 Days & Onboarding Strategy", publisher: "Harvard Business Publishing", url: "https://hbr.org/" },
      { title: "MIT Career Advising & Professional Development — STAR Interviewing", publisher: "MIT CAPD", url: "https://capd.mit.edu/" },
      { title: "CIPD — Recruitment, Selection & Induction Standards", publisher: "Chartered Institute of Personnel and Development", url: "https://www.cipd.org/" },
    ],
  },
};

for (const [name, data] of Object.entries(GUIDES)) {
  // 1. Write lib/guides/<name>.js
  const guideFile = path.join(process.cwd(), "lib/guides", `${name}.js`);
  const content = `/* ${data.category} — long-form 22-step guide. */\nmodule.exports = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(guideFile, content);

  // 2. Ensure public/img/steps/<slug>/01..22.jpg exist on disk (never overwriting existing AI-generated ones!)
  const stepDir = path.join(process.cwd(), "public/img/steps", data.slug);
  fs.mkdirSync(stepDir, { recursive: true });
  for (let i = 1; i <= 22; i++) {
    const num = String(i).padStart(2, "0");
    const target = path.join(stepDir, `${num}.jpg`);
    if (!fs.existsSync(target)) {
      const catNum = String(((i - 1) % 20) + 1).padStart(2, "0");
      const src = path.join(process.cwd(), "public/img/thumbs/cat", `${data.catKey}-${catNum}.jpg`);
      fs.copyFileSync(src, target);
    }
  }
}

console.log("Created all 8 remaining flagship 22-step guide files and populated step image folders");

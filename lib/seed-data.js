/* English seed content for the wikiHow clone. */

const CATEGORIES = [
  { name: 'Arts and Entertainment', slug: 'Arts-and-Entertainment', emoji: '🎨', color: '#c56cf0', description: 'Draw, paint, play music, and enjoy the arts.' },
  { name: 'Computers and Electronics', slug: 'Computers-and-Electronics', emoji: '💻', color: '#4a90d9', description: 'Get more out of your devices and software.' },
  { name: 'Education and Communications', slug: 'Education-and-Communications', emoji: '📚', color: '#f39c12', description: 'Study smarter, write better, speak clearly.' },
  { name: 'Family Life', slug: 'Family-Life', emoji: '👨‍👩‍👧', color: '#e84393', description: 'Ideas for parents, kids, and everyday family life.' },
  { name: 'Finance and Business', slug: 'Finance-and-Business', emoji: '💰', color: '#27ae60', description: 'Save money, budget well, and grow a business.' },
  { name: 'Food and Entertaining', slug: 'Food-and-Entertaining', emoji: '🍳', color: '#e67e22', description: 'Cook, bake, and host like a pro.' },
  { name: 'Health', slug: 'Health', emoji: '💚', color: '#16a085', description: 'Feel better, move more, sleep well.' },
  { name: 'Hobbies and Crafts', slug: 'Hobbies-and-Crafts', emoji: '🧶', color: '#8e6fd8', description: 'Pick up a new hobby and make things by hand.' },
  { name: 'Home and Garden', slug: 'Home-and-Garden', emoji: '🌱', color: '#7cb342', description: 'Grow plants, fix things, and love your space.' },
  { name: 'Pets and Animals', slug: 'Pets-and-Animals', emoji: '🐶', color: '#d35400', description: 'Care for, train, and understand your pets.' },
  { name: 'Sports and Fitness', slug: 'Sports-and-Fitness', emoji: '🏃', color: '#2980b9', description: 'Train your body and enjoy being active.' },
  { name: 'Work World', slug: 'Work-World', emoji: '💼', color: '#34495e', description: 'Land the job, ace the interview, thrive at work.' },
];

const ARTICLES = [
  {
    slug: 'Make-Pasta-Carbonara',
    title: 'Make Pasta Carbonara',
    category: 'Food-and-Entertaining',
    featured: 1,
    read_time: 7,
    author: 'wikiHow Culinary Team',
    summary:
      'Carbonara is a classic Roman pasta dish made with eggs, Pecorino Romano, guanciale, and plenty of black pepper. There is no cream in the authentic version — the silky sauce comes from the eggs and starchy pasta water emulsifying together.',
    intro:
      'Restaurant-style carbonara is easier than it looks, and it takes about as long as the pasta does to boil. The trick is temperature control: if the pan is too hot when the eggs go in, you get scrambled eggs instead of sauce.',
    hero: 'carbonara',
    methods: [
      {
        title: 'Classic Roman Carbonara',
        steps: [
          'Boil 4 quarts (3.8 L) of water in a large pot and season it generously with salt. While it heats, cut 8 oz (225 g) of guanciale into ½-inch strips.',
          'Cook the guanciale in a dry skillet over medium heat for 8–10 minutes until the fat renders and the edges turn crisp. Turn off the heat and leave the meat in the pan.',
          'Whisk 3 whole eggs and 1 egg yolk with 1½ cups (150 g) of finely grated Pecorino Romano and a heavy grind of black pepper in a bowl until you have a thick paste.',
          'Cook 1 lb (450 g) of spaghetti until al dente. Reserve 1 cup of the pasta water, then drain the pasta.',
          'Add the hot pasta to the warm skillet and toss so the noodles are coated in the rendered fat. Let it cool for 30 seconds off the heat.',
          'Pour in the egg mixture and toss vigorously, adding reserved pasta water a splash at a time until the sauce looks glossy and coats every strand.',
          'Plate immediately with more Pecorino Romano and coarse black pepper. Serve hot — carbonara does not wait for anyone.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'No guanciale? Pancetta is a fine substitute. Bacon works in a pinch, but drain most of the fat so the sauce does not turn greasy.' },
      { kind: 'tip', body: 'Room-temperature eggs emulsify more easily. Take them out of the fridge while the water comes to a boil.' },
      { kind: 'warning', body: 'Never add cream if you are making the traditional version. The eggs and cheese are what make the sauce.' },
      { kind: 'warning', body: 'Keep the skillet off the heat when the eggs go in. Direct heat is what turns carbonara into pasta with scrambled eggs.' },
    ],
    faqs: [
      { question: 'Can I make carbonara ahead of time?', answer: 'It is best eaten right away. If you must, store it for up to one day and reheat gently with a splash of water over low heat, stirring constantly.' },
      { question: 'Why is my carbonara sauce grainy?', answer: 'Grainy sauce usually means the pan was too hot. Let the pasta cool for 30 seconds, then toss the egg mixture in off the heat.' },
      { question: 'Which pasta shape is best?', answer: 'Spaghetti, rigatoni, and bucatini are all traditional. Use a shape with ridges or a hollow center so the sauce clings.' },
    ],
    things: ['Large pot', '12-inch skillet', 'Mixing bowl', 'Whisk', 'Colander', 'Microplane grater'],
    comments: [
      { author: 'Marta R.', rating: 5, body: 'I have made this four times now and the pasta water trick finally fixed my grainy sauce. Thank you!' },
      { author: 'Devon', rating: 4, body: 'Used pancetta because my store was out of guanciale. Still excellent, and the whole thing took 25 minutes.' },
    ],
  },
  {
    slug: 'Grow-Tomatoes-in-a-Pot',
    title: 'Grow Tomatoes in a Pot',
    category: 'Home-and-Garden',
    featured: 1,
    read_time: 8,
    author: 'wikiHow Garden Team',
    summary:
      'You do not need a garden to grow tomatoes. With a large container, the right soil, and steady watering, a single plant can produce 10–15 pounds of fruit in one season.',
    intro:
      'Container tomatoes need three things: sun, consistent moisture, and support. Get those right and the rest is mostly waiting.',
    hero: 'tomatoes',
    methods: [
      {
        title: 'Planting Your Tomato',
        steps: [
          'Choose a compact or determinate variety such as Roma, Cherry, or Patio. These stay manageable in a pot instead of growing six feet tall.',
          'Pick a container at least 18 inches (45 cm) across with drainage holes. A 5-gallon (19 L) pot is the sweet spot for one plant.',
          'Fill the pot with a loose potting mix designed for vegetables. Do not use garden soil — it compacts and drains poorly in containers.',
          'Bury the seedling deeply, up to the first set of leaves. Tomatoes grow roots along the buried stem, which makes a stronger plant.',
          'Water thoroughly until it runs out the bottom, then add a 2-inch layer of straw or bark mulch to hold moisture.',
          'Push a 5-foot stake or tomato cage into the pot right away so you never disturb the roots later.',
        ],
      },
      {
        title: 'Caring for the Plant',
        steps: [
          'Water when the top inch of soil feels dry, usually every 1–2 days in hot weather. Water at the base, not the leaves.',
          'Feed with a tomato fertilizer every two weeks once the first flowers appear. Too much nitrogen gives you leaves instead of fruit.',
          'Pinch off suckers that grow between the main stem and branches to keep the plant open and airy.',
          'Harvest when the fruit is fully colored and gives slightly when you squeeze it. Ripening continues on the counter if birds get there first.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Water in the morning so the leaves dry before evening. Wet foliage overnight invites blight.' },
      { kind: 'tip', body: 'A layer of mulch can cut your watering in half and keeps the soil temperature steady.' },
      { kind: 'warning', body: 'Tomatoes in pots dry out fast. In a heat wave you may need to water twice a day.' },
    ],
    faqs: [
      { question: 'How much sun do potted tomatoes need?', answer: 'At least 6 to 8 hours of direct sun. Less than that and you will get a tall plant with very little fruit.' },
      { question: 'Can I grow tomatoes indoors?', answer: 'Yes, with a sunny south-facing window and a small fan to strengthen the stems, though yields will be lower.' },
    ],
    things: ['5-gallon pot', 'Potting mix', 'Tomato cage or stake', 'Watering can', 'Mulch'],
    comments: [{ author: 'Priya S.', rating: 5, body: 'My balcony cherry tomatoes went from 3 sad fruits to a bowl a week after I started mulching.' }],
  },
  {
    slug: 'Play-the-Guitar-for-Beginners',
    title: 'Play the Guitar for Beginners',
    category: 'Arts-and-Entertainment',
    featured: 1,
    read_time: 9,
    author: 'wikiHow Music Team',
    summary:
      'You can play your first song in a week. Start with three open chords, learn to strum in time, and practice in short daily sessions instead of one long weekly one.',
    intro:
      'Most beginners quit because they try to learn everything at once. This guide narrows it down to the handful of skills that actually get you playing music.',
    hero: 'guitar',
    methods: [
      {
        title: 'Getting Set Up',
        steps: [
          'Hold the guitar with the body resting on your right thigh if you are right-handed, and the neck angled slightly upward.',
          'Tune the strings from low to high: E, A, D, G, B, E. A clip-on tuner is the fastest way to get this right.',
          'Number your fretting fingers 1 (index) through 4 (pinky) and practice pressing just behind the fret wire, not on top of it.',
          'Check your posture — sit up, relax your shoulders, and keep your fretting wrist slightly curved rather than flat.',
        ],
      },
      {
        title: 'Learning Your First Chords',
        steps: [
          'Place your fingers for an E minor chord: middle finger on the second fret of the A string, ring finger on the second fret of the D string, and strum all six strings.',
          'Add a C major chord by moving your ring finger to the third fret of the A string, middle finger to the second fret of the D string, and index finger to the first fret of the B string.',
          'Learn G major with your middle finger on the third fret of the low E, index finger on the second fret of the A, and ring and pinky on the third fret of the high E and B strings.',
          'Practice switching between the three chords slowly. Clean changes matter far more than speed at this stage.',
        ],
      },
      {
        title: 'Playing Your First Song',
        steps: [
          'Strum down four times per bar in a steady count of one-and-two-and-three-and-four-and. Use a metronome at 60 BPM.',
          'Once the downstrokes feel automatic, add upstrokes on the "and" beats for a basic folk strum.',
          'Loop a chord progression like G–C–Em–D for ten minutes. This is the progression behind thousands of pop songs.',
          'Play along with a recording at half speed. Playing with other musicians is the fastest way to build timing.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Fingertip soreness is normal for the first two weeks. Ten minutes a day builds calluses faster than an hour once a week.' },
      { kind: 'tip', body: 'Press close to the fret wire and use the very tips of your fingers so the strings ring cleanly.' },
      { kind: 'warning', body: 'If your wrist or forearm hurts, stop. Sore fingertips are fine; joint pain is not.' },
    ],
    faqs: [
      { question: 'Acoustic or electric for a total beginner?', answer: 'Acoustic steel-string builds strength and is portable, but electric guitars have lighter strings and are easier on the fingers. Either works — pick the one you want to play.' },
      { question: 'How long until I can play a song?', answer: 'With 15 minutes a day, most people can play a simple three-chord song within two weeks.' },
    ],
    things: ['Guitar', 'Tuner', 'Picks', 'Metronome'],
    comments: [
      { author: 'Sam K.', rating: 5, body: 'The G–C–Em–D loop kept me playing for an hour without noticing. Great advice.' },
      { author: 'Lena', rating: 4, body: 'Wish it mentioned how much fingertips hurt at first. Otherwise clear and helpful.' },
    ],
  },
  {
    slug: 'Train-a-Puppy-to-Sit',
    title: 'Train a Puppy to Sit',
    category: 'Pets-and-Animals',
    featured: 0,
    read_time: 5,
    author: 'wikiHow Pet Team',
    summary:
      'Sitting is the easiest cue to teach and the foundation for almost every other behavior. With treats, timing, and five-minute sessions, most puppies learn it in a single afternoon.',
    intro:
      'The secret is not repetition, it is timing. Reward the sit within one second and your puppy will connect the word with the action.',
    hero: 'puppy',
    methods: [
      {
        title: 'Teaching the Cue',
        steps: [
          'Start in a quiet room with no other pets or distractions. Have ten small, smelly treats ready in your hand.',
          'Hold a treat right at your puppy\'s nose and slowly move it up and back over their head. Their bottom will naturally drop.',
          'The instant their rear touches the floor, say "yes!" and give the treat. Do not push their hips down.',
          'Repeat five times, then take a short break. Puppies lose focus after a few minutes.',
          'Add the word "sit" just before you move the treat. Say it once, clearly, and wait.',
          'Practice in new rooms and outside once your puppy sits reliably indoors. This is called proofing.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Use tiny treats — pea-sized is plenty. You are rewarding the behavior, not filling the dog up.' },
      { kind: 'tip', body: 'Keep sessions under five minutes and always end on a success.' },
      { kind: 'warning', body: 'Never yell or physically press a puppy into position. It makes training stressful and slows learning.' },
    ],
    faqs: [
      { question: 'How long does it take to teach sit?', answer: 'Most puppies learn the hand signal in one session and reliably respond to the spoken word within a week of short daily practice.' },
      { question: 'What if my puppy ignores the treat?', answer: 'Use something higher value such as boiled chicken, and train before meals rather than after.' },
    ],
    things: ['Small treats', 'Treat pouch', 'Leash (for outdoor practice)'],
    comments: [{ author: 'Chris B.', rating: 5, body: 'The "lure up and back" motion worked on the first try with my 9-week-old lab mix.' }],
  },
  {
    slug: 'Paint-with-Watercolors',
    title: 'Paint with Watercolors',
    category: 'Arts-and-Entertaining',
    featured: 0,
    read_time: 6,
    author: 'wikiHow Art Team',
    summary:
      'Watercolor is forgiving: you can lift mistakes with a damp brush and build depth with layers. Learn wet-on-wet, wet-on-dry, and how much water your brush actually needs.',
    intro:
      'The biggest beginner mistake is using too little water. Watercolor should flow off the brush, not be scrubbed into the paper.',
    hero: 'watercolor',
    methods: [
      {
        title: 'Setting Up Your Palette',
        steps: [
          'Tape 140 lb (300 gsm) cold-press watercolor paper to a board so it does not buckle when wet.',
          'Squeeze a pea-sized amount of each color around the edge of your palette, leaving a large open area in the middle for mixing.',
          'Fill one jar with clean water for mixing and a second for rinsing brushes.',
          'Load your brush with water, then touch it to the paint. You want a glossy puddle, not a dry paste.',
        ],
      },
      {
        title: 'Learning the Core Techniques',
        steps: [
          'Try wet-on-wet: wet the paper with clean water first, then drop in color and watch it bloom outward.',
          'Try wet-on-dry: paint onto dry paper for crisp edges. This is how you add details on top of a dry wash.',
          'Practice a graded wash by painting a stripe, then adding clean water to the bottom edge so the color fades out.',
          'Lift highlights with a clean, damp brush or a paper towel while the paint is still wet.',
          'Layer once the paper is bone dry. Rushing this step muddies your colors.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Test every mix on scrap paper — watercolor dries about 20% lighter than it looks when wet.' },
      { kind: 'tip', body: 'Never let paint dry in your brush. Rinse it every time you change colors.' },
      { kind: 'warning', body: 'Do not scrub the paper. It damages the surface and lifts fibers that will never hold color again.' },
    ],
    faqs: [
      { question: 'Do I need expensive paints to start?', answer: 'No. A student-grade pan set with 12 colors will teach you everything for the first year. Upgrade the paper before you upgrade the paint.' },
      { question: 'How do I stop colors from turning muddy?', answer: 'Mix no more than two pigments at a time and wait for each layer to dry completely.' },
    ],
    things: ['Watercolor pans', 'Cold-press paper', 'Round brushes (sizes 6 and 12)', 'Two water jars', 'Palette'],
    comments: [{ author: 'Iris M.', rating: 5, body: 'The graded wash exercise finally made it click for me. My skies look like skies now.' }],
  },
  {
    slug: 'Write-a-Resume',
    title: 'Write a Resume',
    category: 'Work-World',
    featured: 1,
    read_time: 8,
    author: 'wikiHow Career Team',
    summary:
      'A strong resume is specific, easy to scan, and tailored to one job at a time. Recruiters spend about seven seconds on the first pass, so your most relevant achievement needs to be visible immediately.',
    intro:
      'Write for the person skimming, not the person reading closely. Bullet points, numbers, and one clear column beat clever formatting every time.',
    hero: 'resume',
    methods: [
      {
        title: 'Planning the Content',
        steps: [
          'Collect the job description and highlight every required skill, tool, and qualification. These become your keyword list.',
          'List your experience and, for each role, write down one number that proves impact — revenue, users, time saved, team size.',
          'Choose a reverse-chronological format if you have steady experience, or a skills-based format if you are changing fields.',
          'Pick a single-column template with a clean sans-serif font between 10 and 12 points.',
        ],
      },
      {
        title: 'Writing Each Section',
        steps: [
          'Put your name, phone, email, and city at the top. Drop the full mailing address, photo, and date of birth.',
          'Write a two-line summary naming your role, years of experience, and the specific value you bring.',
          'Start every bullet with an action verb — led, built, reduced, launched — and end with a measurable result.',
          'List skills that match the job description word for word, then add tools and certifications.',
          'Keep the whole document to one page unless you have more than ten years of relevant experience.',
        ],
      },
      {
        title: 'Reviewing and Sending',
        steps: [
          'Read it out loud to catch awkward phrasing and repeated words.',
          'Run it through an applicant tracking system checker and make sure the file is a standard PDF.',
          'Ask one person in your field to review it for clarity and relevance.',
          'Name the file Firstname-Lastname-Resume.pdf and keep a copy tailored to each application.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Quantify everything you can. "Cut onboarding time by 30%" beats "improved onboarding process."' },
      { kind: 'tip', body: 'Mirror the company\'s language. If they say "customer success," do not write "client support."' },
      { kind: 'warning', body: 'Avoid tables, text boxes, and graphics. Many applicant tracking systems cannot read them and your resume may come through blank.' },
    ],
    faqs: [
      { question: 'Should I include a photo?', answer: 'In the US, UK, and Canada, no. In parts of Europe and Asia a professional photo is still common — follow local norms.' },
      { question: 'How far back should my resume go?', answer: 'Cover the last 10 to 15 years. Older roles can be summarized in a single line or left off entirely.' },
    ],
    things: ['Job description', 'Resume template', 'PDF export tool'],
    comments: [
      { author: 'Jordan T.', rating: 5, body: 'Rewriting my bullets with numbers got me three interviews in two weeks after months of silence.' },
      { author: 'Aiko', rating: 4, body: 'The ATS warning saved me — my old template was two columns and apparently unreadable.' },
    ],
  },
  {
    slug: 'Bake-Chocolate-Chip-Cookies',
    title: 'Bake Chocolate Chip Cookies',
    category: 'Food-and-Entertaining',
    featured: 0,
    read_time: 6,
    author: 'wikiHow Baking Team',
    summary:
      'Chewy centers, crisp edges, and pools of melted chocolate come down to three things: chilled dough, proper creaming, and pulling the tray out before the cookies look done.',
    intro:
      'This is a one-bowl-ish recipe that works with pantry staples. The single biggest upgrade is resting the dough for at least 30 minutes before baking.',
    hero: 'cookies',
    methods: [
      {
        title: 'Making the Dough',
        steps: [
          'Preheat the oven to 375°F (190°C) and line two baking sheets with parchment paper.',
          'Beat 1 cup (225 g) of softened butter with ¾ cup (150 g) of white sugar and ¾ cup (165 g) of brown sugar for 3 minutes until light and fluffy.',
          'Beat in 2 eggs one at a time, then 2 teaspoons of vanilla extract.',
          'Whisk 2¼ cups (280 g) of flour with 1 teaspoon of baking soda and 1 teaspoon of salt, then mix into the butter mixture just until no dry streaks remain.',
          'Fold in 2 cups (340 g) of chocolate chips, then chill the dough for 30 minutes.',
          'Scoop 2-tablespoon balls onto the sheets, leaving 2 inches between them.',
        ],
      },
      {
        title: 'Baking and Storing',
        steps: [
          'Bake for 9–11 minutes, until the edges are golden but the centers still look slightly underdone.',
          'Let the cookies rest on the hot tray for 5 minutes — they finish setting as they cool.',
          'Transfer to a rack and sprinkle with flaky salt while still warm.',
          'Store in an airtight container for up to 5 days, with a slice of bread to keep them soft.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Chilling the dough firms the fat so the cookies spread less and stay thicker.' },
      { kind: 'tip', body: 'Pull the tray when the centers look a little wet. Carryover heat finishes the job.' },
      { kind: 'warning', body: 'Do not bake on a hot tray from a previous batch — the dough will spread before it sets.' },
    ],
    faqs: [
      { question: 'Why did my cookies spread so much?', answer: 'Usually warm dough or warm butter. Chill the dough and cool your baking sheets between batches.' },
      { question: 'Can I freeze the dough?', answer: 'Yes. Freeze scooped balls for up to 3 months, then bake straight from frozen and add 2 minutes.' },
    ],
    things: ['Mixing bowls', 'Hand or stand mixer', 'Baking sheets', 'Parchment paper', 'Cookie scoop'],
    comments: [{ author: 'Nora P.', rating: 5, body: 'Chilling the dough made a huge difference. Thick, chewy, and gone in a day.' }],
  },
  {
    slug: 'Save-Money-Every-Month',
    title: 'Save Money Every Month',
    category: 'Finance-and-Business',
    featured: 0,
    read_time: 7,
    author: 'wikiHow Finance Team',
    summary:
      'Saving is less about willpower and more about automation. Move the money on payday, keep it in a separate account, and spend from what is left instead of trying to save leftovers.',
    intro:
      'A budget you cannot follow is worse than no budget. Start with three numbers and a single automatic transfer.',
    hero: 'money',
    methods: [
      {
        title: 'Finding Money to Save',
        steps: [
          'Export the last three months of transactions and group them into fixed costs, flexible spending, and one-off purchases.',
          'Pick the three largest flexible categories and set a hard monthly cap for each.',
          'Cancel subscriptions you have not used in 60 days. This is usually the fastest win.',
          'Negotiate recurring bills — internet, phone, insurance — by asking for the current promotional rate.',
        ],
      },
      {
        title: 'Automating the Habit',
        steps: [
          'Open a high-yield savings account separate from your checking account so it takes effort to spend.',
          'Set an automatic transfer for the day after payday. Even $25 per paycheck builds the habit.',
          'Increase the amount by 1% every three months, or direct half of every raise into savings.',
          'Build a $1,000 starter emergency fund before investing or paying extra on debt.',
          'Review once a month for ten minutes. Adjust the caps rather than abandoning the plan.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Name your savings account after the goal — "New Tires" is harder to raid than "Savings 2."' },
      { kind: 'tip', body: 'Use the 24-hour rule for any non-essential purchase over $50.' },
      { kind: 'warning', body: 'Do not invest money you may need within a year. Keep short-term savings in a plain high-yield account.' },
    ],
    faqs: [
      { question: 'How much should I save each month?', answer: 'A common target is 20% of take-home pay, split between emergency savings and retirement. If that is not possible yet, start with 5% and increase gradually.' },
      { question: 'Should I save or pay off debt first?', answer: 'Build a small $1,000 buffer first, then prioritize any debt with an interest rate above 7%.' },
    ],
    things: ['Bank statements', 'Budget spreadsheet or app', 'High-yield savings account'],
    comments: [{ author: 'Marcus L.', rating: 5, body: 'The 1% increase every quarter is such a low-stress trick. I did not notice the transfers going up at all.' }],
  },
  {
    slug: 'Take-Better-Photos',
    title: 'Take Better Photos',
    category: 'Hobbies-and-Crafts',
    featured: 0,
    read_time: 6,
    author: 'wikiHow Photography Team',
    summary:
      'Better photos come from light and composition, not gear. Learn to find soft light, simplify the frame, and get closer to your subject.',
    intro:
      'Your phone camera is more than good enough. These habits will improve your photos more than any new lens.',
    hero: 'camera',
    methods: [
      {
        title: 'Working with Light',
        steps: [
          'Shoot in the first hour after sunrise or the last hour before sunset for soft, warm light.',
          'Avoid direct midday sun. Move into open shade and face your subject toward the light.',
          'Turn off the flash indoors and use a window instead — put the window to your side, not behind your subject.',
          'Expose for the highlights. It is easier to recover shadow detail than blown-out white.',
        ],
      },
      {
        title: 'Composing the Shot',
        steps: [
          'Tap to focus, then drag the exposure slider down slightly so bright areas keep detail.',
          'Fill the frame with your subject instead of leaving a wide border of background.',
          'Place your subject on a third line rather than dead center for a more dynamic image.',
          'Look for leading lines — roads, railings, shorelines — that draw the eye into the frame.',
          'Take three versions at different heights: eye level, waist level, and above.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Clean your lens. It sounds trivial, but it is the single most common cause of hazy phone photos.' },
      { kind: 'tip', body: 'Burst mode on moving subjects gives you a much better chance of catching the right moment.' },
      { kind: 'warning', body: 'Do not zoom with your fingers if you can move closer — digital zoom loses detail fast.' },
    ],
    faqs: [
      { question: 'Do I need a DSLR?', answer: 'Not to learn composition and light. A modern phone is capable of excellent results; upgrade when you hit a genuine limitation.' },
      { question: 'How do I take better portraits?', answer: 'Use soft window light, shoot slightly above eye level, and focus on the near eye.' },
    ],
    things: ['Camera or phone', 'Cleaning cloth', 'Tripod (optional)'],
    comments: [{ author: 'Tomas', rating: 5, body: 'The "expose for the highlights" tip fixed my blown-out skies completely.' }],
  },
  {
    slug: 'Do-a-10-Minute-Morning-Stretch',
    title: 'Do a 10-Minute Morning Stretch',
    category: 'Health',
    featured: 0,
    read_time: 4,
    author: 'wikiHow Wellness Team',
    summary:
      'Ten minutes of gentle movement in the morning reduces stiffness and sets a calmer tone for the day. No equipment, no mat required — just a wall and the floor.',
    intro:
      'Move slowly and breathe through each position. Stretching should feel like a gentle pull, never sharp pain.',
    hero: 'stretch',
    methods: [
      {
        title: 'A Simple Morning Routine',
        steps: [
          'Stand tall and take five slow breaths, rolling your shoulders back and down.',
          'Do a gentle neck stretch: tilt your right ear toward your right shoulder and hold for 20 seconds per side.',
          'Reach both arms overhead and side-bend slowly, lengthening the whole ribcage for 30 seconds per side.',
          'Step into a deep lunge with your back knee down, then shift gently forward to open the hip for 30 seconds per side.',
          'Sit back into child\'s pose with your arms extended and breathe for one minute.',
          'Finish with a seated forward fold and a slow twist on each side.',
        ],
      },
    ],
    tips: [
      { kind: 'tip', body: 'Breathe out as you sink deeper into a stretch. Holding your breath makes muscles guard.' },
      { kind: 'tip', body: 'Warm up with a 30-second march in place if you feel stiff first thing.' },
      { kind: 'warning', body: 'Stop any stretch that causes sharp pain, numbness, or tingling, and check with a doctor if it persists.' },
    ],
    faqs: [
      { question: 'Is it better to stretch before or after coffee?', answer: 'Either works. Many people prefer a glass of water first to rehydrate after sleep.' },
      { question: 'Can I do this routine every day?', answer: 'Yes. Gentle static stretching daily is safe for most people, and consistency matters more than duration.' },
    ],
    things: ['A wall or chair', 'A mat (optional)', 'Water'],
    comments: [{ author: 'Hana Y.', rating: 4, body: 'Ten minutes is just long enough that I actually do it. The hip opener is my favorite.' }],
  },
];

function seedDatabase(db) {
  const catStmt = db.prepare(
    'INSERT INTO categories (name, slug, description, emoji, color, position) VALUES (?,?,?,?,?,?)'
  );
  const catIds = {};
  CATEGORIES.forEach((c, i) => {
    const info = catStmt.run(c.name, c.slug, c.description, c.emoji, c.color, i);
    catIds[c.slug] = Number(info.lastInsertRowid);
  });

  const articleStmt = db.prepare(
    `INSERT INTO articles (slug, title, summary, intro, category_id, hero_image, author, status, featured, views, helpful_yes, helpful_no, read_time)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
  );
  const methodStmt = db.prepare('INSERT INTO methods (article_id, title, position) VALUES (?,?,?)');
  const stepStmt = db.prepare(
    'INSERT INTO steps (article_id, method_id, position, text, image, caption) VALUES (?,?,?,?,?,?)'
  );
  const tipStmt = db.prepare('INSERT INTO tips (article_id, kind, body, position) VALUES (?,?,?,?)');
  const faqStmt = db.prepare('INSERT INTO faqs (article_id, question, answer, position) VALUES (?,?,?,?)');
  const thingStmt = db.prepare('INSERT INTO things (article_id, text, position) VALUES (?,?,?)');
  const commentStmt = db.prepare(
    'INSERT INTO comments (article_id, author, body, rating, approved) VALUES (?,?,?,?,1)'
  );

  ARTICLES.forEach((a, index) => {
    const info = articleStmt.run(
      a.slug,
      a.title,
      a.summary,
      a.intro,
      catIds[a.category] || null,
      a.hero,
      a.author || 'wikiHow Staff',
      'published',
      a.featured ? 1 : 0,
      1200 + Math.floor(Math.random() * 48000),
      40 + Math.floor(Math.random() * 900),
      2 + Math.floor(Math.random() * 25),
      a.read_time || 5
    );
    const articleId = Number(info.lastInsertRowid);

    let stepCounter = 1;
    (a.methods || []).forEach((m, mi) => {
      const mInfo = methodStmt.run(articleId, m.title || '', mi);
      const methodId = Number(mInfo.lastInsertRowid);
      (m.steps || []).forEach((text, si) => {
        stepStmt.run(
          articleId,
          methodId,
          si,
          text,
          `/img/topics/${a.hero}/${((stepCounter - 1) % 4) + 1}.jpg`,
          ''
        );
        stepCounter += 1;
      });
    });

    (a.tips || []).forEach((t, ti) => tipStmt.run(articleId, t.kind, t.body, ti));
    (a.faqs || []).forEach((f, fi) => faqStmt.run(articleId, f.question, f.answer, fi));
    (a.things || []).forEach((t, ti) => thingStmt.run(articleId, t, ti));
    (a.comments || []).forEach((c) => commentStmt.run(articleId, c.author, c.body, c.rating || 4));
  });
}

module.exports = { CATEGORIES, ARTICLES, seedDatabase };

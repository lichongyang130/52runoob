/* Explore mega-menu content: the same column layout the reference site uses.
   `nav_group`: primary = the 12 category cards on the site, extra = links that
   appear in the final "all categories" row. */

const NAV_GROUP_PRIMARY_SLUGS = [
  'Arts-and-Entertainment',
  'Computers-and-Electronics',
  'Education-and-Communications',
  'Family-Life',
  'Finance-and-Business',
  'Food-and-Entertaining',
  'Health',
  'Hobbies-and-Crafts',
  'Home-and-Garden',
  'Pets-and-Animals',
  'Sports-and-Fitness',
  'Work-World',
];

/* Columns shown in the middle band of the menu: a section title plus its
   subcategory links. `category` is the slug the sub-links are filtered by. */
const NAV_COLUMNS = [
  {
    items: [
      { name: 'Arts and Entertainment', slug: 'Arts-and-Entertainment', subs: ['Artwork', 'Books', 'Movies'] },
      { name: 'Hobbies and Crafts', slug: 'Hobbies-and-Crafts', subs: ['Crafts', 'Drawing', 'Games'] },
    ],
  },
  {
    items: [
      {
        name: 'Computers and Electronics',
        slug: 'Computers-and-Electronics',
        subs: ['Computers', 'Phone Skills', 'Technology Hacks'],
      },
      {
        name: 'Education & Communication',
        slug: 'Education-and-Communications',
        subs: ['Communication Skills', 'Personal Development', 'Studying'],
      },
    ],
  },
  {
    items: [
      {
        name: 'Health',
        slug: 'Health',
        subs: ["Men's Health", 'Mental Health', "Women's Health"],
      },
      {
        name: 'Personal Care and Style',
        slug: 'Personal-Care-and-Style',
        subs: ['Fashion', 'Hair Care', 'Personal Hygiene'],
      },
    ],
  },
  {
    items: [
      {
        name: 'Relationships',
        slug: 'Relationships',
        subs: ['Dating', 'Love', 'Relationship Issues'],
      },
      {
        name: 'Quizzes',
        slug: 'Quizzes',
        subs: ['Community Quizzes', 'Personality Quizzes', 'Fun Games'],
      },
    ],
  },
];

/* Last band: every category, including ones with no category card. */
const NAV_ALL_CATEGORIES = [
  'Arts and Entertainment',
  'Cars & Other Vehicles',
  'Computers and Electronics',
  'Education & Communication',
  'Family Life',
  'Finance and Business',
  'Food and Entertaining',
  'Health',
  'Hobbies and Crafts',
  'Holidays and Traditions',
  'Home and Garden',
  'Personal Care and Style',
  'Pets and Animals',
  'Philosophy and Religion',
  'Relationships',
  'Relationship Quizzes',
  'Sports and Fitness',
  'Travel',
  'Work World',
  'Youth',
];

module.exports = { NAV_COLUMNS, NAV_ALL_CATEGORIES, NAV_GROUP_PRIMARY_SLUGS };

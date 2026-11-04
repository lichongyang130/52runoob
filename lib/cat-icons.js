export const CAT_ICON_BY_SLUG = {
  "Arts-and-Entertainment": "/img/cat-icons/arts.jpg",
  "Food-and-Entertaining": "/img/cat-icons/food.jpg",
  "Finance-and-Business": "/img/cat-icons/finance.jpg",
  Health: "/img/cat-icons/health.jpg",
  "Hobbies-and-Crafts": "/img/cat-icons/hobbies.jpg",
  "Home-and-Garden": "/img/cat-icons/home.jpg",
  "Pets-and-Animals": "/img/cat-icons/pets.jpg",
  "Work-World": "/img/cat-icons/work.jpg",
  "Computers-and-Electronics": "/img/cat-icons/computers.jpg",
  "Education-and-Communications": "/img/cat-icons/education.jpg",
  "Family-Life": "/img/cat-icons/family.jpg",
  "Sports-and-Fitness": "/img/cat-icons/sports.jpg",
  "Cars-and-Other-Vehicles": "/img/cat-icons/cars.jpg",
  "Holidays-and-Traditions": "/img/cat-icons/holidays.jpg",
  "Personal-Care-and-Style": "/img/cat-icons/style.jpg",
  "Philosophy-and-Religion": "/img/cat-icons/philosophy.jpg",
  Relationships: "/img/cat-icons/relationships.jpg",
  "Relationship-Quizzes": "/img/cat-icons/quizzes.jpg",
  Travel: "/img/cat-icons/travel.jpg",
  Youth: "/img/cat-icons/youth.jpg",
  Games: "/img/cat-icons/games.jpg",
  Drawing: "/img/cat-icons/drawing.jpg",
  Crafts: "/img/cat-icons/crafts.jpg",
  "Board-Games": "/img/cat-icons/boardgames.jpg",
  "Card-Games": "/img/cat-icons/cardgames.jpg",
  "Party-Games": "/img/cat-icons/partygames.jpg",
  Computers: "/img/cat-icons/computers.jpg",
  Houseplants: "/img/cat-icons/home.jpg",
};

export function getCatIcon(slug) {
  return CAT_ICON_BY_SLUG[slug] || "/img/cat-icons/arts.jpg";
}

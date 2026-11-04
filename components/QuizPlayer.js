"use client";

import Link from "next/link";
import { useState } from "react";

const QUIZZES = [
  {
    id: "atelier-drawing",
    category: "Arts & Classical Atelier",
    icon: "/img/cat-icons/arts.jpg",
    banner: "/img/steps/Learn-to-Draw-for-Beginners/21.jpg",
    title: "Classical Drawing & Perspective Mastery Quiz",
    subtitle: "Test your eye for proportion, chiaroscuro lighting, and Renaissance perspective.",
    guideSlug: "Learn-to-Draw-for-Beginners",
    guideTitle: "How to Learn to Draw for Beginners (24-Step Guide)",
    questions: [
      {
        q: "When laying down broad, velvety shading gradients across a large drawing board, which pencil grip gives you the smoothest control?",
        image: "/img/steps/Learn-to-Draw-for-Beginners/03.jpg",
        options: [
          "The overhand (under-palm) shading grip engaging the side of the lead",
          "A tight tripod writing grip pinched 1 cm from the tip",
          "Holding the pencil vertically at a 90-degree angle to the paper",
          "Pressing hard with an H-grade technical drafting pencil",
        ],
        correct: 0,
        explanation:
          "An overhand grip lets the flat side of the graphite core glide across the paper grain, producing wide, seamless tonal washes without scratchy grooves.",
      },
      {
        q: "Why do classical atelier artists step back and view their drawing in a handheld mirror?",
        image: "/img/steps/Learn-to-Draw-for-Beginners/22.jpg",
        options: [
          "To dry the charcoal fixative faster",
          "Flipping the image horizontally exposes subtle symmetry and proportion skews your brain had adapted to",
          "To make dark shadows appear two steps lighter",
          "To measure the paper's moisture content",
        ],
        correct: 1,
        explanation:
          "After staring at a drawing for 30 minutes, your visual cortex adapts to lopsided angles. Reversing the image in a mirror makes proportion errors jump out immediately.",
      },
      {
        q: "On a sunlit sphere, what is the faint band of light along the far shadow edge caused by light bouncing off the table?",
        image: "/img/steps/Learn-to-Draw-for-Beginners/13.jpg",
        options: [
          "The specular highlight",
          "The halftone bridge",
          "Reflected light within the shadow family",
          "The cast occlusion rim",
        ],
        correct: 2,
        explanation:
          "Reflected light bounces from surrounding surfaces into the shadow side of the form—Crucially, it must always remain darker than any tone in the light family.",
      },
      {
        q: "When drawing a corner building viewed at an angle where both walls recede away from you, which perspective system applies?",
        image: "/img/steps/Learn-to-Draw-for-Beginners/10.jpg",
        options: [
          "Isometric zero-point projection",
          "One-point central perspective",
          "Two-point perspective with two vanishing points on the horizon line",
          "Atmospheric aerial blurring only",
        ],
        correct: 2,
        explanation:
          "Because neither wall is parallel to your picture plane, horizontal edges on the left wall converge to a left vanishing point while edges on the right converge to a right vanishing point.",
      },
      {
        q: "What is the primary purpose of observing 'negative space' (the shapes of air between chair legs or olive branches)?",
        image: "/img/steps/Learn-to-Draw-for-Beginners/11.jpg",
        options: [
          "It bypasses your brain's symbolic assumptions so you draw accurate contour angles",
          "It eliminates the need to sharpen your pencil",
          "It replaces tonal shading with cross-hatching",
          "It makes the background darker than the foreground",
        ],
        correct: 0,
        explanation:
          "Your brain has a pre-stored symbol for 'chair' or 'hand' that distorts what you see. Abstract negative-space shapes have no symbol, forcing pure visual measurement.",
      },
    ],
  },
  {
    id: "artisan-bread",
    category: "Food & Artisan Hearth",
    icon: "/img/cat-icons/food.jpg",
    banner: "/img/steps/Bake-Bread-at-Home/19.jpg",
    title: "European Artisan Bread & Fermentation Quiz",
    subtitle: "How well do you know gluten windowpanes, Dutch-oven steam, and crust caramelization?",
    guideSlug: "Bake-Bread-at-Home",
    guideTitle: "How to Bake Bread at Home (23-Step Guide)",
    questions: [
      {
        q: "Why is weighing flour in grams on a digital scale vastly more reliable than scooping with measuring cups?",
        image: "/img/steps/Bake-Bread-at-Home/01.jpg",
        options: [
          "A cup of flour can vary by 25–30% in weight depending on how tightly it is packed",
          "Digital scales heat the yeast before mixing",
          "Measuring cups dissolve salt too quickly",
          "Grams only measure water, not dry ingredients",
        ],
        correct: 0,
        explanation:
          "120g of bread flour is always 120g, whereas a scooped cup can weigh anywhere from 115g to 155g—the difference between a supple dough and a dry brick.",
      },
      {
        q: "What does the 'Windowpane Test' verify after kneading bread dough?",
        image: "/img/steps/Bake-Bread-at-Home/06.jpg",
        options: [
          "That all yeast cells have stopped producing carbon dioxide",
          "That the gluten network is sufficiently developed to stretch into a thin translucent membrane without tearing",
          "That the salt has crystallized on the surface",
          "That the oven has reached 230°C (450°F)",
        ],
        correct: 1,
        explanation:
          "When glutenin and gliadin proteins align into an elastic mesh, dough stretches paper-thin so light passes through—ensuring it can trap fermentation gas without collapsing.",
      },
      {
        q: "Why do artisan bakers bake a scored boule inside a preheated covered cast-iron Dutch oven for the first 20 minutes?",
        image: "/img/steps/Bake-Bread-at-Home/18.jpg",
        options: [
          "To prevent the bottom of the loaf from cooking",
          "To trap moisture evaporating from the dough as steam, keeping the exterior extensible for maximum oven spring",
          "To cool down the oven temperature",
          "To make the crust soft and pale",
        ],
        correct: 1,
        explanation:
          "Steam keeps the outer skin supple during the first 15–20 minutes so the loaf can expand dramatically before the crust sets and caramelizes once the lid is removed.",
      },
      {
        q: "What happens if you slice into a freshly baked artisan boule immediately after pulling it from the oven?",
        image: "/img/steps/Bake-Bread-at-Home/21.jpg",
        options: [
          "The crust becomes twice as crispy",
          "Internal steam escapes prematurely and gelatinized starches compress into a gummy crumb",
          "The loaf rises an extra inch",
          "Nothing—bread does not change after leaving the oven",
        ],
        correct: 1,
        explanation:
          "As a loaf cools on a wire rack for 60–90 minutes, internal moisture redistributes and starch retrogrades into a structured, airy honeycomb crumb.",
      },
      {
        q: "When performing the 'Poke Test' on a proofed loaf in its banneton, what indicates the dough is ready to bake right now?",
        image: "/img/steps/Bake-Bread-at-Home/09.jpg",
        options: [
          "The indentation springs back completely and immediately",
          "The indentation springs back slowly halfway, leaving a gentle shallow dimple",
          "The dough deflates flat like a punctured balloon",
          "The surface feels rock-hard and dry",
        ],
        correct: 1,
        explanation:
          "Instant bounce-back means under-proofed; no bounce-back means over-proofed. A slow halfway rebound with a slight dimple signals peak gas and gluten balance.",
      },
    ],
  },
  {
    id: "botanical-conservatory",
    category: "Home & Botanical Living",
    icon: "/img/cat-icons/home.jpg",
    banner: "/img/steps/Keep-Houseplants-Alive/25.jpg",
    title: "Sunlit Conservatory & Houseplant Rescue Quiz",
    subtitle: "Diagnose root health, drainage physics, and window light like a master botanist.",
    guideSlug: "Keep-Houseplants-Alive",
    guideTitle: "How to Keep Houseplants Alive (25-Step Guide)",
    questions: [
      {
        q: "What is the #1 cause of houseplant decline in indoor homes?",
        image: "/img/steps/Keep-Houseplants-Alive/05.jpg",
        options: [
          "Watering on a rigid calendar schedule instead of checking soil moisture 2 inches deep",
          "Rotating the pot 90 degrees once a week",
          "Using unglazed terracotta pots with drainage holes",
          "Wiping dust off broad leaves with a damp cloth",
        ],
        correct: 0,
        explanation:
          "Roots require oxygen as much as water. Watering wet soil suffocates roots and triggers rot—always test the top 2 inches with your finger first.",
      },
      {
        q: "Why does placing a layer of gravel at the bottom of a pot WITHOUT a drainage hole actually worsen root rot?",
        image: "/img/steps/Keep-Houseplants-Alive/10.jpg",
        options: [
          "Gravel absorbs all the nitrogen from the soil",
          "It creates a 'perched water table' that pushes the saturated zone higher up into the root ball",
          "Gravel makes the pot too cold in summer",
          "Plant roots dissolve river pebbles",
        ],
        correct: 1,
        explanation:
          "Water will not move from fine potting soil into coarse gravel until the soil above is 100% saturated—raising the stagnant wet zone right into the roots.",
      },
      {
        q: "Why does grouping tropical plants on a pebble tray with water help calatheas and ferns thrive?",
        image: "/img/steps/Keep-Houseplants-Alive/12.jpg",
        options: [
          "It creates a humid microclimate around the leaves without submerging the roots in water",
          "It blocks sunlight from reaching the lower leaves",
          "It replaces the need for potting soil",
          "It cools the room by 15 degrees",
        ],
        correct: 0,
        explanation:
          "As water evaporates from the pebble tray alongside natural leaf transpiration, relative humidity rises right around the foliage while the pot base stays above the waterline.",
      },
      {
        q: "Why should you wipe dust off broad-leaved plants like Fiddle-Leaf Figs and Monsteras every couple of weeks?",
        image: "/img/steps/Keep-Houseplants-Alive/14.jpg",
        options: [
          "Dust blocks light absorption for photosynthesis and clogs microscopic stomatal pores",
          "Dust makes the pot heavier",
          "Wiping leaves changes their color to blue",
          "It prevents the plant from growing new roots",
        ],
        correct: 0,
        explanation:
          "A thin film of household dust can reduce light reaching chloroplasts by 20–30%, noticeably slowing growth indoors where light is already limited.",
      },
      {
        q: "When repotting a root-bound houseplant, how much larger should the new terracotta pot be?",
        image: "/img/steps/Keep-Houseplants-Alive/18.jpg",
        options: [
          "Only 1 to 2 inches (2.5–5 cm) wider in diameter than the current pot",
          "At least 3 times wider so you never have to repot again",
          "Smaller than the original pot",
          "As deep as a wine barrel",
        ],
        correct: 0,
        explanation:
          "Jumping to an oversized pot surrounds small roots with a huge volume of wet soil that stays soggy for weeks, inviting root rot.",
      },
    ],
  },
  {
    id: "scholar-study",
    category: "Education & Cognitive Science",
    icon: "/img/cat-icons/education.jpg",
    banner: "/img/steps/Study-Effectively-for-Exams/10.jpg",
    title: "Cognitive Science & Exam Mastery Quiz",
    subtitle: "Discover whether your study habits build lasting neural pathways or the 'illusion of competence'.",
    guideSlug: "Study-Effectively-for-Exams",
    guideTitle: "How to Study Effectively for Exams (22-Step Guide)",
    questions: [
      {
        q: "Which study method consistently produces the strongest long-term memory retention in cognitive psychology experiments?",
        image: "/img/steps/Study-Effectively-for-Exams/07.jpg",
        options: [
          "Passively re-reading highlighted textbook paragraphs",
          "Active recall—closing the book and retrieving concepts from memory onto a blank page",
          "Copying lecture slides word-for-word in three ink colors",
          "Listening to lectures at 2x speed while multitasking",
        ],
        correct: 1,
        explanation:
          "The effortful act of retrieving information from memory strengthens synaptic pathways far more than passive recognition.",
      },
      {
        q: "In the Leitner Spaced-Repetition Box system, what happens when you miss a flashcard?",
        image: "/img/steps/Study-Effectively-for-Exams/09.jpg",
        options: [
          "You throw the card away",
          "It moves back to Box 1 (daily review) so your study time concentrates on your weakest material",
          "It moves to Box 5 (monthly review)",
          "You rewrite the card 10 times immediately",
        ],
        correct: 1,
        explanation:
          "Cards you know well graduate to longer intervals (every 4, 7, or 14 days), while missed cards return to Box 1 for immediate reinforcement.",
      },
      {
        q: "How does the 'Feynman Technique' expose hidden gaps in your understanding?",
        image: "/img/steps/Study-Effectively-for-Exams/08.jpg",
        options: [
          "By requiring you to explain the concept aloud in plain, jargon-free language as if teaching a beginner",
          "By memorizing the textbook glossary alphabetically",
          "By studying only in complete silence for 6 hours straight",
          "By skipping practice problems",
        ],
        correct: 0,
        explanation:
          "Whenever you have to hide behind memorized jargon or vague phrases while explaining a topic aloud, you've pinpointed the exact step in the logic you don't yet grasp.",
      },
      {
        q: "What is 'Interleaved Practice' during problem-solving sessions?",
        image: "/img/steps/Study-Effectively-for-Exams/12.jpg",
        options: [
          "Doing 50 identical problems of Type A before touching Type B",
          "Mixing problems from 3 different topics in the same session so you practice choosing WHICH strategy applies",
          "Reading two books simultaneously out loud",
          "Studying only the night before the exam",
        ],
        correct: 1,
        explanation:
          "Real exams don't label which chapter a problem comes from. Interleaving trains your brain to diagnose problem structures, not just repeat a formula mechanically.",
      },
      {
        q: "Why is sacrificing sleep the night before an exam counterproductive for memory?",
        image: "/img/steps/Study-Effectively-for-Exams/20.jpg",
        options: [
          "During deep slow-wave and REM sleep, the hippocampus replays and consolidates new memories into the neocortex",
          "Sleep makes textbooks easier to read in the dark",
          "The brain deletes all memories after 10 PM",
          "Sleep only rests muscles, not neurons",
        ],
        correct: 0,
        explanation:
          "Sleep deprivation impairs prefrontal working memory by up to 40% and halts hippocampal memory consolidation—8 hours of sleep locks in what you studied.",
      },
    ],
  },
];

export default function QuizPlayer() {
  const [selectedQuizId, setSelectedQuizId] = useState(QUIZZES[0].id);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const quiz = QUIZZES.find((q) => q.id === selectedQuizId) || QUIZZES[0];
  const currentQ = quiz.questions[qIndex];

  const selectQuiz = (id) => {
    setSelectedQuizId(id);
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  const handleChoose = (optIdx) => {
    if (picked !== null) return;
    setPicked(optIdx);
    if (optIdx === currentQ.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (qIndex + 1 < quiz.questions.length) {
      setQIndex((i) => i + 1);
      setPicked(null);
    } else {
      setFinished(true);
    }
  };

  const getRank = (sc, total) => {
    const pct = sc / total;
    if (pct === 1) return { title: "Grand Master of the Guild", desc: "Flawless score! You command both the theory and practical craft of this subject." };
    if (pct >= 0.8) return { title: "Master Artisan", desc: "Impressive command! Only the finest nuances separate you from a perfect score." };
    if (pct >= 0.6) return { title: "Journeyman Scholar", desc: "Solid foundation! Review the full illustrated guide below to master every step." };
    return { title: "Curious Apprentice", desc: "A great starting point! Dive into our step-by-step illustrated guide to build your mastery." };
  };

  return (
    <div className="wk-quiz-hub">
      {/* Quiz Selector Tabs */}
      <div className="wk-quiz-selector">
        {QUIZZES.map((qz) => {
          const active = qz.id === quiz.id;
          return (
            <button
              key={qz.id}
              type="button"
              className={`wk-quiz-tab ${active ? "is-active" : ""}`}
              onClick={() => selectQuiz(qz.id)}
            >
              <span className="wk-cat-emoji">
                <img src={qz.icon} alt="" className="wk-cat-icon-img" />
              </span>
              <span className="wk-quiz-tab-text">
                <small>{qz.category}</small>
                <strong>{qz.title}</strong>
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Quiz Card */}
      <div className="wk-card wk-quiz-stage">
        {!finished ? (
          <>
            <div className="wk-quiz-head">
              <div>
                <span className="wk-pill">{quiz.category}</span>
                <h2>{quiz.title}</h2>
                <p>{quiz.subtitle}</p>
              </div>
              <div className="wk-quiz-progress-badge">
                <span>Question {qIndex + 1} of {quiz.questions.length}</span>
                <strong>Score: {score}</strong>
              </div>
            </div>

            <div className="wk-quiz-progress-track">
              <div
                className="wk-quiz-progress-fill"
                style={{ width: `${((qIndex + (picked !== null ? 1 : 0)) / quiz.questions.length) * 100}%` }}
              />
            </div>

            <div className="wk-quiz-body">
              <div className="wk-quiz-painting">
                <img src={currentQ.image} alt="" />
              </div>

              <div className="wk-quiz-question-col">
                <h3 className="wk-quiz-q-title">
                  {qIndex + 1}. {currentQ.q}
                </h3>

                <div className="wk-quiz-options">
                  {currentQ.options.map((opt, idx) => {
                    let stateClass = "";
                    if (picked !== null) {
                      if (idx === currentQ.correct) stateClass = "is-correct";
                      else if (idx === picked) stateClass = "is-wrong";
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`wk-quiz-opt ${stateClass}`}
                        onClick={() => handleChoose(idx)}
                        disabled={picked !== null}
                      >
                        <span className="wk-quiz-opt-letter">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="wk-quiz-opt-label">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {picked !== null ? (
                  <div className={`wk-quiz-feedback ${picked === currentQ.correct ? "is-ok" : "is-err"}`}>
                    <strong>
                      {picked === currentQ.correct ? "Correct! " : "Not quite — "}
                    </strong>
                    <span>{currentQ.explanation}</span>
                    <div className="wk-quiz-next-row">
                      <button
                        type="button"
                        className="wk-btn wk-btn-solid"
                        onClick={handleNext}
                      >
                        {qIndex + 1 < quiz.questions.length ? "Next Question →" : "See Final Results →"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <div className="wk-quiz-result">
            <div className="wk-quiz-result-art">
              <img src={quiz.banner} alt={quiz.title} />
            </div>
            <div className="wk-quiz-result-copy">
              <span className="wk-pill">Quiz Completed</span>
              <h2>{getRank(score, quiz.questions.length).title}</h2>
              <div className="wk-quiz-score-big">
                You scored <strong>{score}</strong> out of <strong>{quiz.questions.length}</strong> ({Math.round((score / quiz.questions.length) * 100)}%)
              </div>
              <p>{getRank(score, quiz.questions.length).desc}</p>
              <div className="wk-quiz-result-actions">
                <Link href={`/how-to/${quiz.guideSlug}`} className="wk-btn wk-btn-solid">
                  Read: {quiz.guideTitle} →
                </Link>
                <button
                  type="button"
                  className="wk-btn wk-btn-ghost"
                  onClick={() => selectQuiz(quiz.id)}
                >
                  Retake This Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

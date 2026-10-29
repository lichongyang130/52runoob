#!/usr/bin/env python3
"""Rebuild the initial 19-category topic inventory; does not create or publish articles.

This is a historical planning input, not a replacement for an updated progress
tracker. To preserve later status edits, it refuses to overwrite the CSV.
"""
import csv
from pathlib import Path
import re

ROWS = [
    ("Arts and Entertainment", "Identify-a-Painting", ["Photograph a Painting Safely", "Store Artwork at Home", "Create a Simple Art Inventory", "Hang a Picture Securely", "Research an Artist's Signature"]),
    ("Cars and Other Vehicles", "Jump-Start-a-Car", ["Check Your Tire Pressure", "Understand Dashboard Warning Lights", "Replace Windshield Wiper Blades", "Prepare a Car for a Road Trip", "Build a Car Emergency Kit"]),
    ("Computers and Electronics", "Speed-Up-a-Slow-Laptop", ["Back Up Your Photos", "Organize Digital Files", "Secure Your Online Accounts", "Troubleshoot a Slow Wi-Fi Connection", "Choose a Home Backup Drive"]),
    ("Education and Communications", "Study-for-an-Exam-Without-Cramming", ["Make Effective Study Flashcards", "Take Better Notes in Class", "Prepare a Short Presentation", "Build a Weekly Study Schedule", "Read a Difficult Text Actively"]),
    ("Family Life", "Split-Household-Chores-Fairly", ["Hold a Family Meeting", "Create a Family Weekly Schedule", "Plan Family Meals Together", "Organize Important Household Documents", "Prepare for a Family Move"]),
    ("Finance and Business", "Build-a-Monthly-Budget", ["Lower Your Grocery Bill", "Build an Emergency Fund", "Track Recurring Expenses", "Plan for Irregular Expenses", "Choose a Budgeting Method"]),
    ("Food and Entertaining", "Cook-Rice-Without-a-Rice-Cooker", ["Meal Prep Safely for the Week", "Store and Reheat Cooked Rice Safely", "Cook Dried Beans at Home", "Plan a Simple Potluck", "Organize a Small Pantry"]),
    ("Health", "Build-a-Home-First-Aid-Kit", ["Prepare for a Medical Appointment", "Organize Medicines Safely at Home", "Create an Emergency Contact List", "Build a Handwashing Routine", "Read a Medicine Label Carefully"]),
    ("Hobbies and Crafts", "Start-a-Nature-Journal", ["Begin a Watercolor Sketchbook", "Make a Photo Scrapbook", "Start a Bullet Journal", "Sketch Plants Outdoors", "Organize Basic Craft Supplies"]),
    ("Holidays and Traditions", "Start-a-Family-Holiday-Tradition", ["Plan a Low-Cost Holiday Gathering", "Organize a Holiday Potluck", "Preserve Family Holiday Photos", "Create a Simple Holiday Card", "Start a Gratitude Tradition"]),
    ("Home and Garden", "Care-for-a-Houseplant", ["Repot a Houseplant", "Grow Basil Indoors", "Choose Light for Houseplants", "Water Houseplants More Carefully", "Inspect a Houseplant for Pests"]),
    ("Personal Care and Style", "Build-a-Simple-Skincare-Routine", ["Patch Test a Skincare Product", "Pack a Simple Travel Skincare Kit", "Organize a Small Wardrobe", "Care for Dry Hands", "Choose Clothes for Changing Weather"]),
    ("Pets and Animals", "Brush-a-Dogs-Teeth", ["Build a Dog Walking Routine", "Brush a Dog's Coat", "Prepare for a Veterinary Visit", "Make a Pet Emergency Kit", "Choose Enrichment Activities for a Dog"]),
    ("Philosophy and Religion", "Read-a-Philosophical-Text", ["Map a Philosophical Argument", "Start a Reflective Journal", "Compare Two Philosophical Viewpoints", "Discuss a Moral Dilemma Respectfully", "Use a Thought Experiment"]),
    ("Relationships", "Have-a-Difficult-Conversation", ["Listen More Actively", "Set a Personal Boundary", "Make a Sincere Apology", "Handle a Disagreement Calmly", "Ask for Feedback in a Relationship"]),
    ("Sports and Fitness", "Start-Running-When-You-Hate-Running", ["Run Your First 5K", "Start Walking for Fitness", "Warm Up Before a Run", "Plan a Run-Walk Workout", "Keep an Exercise Routine on Busy Weeks"]),
    ("Travel", "Pack-for-a-Week-in-a-Carry-On", ["Pack a Personal Item for a Trip", "Organize Travel Documents", "Plan Airport Transportation", "Pack for Mixed Weather", "Create a Simple Travel Budget"]),
    ("Work World", "Prepare-for-a-Performance-Review", ["Organize Meeting Notes", "Prepare for a One-on-One Meeting", "Write a Clear Project Update", "Prioritize Tasks at Work", "Set Healthy Work Boundaries"]),
    ("Youth", "Start-a-Club-at-School", ["Plan a School Club Meeting", "Recruit Members for a School Club", "Choose an Extracurricular Activity", "Plan a Student-Led Project", "Create a Club Welcome Guide"]),
]


def slugify(text):
    text = text.replace("'s", "s").replace("'", "")
    return re.sub(r"[^A-Za-z0-9]+", "-", text).strip("-")


def main():
    target = Path(__file__).resolve().parents[1] / "content" / "expanded-plan.csv"
    if target.exists():
        raise SystemExit(f"Will not overwrite existing progress: {target}")
    all_slugs = set()
    with target.open("x", encoding="utf-8", newline="") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow(["category", "category_url", "title", "slug", "existing_anchor", "status", "notes"])
        for category, anchor, titles in ROWS:
            if len(titles) != 5:
                raise ValueError(f"Expected five new topics: {category}")
            category_url = "/Category/" + slugify(category)
            for title in titles:
                slug = slugify(title)
                if slug.lower() in all_slugs:
                    raise ValueError(f"Duplicate slug: {slug}")
                all_slugs.add(slug.lower())
                status = "review_pending" if slug == "Run-Your-First-5K" else "planned"
                note = "15 steps; 16 illustrations; 6 illustrations reused from winter article; human review pending" if slug == "Run-Your-First-5K" else ""
                writer.writerow([category, category_url, "How to " + title, slug, "/" + anchor, status, note])
    print(f"{len(ROWS)} categories; {len(all_slugs)} new topics -> {target}")


if __name__ == "__main__":
    main()

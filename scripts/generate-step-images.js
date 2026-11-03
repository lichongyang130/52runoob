#!/usr/bin/env node
/**
 * Builds the illustration brief for every step of a guide.
 *
 *   node scripts/generate-step-images.js arts            # print the prompt list
 *   node scripts/generate-step-images.js arts --plan     # print plan + output paths
 *
 * The actual images are produced with the image tool and saved to
 * public/img/steps/<slug>/NN.jpg — this script keeps the shared style suffix
 * and the European-cast subject description in one place so every guide looks
 * like one set.
 */
const path = require('path');
const fs = require('fs');

const STYLE =
  'Flat vector illustration, warm cream background with soft sage-green accents, rounded friendly shapes, no outlines, subtle flat shading, clean modern editorial how-to style, European characters, no text, no lettering, 16:10 composition';

function loadGuide(name) {
  const file = path.join(__dirname, '..', 'lib', 'guides', `${name}.js`);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function plan(guide) {
  const out = [];
  let n = 0;
  (guide.methods || []).forEach((m) => {
    (m.steps || []).forEach((s) => {
      n += 1;
      out.push({
        n,
        file: `/img/steps/${guide.slug}/${String(n).padStart(2, '0')}.jpg`,
        subject: typeof s === 'string' ? s : s.text,
        prompt: (typeof s === 'object' && s.prompt) || null,
      });
    });
  });
  return out;
}

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--')) || 'arts';
const guide = loadGuide(name);
const items = plan(guide);

console.log(`# ${guide.title} — ${items.length} step images @ public${'/img/steps/' + guide.slug}/`);
if (args.includes('--plan')) {
  items.forEach((i) => {
    console.log(`\n${String(i.n).padStart(2, '0')}. ${i.file}`);
    console.log(`   ${i.prompt || i.subject}`);
  });
} else {
  items.forEach((i) => console.log(`${String(i.n).padStart(2, '0')}  ${i.prompt || i.subject}`));
}
console.log(`\nSTYLE SUFFIX: ${STYLE}`);

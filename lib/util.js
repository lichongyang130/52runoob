export function slugify(text) {
  return String(text)
    .trim()
    .replace(/['’"]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

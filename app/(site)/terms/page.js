export const metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <main className="page">
      <div className="container wrap-narrow">
        <h1>Terms of Use</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <h2>1. Educational purpose</h2>
        <p>
          All content on this site is provided for general informational and educational purposes.
          Guides involving health, fitness, finance, electrical work, or tools are not a substitute
          for advice from a qualified professional.
        </p>

        <h2>2. Your contributions</h2>
        <p>
          By submitting a comment or an article, you confirm that the text is your own work and that
          you grant this site a non-exclusive license to display and edit it.
        </p>

        <h2>3. Acceptable use</h2>
        <p>
          Do not post spam, personal attacks, misleading instructions, or content that could cause
          physical harm. Comments that violate these rules may be removed without notice.
        </p>

        <h2>4. No warranty</h2>
        <p>
          Steps are reviewed by editors but results vary with equipment, materials, and skill.
          Follow instructions at your own risk.
        </p>

        <h2>5. Changes</h2>
        <p>
          These terms may be updated as the site evolves. Continued use after an update constitutes
          acceptance of the revised terms.
        </p>
      </div>
    </main>
  );
}

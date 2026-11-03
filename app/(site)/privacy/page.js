export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <main className="page">
      <div className="container wrap-narrow">
        <h1>Privacy Policy</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <h2>What we collect</h2>
        <p>
          This is a demonstration project. The site stores article content, comments you submit,
          and aggregate view counts in a local database. No third-party analytics or advertising
          scripts are included.
        </p>

        <h2>Comments</h2>
        <p>
          Comments are public. Any name you enter with a comment is displayed next to it. Do not
          share personal information in comments.
        </p>

        <h2>Cookies</h2>
        <p>
          A single session cookie is set when an administrator logs into the dashboard. It contains
          no personal data beyond a random session identifier and expires after seven days.
        </p>

        <h2>Your choices</h2>
        <p>
          Because this is a demo installation, deleting the database file removes every comment and
          view count. In a production deployment you would add account deletion and export tooling.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy can be directed to the site administrator.</p>
      </div>
    </main>
  );
}

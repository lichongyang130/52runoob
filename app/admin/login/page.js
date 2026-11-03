import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "../../../lib/admin-actions";
import { getCurrentUser } from "../../../lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Login" };

export default async function LoginPage({ searchParams }) {
  const user = await getCurrentUser();
  if (user) redirect("/admin");
  const sp = await searchParams;

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="logo">
          <span className="logo-mark">h</span>
          <span>
            How<span className="logo-how">compass</span>
          </span>
        </Link>
        <p className="sub">Sign in to the editorial dashboard</p>

        {sp?.error ? (
          <div className="alert alert-error">
            Wrong username or password. Please try again.
          </div>
        ) : null}

        <form action={loginAction}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              className="input"
              autoComplete="username"
              required
              defaultValue="admin"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit">
            Sign in
          </button>
        </form>

        <div
          className="alert alert-info"
          style={{ marginTop: 18, marginBottom: 0 }}
        >
          <b>Demo credentials</b>
          <br />
          Username: <code>admin</code> · Password: <code>admin123</code>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          <Link href="/">← Back to the site</Link>
        </p>
      </div>
    </div>
  );
}

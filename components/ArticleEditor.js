"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveArticleAction } from "../lib/admin-actions";
import { slugify } from "../lib/util";
import { Illustration } from "./Illustration";
import { SCENES } from "./Illustration";

const ART_OPTIONS = Object.keys(SCENES);

function emptyMethod() {
  return { title: "", steps: [""] };
}

export default function ArticleEditor({ article, categories }) {
  const router = useRouter();
  const isNew = !article;
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));
  const [summary, setSummary] = useState(article?.summary || "");
  const [intro, setIntro] = useState(article?.intro || "");
  const [categoryId, setCategoryId] = useState(
    article?.category_id || categories[0]?.id || "",
  );
  const [hero, setHero] = useState(article?.hero_image || "idea");
  const [author, setAuthor] = useState(article?.author || "wikiHow Staff");
  const [status, setStatus] = useState(article?.status || "draft");
  const [featured, setFeatured] = useState(Boolean(article?.featured));
  const [readTime, setReadTime] = useState(article?.read_time || 5);
  const [methods, setMethods] = useState(
    article?.methods?.length
      ? article.methods.map((m) => ({
          title: m.title,
          steps: m.steps.map((s) => s.text),
        }))
      : [emptyMethod()],
  );
  const [tips, setTips] = useState(
    article?.tips?.length ? article.tips.map((t) => t.body) : [""],
  );
  const [warnings, setWarnings] = useState(
    article?.warnings?.length ? article.warnings.map((t) => t.body) : [""],
  );
  const [faqs, setFaqs] = useState(
    article?.faqs?.length
      ? article.faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : [{ question: "", answer: "" }],
  );
  const [things, setThings] = useState(
    article?.things?.length ? article.things : [""],
  );
  const [saving, setSaving] = useState(false);

  const totalSteps = useMemo(
    () =>
      methods.reduce((n, m) => n + m.steps.filter((s) => s.trim()).length, 0),
    [methods],
  );

  function updateMethod(i, patch) {
    setMethods((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)),
    );
  }
  function updateStep(mi, si, value) {
    setMethods((prev) =>
      prev.map((m, idx) =>
        idx === mi
          ? { ...m, steps: m.steps.map((s, sIdx) => (sIdx === si ? value : s)) }
          : m,
      ),
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title,
      slug: slug || slugify(title),
      summary,
      intro,
      category_id: Number(categoryId) || null,
      hero_image: hero,
      author,
      status,
      featured,
      read_time: Number(readTime) || 5,
      methods: methods.map((m) => ({
        title: m.title,
        steps: m.steps.filter((s) => s.trim()),
      })),
      tips: tips.filter((t) => t.trim()),
      warnings: warnings.filter((t) => t.trim()),
      faqs: faqs.filter((f) => f.question.trim()),
      things: things.filter((t) => t.trim()),
    };
    const fd = new FormData();
    if (article?.id) fd.set("id", String(article.id));
    fd.set("payload", JSON.stringify(payload));
    try {
      await saveArticleAction(fd);
    } catch (err) {
      // redirect() inside a server action throws a control-flow signal
      if (String(err?.message || "").includes("NEXT_REDIRECT")) {
        router.push(`/admin/articles/${article?.id || ""}`);
        return;
      }
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="panel-head">
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>
            {isNew ? "New article" : `Editing: ${article.title}`}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13, margin: "4px 0 0" }}>
            {totalSteps} step{totalSteps === 1 ? "" : "s"} · {methods.length}{" "}
            method
            {methods.length === 1 ? "" : "s"} · status: {status}
          </p>
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.push("/admin/articles")}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={saving || !title.trim()}
          >
            {saving ? "Saving…" : "Save article"}
          </button>
        </div>
      </div>

      <div className="admin-form-grid">
        <div>
          <div className="editor-section">
            <h3>Article content</h3>
            <div className="field">
              <label htmlFor="title">Title (without “How to”)</label>
              <input
                id="title"
                className="input"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                placeholder="Make Pasta Carbonara"
                required
              />
              <div className="hint">
                Readers will see: “How to {title || "…"}”
              </div>
            </div>
            <div className="field">
              <label htmlFor="slug">URL slug</label>
              <input
                id="slug"
                className="input"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="Make-Pasta-Carbonara"
              />
              <div className="hint">/wikiHow/{slug || "your-slug"}</div>
            </div>
            <div className="field">
              <label htmlFor="summary">Quick summary</label>
              <textarea
                id="summary"
                className="textarea"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <div className="hint">
                Shown in the green summary box and on cards.
              </div>
            </div>
            <div className="field">
              <label htmlFor="intro">Intro paragraph</label>
              <textarea
                id="intro"
                className="textarea"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
            </div>
          </div>

          <div className="editor-section">
            <h3>
              Methods &amp; steps
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setMethods((p) => [...p, emptyMethod()])}
              >
                ➕ Add method
              </button>
            </h3>

            {methods.map((m, mi) => (
              <div className="repeat-row" key={mi}>
                <div className="row-head">
                  <span>Method {mi + 1}</span>
                  {methods.length > 1 ? (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm danger"
                      onClick={() =>
                        setMethods((p) => p.filter((_, i) => i !== mi))
                      }
                    >
                      Remove method
                    </button>
                  ) : null}
                </div>
                <div className="field">
                  <label>Method title</label>
                  <input
                    className="input"
                    value={m.title}
                    onChange={(e) =>
                      updateMethod(mi, { title: e.target.value })
                    }
                    placeholder="e.g. Classic Roman Carbonara"
                  />
                </div>
                {m.steps.map((s, si) => (
                  <div
                    key={si}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        minWidth: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "var(--green)",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        marginTop: 8,
                      }}
                    >
                      {si + 1}
                    </span>
                    <textarea
                      className="textarea"
                      style={{ minHeight: 62 }}
                      value={s}
                      onChange={(e) => updateStep(mi, si, e.target.value)}
                      placeholder="Describe one clear action…"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ marginTop: 6 }}
                      onClick={() =>
                        updateMethod(mi, {
                          steps: m.steps.filter((_, i) => i !== si),
                        })
                      }
                      title="Remove step"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => updateMethod(mi, { steps: [...m.steps, ""] })}
                >
                  ➕ Add step
                </button>
              </div>
            ))}
          </div>

          <div className="editor-section">
            <h3>Tips</h3>
            {tips.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <textarea
                  className="textarea"
                  style={{ minHeight: 56 }}
                  value={t}
                  onChange={(e) =>
                    setTips((p) =>
                      p.map((v, idx) => (idx === i ? e.target.value : v)),
                    )
                  }
                  placeholder="A helpful tip…"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    setTips((p) => p.filter((_, idx) => idx !== i))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setTips((p) => [...p, ""])}
            >
              ➕ Add tip
            </button>
          </div>

          <div className="editor-section">
            <h3>Warnings</h3>
            {warnings.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <textarea
                  className="textarea"
                  style={{ minHeight: 56 }}
                  value={t}
                  onChange={(e) =>
                    setWarnings((p) =>
                      p.map((v, idx) => (idx === i ? e.target.value : v)),
                    )
                  }
                  placeholder="Something that could go wrong…"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    setWarnings((p) => p.filter((_, idx) => idx !== i))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setWarnings((p) => [...p, ""])}
            >
              ➕ Add warning
            </button>
          </div>

          <div className="editor-section">
            <h3>FAQ</h3>
            {faqs.map((f, i) => (
              <div className="repeat-row" key={i}>
                <div className="row-head">
                  <span>Question {i + 1}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm danger"
                    onClick={() =>
                      setFaqs((p) => p.filter((_, idx) => idx !== i))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="field">
                  <input
                    className="input"
                    value={f.question}
                    onChange={(e) =>
                      setFaqs((p) =>
                        p.map((v, idx) =>
                          idx === i ? { ...v, question: e.target.value } : v,
                        ),
                      )
                    }
                    placeholder="Can I make it ahead of time?"
                  />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 56 }}
                    value={f.answer}
                    onChange={(e) =>
                      setFaqs((p) =>
                        p.map((v, idx) =>
                          idx === i ? { ...v, answer: e.target.value } : v,
                        ),
                      )
                    }
                    placeholder="Answer…"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                setFaqs((p) => [...p, { question: "", answer: "" }])
              }
            >
              ➕ Add question
            </button>
          </div>

          <div className="editor-section">
            <h3>Things You&apos;ll Need</h3>
            {things.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  className="input"
                  value={t}
                  onChange={(e) =>
                    setThings((p) =>
                      p.map((v, idx) => (idx === i ? e.target.value : v)),
                    )
                  }
                  placeholder="e.g. Large pot"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    setThings((p) => p.filter((_, idx) => idx !== i))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setThings((p) => [...p, ""])}
            >
              ➕ Add item
            </button>
          </div>
        </div>

        <aside>
          <div className="editor-section">
            <h3>Publish</h3>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (live)</option>
              </select>
            </div>
            <label
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                fontSize: 13.5,
                marginBottom: 14,
              }}
            >
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Feature on the homepage
            </label>
            <button
              className="btn btn-primary btn-block"
              disabled={saving || !title.trim()}
            >
              {saving ? "Saving…" : "Save article"}
            </button>
            {!isNew ? (
              <a
                href={`/wikiHow/${article.slug}`}
                target="_blank"
                className="btn btn-outline btn-block"
                style={{ marginTop: 9 }}
              >
                Preview on site ↗
              </a>
            ) : null}
          </div>

          <div className="editor-section">
            <h3>Details</h3>
            <div className="field">
              <label htmlFor="author">Author</label>
              <input
                id="author"
                className="input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="read">Read time (minutes)</label>
              <input
                id="read"
                type="number"
                min="1"
                max="60"
                className="input"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
              />
            </div>
          </div>

          <div className="editor-section">
            <h3>Hero illustration</h3>
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--line)",
                marginBottom: 12,
              }}
            >
              <Illustration name={hero} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <select
                className="select"
                value={hero}
                onChange={(e) => setHero(e.target.value)}
              >
                {ART_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="hint">
                Illustrations are generated as flat vector scenes, in the
                wikiHow style.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}

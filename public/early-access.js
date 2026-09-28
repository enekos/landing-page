(() => {
  const ENDPOINT = "/api/early-access";
  const APPS = [
    ["lemazain", "lemazain", "Kubernetes IDE"],
    ["taula", "Taula", "Database manager"],
    ["adar", "adar", "Pull-request client"],
  ];

  const css = `
.ea-dialog{border:0;padding:0;border-radius:18px;width:min(440px,calc(100vw - 32px));max-height:calc(100dvh - 32px);
  background:#fff;color:#15171C;box-shadow:0 30px 80px -20px rgba(21,23,28,.45),0 0 0 1px rgba(21,23,28,.06);
  font:400 15px/1.5 "Instrument Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.ea-dialog::backdrop{background:rgba(21,23,28,.38);backdrop-filter:blur(3px)}
.ea-dialog[open]{animation:ea-in .22s cubic-bezier(.2,.7,.2,1)}
@keyframes ea-in{from{opacity:0;transform:translateY(10px) scale(.98)}}
.ea-form{padding:26px 26px 22px;display:grid;gap:16px}
.ea-form[hidden]{display:none}
.ea-x{position:absolute;top:12px;right:12px;width:32px;height:32px;border:0;border-radius:8px;background:transparent;
  color:#6B7080;font-size:20px;line-height:1;cursor:pointer}
.ea-x:hover{background:#F3F4F6;color:#15171C}
.ea-h{margin:0;font:600 22px/1.2 "Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;letter-spacing:-.01em}
.ea-p{margin:4px 0 0;color:#5A5F6B}
.ea-apps{display:grid;gap:8px;border:0;margin:0;padding:0}
.ea-apps legend{font-size:13px;color:#5A5F6B;margin-bottom:6px;padding:0}
.ea-app{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #D9DCE2;border-radius:10px;cursor:pointer}
.ea-app:has(input:checked){border-color:#2A63D6;background:#F4F7FE}
.ea-app input{accent-color:#2A63D6;width:16px;height:16px;margin:0}
.ea-app b{font-weight:600}
.ea-app span{color:#6B7080;font-size:13px;margin-left:auto}
.ea-email{display:grid;gap:6px;font-size:13px;color:#5A5F6B}
.ea-email input{font:inherit;font-size:15px;color:#15171C;padding:11px 12px;border:1px solid #D9DCE2;border-radius:10px;outline:0}
.ea-email input:focus{border-color:#2A63D6;box-shadow:0 0 0 3px rgba(42,99,214,.18)}
.ea-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.ea-go{font-family:inherit;font-weight:600;font-size:15px;line-height:1;padding:13px 16px;border:0;border-radius:10px;background:#15171C;color:#fff;cursor:pointer}
.ea-go:hover{background:#000}
.ea-go[disabled]{opacity:.6;cursor:progress}
.ea-msg{margin:0;font-size:13px;min-height:1.2em;color:#5A5F6B}
.ea-msg.err{color:#C23B32}
.ea-done{padding:34px 26px 28px;text-align:center;display:grid;gap:8px}
.ea-done .ea-tick{width:44px;height:44px;margin:0 auto 6px;border-radius:50%;background:#E8F7EE;color:#2E9C5A;
  display:grid;place-items:center;font-size:22px}
@media (prefers-reduced-motion:reduce){.ea-dialog[open]{animation:none}}`;

  const ERRORS = {
    bad_email: "That email address doesn't look right.",
    no_app: "Pick at least one app.",
    slow_down: "Too many sign-ups from here. Try again in an hour.",
  };

  let dialog;

  function build() {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);

    dialog = document.createElement("dialog");
    dialog.className = "ea-dialog";
    dialog.setAttribute("aria-labelledby", "ea-h");
    dialog.innerHTML = `
      <button class="ea-x" type="button" aria-label="Close">×</button>
      <form class="ea-form" novalidate>
        <div>
          <h2 class="ea-h" id="ea-h">Request early access</h2>
          <p class="ea-p">The apps aren't on sale yet. Leave your email and you'll get one message when yours is ready. Nothing else.</p>
        </div>
        <fieldset class="ea-apps">
          <legend>Which apps?</legend>
          ${APPS.map(([slug, name, kind]) => `
          <label class="ea-app"><input type="checkbox" name="apps" value="${slug}"><b>${name}</b><span>${kind}</span></label>`).join("")}
        </fieldset>
        <label class="ea-email">Email
          <input type="email" name="email" autocomplete="email" required placeholder="you@example.com">
        </label>
        <label class="ea-hp" aria-hidden="true">Company <input type="text" name="company" tabindex="-1" autocomplete="off"></label>
        <button class="ea-go" type="submit">Request early access</button>
        <p class="ea-msg" role="status" aria-live="polite"></p>
      </form>`;
    document.body.append(dialog);

    dialog.querySelector(".ea-x").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.querySelector("form").addEventListener("submit", submit);
  }

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = form.querySelector(".ea-msg");
    const go = form.querySelector(".ea-go");
    const data = new FormData(form);
    const body = {
      email: String(data.get("email") || "").trim(),
      apps: data.getAll("apps"),
      company: data.get("company") || "",
      source: location.pathname,
    };

    msg.className = "ea-msg";
    if (!body.apps.length) return fail(msg, ERRORS.no_app);
    if (!form.email.checkValidity() || !body.email) return fail(msg, ERRORS.bad_email);

    go.disabled = true;
    msg.textContent = "Sending…";
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) return fail(msg, ERRORS[out.error] || "Something went wrong. Try again in a minute.");
      done(body);
    } catch {
      fail(msg, "Couldn't reach the server. Check your connection and try again.");
    } finally {
      go.disabled = false;
    }
  }

  function fail(msg, text) {
    msg.className = "ea-msg err";
    msg.textContent = text;
  }

  function done({ email, apps }) {
    const names = APPS.filter(([slug]) => apps.includes(slug)).map(([, name]) => name);
    const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
    const form = dialog.querySelector("form");
    form.hidden = true;
    const box = document.createElement("div");
    box.className = "ea-done";
    box.innerHTML = `<div class="ea-tick" aria-hidden="true">✓</div><h2 class="ea-h">You're on the list</h2>
      <p class="ea-p"></p><p><button class="ea-go" type="button">Close</button></p>`;
    box.querySelector(".ea-p").textContent = `We'll write to ${email} when ${list} ${names.length > 1 ? "are" : "is"} ready.`;
    box.querySelector(".ea-go").addEventListener("click", () => dialog.close());
    dialog.append(box);
    dialog.addEventListener("close", () => { box.remove(); form.hidden = false; form.reset(); }, { once: true });
  }

  function open(slug) {
    if (!dialog) build();
    if (dialog.open) return;
    const form = dialog.querySelector("form");
    form.querySelectorAll('input[name="apps"]').forEach((i) => { i.checked = i.value === slug; });
    form.querySelector(".ea-msg").textContent = "";
    dialog.showModal();
    form.email.focus();
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-early]");
    if (!trigger) return;
    e.preventDefault();
    open(trigger.dataset.early);
  });

  const wanted = new URLSearchParams(location.search).get("early");
  if (wanted !== null) {
    const go = () => open(wanted);
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go();
  }
})();

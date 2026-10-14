/* main.js — builds the page from content.js. You don't need to edit this. */

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

function link(href, label) {
  const a = el("a", { href }, label);
  if (/^https?:\/\//.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
  return a;
}

const has = (v) => typeof v === "string" && v.trim() !== "";

/* ---------- Top section ---------- */
document.title = `${SITE.name} — Portfolio`;
document.getElementById("name").textContent = SITE.name;
document.getElementById("headline").textContent = SITE.headline;
document.getElementById("intro").textContent = SITE.intro;

const linkList = document.getElementById("links");
const L = SITE.links;
[
  [L.cv, "Download CV"],
  [L.github, "GitHub"],
  [L.linkedin, "LinkedIn"],
  [has(L.email) ? `mailto:${L.email}` : "", "Email"]
].forEach(([href, label]) => {
  if (!has(href)) return;
  const li = el("li");
  li.appendChild(link(href, label));
  linkList.appendChild(li);
});

/* ---------- Projects ---------- */
const projectsBox = document.getElementById("projects");
(SITE.projects || []).forEach((p) => {
  const item = el("article", { class: "item" });
  item.appendChild(el("h3", {}, p.title));
  if (has(p.year)) item.appendChild(el("p", { class: "meta" }, p.year));
  item.appendChild(el("p", {}, p.summary));

  if (p.tags && p.tags.length) {
    const tags = el("ul", { class: "tags" });
    p.tags.forEach((t) => tags.appendChild(el("li", {}, t)));
    item.appendChild(tags);
  }

  const actions = el("div", { class: "actions" });
  if (has(p.demo)) actions.appendChild(link(p.demo, "Open live demo"));
  if (has(p.code)) actions.appendChild(link(p.code, "View code"));
  if (actions.children.length) item.appendChild(actions);

  if (has(p.note) && has(p.demo)) item.appendChild(el("p", { class: "note" }, p.note));
  projectsBox.appendChild(item);
});

/* ---------- Papers ---------- */
const papersBox = document.getElementById("papers");
const papers = SITE.papers || [];
if (!papers.length) document.getElementById("papers-section").remove();
papers.forEach((p) => {
  const item = el("article", { class: "item" });
  item.appendChild(el("h3", {}, p.title));
  const meta = [p.context, p.year].filter(has).join(", ");
  if (meta) item.appendChild(el("p", { class: "meta" }, meta));
  if (has(p.summary)) item.appendChild(el("p", {}, p.summary));
  if (has(p.pdf)) {
    const actions = el("div", { class: "actions" });
    actions.appendChild(link(p.pdf, "Read the paper (PDF)"));
    item.appendChild(actions);
  }
  papersBox.appendChild(item);
});

/* ---------- Experience ---------- */
const expBox = document.getElementById("experience");
(SITE.experience || []).forEach((x) => {
  const li = el("li");
  li.appendChild(el("h3", {}, x.role));
  li.appendChild(el("p", { class: "meta" }, [x.place, x.dates].filter(has).join(", ")));
  if (x.points && x.points.length) {
    const ul = el("ul");
    x.points.forEach((pt) => ul.appendChild(el("li", {}, pt)));
    li.appendChild(ul);
  }
  expBox.appendChild(li);
});

/* ---------- Certifications ---------- */
const certsBox = document.getElementById("certifications");
const certs = SITE.certifications || [];
if (!certs.length) document.getElementById("certifications-section").remove();
certs.forEach((c) => {
  const li = el("li");
  li.appendChild(el("h3", {}, c.title));
  const meta = [c.issuer, c.date].filter(has).join(", ");
  if (meta) li.appendChild(el("p", { class: "meta" }, meta));
  if (has(c.link)) {
    const actions = el("div", { class: "actions" });
    actions.appendChild(link(c.link, "View credential"));
    li.appendChild(actions);
  }
  certsBox.appendChild(li);
});

/* ---------- Skills ---------- */
const skillsBox = document.getElementById("skills");
(SITE.skills || []).forEach((s) => {
  skillsBox.appendChild(el("dt", {}, s.group));
  skillsBox.appendChild(el("dd", {}, s.items));
});

/* ---------- Footer ---------- */
document.getElementById("footer").textContent =
  `${SITE.name}, ${SITE.location}. Updated ${new Date(document.lastModified).getFullYear()}.`;

/* ---------- Regression plot in the header ---------- */
(function drawPlot() {
  const svg = document.getElementById("plot");
  const NS = "http://www.w3.org/2000/svg";
  const add = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.appendChild(n);
  };

  // axes
  add("line", { x1: 20, y1: 200, x2: 290, y2: 200, class: "axis" });
  add("line", { x1: 20, y1: 10, x2: 20, y2: 200, class: "axis" });

  // fixed "random" points around a line, so the picture is the same every time
  let seed = 7;
  const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pts = [];
  for (let i = 0; i < 34; i++) {
    const x = 30 + rand() * 250;
    const y = 185 - 0.55 * (x - 30) + (rand() - 0.5) * 70;
    pts.push([x, Math.max(15, Math.min(195, y))]);
  }
  pts.forEach(([x, y]) => add("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: 3.2, class: "pt" }));

  // least-squares fit line
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  const w = pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) /
            pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
  const b = my - w * mx;
  add("line", { x1: 25, y1: (w * 25 + b).toFixed(1), x2: 285, y2: (w * 285 + b).toFixed(1), class: "fit" });
})();

/*
 * Shared helpers used by every page.
 * Loaded after data.js and before the page script.
 */
"use strict";

const STORAGE_KEYS = {
  theme: "jatra-theme",
  registrations: "jatra-registrations"
};
const TIME_ZONE = "Asia/Kolkata";

/* ---------- Small utilities ---------- */

function escapeHTML(value) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (ch) => map[ch]);
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getEventById(id) {
  return EVENTS.find((ev) => ev.id === id) || null;
}

function byStartDate(a, b) {
  return new Date(a.start) - new Date(b.start);
}

/* ---------- Dates and prices ---------- */

function formatPart(iso, options) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: TIME_ZONE, ...options }).format(new Date(iso));
}

function dateParts(iso) {
  return {
    day: formatPart(iso, { day: "numeric" }),
    month: formatPart(iso, { month: "short" }),
    weekday: formatPart(iso, { weekday: "short" }),
    time: formatPart(iso, { hour: "numeric", minute: "2-digit", hour12: true })
  };
}

function shortDate(iso) {
  return formatPart(iso, { weekday: "short", day: "numeric", month: "short" });
}

function longDate(iso) {
  return formatPart(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function sameDay(a, b) {
  const opts = { year: "numeric", month: "2-digit", day: "2-digit" };
  return formatPart(a, opts) === formatPart(b, opts);
}

/* Human-readable date and time lines for an event. */
function eventWhen(ev) {
  const start = dateParts(ev.start);
  const end = dateParts(ev.end);
  if (sameDay(ev.start, ev.end)) {
    return { date: longDate(ev.start), time: `${start.time} to ${end.time}` };
  }
  return {
    date: `${shortDate(ev.start)} to ${shortDate(ev.end)} ${formatPart(ev.end, { year: "numeric" })}`,
    time: `Starts ${start.time}, ends ${end.time} on the last day`
  };
}

function formatPrice(price) {
  return price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`;
}

/* ---------- Event status ---------- */

function hasStarted(ev) {
  return new Date(ev.start).getTime() <= Date.now();
}

function hasEnded(ev) {
  return new Date(ev.end).getTime() <= Date.now();
}

/* ---------- Local Storage: registrations ---------- */

function loadRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.registrations);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (err) {
    return [];
  }
}

function saveRegistrations(list) {
  try {
    localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(list));
    return true;
  } catch (err) {
    return false;
  }
}

function seatsLeft(ev) {
  const mine = loadRegistrations().filter((r) => r.eventId === ev.id).length;
  return Math.max(ev.seats - ev.seatsTaken - mine, 0);
}

function canRegister(ev) {
  return !hasStarted(ev) && seatsLeft(ev) > 0;
}

/* ---------- Ikat artwork ----------
 * Each event gets a generated pattern inspired by Odisha's ikat weaves
 * (Sambalpuri / Bomkai). The pattern is seeded by the event id, so it
 * looks the same on every visit. An SVG displacement filter shifts each
 * line sideways a little, imitating the "feathered" edge of tie-dyed yarn.
 */

const PALETTES = {
  Tech: ["#27318C", "#F0A202", "#F3F4FA"],
  Music: ["#B23A48", "#191B3A", "#F0A202"],
  Workshop: ["#1F7A72", "#F3F4FA", "#F0A202"],
  Sports: ["#F0A202", "#27318C", "#B23A48"],
  Culture: ["#191B3A", "#B23A48", "#F0A202"],
  Food: ["#E4E6F3", "#B23A48", "#1F7A72"]
};

let ikatCounter = 0;

function seededRandom(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function diamond(x, y, r, fill) {
  const f = (n) => n.toFixed(1);
  return `<path d="M${f(x)} ${f(y - r)}L${f(x + r)} ${f(y)}L${f(x)} ${f(y + r)}L${f(x - r)} ${f(y)}Z" fill="${fill}"/>`;
}

function ikatSVG({ seed, palette, width = 500, height = 300, label = "" }) {
  const rand = seededRandom(seed);
  const [bg, outer, inner] = palette;
  const id = `ikat-${++ikatCounter}`;
  const size = [60, 76, 92][Math.floor(rand() * 3)];
  const step = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.2;

  let shapes = "";
  let row = 0;
  for (let y = -size; y <= height + size; y += step, row++) {
    const shift = row % 2 ? step : 0;
    for (let x = -size + shift; x <= width + size; x += size) {
      shapes += diamond(x, y, outerR, outer) + diamond(x, y, innerR, inner);
      if (rand() < 0.35) shapes += diamond(x, y, innerR * 0.45, bg);
    }
  }

  const a11y = label
    ? `role="img" aria-label="${escapeHTML(label)}"`
    : `aria-hidden="true" focusable="false"`;

  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" ${a11y}>
    <defs>
      <filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.45" numOctaves="1" seed="${Math.floor(rand() * 1000)}" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="shiftX"/>
        <feDisplacementMap in="SourceGraphic" in2="shiftX" scale="10" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="${bg}"/>
    <g filter="url(#${id})">${shapes}</g>
  </svg>`;
}

function eventArt(ev, options = {}) {
  return ikatSVG({ seed: ev.id, palette: PALETTES[ev.category], ...options });
}

/* ---------- Event card (ticket) ---------- */

function seatNote(ev) {
  if (hasEnded(ev)) return "";
  const left = seatsLeft(ev);
  if (left === 0) return `<span class="ticket__seats">Sold out</span>`;
  if (left <= 20) return `<span class="ticket__seats">${left} seats left</span>`;
  return "";
}

function ticketCard(ev) {
  const d = dateParts(ev.start);
  const ended = hasEnded(ev);
  return `
    <a class="ticket${ended ? " is-past" : ""}" href="event.html?id=${encodeURIComponent(ev.id)}">
      <div class="ticket__art">${eventArt(ev)}</div>
      <div class="ticket__tear" aria-hidden="true"></div>
      <div class="ticket__body">
        <div class="ticket__date">
          <span class="ticket__day">${d.day}</span>
          <span class="ticket__month">${d.month}</span>
          <span class="ticket__time">${d.weekday}<br>${d.time}</span>
        </div>
        <div class="ticket__info">
          <p class="ticket__tags">
            <span class="tag" data-cat="${ev.category}">${ev.category}</span>
            ${ended ? `<span class="tag tag--ended">Ended</span>` : ""}
          </p>
          <h3 class="ticket__title">${escapeHTML(ev.title)}</h3>
          <p class="ticket__venue">${escapeHTML(ev.venue)}, ${escapeHTML(ev.area)}</p>
          <p class="ticket__summary">${escapeHTML(ev.summary)}</p>
          <p class="ticket__foot">
            <span>${formatPrice(ev.price)}</span>
            ${seatNote(ev)}
          </p>
        </div>
      </div>
    </a>`;
}

/* ---------- Countdown timer ---------- */

function mountCountdown(container, ev) {
  if (!container) return;
  const start = new Date(ev.start).getTime();
  const end = new Date(ev.end).getTime();
  const units = ["days", "hours", "minutes", "seconds"];
  let timer = null;

  container.innerHTML = `
    <div class="countdown" role="timer" aria-label="Time until ${escapeHTML(ev.title)} starts">
      ${units
        .map(
          (u) => `<span class="countdown__unit">
            <span class="countdown__num" data-unit="${u}">00</span>
            <span class="countdown__label">${u}</span>
          </span>`
        )
        .join("")}
    </div>`;

  const nums = {};
  units.forEach((u) => (nums[u] = container.querySelector(`[data-unit="${u}"]`)));

  function stop(message, modifier) {
    if (timer) clearInterval(timer);
    container.innerHTML = `<p class="countdown-note ${modifier}">${message}</p>`;
    return false;
  }

  function tick() {
    const now = Date.now();
    if (now >= end) return stop("This event has ended.", "");
    if (now >= start) return stop("Happening now", "countdown-note--live");

    let secs = Math.floor((start - now) / 1000);
    const days = Math.floor(secs / 86400);
    secs -= days * 86400;
    const hours = Math.floor(secs / 3600);
    secs -= hours * 3600;
    const minutes = Math.floor(secs / 60);
    const seconds = secs - minutes * 60;

    nums.days.textContent = String(days);
    nums.hours.textContent = String(hours).padStart(2, "0");
    nums.minutes.textContent = String(minutes).padStart(2, "0");
    nums.seconds.textContent = String(seconds).padStart(2, "0");
    return true;
  }

  if (tick()) timer = setInterval(tick, 1000);
}

/* ---------- Light / dark theme ---------- */

function currentTheme() {
  const set = document.documentElement.dataset.theme;
  if (set) return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function initThemeToggle() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  const sync = () => {
    const dark = currentTheme() === "dark";
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    button.title = dark ? "Switch to light mode" : "Switch to dark mode";
  };

  button.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEYS.theme, next);
    } catch (err) {
      /* Storage blocked: the theme still changes for this visit. */
    }
    sync();
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", sync);
  sync();
}

/* ---------- Page chrome ---------- */

function markCurrentNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    const target = link.getAttribute("href").split("#")[0];
    if (target === page && !link.getAttribute("href").includes("#")) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function renderBands() {
  document.querySelectorAll("[data-ikat-band]").forEach((el) => {
    el.innerHTML = ikatSVG({
      seed: el.dataset.ikatBand,
      palette: ["#27318C", "#F0A202", "#B23A48"],
      width: 1600,
      height: 80
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  markCurrentNav();
  renderBands();
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});

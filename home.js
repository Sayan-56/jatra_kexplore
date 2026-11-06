/* Homepage: next-up ticket, featured events, search, filters and sorting. */
"use strict";

(function () {
  const state = {
    query: "",
    category: "All",
    sort: "soonest",
    showPast: false
  };

  const els = {
    nextUp: document.getElementById("next-up"),
    featured: document.getElementById("featured-grid"),
    grid: document.getElementById("event-grid"),
    chips: document.getElementById("category-chips"),
    search: document.getElementById("event-search"),
    sort: document.getElementById("event-sort"),
    past: document.getElementById("show-past"),
    count: document.getElementById("results-count"),
    empty: document.getElementById("empty-state"),
    emptyMessage: document.getElementById("empty-message"),
    clear: document.getElementById("clear-filters")
  };

  /* ---------- URL <-> state, so filtered views can be shared ---------- */

  function readStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    state.query = params.get("q") || "";
    const cat = params.get("category");
    state.category = CATEGORIES.includes(cat) ? cat : "All";
    const sort = params.get("sort");
    state.sort = ["soonest", "price", "name"].includes(sort) ? sort : "soonest";
    state.showPast = params.get("past") === "1";
  }

  function writeStateToURL() {
    const params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.category !== "All") params.set("category", state.category);
    if (state.sort !== "soonest") params.set("sort", state.sort);
    if (state.showPast) params.set("past", "1");
    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    history.replaceState(null, "", url);
  }

  function syncControls() {
    els.search.value = state.query;
    els.sort.value = state.sort;
    els.past.checked = state.showPast;
  }

  /* ---------- Hero: next upcoming event ---------- */

  function renderNextUp() {
    const next = EVENTS.filter((ev) => !hasStarted(ev)).sort(byStartDate)[0];
    if (!next) {
      els.nextUp.innerHTML = `<div class="next-up"><div class="next-up__body">
        <p class="next-up__label">Nothing scheduled yet</p>
        <p class="next-up__when">New events are added every week.</p></div></div>`;
      return;
    }
    const when = eventWhen(next);
    els.nextUp.innerHTML = `
      <article class="next-up" aria-labelledby="next-up-title">
        <div class="next-up__art">${eventArt(next, { width: 500, height: 150 })}</div>
        <div class="ticket__tear" aria-hidden="true"></div>
        <div class="next-up__body">
          <p class="next-up__label">Next up</p>
          <h2 class="next-up__title" id="next-up-title">
            <a href="event.html?id=${encodeURIComponent(next.id)}">${escapeHTML(next.title)}</a>
          </h2>
          <p class="next-up__when">${when.date}<br>${escapeHTML(next.venue)}, ${escapeHTML(next.area)}</p>
          <div data-countdown></div>
          <a class="btn btn--primary btn--block" href="register.html?event=${encodeURIComponent(next.id)}">Register for this event</a>
        </div>
      </article>`;
    mountCountdown(els.nextUp.querySelector("[data-countdown]"), next);
  }

  /* ---------- Featured ---------- */

  function renderFeatured() {
    const featured = EVENTS.filter((ev) => ev.featured && !hasEnded(ev)).sort(byStartDate);
    els.featured.innerHTML = featured.map((ev) => `<li>${ticketCard(ev)}</li>`).join("");
  }

  /* ---------- Filtering ---------- */

  function matchesQuery(ev) {
    if (!state.query.trim()) return true;
    const haystack = [ev.title, ev.summary, ev.venue, ev.area, ev.category, ev.price === 0 ? "free" : ""]
      .join(" ")
      .toLowerCase();
    return state.query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((word) => haystack.includes(word));
  }

  function visibleByTime(ev) {
    return state.showPast || !hasEnded(ev);
  }

  function getFilteredEvents() {
    const list = EVENTS.filter(
      (ev) => visibleByTime(ev) && matchesQuery(ev) && (state.category === "All" || ev.category === state.category)
    );

    const sorters = {
      soonest: byStartDate,
      price: (a, b) => a.price - b.price || byStartDate(a, b),
      name: (a, b) => a.title.localeCompare(b.title)
    };
    list.sort(sorters[state.sort]);

    // Past events always go to the end of the list.
    return list.sort((a, b) => Number(hasEnded(a)) - Number(hasEnded(b)));
  }

  function renderChips() {
    const pool = EVENTS.filter((ev) => visibleByTime(ev) && matchesQuery(ev));
    const options = ["All", ...CATEGORIES];
    els.chips.innerHTML = options
      .map((cat) => {
        const count = cat === "All" ? pool.length : pool.filter((ev) => ev.category === cat).length;
        const pressed = state.category === cat;
        return `<li><button class="chip" type="button" data-category="${cat}" aria-pressed="${pressed}">
          ${cat}<span class="chip__count">${count}</span>
        </button></li>`;
      })
      .join("");
  }

  function renderEvents(animate) {
    const list = getFilteredEvents();

    els.grid.innerHTML = list
      .map((ev, i) => `<li style="--i:${Math.min(i, 8)}">${ticketCard(ev)}</li>`)
      .join("");

    if (animate) {
      els.grid.classList.remove("is-updating");
      void els.grid.offsetWidth; // restart the entrance animation
      els.grid.classList.add("is-updating");
    }

    const noun = list.length === 1 ? "event" : "events";
    els.count.textContent = `Showing ${list.length} ${noun}${state.category !== "All" ? ` in ${state.category}` : ""}`;

    els.empty.hidden = list.length > 0;
    if (!list.length) {
      const where = state.category !== "All" ? ` in ${state.category}` : "";
      els.emptyMessage.textContent = state.query
        ? `No events match \u201C${state.query.trim()}\u201D${where}.`
        : `No upcoming events${where} right now.`;
    }
  }

  function update(animate = true) {
    // Chips are re-rendered, so remember which one had keyboard focus.
    const focusedChip = document.activeElement && document.activeElement.closest(".chip");
    const focusedCategory = focusedChip ? focusedChip.dataset.category : null;

    renderChips();
    if (focusedCategory) {
      const chip = els.chips.querySelector(`[data-category="${focusedCategory}"]`);
      if (chip) chip.focus();
    }
    renderEvents(animate);
    writeStateToURL();
  }

  /* ---------- Events ---------- */

  let searchTimer = null;
  els.search.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = els.search.value;
      update();
    }, 180);
  });

  els.sort.addEventListener("change", () => {
    state.sort = els.sort.value;
    update();
  });

  els.past.addEventListener("change", () => {
    state.showPast = els.past.checked;
    update();
  });

  els.chips.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    state.category = chip.dataset.category;
    update();
  });

  els.clear.addEventListener("click", () => {
    state.query = "";
    state.category = "All";
    syncControls();
    update();
    els.search.focus();
  });

  /* ---------- Start ---------- */

  readStateFromURL();
  syncControls();
  renderNextUp();
  renderFeatured();
  update(false);
})();

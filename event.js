/* Event detail page: reads ?id= from the URL and renders that event. */
"use strict";

(function () {
  const root = document.getElementById("event-root");
  const id = getParam("id");
  const ev = id ? getEventById(id) : null;

  if (!ev) {
    document.title = "Event not found | Jatra";
    root.innerHTML = `
      <section class="container not-found">
        <h1>We couldn&rsquo;t find that event</h1>
        <p>The link may be mistyped, or the event may have been removed.</p>
        <a class="btn btn--primary" href="index.html#events">See all events</a>
      </section>`;
    return;
  }

  document.title = `${ev.title} | Jatra`;

  const when = eventWhen(ev);
  const left = seatsLeft(ev);
  const ended = hasEnded(ev);
  const started = hasStarted(ev);

  let seatsText = `${left} of ${ev.seats.toLocaleString("en-IN")} left`;
  if (ended || started) seatsText = "Registration closed";
  else if (left === 0) seatsText = "Sold out";

  let action;
  if (ended) {
    action = `<p class="booking__status">This event has ended.</p>`;
  } else if (started) {
    action = `<p class="booking__status">Registration closed when the event started.</p>`;
  } else if (left === 0) {
    action = `<p class="booking__status">This event is sold out.</p>`;
  } else {
    action = `<a class="btn btn--primary btn--block" href="register.html?event=${encodeURIComponent(ev.id)}">Register for this event</a>`;
  }

  const schedule = ev.schedule
    .map(([time, item]) => `<li><span class="schedule__time">${escapeHTML(time)}</span><span>${escapeHTML(item)}</span></li>`)
    .join("");

  const related = EVENTS.filter((e) => e.category === ev.category && e.id !== ev.id && !hasEnded(e))
    .sort(byStartDate)
    .slice(0, 3);

  root.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html#events">All events</a>
        <span aria-hidden="true">/</span>
        <a href="index.html?category=${encodeURIComponent(ev.category)}#events">${ev.category}</a>
      </nav>

      <div class="detail-banner">
        ${eventArt(ev, { width: 1200, height: 360 })}
      </div>

      <div class="detail-grid">
        <article>
          <span class="tag" data-cat="${ev.category}">${ev.category}</span>
          <h1 class="detail-title">${escapeHTML(ev.title)}</h1>
          <p class="detail-lede">${escapeHTML(ev.summary)}</p>

          <div class="prose">
            ${ev.about.map((p) => `<p>${escapeHTML(p)}</p>`).join("")}
          </div>

          <h2 class="detail-subtitle">Schedule</h2>
          <ol class="schedule">${schedule}</ol>
        </article>

        <aside class="booking" aria-label="Date, venue and registration">
          <dl class="facts">
            <div><dt>Date</dt><dd>${when.date}</dd></div>
            <div><dt>Time</dt><dd>${when.time}</dd></div>
            <div><dt>Venue</dt><dd>${escapeHTML(ev.venue)}<br><span class="muted">${escapeHTML(ev.area)}, Bhubaneswar</span></dd></div>
            <div><dt>Entry</dt><dd>${formatPrice(ev.price)}</dd></div>
            <div><dt>Seats</dt><dd>${seatsText}</dd></div>
            <div><dt>Host</dt><dd>${escapeHTML(ev.organizer)}</dd></div>
          </dl>
          <div data-countdown></div>
          ${action}
        </aside>
      </div>

      ${
        related.length
          ? `<section class="section" aria-labelledby="related-title">
              <div class="section__head">
                <h2 class="section__title" id="related-title">More ${ev.category.toLowerCase()} events</h2>
              </div>
              <ul class="event-grid">${related.map((e) => `<li>${ticketCard(e)}</li>`).join("")}</ul>
            </section>`
          : ""
      }
    </div>`;

  mountCountdown(root.querySelector("[data-countdown]"), ev);
})();

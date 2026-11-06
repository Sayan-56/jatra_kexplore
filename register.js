/* Registration page: form validation, confirmation and "My registrations". */
"use strict";

(function () {
  const form = document.getElementById("register-form");
  const formCard = document.getElementById("form-card");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const confirmation = document.getElementById("confirmation");
  const preview = document.getElementById("reg-event-preview");
  const regList = document.getElementById("reg-list");
  const regsStatus = document.getElementById("regs-status");
  const clearAll = document.getElementById("clear-all");

  const inputs = {
    name: form.elements.name,
    email: form.elements.email,
    phone: form.elements.phone,
    event: form.elements.event
  };
  const FIELD_ORDER = ["name", "email", "phone", "event"];
  const touched = new Set();

  /* ---------- Validation rules ---------- */

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const NAME_PATTERN = /^[\p{L}][\p{L} .'-]*$/u;

  function cleanName(value) {
    return value.trim().replace(/\s+/g, " ");
  }

  // Accepts "98765 43210", "+91 98765-43210", "09876543210" and returns 10 digits.
  function normalisePhone(value) {
    let digits = value.replace(/[\s()-]/g, "");
    if (digits.startsWith("+91")) digits = digits.slice(3);
    else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    return digits;
  }

  const validators = {
    name(value) {
      const name = cleanName(value);
      if (!name) return "Enter your full name.";
      if (name.length < 2) return "Name must be at least 2 characters.";
      if (name.length > 60) return "Name must be 60 characters or fewer.";
      if (!NAME_PATTERN.test(name)) return "Use letters, spaces, dots, apostrophes or hyphens only.";
      return "";
    },
    email(value) {
      const email = value.trim();
      if (!email) return "Enter your email address.";
      if (!EMAIL_PATTERN.test(email)) return "Enter an email address like name@example.com.";
      return "";
    },
    phone(value) {
      if (!value.trim()) return "Enter your phone number.";
      if (!/^[6-9]\d{9}$/.test(normalisePhone(value))) {
        return "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.";
      }
      return "";
    },
    event(value) {
      if (!value) return "Choose an event to register for.";
      const ev = getEventById(value);
      if (!ev) return "Choose an event from the list.";
      if (hasStarted(ev)) return "Registration for this event has closed. Choose another one.";
      if (seatsLeft(ev) === 0) return "This event is sold out. Choose another one.";
      return "";
    }
  };

  function setFieldState(name, message) {
    const input = inputs[name];
    const error = document.getElementById(`reg-${name}-error`);
    error.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    input.classList.toggle("is-valid", !message && input.value.trim() !== "");
  }

  function validateField(name) {
    const message = validators[name](inputs[name].value);
    setFieldState(name, message);
    return message;
  }

  function clearFieldStates() {
    FIELD_ORDER.forEach((name) => {
      const input = inputs[name];
      input.removeAttribute("aria-invalid");
      input.classList.remove("is-valid");
      document.getElementById(`reg-${name}-error`).textContent = "";
    });
    touched.clear();
  }

  // Pressing the submit button blurs the current field first. If that blur
  // showed an error, the layout would shift and the click could miss the
  // button, so blur validation is skipped while the button is being pressed.
  let pressingSubmit = false;
  submitBtn.addEventListener("pointerdown", () => {
    pressingSubmit = true;
  });
  document.addEventListener("pointerup", () => {
    setTimeout(() => (pressingSubmit = false), 0);
  });

  // Validate when a field loses focus, then live while the user fixes it.
  FIELD_ORDER.forEach((name) => {
    const input = inputs[name];
    input.addEventListener("blur", () => {
      if (pressingSubmit) return;
      if (input.value.trim() !== "" || touched.has(name)) {
        touched.add(name);
        validateField(name);
      }
    });
    input.addEventListener(name === "event" ? "change" : "input", () => {
      if (touched.has(name)) validateField(name);
    });
  });

  /* ---------- Event dropdown ---------- */

  function populateEvents(selectedId) {
    const upcoming = EVENTS.filter((ev) => !hasStarted(ev)).sort(byStartDate);
    inputs.event.innerHTML =
      `<option value="">Choose an event</option>` +
      upcoming
        .map((ev) => {
          const soldOut = seatsLeft(ev) === 0;
          return `<option value="${ev.id}"${soldOut ? " disabled" : ""}>${escapeHTML(ev.title)} (${shortDate(ev.start)})${soldOut ? ", sold out" : ""}</option>`;
        })
        .join("");

    const option = selectedId && inputs.event.querySelector(`option[value="${CSS.escape(selectedId)}"]`);
    if (option && !option.disabled) inputs.event.value = selectedId;
    updatePreview();
  }

  function updatePreview() {
    const ev = getEventById(inputs.event.value);
    if (!ev) {
      preview.innerHTML = "";
      return;
    }
    const when = eventWhen(ev);
    const left = seatsLeft(ev);
    preview.innerHTML = `${when.date}, ${when.time}<br>${escapeHTML(ev.venue)}, ${escapeHTML(ev.area)}<br>
      <strong>${formatPrice(ev.price)}</strong>, ${left} ${left === 1 ? "seat" : "seats"} left`;
  }

  inputs.event.addEventListener("change", updatePreview);

  /* ---------- Submit ---------- */

  function makeRegistrationId() {
    const stamp = Date.now().toString(36).toUpperCase().slice(-5);
    const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
    return `JTR-${stamp}${rand}`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    FIELD_ORDER.forEach((name) => touched.add(name));
    const invalid = FIELD_ORDER.filter((name) => validateField(name));

    // Same email cannot register twice for the same event.
    if (!invalid.length) {
      const email = inputs.email.value.trim().toLowerCase();
      const eventId = inputs.event.value;
      const duplicate = loadRegistrations().some((r) => r.eventId === eventId && r.email === email);
      if (duplicate) {
        setFieldState("email", `This email is already registered for ${getEventById(eventId).title}.`);
        invalid.push("email");
      }
    }

    if (invalid.length) {
      formStatus.textContent =
        invalid.length === 1 ? "Fix the highlighted field to continue." : `Fix the ${invalid.length} highlighted fields to continue.`;
      inputs[invalid[0]].focus();
      return;
    }

    const ev = getEventById(inputs.event.value);
    const registration = {
      id: makeRegistrationId(),
      eventId: ev.id,
      name: cleanName(inputs.name.value),
      email: inputs.email.value.trim().toLowerCase(),
      phone: normalisePhone(inputs.phone.value),
      createdAt: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering\u2026";

    // A short pause so the button state is visible, like a real request.
    setTimeout(() => {
      const list = loadRegistrations();
      list.push(registration);
      const saved = saveRegistrations(list);

      submitBtn.disabled = false;
      submitBtn.textContent = "Register";

      if (!saved) {
        formStatus.textContent =
          "Your browser blocked saving to Local Storage, so this registration wasn't kept. Turn off private browsing and try again.";
        return;
      }
      showConfirmation(registration, ev);
      renderRegistrations();
    }, 500);
  });

  /* ---------- Confirmation ---------- */

  function showConfirmation(reg, ev) {
    const when = eventWhen(ev);
    confirmation.innerHTML = `
      <div class="confirm__ticket">
        <div class="confirm__art">${eventArt(ev, { width: 500, height: 110 })}</div>
        <div class="ticket__tear" aria-hidden="true"></div>
        <div class="confirm__body">
          <h2 class="confirm__title">
            <span class="confirm__check" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            </span>
            You&rsquo;re registered
          </h2>
          <p class="confirm__lede">Your seat for <strong>${escapeHTML(ev.title)}</strong> is saved. Show your registration ID at the entry desk.</p>
          <dl class="facts">
            <div><dt>ID</dt><dd class="confirm__id">${reg.id}</dd></div>
            <div><dt>Name</dt><dd>${escapeHTML(reg.name)}</dd></div>
            <div><dt>Email</dt><dd>${escapeHTML(reg.email)}</dd></div>
            <div><dt>Phone</dt><dd>+91 ${reg.phone.slice(0, 5)} ${reg.phone.slice(5)}</dd></div>
            <div><dt>Date</dt><dd>${when.date}<br><span class="muted">${when.time}</span></dd></div>
            <div><dt>Venue</dt><dd>${escapeHTML(ev.venue)}, ${escapeHTML(ev.area)}</dd></div>
          </dl>
        </div>
      </div>
      <div class="confirm__actions">
        <a class="btn btn--primary" href="event.html?id=${encodeURIComponent(ev.id)}">View event</a>
        <button class="btn btn--ghost" type="button" data-action="register-another">Register for another event</button>
      </div>`;

    formCard.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
    confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  confirmation.addEventListener("click", (event) => {
    if (!event.target.closest('[data-action="register-another"]')) return;
    form.reset();
    clearFieldStates();
    formStatus.className = "form-status";
    formStatus.textContent = "";
    populateEvents(null);
    confirmation.hidden = true;
    confirmation.innerHTML = "";
    formCard.hidden = false;
    inputs.name.focus();
  });

  /* ---------- My registrations (Local Storage) ---------- */

  function renderRegistrations() {
    const list = loadRegistrations()
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    clearAll.hidden = list.length < 2;

    if (!list.length) {
      regList.innerHTML = `<p class="empty-note">No registrations yet. Pick an event and your tickets will show up here.</p>`;
      return;
    }

    regList.innerHTML = `<ul class="reg-list">${list
      .map((reg) => {
        const ev = getEventById(reg.eventId);
        if (!ev) {
          return `<li class="reg-item is-past">
            <div><h3 class="reg-item__title">Event no longer listed</h3>
            <p class="reg-item__meta">Registration ${reg.id}</p></div>
            <button class="btn btn--ghost btn--small" type="button" data-cancel="${reg.id}">Remove</button>
          </li>`;
        }
        const ended = hasEnded(ev);
        return `<li class="reg-item${ended ? " is-past" : ""}">
          <div>
            <h3 class="reg-item__title"><a href="event.html?id=${encodeURIComponent(ev.id)}">${escapeHTML(ev.title)}</a></h3>
            <p class="reg-item__meta">${shortDate(ev.start)}, ${dateParts(ev.start).time}. ${escapeHTML(ev.venue)}</p>
            <p class="reg-item__meta">${escapeHTML(reg.name)}, ID ${reg.id}${ended ? ". Event ended" : ""}</p>
          </div>
          <button class="btn btn--ghost btn--small" type="button" data-cancel="${reg.id}"
            aria-label="${ended ? "Remove" : "Cancel"} registration for ${escapeHTML(ev.title)}">${ended ? "Remove" : "Cancel"}</button>
        </li>`;
      })
      .join("")}</ul>`;
  }

  regList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cancel]");
    if (!button) return;
    const reg = loadRegistrations().find((r) => r.id === button.dataset.cancel);
    if (!reg) return;
    const ev = getEventById(reg.eventId);
    const title = ev ? ev.title : "this event";
    if (!window.confirm(`Cancel your registration for ${title}?`)) return;

    saveRegistrations(loadRegistrations().filter((r) => r.id !== reg.id));
    renderRegistrations();
    populateEvents(inputs.event.value);
    regsStatus.textContent = `Registration for ${title} cancelled.`;
  });

  clearAll.addEventListener("click", () => {
    if (!window.confirm("Cancel all of your registrations? This can't be undone.")) return;
    saveRegistrations([]);
    renderRegistrations();
    populateEvents(inputs.event.value);
    regsStatus.textContent = "All registrations cancelled.";
  });

  // Keep the list in sync if registrations change in another tab.
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.registrations) {
      renderRegistrations();
      populateEvents(inputs.event.value);
    }
  });

  /* ---------- Start ---------- */

  const requestedId = getParam("event");
  populateEvents(requestedId);

  if (requestedId) {
    const requested = getEventById(requestedId);
    if (!requested) {
      formStatus.className = "form-status form-status--info";
      formStatus.textContent = "That event isn't listed any more. Choose another one below.";
    } else if (!canRegister(requested)) {
      formStatus.className = "form-status form-status--info";
      formStatus.textContent = hasStarted(requested)
        ? `Registration for ${requested.title} has closed. Choose another event below.`
        : `${requested.title} is sold out. Choose another event below.`;
    }
  }

  renderRegistrations();
})();

# Jatra: Event Management Website

Jatra is a responsive event management website for discovering events around Bhubaneswar. Visitors can browse upcoming and featured events, search and filter them by category, open a detail page for each event, and register through a validated form. Registrations are saved in the browser with Local Storage and can be viewed or cancelled later.

Built for **K Explore: Web Designing** using HTML5, CSS3 and vanilla JavaScript.

- **Live site:** https://jatraevents.vercel.app/index.html
- **Repository:** _add your GitHub link here_

> All events on the site are fictional and made up for this project.

---

## Features

### Core requirements

| Requirement | How it is implemented |
| --- | --- |
| Hero section | Large headline with a live "Next up" ticket showing the nearest upcoming event |
| Upcoming and featured events | A "Featured this season" row and an "All events" grid |
| Event cards | Each card shows the name, date, time, venue, artwork, short description, price and seats left |
| Search | Live search across title, description, venue, area and category (debounced) |
| Category filter | Chip buttons with live counts for Tech, Music, Workshop, Sports, Culture and Food |
| Event details | `event.html?id=...` shows the full description, schedule, venue, price, seats and host |
| Registration form | Name, email, phone and event, with JavaScript validation |
| Confirmation message | A confirmation ticket with a registration ID appears after a successful submit |
| Responsive design | Works on phones (360px and up), tablets and desktops |

### Bonus challenges

- **Dark and light mode:** follows the system setting by default; the toggle choice is saved in Local Storage and applied before the page paints, so there is no flash.
- **Countdown timers:** live days, hours, minutes and seconds on the homepage and every event page. Switches to "Happening now" or "This event has ended" automatically.
- **Animations:** the hero ticket slides in on load, filtered cards fade in, and the confirmation ticket appears with a short animation. All motion is turned off for users who set "reduce motion" on their device.
- **Local Storage registration management:** registrations are stored in the browser, shown under "My registrations", and can be cancelled one by one or all at once. Seat counts update when you register or cancel, and the list stays in sync across browser tabs.

### Extra touches

- Event artwork is generated in code as SVG ikat patterns (inspired by Odisha's Sambalpuri and Bomkai weaves), so the site has no image files to load or break.
- Search, category and sort are kept in the URL (for example `index.html?category=Music`), so a filtered view can be shared.
- Past events are hidden by default and can be shown with "Include past events".
- The same email cannot register twice for the same event.
- Accessibility: semantic HTML, skip link, labelled form fields, error messages linked with `aria-describedby`, visible keyboard focus, and `aria-live` announcements for result counts.

---

## Tech stack

- **HTML5** for structure, with semantic elements (`header`, `main`, `nav`, `article`, `aside`, `section`, `footer`)
- **CSS3** with custom properties (design tokens), Flexbox, Grid, `clamp()` for fluid type, media queries and keyframe animations
- **JavaScript (ES6+)** with no frameworks or libraries
- **Google Fonts:** Bricolage Grotesque (headings) and Atkinson Hyperlegible (body)
- **Git and GitHub** for version control

---

## Project structure

```
jatra-events/
├── index.html      Homepage: hero, featured events, search, filters, all events
├── event.html      Event detail page (reads ?id= from the URL)
├── register.html   Registration form and "My registrations"
├── style.css       All styles, design tokens, light/dark themes, breakpoints
├── data.js         Event data and category list
├── common.js       Shared helpers: dates, storage, artwork, cards, countdown, theme
├── home.js         Homepage logic: next-up ticket, search, filter, sort
├── event.js        Detail page rendering
├── register.js     Form validation, confirmation, registration management
├── favicon.svg
└── README.md
```

Scripts are plain `<script>` tags loaded in order (`data.js`, then `common.js`, then the page script), so the site also works when `index.html` is opened directly from the file system.

---

## How it works

### Event data

Events live in `data.js` as an array of objects:

```js
{
  id: "odissi-evening",
  title: "An Evening of Odissi",
  category: "Culture",
  start: "2026-12-12T18:00:00+05:30",
  end: "2026-12-12T20:30:00+05:30",
  venue: "Rabindra Mandap",
  area: "Sachivalaya Marg",
  price: 0,
  seats: 600,
  seatsTaken: 402,
  featured: true,
  organizer: "Kalinga Nritya Sangha",
  summary: "...",
  about: ["...", "..."],
  schedule: [["6:00 pm", "Doors open"], ...]
}
```

To add an event, add another object to the array. Cards, filters, counts, the detail page and the registration dropdown all pick it up automatically.

### Search, filter and sort (`home.js`)

The page keeps a small `state` object (`query`, `category`, `sort`, `showPast`). Every change calls `update()`, which filters `EVENTS`, sorts the result, re-renders the grid and chips, and writes the state to the URL with `history.replaceState`. Search input is debounced by 180ms so the grid doesn't re-render on every keystroke.

### Form validation (`register.js`)

The form uses `novalidate` so all validation is done in JavaScript:

| Field | Rule |
| --- | --- |
| Name | Required, 2 to 60 characters, letters, spaces, dots, apostrophes and hyphens only |
| Email | Required, must match `name@domain.tld` |
| Phone | Required, 10-digit Indian mobile number starting with 6 to 9. Spaces, dashes, `+91` and a leading `0` are accepted and stripped |
| Event | Required, must not have started and must have seats left |

Fields are checked when they lose focus and then live as the user corrects them. On submit, every field is checked, an error summary appears, and focus moves to the first invalid field. A duplicate check stops the same email registering twice for the same event.

### Local Storage

| Key | Value |
| --- | --- |
| `jatra-registrations` | Array of `{ id, eventId, name, email, phone, createdAt }` |
| `jatra-theme` | `"light"` or `"dark"` |

All reads and writes are wrapped in `try/catch`, so the site still works (without saving) if storage is blocked, for example in some private browsing modes.

### Countdown

`mountCountdown()` in `common.js` updates once per second with `setInterval`, and clears the interval once the event starts or ends.

### Responsive breakpoints

| Width | Layout |
| --- | --- |
| Above 960px | Two-column hero, sticky booking panel on event pages, form and registrations side by side |
| 600px to 960px | Single column; event grid wraps to two columns where it fits |
| Below 600px | Single column cards, scrollable category chips, header nav on its own row |

The event grid uses `repeat(auto-fill, minmax(min(100%, 290px), 1fr))`, so the number of columns adjusts without extra media queries.

---

## Run it locally

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/jatra-events.git
   cd jatra-events
   ```
2. Open `index.html` in a browser, or run a local server:
   ```bash
   # Python
   python -m http.server 8000
   # or VS Code: right-click index.html and choose "Open with Live Server"
   ```
3. Visit `http://localhost:8000`.

---

## Deployment

### GitHub Pages

1. Push the project to a GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a branch**, choose `main` and `/ (root)`, then save.
4. The site goes live at `https://<your-username>.github.io/jatra-events/` within a minute or two.

### Netlify

1. Sign in at netlify.com and choose **Add new site → Import an existing project**.
2. Pick the GitHub repository. Leave the build command empty and set the publish directory to `/`.
3. Deploy.

### Vercel

1. Sign in at vercel.com and choose **Add New → Project**.
2. Import the GitHub repository. Set the framework preset to **Other** and leave the build command empty.
3. Deploy.

---

## Git workflow used

```bash
git init
git add .
git commit -m "Set up project structure and base styles"
git branch -M main
git remote add origin https://github.com/<your-username>/jatra-events.git
git push -u origin main
```

Suggested commit history while building:

```
Set up project structure and base styles
Add event data and ticket card component
Build homepage hero and featured events
Add search, category filter and sorting
Add event detail page with schedule and countdown
Add registration form with JavaScript validation
Save registrations to Local Storage and add My registrations
Add dark and light mode
Make layout responsive for mobile and tablet
Write README and deploy
```

---

## Testing checklist

- [ ] Search for "Odissi", "Patia" and "free" and check the results
- [ ] Click each category chip and check the counts
- [ ] Tick "Include past events" and confirm the ended event appears greyed out at the end
- [ ] Open an event, check the countdown ticks, then click Register
- [ ] Submit the empty form and confirm every field shows an error
- [ ] Try an invalid email (`abc@x`) and phone (`12345`)
- [ ] Register successfully and check the confirmation and "My registrations"
- [ ] Register the same email for the same event again and confirm it is blocked
- [ ] Cancel a registration and confirm the seat count goes back up
- [ ] Toggle dark mode, reload, and confirm it is remembered
- [ ] Check the layout at 360px, 768px and 1280px in DevTools device mode

---

## Author

**Sayan Ghosh**
Roll no. 24051128, Section CSE-44

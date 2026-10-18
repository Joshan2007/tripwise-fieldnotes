# TripWise — Field Notes

**A little curiosity. A great escape.**

Frontend Development submission for the AWS Student Builder Group, VIT Chennai recruitment task.

TripWise turns travel inspiration into a personal plan. Discover a curated shortlist of destinations with live place information, read the story behind each place, and collect your favorites into a day-by-day itinerary that survives refresh.

![TripWise desktop experience](screenshots/01-explore-desktop.png)

**Track:** Frontend Development · **Stack:** HTML, CSS, JavaScript · **Product backend:** None · **Persistence:** Browser localStorage

**Deployment status:** Source published to GitHub. The website has not been deployed yet; deployment is intentionally deferred until the design is approved. A publicly accessible live link is still required before the final recruitment submission.

## The experience

1. **Explore** — browse destination postcards, search by place or country, combine travel-style and region filters, and choose a useful sort order.
2. **Look closer** — open a destination to read its description, see its location and suggested visit length, view its source and map, and collect it.
3. **Make it yours** — name your trip, choose dates and days, move places between days, reorder stops, and leave personal notes.
4. **Keep the plan** — return after refresh, export your itinerary as a text file, or use the browser print dialog to save a trip PDF.

## Run locally

Requires Node.js 20 or newer. No package installation, API key, database, or backend service is required.

```sh
npm start
```

Open http://127.0.0.1:4173. Serve the app over HTTP; do not double-click index.html because browser module loading requires a server.

```sh
npm run check
node tests/check.mjs
```

## Mandatory frontend features

- **Destination exploration:** 12 place records enriched at runtime through the real Wikipedia MediaWiki Action API. Cards display photos, destination names, country, category and extracted text.
- **Search:** case-insensitive matching across destination name, country, travel style and editorial tagline.
- **Filters:** combine continent and six travel styles. Filters work together with search.
- **Sorting:** editorial order, name A-Z, name Z-A, and suggested visit length.
- **Details:** accessible native dialog with live description, location, travel style, suggested duration, source article, photo credit/license link, map link when coordinates exist, and collect action.
- **Itinerary:** add, view and remove destinations; duplicate prevention; browser localStorage persistence across refresh.
- **Responsive experience:** desktop three-column grid, mobile two-column grid and one column on narrow screens, stacked trip board, and mobile details dialog.
- **Feedback:** loading skeletons; explicit network/API errors with retry; no-results and empty-itinerary states; cached results clearly identified during a service outage; unavailable-image fallback; storage-failure feedback.

## Distinctive features

Travel-journal visual direction with paper, forest green and terracotta colors; serif typography; postcard photography; circular travel stamp; ticket motif; day assignments; trip naming and optional start date; notes; keyboard-accessible reorder buttons; surprise destination; itinerary text export; print/save as PDF layout; and a decorative route sketch clearly identified as non-geographic.

## Technology and structure

Semantic HTML, CSS Grid/Flexbox, vanilla JavaScript ES modules, browser localStorage, and a zero-dependency Node static server for development. The deployable frontend consists only of `dist/`.

- `dist/index.html`: shell, navigation, dialog and footer.
- `dist/styles.css`: layout, design system, responsive and print styles.
- `dist/data.js`: curated destination identifiers and editorial metadata.
- `dist/app.js`: API integration, view rendering, combined filters, itinerary and persistence.
- `server.mjs`: local static file server; it does not implement product APIs or store itinerary data.
- `tests/check.mjs`: deterministic network/storage and filtering checks against the production code.
- `screenshots/`: screenshots captured from the browser for the submission PDF.

## API details

Endpoint: `https://en.wikipedia.org/w/api.php`

An anonymous GET request uses `action=query`, `origin=*`, `redirects=1`, and `prop=extracts|pageimages|coordinates` with the curated Wikipedia titles. `exintro=1` and `explaintext=1` return introductory plain text; `pithumbsize=900` requests a photo thumbnail. Returned `query.pages` records are matched to the editorial shortlist, following redirects. No private API keys or credentials are used.

Destination titles are curated in data.js, while descriptions, photos and coordinates are loaded live. Search operates over the returned shortlist; this is not a worldwide arbitrary-city search. Visit lengths and categories are editorial suggestions, not API-provided availability or booking data.

A 15-second timeout and HTTP/response validation handle failure. A previously successful response is cached in localStorage. If a later fetch fails, a warning explicitly says that saved information is being shown. On a first-load failure the interface shows an error with retry rather than fake destination data.

Documentation: https://www.mediawiki.org/wiki/API:Main_page and https://www.mediawiki.org/wiki/API:Cross-site_requests

## Persistence and privacy

`tripwise.fieldnotes.v1` stores trip name, optional date, day count, destination identifiers, assigned days, and personal notes. `tripwise.places.v1` caches public place information. Data remains in this browser and is not synchronized between devices. Private browsing/storage restrictions may prevent saving; export is available in that case. Rendering escapes text, checks external URLs, validates saved destination IDs and clamps day values.

## Credits

Destination text: Wikipedia contributors, CC BY-SA; each destination links to its full article. Photographs retain their own licenses and attribution requirements, accessible through the destination photo credit link. Hero photograph: Bali temple, served by Unsplash (`photo-1537996194471-e657df975ab4`). Fonts: DM Sans and Playfair Display through Google Fonts, with system fallbacks.

## Verification

Verified in Chrome: live API returned 12 destinations; combined India + Asia + A-Z returns Alleppey, Hampi, Leh, Munnar; no-match search shows the empty state; add from details/card; notes, name and day assignment persist after refresh; native modal; reorder controls; responsive 390px layout with no horizontal overflow. Automated checks cover failed network, cached fallback, malformed responses, invalid/corrupt storage, duplicates and escaping.

## Deployment and submission

Upload the contents of `dist/` to any static host (GitHub Pages, Netlify, Vercel or similar). No build command or environment variables are required. Website deployment is currently deferred at the project owner's request. Publish the site and verify its URL in a signed-out browser before submitting it to the judges.

The brief requires a **public GitHub repository**, an **accessible live website**, this README, and a **screenshots PDF** covering Explore, Details, My Trip, desktop/mobile and key states. The [screenshots PDF](TripWise_frontend.pdf) is included. Rename it to `<your-register-number>_frontend.pdf` before submitting. A video was referenced but not supplied; this implementation follows the provided PDF brief.

### Submission checklist

- [x] Frontend source code and setup instructions.
- [x] All mandatory frontend features implemented.
- [x] Real external API with no private credentials required.
- [x] Screenshots PDF covering the major views, mobile and key states.
- [ ] Public website deployment and signed-out accessibility check.
- [ ] Rename the screenshots PDF using the applicant's register number.
- [ ] Submit the repository URL, live URL and screenshots PDF through the organizer's submission channel.

## Screenshots

![Live destination cards](screenshots/09-destination-cards.png)
![Destination details](screenshots/02-details-desktop.png)
![Day-by-day itinerary](screenshots/03-my-trip-desktop.png)

Mobile Explore, Details and My Trip screenshots are included in `screenshots/` and in the PDF.

## Scope and tradeoffs

- A focused list of 12 destinations makes discovery predictable and keeps the initial API request small. The interface clearly searches this shortlist rather than claiming to search every destination worldwide.
- The app calls the external API directly from the browser, which fits the frontend track. A database or custom product backend is not required.
- The route illustration is decorative. Real coordinates link out to OpenStreetMap; the app does not claim to calculate an optimized route or travel times.
- Itinerary data is local to the current browser. There is no account system or cross-device synchronization.
- Live place information, third-party images and web fonts depend on external services. The app includes service failure, cached data and image fallback behavior, with system fonts available when font loading fails.
- Suggested visit lengths and categories are editorial metadata. Booking, weather and price feeds are outside this implementation's scope.

## Explain it in the interview

1. The app fetches Wikipedia data once, then derives search/filter/sort views without extra API requests.
2. Editorial metadata and live API content have separate roles.
3. The itinerary stores destination IDs and personal planning fields rather than duplicating live descriptions.
4. UI rendering derives from shared state; localStorage restores it after refresh.
5. Native dialog handles keyboard focus trapping and Escape dismissal.
6. Failure and empty states are designed as part of the normal flow.

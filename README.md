# WeShare — React frontend

A complete, responsive social frontend inspired by the supplied **Social Media Platform** reference. The white panels, blue navigation, stories, composer, three-column feed, event cards, video feed, and marketplace follow that reference. Every screen is implemented as React components; the app is not a screenshot with hotspots.

**Frontend only:** actions work with browser-local data. This package does not include a backend, real accounts, remote messaging, live broadcasting, checkout, or payments.

## Fastest way to open it on Windows

1. Extract the entire ZIP. Do not run it from inside the ZIP viewer.
2. Install **Node.js 24 LTS, version 24.15.0 or newer in the 24 series** if it is not already installed.
3. Open the `weshare-frontend` folder.
4. Double-click **`OPEN-PREBUILT-WINDOWS.bat`**.
5. Open **http://127.0.0.1:4173/** if the browser does not open automatically.

This runs the included `dist/` build with a small local server. **No npm download is needed in this mode.** Keep the terminal open while using the app. Press Ctrl+C to stop it.

Do not double-click `index.html`; browser module and storage rules require a local HTTP server.

## Edit and run the source on Windows

1. Double-click **`SETUP-WINDOWS.bat`** once. An internet connection is needed to install npm dependencies.
2. Double-click **`START-WINDOWS.bat`**.
3. Visit **http://127.0.0.1:5173/**. Changes to the source refresh automatically.

The equivalent commands, from the extracted project folder, are:

```powershell
node --version
npm ci
npm run dev
```

If PowerShell blocks `npm.ps1`, use `npm.cmd ci` and `npm.cmd run dev`, or use the `.bat` launchers. Changing the machine's execution policy is unnecessary.

Supported development/test runtimes: Node **22.22.2+ in the 22 series**, **24.15+ in the 24 series**, or **26+**. The package records this requirement. Node 24 LTS is the recommended choice for this package.

## macOS or Linux

```bash
npm ci
npm run dev
```

Or run `sh start.sh`. To open the included build without installing dependencies:

```bash
node scripts/serve.mjs
```

## What works

| Area | Included behavior |
| --- | --- |
| Feed | Latest, most liked, and following filters; new posts; editing and deleting your posts |
| Composer | Text, up to four photos or one video, file attachments, audience labels, hashtags, friend mentions |
| Post interactions | Like/unlike, threaded display of comments, add a comment, bookmark, copy a direct post URL |
| Stories | View previous/next stories, arrow-key navigation, add a story with artwork or an uploaded image |
| Friends | Discover people, search, follow/unfollow, accept/dismiss sample friend requests |
| Messages | Primary/general/request views, search, accept a sample message request, save messages locally |
| Events | Filter and sort, details, create an event, RSVP/cancel, view events you are going to |
| Watch | Two included playable MP4 demo clips, native video controls, likes, following, watchlist |
| Photos | Album tabs, upload, lightbox, download your uploaded photos, delete your uploads |
| Marketplace | 12 sample products, search, category/condition/price/location/seller filters, sorting, details, saved items |
| Bag | Add items, adjust quantities, remove items, calculate subtotal |
| Files | Multiple uploads, drag-and-drop, search, sort, download, delete, total storage display |
| Profile | View creator profiles; edit your name, username, role, bio, location, website, and photo |
| Communities | View and follow pages; create posts in the selected community |
| Saved | Separate saved posts, products, and videos |
| Search | Search people, post text, events, and product names/categories |
| Notifications | View sample activity, follow its link, mark one or all notifications as read |
| Local camera | Explicit start/stop controls; preview your camera; stop camera tracks when the dialog closes |
| Settings | Activity indicators, edit profile, confirmed reset of this app's local data |
| Navigation | Hash routes, direct URLs, browser back/forward, mobile drawer, mobile bottom navigation |

Photos: PNG/JPEG/WebP/GIF up to 5 MB each. Post videos: MP4/WebM up to 20 MB. Post attachments: up to 10 MB. Files page: up to 20 MB per file, at most 10 files per upload operation. Available space also depends on your browser's storage quota.

## Responsive behavior

- Wide screens use a left navigation column, main content, and contextual right sidebar.
- The marketplace uses its own category/filter column.
- At 1100px and below, the community sidebar collapses; the inbox stays available in the header.
- At 850px and below, marketplace filters move into a toggleable panel.
- At 680px and below, navigation becomes a drawer plus bottom bar, with search in a dedicated header row.
- Smaller screens use two-column product/event/photo grids and narrower spacing.
- The file table scrolls inside its container when its columns cannot fit.
- Dialogs adapt to the viewport, trap keyboard focus, close with Escape, and restore focus. Reduced-motion preferences are respected.

## Where data lives

- Structured application data is saved under `weshare.frontend.v1` in `localStorage`.
- Upload bytes are saved in the `weshare-media-v1` IndexedDB database.
- Uploaded media is loaded as local object URLs. Images and scripts do not require a remote image host or CDN.
- Reloading the **same browser and origin** preserves your changes. Development on port 5173 and the included preview on port 4173 are different origins, so they have separate data. `localhost` and `127.0.0.1` also have separate data.
- New posts and messages exist only in that browser. A link to a locally created post will not give another person access to its content.
- Sample follower counts, online indicators, views, listings, and received messages are demonstration data. The app does not invent incoming replies.
- Clearing site data, using private browsing, or resetting the demo can remove your data. Download important uploaded files before resetting.
- Audience selectors are UI labels, not access-control enforcement. Authentication, multi-user authorization, moderation, delivery, synchronization, and storage services require a backend.

The Live control is a **local camera preview**, not a public broadcast. It needs a camera-capable browser and localhost or HTTPS. Permission is requested only when you click Start camera.

## Project map

| File/folder | Purpose |
| --- | --- |
| `src/App.jsx` | Hash routing, application shell, dialog dispatch |
| `src/components/Layout.jsx` | Header, sidebar, mobile navigation, inbox, contextual panels |
| `src/components/UI.jsx` | Shared UI, modal accessibility, artwork sprite map |
| `src/components/Post.jsx` | Stories, composer entry points, post cards, comments, feed |
| `src/components/ComposeDialogs.jsx` | Post/story forms and local camera preview |
| `src/components/Dialogs.jsx` | Chat, notifications, stories, lightbox, confirmations |
| `src/pages/` | Events, video feed, marketplace, social pages, settings, global search |
| `src/state/data.js` | Seed content, people, products, events, and video definitions |
| `src/state/model.js` | Pure state transitions, filters, cart calculations, hydration |
| `src/state/Store.jsx` | React context, persistence, notification messages |
| `src/lib/media.js` | IndexedDB uploads, local URL management, downloads |
| `src/lib/format.js` | Formatting and clipboard helpers |
| `src/styles.css` | Visual system, layouts, component styles, responsive breakpoints |
| `public/assets/` | Reference artwork and bundled demo MP4 clips |
| `scripts/serve.mjs` | Dependency-free server for the included production build |
| `scripts/check-node.mjs` | Checks the development/test Node version |
| `scripts/generate-demo-videos.mjs` | Optional FFmpeg regeneration of the sample clips |
| `tests/` | State, upload-storage, and component integration tests |
| `dist/` | Ready-to-serve production build |

## Customize it

**Brand and colors:** edit the CSS variables and the `Header` component in `Layout.jsx`; replace `public/favicon.svg`.

**Sample content:** edit `src/state/data.js`. Once a browser has saved a session, its saved data takes precedence. Use Settings → Reset local data to load changed seed content.

**Artwork:** the source reference is only 564×1974 pixels. To preserve its visual character without relying on remote assets, `Art` renders the relevant photograph/artwork regions using an SVG viewBox sprite map. The UI itself is fully coded. These small source images naturally soften when enlarged. For a polished public deployment, replace the sprite entries with your full-resolution image files. The original supplied reference remains in `public/assets/reference.jpg`.

**Videos:** the included files are silent, playable pan/zoom artwork studies made from clean regions of the supplied reference, not the original videos visible in its screenshot. Replace the MP4 paths and metadata in `data.js` to use your own videos. `generate-demo-videos.mjs` is optional and requires FFmpeg only if you want to regenerate the samples.

**Backend integration:** replace browser persistence in `Store.jsx` with your API service and replace IndexedDB writes in `media.js` with your media upload service. Keep the page components and existing action boundaries. Implement real identity and authorization on the server before treating audience labels or ownership UI as security controls. Add an actual messaging service, upload validation, and checkout flow if those are required.

## Build and verify

```bash
npm test
npm run build
npm run preview
```

The build creates `dist/`. The `preview` script needs installed dependencies. Alternatively, `node scripts/serve.mjs` serves the same build without dependencies.

Validation during delivery:

- Production compilation and bundling with Vite.
- 25 automated tests covering post creation/edit/deletion, likes, comments, bookmarks, persistence, friend requests, chat, event creation/RSVP, search, products/cart totals, video controls, notifications, stories, profiles, file/photo uploads, IndexedDB operations, and invalid input handling.
- JavaScript syntax checks for the local server and helper scripts.
- Media files checked for valid MP4/H.264 streams and expected durations.

These tests run in **jsdom with simulated IndexedDB**. They are not real-browser visual tests. Browser rendering, viewport screenshots, actual camera hardware, and Windows launcher execution were not available in the delivery environment. Video playback is mocked in component tests; the packaged media is checked separately. Responsive breakpoints and Windows launchers are included for local verification.

## Deploy as a static frontend

Upload the **contents of `dist/`** to any static host that serves JavaScript, CSS, images, and MP4 files. Hash routing avoids special route rewrite rules. Vite's relative asset base also supports hosting in a subdirectory.

Do not deploy `node_modules`, tests, the local server, or the source reference as an unrelated public document. The image is already included as an app asset in the build. Hosting this frontend does not create a backend or sync users' data.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `node` or `npm` not recognized | Install a supported Node LTS version and reopen the terminal. |
| Unsupported engine error | Check `node --version`; use Node 24.15+ LTS or Node 22.22.2+ LTS. |
| `vite` not recognized | Run `npm ci` inside the folder containing `package.json`. |
| Platform-specific dependency error | Use this ZIP without copying someone else's `node_modules`. Run `npm ci` on your own Windows machine. |
| Port 5173 already in use | Close the earlier development server or run `npm run dev -- --port 5174`. |
| Port 4173 already in use | Close the earlier preview, or set `WESHARE_PORT` before `node scripts/serve.mjs`. |
| Blank page opened from a file | Use a launcher or an HTTP server; do not open `index.html` directly. |
| Changes are not in the prebuilt app | Run `npm run build` after editing source, then reload port 4173. |
| npm network timeout | Check your internet/proxy settings and retry `npm ci`; use the included prebuilt mode meanwhile. |
| Image or uploaded file unavailable | Use the same origin/browser where it was uploaded. Site data may have been cleared. Upload it again. |
| Camera permission denied | Allow camera access for localhost in browser site settings and try again. |
| Camera unavailable | Close other applications using the camera, check the device, then retry Start camera. |
| Saved changes disappear | Allow browser storage; avoid private mode. Check that you are on the same hostname and port. |

Example alternate prebuilt port in PowerShell:

```powershell
$env:WESHARE_PORT = "4174"
node scripts/serve.mjs
```

## Credits

UI inspiration and artwork: the user-supplied Social Media Platform reference. No claim is made to its original design/artwork ownership. React, Vite, and Lucide are used with their respective licenses. See `THIRD-PARTY-NOTICES.txt` for bundled runtime notices. The original application code is supplied for your use and customization; reference artwork retains its original rights.

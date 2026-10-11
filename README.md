# Scanory · Moonlit Love Story — Polished Refinement

This release is a **separate review candidate**, based on the latest approved Refined V2 presentation. No GitHub or Shopify changes were made.

## Scope
- Reduced opacity of intro decorative circular outlines and opening portal rings.
- Mobile text flow: more horizontal and vertical breathing room, larger paragraph leading, adjusted headline leading, and better separation between title, supporting copy and content.
- Replaced bottom preview jargon with customer-facing `MOONLIT LOVE STORY · A STORY MADE JUST FOR YOU` (preview banner only; may be hidden/removed in production).
- Reduced star opacity and masked star field behind central time-together text, retaining night atmosphere.
- Timeline uses a compositor-friendly `scaleY` progress fill rather than repeated CSS height changes, preserving reverse-scroll behavior.
- Moved the memory message into the photograph itself (not beside it), with a blur scrim, and moved the TURN THIS MEMORY OVER button immediately under the photo.
- Enlarged dust brush radius from 8.5% to 27% of the shorter photo dimension (approx. 10x swept area per isolated contact); continuous interpolated pointer strokes remove gaps. **Completion still requires real 90% transparent-pixel coverage**. Button remains an immediate reveal alternative.
- No pictographic emoji; decorative stars and typography symbols retained intentionally.
- Kept timeline, albums, soundtrack, personal letter, final hearts, story gate, the full `story-data.js` schema, YES/NO flags and standalone editor.

## Verification
- Chromium 320/390/768/1440 with reduced motion: correct overlay inside photo, button below, no JS exceptions, no horizontal overflow.
- Scratch button: reveals image and note.
- Letter: open and close.
- Soundtrack: visible in absence of audio URL.
- Standalone Studio: frame rendered and a recipient-name edit applied live.
- Physical iOS Safari, Android shake and high-frame-rate timeline profiling: **not tested**. Do not claim zero defects or production security.

## Files
- `index.html` plus `styles.css`, `story-data.js`, `app.js`: source project; serve via HTTP when developing.
- `preview.html`: self-contained demo with embedded CSS and JS; sample images/fonts require internet.
- `editor.html`: source-project editor using sibling files.
- `studio-standalone.html`: self-contained personalization demo with iframe preview.

This remains a public-fiction design prototype, not a secure post-purchase customer portal. Per-order private data, image storage, real audio licensing, time-restricted letters and QR delivery need secure backend implementation.

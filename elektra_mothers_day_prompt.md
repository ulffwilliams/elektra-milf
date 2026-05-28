# Prompt: Mother's Day Web App for Elektra

## Overview

Create a single-file HTML/CSS/JS web app as a Mother's Day surprise for someone named **Elektra**. The app should have a **cute, mobile-first, pastel-colored, light and airy design** — think soft pinks, lavenders, mint greens, and warm whites. Use rounded elements, soft shadows, and a gentle aesthetic throughout. No dark colors. The font should be playful but readable (e.g. Google Font like "Quicksand" or "Nunito").

---

## App Flow

### Step 1 – Intro Text Fade-ins

Three lines of text fade in one at a time, with a delay between each:

1. *"Glad mors dag, Elektra"*
2. *"Du är en av mina favoritmammor (jag har två)"*
3. *"Och den snyggaste, sexigaste och roligaste mamman jag vet"*

Each line should fade in smoothly. Wait until all three have appeared before moving to Step 2.

---

### Step 2 – Date Question Bubble

A cute speech/chat bubble fades in with the text:

> *"Vill du gå på dejt med mig nästa helg?"*

Below it, two buttons appear: **"Ja"** and **"Nej"**

- If the user taps/clicks **"Nej"**: the Nej button must **run away** — it should move to a random new position on screen every time the user's pointer or finger gets close to it or clicks it. It should be impossible to click. It has no functional purpose other than escaping. The Ja button stays in place.
- If the user taps/clicks **"Ja"**: proceed to Step 3.

---

### Step 3 – Day Selection Bubble

A new cute bubble appears with the text:

> *"Vilken dag vill du gå på dejt?"*

Two buttons appear: **"Fredag"** and **"Lördag"**

---

### Step 4 – Confirmation Screen

After selecting a day, a final screen appears saying:

> *"Toppen, ses på {chosen day}! 🥰"*

This should feel celebratory — add a small animation like floating hearts or confetti in pastel colors.

---

## Technical Requirements

- **Single HTML file** — no external dependencies except Google Fonts and optionally a lightweight confetti library via CDN
- **Mobile-first** — looks great on a phone screen (~390px wide)
- All transitions should be **smooth and soft** (CSS transitions/animations)
- The **"Nej" button avoidance** should work on both mouse (`mousemove`) and touch (`touchmove`) events

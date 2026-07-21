# AI Usage Log — 10X CRM

## Entry 1 — Project Planning
**Goal:** Get a structured day-by-day plan for the 10-day exam project before writing any code.
**Prompt:** "Please create a plan for me, spread out over 10 days. By the end of this period, I need to have the work completed thoroughly, from start to finish. Please outline the plan for each day in as much detail as possible."
**Tool:** Claude (Sonnet)
**Result:** Used. The AI broke the PRD into 10 scoped days, which I followed throughout the project.
**What I learned:** Breaking a large spec into small daily deliverables with a clear "done" checkpoint each day made an otherwise overwhelming PRD manageable, and made it easier to test each feature in isolation before moving on.

---

## Entry 2 — Prompt Refinement Example (Signup Form Bug)
**Goal:** Fix a broken Full Name validation rule that let invalid names through.
**Prompt (first, vague):** "full name validation and email is not working"
**Prompt (refined after AI asked for the code):** I pasted my actual `auth.js` code so the AI could see the exact bug instead of guessing.
**Tool:** Claude (Sonnet)
**Result:** Used. The AI found that my comparison operator was reversed (`length > 3` instead of `length < 3`), which caused valid names to fail and invalid short names to pass.
**What I learned:** A vague bug report ("it's not working") gets a much weaker answer than pasting the actual code. Once I shared the real file, the AI found the exact line immediately instead of listing generic possibilities.

---

## Entry 3 — Critical Evaluation of AI's Own Code
**Goal:** Fix login not redirecting to the dashboard after a successful sign-in.
**Prompt:** "its not working" → then, after more back-and-forth, I pasted `guard.js`.
**Tool:** Claude (Sonnet)
**Result:** Partially rejected an earlier AI suggestion. Earlier in the project, the AI had put login form-handling logic inside `guard.js`, and I hadn't noticed the design was wrong. Because `guard.js` is loaded at the very top of `<body>` (before the login `<form>` exists in the DOM), `document.getElementById('loginForm')` was returning `null`, and the submit listener never attached — so nothing happened when I clicked "Log In." I asked the AI to explain why, and it acknowledged this was a structural mistake in its own earlier code and restructured the project so `guard.js` only contains the redirect check, while all form logic (`handleLogin`, `handleSignup`) lives in `auth.js`, which loads after the forms exist.
**What I learned:** Script *load order* matters as much as the code itself — a function can be perfectly correct and still never run if the DOM element it targets doesn't exist yet when the script executes. I also learned not to assume AI-generated code is automatically well-structured; I had to ask "why" before I understood the actual bug well enough to explain it myself.

---

## Entry 4 — Building the Clients Page (API Integration)
**Goal:** Implement Day 4–6: loading clients from DummyJSON, caching in localStorage, and adding search/filter/sort.
**Prompt:** "lets do it day 4, 5 and 6 fully. tell me codes where should i add this to work and which day is it"
**Tool:** Claude (Sonnet)
**Result:** Used, with one correction. I noticed the status dropdown didn't visually match the color-coded badges from earlier days until I specifically re-applied the badge CSS classes to the `<select>` element in Day 6.
**What I learned:** `.filter()`, `.find()`, and `.sort()` all return new arrays/values instead of mutating the original — this is why `getVisibleClients()` could safely apply search/filter/sort without ever corrupting the actual data stored in `crm_clients`.

---

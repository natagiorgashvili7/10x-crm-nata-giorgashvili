# 10X CRM

## About
10X CRM is a lightweight, browser-based customer relationship management tool built with vanilla JavaScript, HTML, and SCSS. It lets a logged-in user manage a client pipeline — tracking leads, deals, and follow-ups — entirely in the browser, using the DummyJSON API for sample client data and localStorage for persistence.

## Features
- User authentication (Sign Up / Login) with session-based route protection
- Dashboard with live stats, deal pipeline overview, and recent clients
- Client management: add, delete, search, filter by status, sort, and change status inline
- Client details modal with notes and a follow-up reminder
- Editable user profile: update name/company, change password, reset CRM data
- Light/dark theme toggle, persisted across sessions

## Tech Stack
- HTML5, SCSS (compiled to CSS)
- Vanilla JavaScript (ES6+), no frameworks
- [DummyJSON](https://dummyjson.com) API for sample client data
- Browser `localStorage` for all persistence (no backend)

## How to Run
1. Clone this repository
2. Open the project folder in VS Code (or any editor)
3. Install the "Live Server" extension (or any local static server)
4. Right-click `index.html` → "Open with Live Server"
5. No build step or dependencies are required — this is pure vanilla JS/CSS

## Live Demo


## Test Account
No pre-seeded account exists (all data is stored in your own browser's localStorage). Please register a new account via the Sign Up page — this takes under a minute and requires no email verification.

## Credits
Built by Nata Giorgashvili as an exam project. Development was supported by Claude (Anthropic) for planning, debugging, and code review — see `ai-log.md` for details on how AI was used throughout the project.
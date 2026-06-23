# Contributing Guidelines

This document outlines the contribution workflow, code standards, and Git conventions for this booking application.

---

## 🛠️ 1. Local Development Setup
1. Clone the repository.
2. Navigate to the `/api` directory: `cd api`.
3. Create your local `.env` configuration: `cp .env.example .env` and populate the required keys.
4. Install dependencies: `npm install`.
5. Run the server in development mode: `npm run dev`.

---

## 🌿 2. Branching Strategy
We follow a standard feature-branching workflow:
- **`main`**: Production-ready code. Never commit directly to `main`.
- **`feature/`**: New feature development (e.g. `feature/booking-overlap`).
- **`bugfix/`**: Bug fixes (e.g. `bugfix/unauthorized-error`).
- **`docs/`**: Documentation updates.

---

## 📜 3. Git Commit Message Conventions
Commit messages must follow the **Conventional Commits standard** (`type(scope): subject`):

### Types:
* `feat`: A new feature (e.g., `feat(booking): add date overlap validation`).
* `fix`: A bug fix (e.g., `fix(auth): fix argument order in createError`).
* `docs`: Documentation changes (e.g., `docs(readme): add setup instructions`).
* `style`: Formatting, semi-colons, whitespace (no code logic changes).
* `refactor`: Code changes that neither fix a bug nor add a feature.
* `test`: Adding or correcting tests.
* `chore`: Updating build scripts, package dependencies, etc.

### Rules:
1. Limit the subject line to **72 characters**.
2. Write the subject line in **present tense** (e.g., "add check", not "added check").
3. Keep the subject line in **lowercase**.
4. Separate the header from the body with a blank line (optional for small commits).

---

## 🧑‍💻 4. Coding Code Style & Quality
Before submitting a pull request, verify:
* All console logs used for debugging are removed.
* Sensitive fields (like `isAdmin`) are protected against Mass-Assignment in controllers.
* Error handlers delegate correctly using `next(createError(message, status))`.

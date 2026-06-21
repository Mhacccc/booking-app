Run `git status` and `git diff` (or `git diff --cached` if files are staged) on the workspace to inspect my code changes. 

Then, write a Conventional Commit message following these rules:
- **Rely primarily on the code changes** you discover from the Git commands. Analyze the diff carefully to find all modifications, new files, and refactorings.
- Format: `<type>(<scope>): <short description in present tense, lowercase>`
- Types: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting), `refactor` (code reorganization), `test` (tests), `chore` (build/config/dependencies)
- Keep the header under 72 characters.
- If the changes are large, include a body with bullet points explaining the "why" and "what".
- Use the "additional progress notes" below only as secondary context to supplement the commit message (e.g. to explain *why* a change was made or add context not visible in the diff).
- Respond ONLY with the final Git commit message.

Here are my additional progress notes / context (optional):
- [Type extra context here, or leave blank]

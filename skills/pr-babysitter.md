# Skill: PR Babysitter

Automated workflow that runs on pull request events:
1. Validates code syntax with ESLint.
2. Runs Supertest & Jest API test suites.
3. Checks Prisma schema integrity (`npx prisma validate`).
4. Scans for hardcoded secrets or unhashed passwords.
5. Posts structured review comments on GitHub PR.

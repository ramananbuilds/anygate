# Guide: Release Process

> Release workflow, versioning rules, GitHub Actions CI/CD, and npm publishing.

## Automated Release Workflow

Publishing is fully automated via GitHub Actions (`.github/workflows/publish.yml`).

> ⚠️ **DO NOT run `npm publish` locally.** Pushing a `v*` tag triggers CI to build, test, publish to npm, and create GitHub releases.

## Step-by-Step Release

1. **Update CHANGELOG.md**: Document all new features, bug fixes, and breaking changes under a new `## x.y.z (YYYY-MM-DD)` header.
2. **Bump Package Version**:
   ```bash
   npm version patch --no-git-tag-version  # or minor / major
   ```
3. **Build & Verify Locally**:
   ```bash
   npm run typecheck
   npm test
   npm run build
   anygate --version
   ```
4. **Commit & Tag**:
   ```bash
   git add -A
   git commit -m "release: vX.Y.Z"
   git tag -f vX.Y.Z
   git push origin main
   git push origin vX.Y.Z --force
   ```
5. **Monitor CI**: Verify that `.github/workflows/publish.yml` completes successfully on GitHub Actions.

# Commit Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Why Conventional Commits?

- **Automated Changelog Generation** - Automatically generate CHANGELOGs
- **Semantic Versioning** - Automatically determine version bumps
- **Clear History** - Easier to understand project history
- **Better Communication** - Consistent format across team

## Commit Message Format

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI/CD configuration
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope should specify what is being changed:

- `feat(products)`: Feature related to products
- `fix(cart)`: Bug fix in cart
- `docs(readme)`: Update README

### Subject

- Use imperative, present tense: "add" not "added" nor "adds"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 72 characters

### Body (Optional)

- Use to explain **what** and **why** vs. **how**
- Separate from subject with blank line
- Wrap at 72 characters

### Footer (Optional)

- Reference GitHub issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

### Feature

```bash
feat(products): add product search functionality

Implement search with filters for category and price range.
Users can now search products by name, category, and price.

Closes #45
```

### Bug Fix

```bash
fix(cart): correct quantity update logic

Fixed issue where cart quantity would reset to 1 when updating.
Now properly increments/decrements based on user input.
```

### Documentation

```bash
docs(readme): update installation instructions

Add Docker setup steps and environment variable configuration.
```

### Style Change

```bash
style(frontend): format code with Prettier

Run Prettier across all TypeScript and TSX files.
```

### Refactor

```bash
refactor(backend): simplify product service logic

Extract common database queries into separate methods.
Improves code readability and maintainability.
```

### Performance

```bash
perf(api): optimize product listing query

Add database indexes and reduce N+1 queries.
Improves response time from 500ms to 50ms.
```

### Test

```bash
test(cart): add unit tests for cart service

Add test coverage for add, remove, and update operations.
```

### Build

```bash
build: upgrade Next.js to version 16

Update dependencies and fix breaking changes.
```

### Chore

```bash
chore: setup Husky and Commitlint

Add pre-commit hooks for code quality.
```

### Breaking Change

```bash
feat(api): change product endpoint structure

BREAKING CHANGE: Product API now returns `items` instead of `products`.
Update all API consumers to use the new response format.
```

## Validation

Commits are automatically validated using [Commitlint](https://commitlint.js.org/) via Husky pre-commit hooks.

### Test Your Commit Message

```bash
# Test a commit message
echo "feat: add new feature" | npx commitlint

# Test from a file
npx commitlint --from HEAD~1
```

### Common Errors

**❌ Invalid:**

```bash
Added new feature
Fix bug
updated docs
```

**✅ Valid:**

```bash
feat: add new feature
fix: correct bug in cart
docs: update readme
```

## Pre-Commit Hooks

This project uses Husky to run automated checks before each commit:

### 1. **Code Formatting** (Prettier)

- Automatically formats all staged files
- Ensures consistent code style across the project
- Runs on: `*.{js,jsx,ts,tsx,json,css,md}`

### 2. **Linting** (ESLint)

- Checks and fixes code quality issues in backend and frontend
- Runs on TypeScript/JavaScript files
- Auto-fixes issues when possible

### 3. **Commit Message Validation** (Commitlint)

- Validates commit message format
- Ensures conventional commits standard
- Runs after you write your commit message

### What Happens on Commit:

```bash
git commit -m "feat: add new feature"

# 1. Prettier formats your staged files
# 2. ESLint checks and fixes code issues
# 3. Commitlint validates your message
# 4. If all pass ✅ - commit succeeds
# 5. If any fail ❌ - commit is blocked
```

## Tools

- **Husky** - Git hooks manager
- **Commitlint** - Commit message linter
- **Prettier** - Code formatter
- **lint-staged** - Run linters on staged files
- **Conventional Commits** - Specification

## Benefits for Trove

1. **Milestone Tracking** - Easily see what was added in each milestone
2. **Automated Releases** - Future integration with semantic-release
3. **Clear History** - Understand changes between milestones
4. **Professional Standards** - Industry-standard commit practices

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Semantic Versioning](https://semver.org/)

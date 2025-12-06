# Documentation

Welcome to the Trove project documentation! This folder contains comprehensive documentation organized by category.

## 📁 Documentation Structure

```
docs/
├── project/         # Project overview and planning
├── milestones/      # Individual milestone progress reports
├── architecture/    # Technical architecture and setup
├── guides/          # Development guides and conventions
└── reviews/         # Code reviews and quality reports
```

---

## 📋 Project Planning

High-level project information and development roadmap.

### [project/](./project/)

- **[PROJECT_OVERVIEW.md](./project/PROJECT_OVERVIEW.md)** - Project goals, features, and vision
- **[MILESTONES.md](./project/MILESTONES.md)** - Development roadmap with all milestones

---

## 🎯 Milestones

Detailed progress reports for completed milestones.

### [milestones/](./milestones/)

- **[MILESTONE_2_PROGRESS.md](./milestones/MILESTONE_2_PROGRESS.md)** - Product Catalog implementation details
- **[MILESTONE_3_PROGRESS.md](./milestones/MILESTONE_3_PROGRESS.md)** - Shopping Cart implementation details

---

## 🏗️ Technical Architecture

System design, technology stack, and setup instructions.

### [architecture/](./architecture/)

- **[ARCHITECTURE.md](./architecture/ARCHITECTURE.md)** - System architecture and data flow
- **[TECH_STACK.md](./architecture/TECH_STACK.md)** - Technology choices and rationale
- **[CONFIGURATION.md](./architecture/CONFIGURATION.md)** - Advanced configuration system (NestJS)
- **[SETUP.md](./architecture/SETUP.md)** - Detailed setup and installation guide

---

## 📖 Development Guides

Guidelines and conventions for development.

### [guides/](./guides/)

- **[COMMIT_CONVENTIONS.md](./guides/COMMIT_CONVENTIONS.md)** - Git commit message standards (Conventional Commits)
- **[CLAUDE_AGENTS.md](./guides/CLAUDE_AGENTS.md)** - Custom Claude Code agents and commands

---

## ✅ Code Reviews

Code quality reports and improvement documentation.

### [reviews/](./reviews/)

- **[SECURITY_IMPROVEMENTS.md](./reviews/SECURITY_IMPROVEMENTS.md)** - Security enhancements (Helmet, rate limiting, validation, XSS prevention)
- **[NEXTJS_REVIEW_FIXES.md](./reviews/NEXTJS_REVIEW_FIXES.md)** - Next.js 16 code review fixes (SEO, performance, accessibility)
- **[UIUX_IMPROVEMENTS.md](./reviews/UIUX_IMPROVEMENTS.md)** - UI/UX improvements (navbar, pagination, image loading, Shadcn UI)

---

## 🚀 Quick Links

### Getting Started

1. Start with [PROJECT_OVERVIEW.md](./project/PROJECT_OVERVIEW.md) to understand the project
2. Check [MILESTONES.md](./project/MILESTONES.md) to see current progress
3. Follow [SETUP.md](./architecture/SETUP.md) to set up your development environment

### For Developers

- **Architecture**: [ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
- **Tech Stack**: [TECH_STACK.md](./architecture/TECH_STACK.md)
- **Configuration**: [CONFIGURATION.md](./architecture/CONFIGURATION.md)
- **Commit Guidelines**: [COMMIT_CONVENTIONS.md](./guides/COMMIT_CONVENTIONS.md)

### Current Status

- **Milestone 1**: ✅ Complete - Project Setup
- **Milestone 2**: ✅ Complete - Product Catalog
- **Milestone 3**: ✅ Complete - Shopping Cart
- **Milestone 4**: ⏳ Not Started - Checkout & Orders
- **Code Quality**: Grade A (see [NEXTJS_REVIEW_FIXES.md](./reviews/NEXTJS_REVIEW_FIXES.md))

### Security Notices

- **CVE-2025-55182 (React2Shell)**: ⚠️ Critical - React updated to 19.2.1 to patch remote code execution vulnerability (December 5, 2025)

---

## 📝 Documentation Standards

### File Naming

- Use `SCREAMING_SNAKE_CASE.md` for all documentation files
- Be descriptive and specific (e.g., `NEXTJS_REVIEW_FIXES.md` not `FIXES.md`)

### Organization

- **project/**: High-level planning and roadmap
- **milestones/**: Detailed reports for each completed milestone
- **architecture/**: Technical design and setup
- **guides/**: How-to guides and conventions
- **reviews/**: Code review reports and improvements

### Linking

When linking to other docs within this folder:

- Same directory: `[Link](./FILE.md)`
- Parent directory: `[Link](../FILE.md)`
- Subdirectory: `[Link](./subdir/FILE.md)`
- From root README: `[Link](docs/category/FILE.md)`

---

## 🔄 Keeping Documentation Updated

As the project evolves, please:

1. Update milestone progress in [MILESTONES.md](./project/MILESTONES.md)
2. Create new milestone reports in `milestones/` when completing major features
3. Add new code review reports to `reviews/` after significant improvements
4. Update architecture docs when system design changes
5. Keep this README.md updated with new documentation files

---

**Last Updated**: December 6, 2025
**Current Milestone**: 3 - Shopping Cart (Complete)

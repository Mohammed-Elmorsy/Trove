# Claude Code Review Agents

This document describes the Claude Code review agents available for this project and how to use them.

## Overview

We have three specialized review agents to help maintain code quality across the full-stack application:

1. **Backend Review Agent** - Reviews Nest.js backend code
2. **Frontend Review Agent** - Reviews Next.js frontend code
3. **Database Review Agent** - Reviews Prisma schemas and queries

All agents are **review-only** - they provide feedback and suggestions but do NOT make code changes automatically.

## Available Agents

### 1. Backend Review Agent

**Location**: `.claude/agents/backend-review.md`

**Specializes in**:

- Nest.js module architecture and dependency injection
- API design and RESTful conventions
- Input validation and DTOs
- Exception handling and error responses
- Prisma query optimization (N+1 prevention)
- Security (authentication, authorization, CORS)
- Testing patterns (unit and e2e)

**Best for reviewing**:

- Controllers and services
- Module configuration
- API endpoints
- Database queries in services
- Exception filters and guards

### 2. Frontend Review Agent

**Location**: `.claude/agents/frontend-review.md`

**Specializes in**:

- Next.js App Router patterns
- Server vs Client Components
- React best practices and hooks
- Performance optimization (image optimization, code splitting)
- Accessibility (WCAG compliance)
- TypeScript type safety
- Tailwind CSS and Shadcn UI usage
- Security (XSS prevention, environment variables)

**Best for reviewing**:

- Pages and layouts
- React components
- Client-side logic and state management
- Styling and responsive design
- SEO and metadata

### 3. Database Review Agent

**Location**: `.claude/agents/database-review.md`

**Specializes in**:

- Prisma schema design
- Database relationships and foreign keys
- Index optimization (critical for performance)
- Migration safety
- Query patterns and N+1 prevention
- Transaction handling
- Data integrity and constraints
- Security (SQL injection prevention)

**Best for reviewing**:

- Prisma schema changes
- Database migrations
- Query optimization in services
- Transaction logic
- Index strategy

## How to Use the Agents

### Method 1: Task Tool (Recommended)

Use Claude Code's Task tool to launch agents:

```
Can you review my backend code using the backend review agent?
Files to review:
- backend/src/products/products.controller.ts
- backend/src/products/products.service.ts
- backend/src/products/products.module.ts
```

Claude will use the Task tool to launch the agent with the backend-review.md prompt.

### Method 2: Manual Invocation

Simply reference the agent in your request:

```
Using the backend review agent guidelines, please review the OrdersService implementation in backend/src/orders/orders.service.ts
```

### Method 3: Direct File Reference

Read the agent file and apply its guidelines:

```
Read .claude/agents/database-review.md and use it to review my Prisma schema changes
```

## Review Output Format

All agents provide feedback in a consistent format:

```
## [Agent Type] Code Review

### Files Reviewed
- path/to/file:line - Purpose

### 🔴 Critical Issues
- Security vulnerabilities
- Data loss risks
- Breaking bugs

### 🟡 Important Improvements
- Performance issues
- Maintainability concerns
- Best practice violations

### 🟢 Suggestions
- Optimization opportunities
- Code organization improvements

### ✅ Strengths
- What was done well

### Summary
Overall assessment and priority recommendations
```

## When to Use Each Agent

### Backend Review Agent

Use when:

- Adding new API endpoints
- Creating new Nest.js modules
- Implementing authentication/authorization
- Writing services with database queries
- Before merging backend PRs

### Frontend Review Agent

Use when:

- Creating new pages or components
- Implementing user interactions
- Optimizing performance
- Ensuring accessibility
- Before merging frontend PRs

### Database Review Agent

Use when:

- Modifying Prisma schema
- Creating migrations
- Optimizing slow queries
- Adding new relationships
- Before applying migrations to production

## Best Practices

1. **Review Early**: Use agents during development, not just before merging
2. **Be Specific**: Point agents to specific files or changes for focused feedback
3. **Iterate**: Address critical issues first, then important improvements
4. **Combine Agents**: For full-stack features, use multiple agents
5. **Learn**: Use agent feedback to improve your coding practices

## Example Workflows

### Adding a New Feature

```
# Step 1: Review database schema
"Review my Prisma schema changes for the Cart feature using the database review agent:
- backend/prisma/schema.prisma"

# Step 2: Review backend implementation
"Review my backend Cart implementation using the backend review agent:
- backend/src/cart/cart.controller.ts
- backend/src/cart/cart.service.ts
- backend/src/cart/cart.module.ts"

# Step 3: Review frontend implementation
"Review my Cart frontend using the frontend review agent:
- frontend/app/cart/page.tsx
- frontend/components/cart-item.tsx"
```

### Optimizing Performance

```
"Use the database review agent to analyze query performance in:
- backend/src/orders/orders.service.ts

Focus on N+1 queries and missing indexes."
```

### Security Audit

```
"Use the backend review agent to perform a security audit on:
- backend/src/auth/auth.controller.ts
- backend/src/auth/auth.service.ts

Focus on authentication, validation, and error handling."
```

## Agent Maintenance

The agents are based on official documentation from:

- **Next.js**: Best practices for App Router, Server Components, performance
- **Nest.js**: Dependency injection, exception handling, testing patterns
- **Prisma**: Schema design, migrations, query optimization

When frameworks update, the agent files may need updates to reflect new best practices.

## Tips for Best Results

1. **Provide Context**: Tell the agent what the code is supposed to do
2. **Specify Concerns**: If you're worried about specific issues, mention them
3. **Include Related Files**: Provide enough context for thorough review
4. **Ask Questions**: Use agents to learn, not just to find bugs
5. **Prioritize Feedback**: Focus on critical and important issues first

## Integration with Development Workflow

### Pre-Commit

```
Review my changes before committing:
- [list modified files]
```

### Pre-PR

```
Comprehensive review of my feature branch:
- Backend changes: [files]
- Frontend changes: [files]
- Database changes: [migrations]
```

### Code Review

Use agents to supplement human code review, catching common issues automatically.

## Limitations

- Agents provide **review only**, not automatic fixes
- Agents work best with clear, specific requests
- Complex architectural decisions may require human judgment
- Agents are based on current best practices and may need updates

## Getting Help

If you need clarification on agent feedback:

1. Ask the agent to explain specific suggestions
2. Request code examples for recommended patterns
3. Ask for prioritization if there are many suggestions

## Contributing

To improve the agents:

1. Update the agent files in `.claude/agents/`
2. Test changes with real code reviews
3. Document new patterns and anti-patterns
4. Keep agents aligned with official framework documentation

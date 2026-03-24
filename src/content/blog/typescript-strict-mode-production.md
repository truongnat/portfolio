---
title: "Migrating a 50k-Line JavaScript Codebase to Strict TypeScript"
date: "2026-03-24"
description: "How our team phased a 50,000-line JavaScript backend into strict TypeScript, eliminated 90% of runtime type errors, and made the codebase maintainable again."
slug: "typescript-strict-mode-production"
published: true
tags: ["Backend", "TypeScript", "Best Practices"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1000"
---

# Migrating a 50k-Line JavaScript Codebase to Strict TypeScript

"Cannot read property 'id' of undefined" — this was the most common error in our production logs for two years straight. We had a Node.js backend that had grown from a quick prototype to a 50,000-line codebase, and the lack of types was catching up with us. Runtime errors that should have been caught at compile time were hitting users.

The decision to migrate to TypeScript wasn't controversial. But *how* to do it without stopping feature development for three months? That required a plan.

## Why We Finally Did It

Beyond the runtime errors (which alone justified the migration), a few incidents pushed us over the edge:

- A refactoring renamed `user.userId` to `user.id` in the database model. Three API handlers still referenced `user.userId`. The bug shipped to production.
- A new developer added a feature that passed `req.user` (which could be undefined for unauthenticated routes) to a function that assumed it was always defined. Null pointer in production.
- Our IDE autocomplete was guessing, not knowing. Every function call was a trip to the source file to check the signature.

TypeScript wouldn't prevent logic bugs, but it would have caught all three of these before they left our laptops.

## The Phased Migration Strategy

A big-bang migration of 50k lines wasn't realistic. Our strategy:

**Phase 1 — Rename and configure (Week 1)**
- Rename all `.js` files to `.ts`
- Set `"strict": false` in `tsconfig.json` with `"allowJs": true` and `"checkJs": false`
- Verify the app still runs
- Goal: zero new TypeScript errors, zero functionality changes

**Phase 2 — Type the boundaries (Weeks 2-4)**
- Add types to all public API interfaces, database models, and service signatures
- Use `any` liberally inside function bodies for now
- Goal: the "shape" of data flowing between modules is typed

**Phase 3 — Enable strict, fix errors (Weeks 5-8)**
- Enable `"strict": true` module by module
- Use `ts-migrate` to speed up common patterns
- Goal: entire codebase under strict mode

**Phase 4 — Eliminate `any` (Ongoing)**
- Gradually replace `any` with proper types using `grep -r "any" --include="*.ts"`
- Set `"noImplicitAny": true` progressively per directory

## The tsconfig Setup

Our final `tsconfig.json` for strict mode:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": false,
    "resolveJsonModule": true
  }
}
```

`noUncheckedIndexedAccess` is the hidden gem here. Without it, `array[0]` has type `T`. With it, `array[0]` has type `T | undefined`, forcing you to check if the element exists. This alone would have caught two of our production bugs.

`exactOptionalPropertyTypes` is the strict option that causes the most initial pain but catches real bugs: `{ a?: string }` means `a` can be `string | undefined` or absent — they're different things.

## Common Error Patterns We Found

**Pattern 1: Unguarded property access**

```typescript
// Before (JS)
function getUsername(user) {
  return user.profile.displayName.toLowerCase();
}

// After (TS strict) — forces you to handle the failure cases
function getUsername(user: User): string {
  return user.profile?.displayName?.toLowerCase() ?? 'Anonymous';
}
```

**Pattern 2: Implicit `any` from Express request**

```typescript
// Before: req.user was any, compiler couldn't warn you
app.get('/profile', (req, res) => {
  const { id } = req.user; // could blow up at runtime
  // ...
});

// After: augment Express types
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

app.get('/profile', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.user; // TypeScript confirms this is safe
});
```

**Pattern 3: Loose function return types**

```typescript
// Before: return type was inferred as string | undefined | null | boolean
function findUserEmail(id: string) {
  const user = users.find(u => u.id === id);
  if (!user) return null;
  if (!user.verified) return false;
  return user.email;
}

// After: explicit return type forces consistent behavior
function findUserEmail(id: string): string | null {
  const user = users.find(u => u.id === id);
  if (!user || !user.verified) return null;
  return user.email;
}
```

## Using ts-migrate

For the mechanical parts of the migration — adding `: any` annotations to parameters and variables that TypeScript couldn't infer — we used Airbnb's `ts-migrate`:

```bash
npx ts-migrate-full src/
```

This doesn't make the code *good* TypeScript, but it makes it *valid* TypeScript. It's a starting point, not a finish line. After running it, we had a completely type-annotated codebase where almost everything was `: any` — but TypeScript was happy, and we could incrementally improve from there.

## Results

Six months after completing the migration:

- **Runtime type errors in production: down 90%** (measured against the same 6-month period the prior year)
- **"Cannot read property of undefined" errors: eliminated entirely**
- **Developer velocity: up ~20%** (subjective, from team survey) — primarily from IDE autocomplete and catching errors before commits
- **Onboarding time for new developers: down from 2 weeks to 4 days** (types serve as documentation)

The migration wasn't free — we invested roughly 200 developer-hours spread over 8 weeks. But it paid back within the first quarter in reduced incident response time alone.

If your JavaScript project is growing and maintenance is getting harder, TypeScript strict mode is one of the highest-ROI investments you can make. Start with `strict: false`, type your boundaries first, then ratchet up the strictness. You don't have to do it all at once.

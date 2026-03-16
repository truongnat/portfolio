# Skill Tree Donation System

A gamified donation system that allows supporters to unlock learning paths and earn exclusive rewards.

---

## 🎯 Overview

The Skill Tree Donation System transforms traditional donations into an interactive RPG-like experience where:

- **Skills** = Learning topics you want to master
- **Donations** = Unlock progress toward each skill
- **Badges** = Achievements for milestones
- **Certificates** = Exclusive rewards for donators

---

## 🏗 Architecture

```
src/
├── components/
│   ├── SkillTree.client.tsx       # Main interactive skill tree UI
│   └── SkillTreeAdmin.client.tsx  # Admin dashboard
├── lib/
│   ├── skill-tree-data.ts         # Skill definitions & initial data
│   ├── certificate-generator.ts   # SVG/PNG certificate generation
│   └── db/
│       ├── schema.sql             # D1 database schema
│       └── index.ts               # Database queries
├── types/
│   └── skill-tree.ts              # TypeScript types
└── pages/
    ├── skill-tree.astro           # Public skill tree page
    ├── admin/skill-tree.astro     # Admin dashboard
    └── api/
        ├── donations.ts           # Create donation
        ├── certificate.ts         # Generate certificate
        ├── stripe/
        │   ├── create-payment.ts  # Stripe payment intent
        │   └── webhook.ts         # Stripe webhook handler
        └── crypto/
            ├── create-payment.ts  # Crypto payment generation
            └── qr.ts              # QR code generation
```

---

## 🚀 Setup

### 1. Database Setup (Cloudflare D1)

```bash
# Create D1 database
wrangler d1 create skill-tree-db

# Add to wrangler.json
[[d1_databases]]
binding = "DONATE_DB"
database_name = "skill-tree-db"
database_id = "your-database-id"

# Initialize schema
wrangler d1 execute skill-tree-db --file=src/lib/db/schema.sql
```

### 2. Payment Configuration

#### Stripe
```bash
# Environment variables
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Crypto
- No API key needed (uses public wallet addresses)
- For production, integrate with Coinbase Commerce or BitPay

### 3. Certificate Generation

Uses `@resvg/resvg-js` and `satori` (already installed).

---

## 🎮 Skill Tree Configuration

### Adding New Skills

Edit `src/lib/skill-tree-data.ts`:

```typescript
{
  id: 'unique-skill-id',
  name: 'Skill Name',
  description: 'What you will learn',
  icon: 'LucideIconName',
  category: 'ai-ml' | 'database' | 'security' | 'devops' | 'architecture' | 'frontend',
  cost: 300, // USD to fully unlock
  status: 'locked' | 'funding' | 'unlocked' | 'completed' | 'mastered',
  prerequisites: ['other-skill-id'], // Must unlock these first
  position: { x: 50, y: 50 }, // Percentage position on tree
  color: 'violet',
  totalDonated: 0,
  progress: 0,
  metadata: {
    estimatedHours: 20,
    resources: ['Resource 1', 'Resource 2'],
    milestones: [
      { id: '1', title: 'Milestone', description: 'Description', completed: false }
    ],
  },
}
```

### Positioning Skills

The skill tree uses percentage-based positioning:
- `x: 0` = left edge, `x: 100` = right edge
- `y: 0` = top, `y: 100` = bottom
- Prerequisites should be positioned above dependent skills

---

## 💰 Payment Flow

### Stripe Flow
```
1. User selects skill + amount
2. Frontend calls /api/stripe/create-payment
3. Backend creates PaymentIntent
4. Frontend shows Stripe Elements checkout
5. User completes payment
6. Stripe webhook → /api/stripe/webhook
7. Webhook updates donation status + skill progress
8. Generate certificate + award badge
```

### Crypto Flow
```
1. User selects crypto currency
2. Frontend calls /api/crypto/create-payment
3. Backend generates wallet address + QR code
4. User sends crypto
5. (Production) Monitor blockchain for confirmation
6. On confirmation: update donation + generate certificate
```

---

## 🏅 Badge System

Badges are automatically awarded based on criteria:

| Badge | Requirement |
|-------|-------------|
| First Unlock | Donate to any skill |
| AI Sponsor | $100+ to AI/ML category |
| Generous Learner | $500+ total donations |
| Skill Master | Fully fund a $300+ skill |

Badge logic in `src/lib/db/schema.sql` triggers.

---

## 📜 Certificate Generation

Certificates are generated as PNG images using Satori (React → SVG → PNG).

### API Usage
```
GET /api/certificate?donatorName=John+Doe&skillName=AI+Agents&amount=100&date=2026-03-16&certificateId=cert_123
```

### Customization
Edit `src/lib/certificate-generator.ts` to customize:
- Design/layout
- Colors and gradients
- Fonts
- Verification QR code

---

## 🛡 Security Considerations

### Webhook Verification
```typescript
// Always verify Stripe signatures
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  STRIPE_WEBHOOK_SECRET
);
```

### Rate Limiting
Implement rate limiting on donation endpoints to prevent abuse.

### Admin Authentication
Protect `/admin/skill-tree` with authentication:
- Cloudflare Access
- Basic auth (for simple setups)
- OAuth (Google, GitHub)

---

## 📊 Admin Dashboard

Access at `/admin/skill-tree`

Features:
- View all donations (pending/completed/failed)
- Approve/reject pending donations
- Generate certificates
- View statistics and leaderboards
- Manage badges and skills

---

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/donations` | POST | Create donation record |
| `/api/stripe/create-payment` | POST | Create Stripe payment |
| `/api/stripe/webhook` | POST | Stripe webhook handler |
| `/api/crypto/create-payment` | POST | Generate crypto payment |
| `/api/crypto/qr` | GET | Generate QR code |
| `/api/certificate` | GET | Generate certificate PNG |

---

## 🎨 Customization

### Theme Colors
Edit `statusColors` in `SkillTree.client.tsx`:
```typescript
const statusColors = {
  locked: 'bg-gray-800 border-gray-700',
  funding: 'bg-blue-900/50 border-blue-500',
  unlocked: 'bg-violet-900/50 border-violet-500',
  // ...
};
```

### Animation Speed
Adjust Framer Motion `transition` durations.

### Certificate Design
Modify the JSX in `certificate-generator.ts`.

---

## 🧪 Testing

### Mock Mode
Payment APIs run in mock mode when env vars are not set:
```json
{
  "success": true,
  "mode": "mock",
  "paymentIntent": { "id": "pi_mock_..." }
}
```

### Test Scenarios
1. Create donation → verify database record
2. Complete payment → verify skill progress update
3. Generate certificate → verify PNG output
4. Award badge → verify badge assignment

---

## 🚀 Future Enhancements

- [ ] NFT badge minting on Polygon
- [ ] Leaderboard with social sharing
- [ ] Recurring donation subscriptions
- [ ] Corporate matching integration
- [ ] GitHub Sponsors sync
- [ ] Public roadmap voting
- [ ] Discord bot notifications
- [ ] Email receipt automation

---

## 📞 Support

For issues or questions:
1. Check logs: `wrangler tail`
2. Database queries: `wrangler d1 execute <db> --command="SELECT * FROM ..."`
3. Test locally: `bun run dev`

---

**Built with:** Astro, React, Framer Motion, Stripe, Cloudflare D1, Satori

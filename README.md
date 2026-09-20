# TrustFund.

> A transparent, on-chain donation platform built on Solana.
>
> - Create campaigns,
> - Accept $SOL contributions &
> - Withdraw funds.
>
> All trustlessly via Anchor smart contracts.

---

## Demo

🎥 **Demo Video:** [Watch TrustFund on YouTube]()

> Demoed on Solana Devnet.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem & Solution](#2-problem--solution)
3. [Target Users](#3-target-users)
4. [Feature Scope](#4-feature-scope)
5. [Tech Stack](#5-tech-stack)
6. [System Architecture](#6-system-architecture)
7. [Smart Contract Design](#7-smart-contract-design)
8. [Pages & Routes](#8-pages--routes)
9. [Folder Structure](#9-folder-structure)
10. [Environment Variables](#10-environment-variables)
11. [Project Building Steps](#11-project-building-steps)
12. [How to Contribute](#12-how-to-contribute)

---

## 1. Overview

| Field             | Detail                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **Project name**  | TrustFund                                                                                        |
| **Type**          | Campaign management + Escrowed SOL donations + Onchain donor tracking                            |
| **Core value**    | On-chain campaign creation, SOL donations and owner withdrawal. Enforced by Anchor.              |
| **Tag line**      | Crypto fundraising, transparently.                                                               |
| **Chain**         | Solana (devnet)                                                                                  |
| **Timeline**      | September 18 – October 07, 2026                                                                  |
| **Primary stack** | Next.js 16 · Anchor 1.1 · Solana Kit · Wallet Standard · Codama · Pinata · Tailwind CSS v4       |
| **App**           | Single Next.js app with public marketing/landing at `/` & full dApp behind it. No monorepo split |
| **Deployment**    | Vercel (frontend) · Solana devnet (Anchor program) · Supabase (Postgres, for indexed data)       |

> **Not an escrow.** TrustFund does not hold donors' funds in trust pending success.
>
> Once a donation is sent, it belongs to the campaign. The owner can withdraw it after the deadline whether or not the goal was met. There are no refunds. This is a deliberate scope decision, not an oversight. See [Section 4](#4-feature-scope).

---

## 2. Problem & Solution

### The Problem

Donating online often lacks transparency. Donors rarely know where their money goes and campaign creators have no trustless way to prove funds are being managed responsibly.

Traditional platforms don't support crypto natively and most existing Web3 donation tools are either too complex for new users or built on Ethereum with high gas costs.

### The Solution

**TrustFund** is a Solana-based donation platform that uses an Anchor smart contract to manage campaigns and funds entirely on-chain.

Every campaign creation, donation and withdrawal is publicly verifiable on the Solana blockchain

- No intermediaries,
- no hidden fees,
- no trust required about _where the money is_.

Only about what happens to it after the deadline, which is stated up front.

Here's how it works:

1. **Campaign creation** : A user creates a fundraising campaign with a title, description, cover image (uploaded to IPFS), SOL goal and deadline.

   Each wallet can create any number of campaigns. A `UserProfile` PDA tracks a running campaign counter so campaign PDAs never collide.

2. **SOL donations** : Donors contribute SOL directly to the campaign's dedicated vault PDA via a secure Anchor instruction.

   A `DonationRecord` PDA accumulates each donor's total per campaign. One record per donor per campaign, not one per donation.

3. **Fund holding** : Donated SOL sits in a vault PDA that holds no account data, only lamports.

   This keeps it a plain system-owned account, so SOL can move in and out via ordinary System Program transfers with no rent-exemption complications.

4. **Campaign deadlines** : Each campaign has a deadline. The `donate` instruction rejects any contribution after it passes.

5. **Fund withdrawal** : After the deadline, the campaign owner can withdraw everything in the vault in one instruction.

   No separate "close" step. The deadline check happens inline in `withdraw`. Only the owner's wallet can trigger this, enforced by Anchor's `has_one` constraint.

6. **On-chain transparency** : All campaign and donation accounts are publicly readable on Solana at any time via `getProgramAccounts`.

   A Helius webhook additionally indexes events into Postgres so the leaderboard and donor history load fast without hammering the RPC.

---

## 3. Target Users

| User type         | Role                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| Campaign creators | Create fundraising campaigns & withdraw funds after the deadline      |
| Donors            | Browse active campaigns & contribute SOL                              |
| General public    | View campaign progress, on-chain donation history & donor leaderboard |

---

## 4. Feature Scope

### ✅ Build in MVP

- **Create a campaign** : Title, description, SOL goal, cover image (uploaded to IPFS), stored in a counter-seeded PDA. One wallet, many campaigns.
- **Browse all campaigns** : List page with cover images and progress indicators.
- **Campaign detail page** : Cover image, description, total raised, goal, owner wallet, deadline countdown.
- **Donate SOL to a campaign** : Sign and send transaction via Wallet Standard.
- **Withdraw funds** : Campaign owner only, after deadline, enforced on-chain. One instruction, no separate close step.
- **Connect wallet** : Any Wallet Standard wallet (Phantom, Solflare, Backpack). No per-wallet adapter packages.
- Deploy program to Solana (**devnet**)
- **Indexing** : Helius webhook → Postgres, with a `getProgramAccounts` fallback so pages never depend solely on the indexer being healthy.
- **Campaign deadlines** : Donations rejected after the deadline; No auto-close transaction needed.
- **Donor leaderboard** : Ranked list of donors by total SOL donated across all campaigns. Clicking a donor opens a panel showing every campaign they've donated to and their running total per campaign.

### ❌ Explicitly out of scope for MVP

- **Refunds.** If a campaign misses its goal, donations are not returned. This is a stated product decision, not a missing feature. See the note in [Section 1](#1-overview).
- **A separate `close_campaign` instruction.** The deadline check lives inline in `withdraw` instead.
- Multi-token donations (SPL tokens) — SOL only.
- Campaign editing after creation.

---

## 5. Tech Stack

### Frontend

| Tool                    | Purpose                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Next.js 16 (App Router) | Current LTS. SSR for public campaign pages, App Router for layouts                    |
| TypeScript              | Type safety across the frontend                                                       |
| Tailwind CSS v4         | Utility-first styling, CSS-first config                                               |
| `@solana/kit`           | Core SDK — RPC, transaction building, sending. Replaces `@solana/web3.js` v1          |
| `@solana/react`         | React hooks + Wallet Standard discovery. Replaces `@solana/wallet-adapter-*` entirely |
| Codama-generated client | Typed instruction builders + account decoders, generated from the Anchor IDL          |
| `pinata` (v2 SDK)       | Upload campaign cover images to IPFS. Returns a CID stored on-chain                   |

> **No `@coral-xyz/anchor` in the frontend at all.** Codama converts the Anchor IDL into a Kit-native client at build time. The app never imports Anchor, only the generated client and Kit itself.

### Indexing

| Tool                           | Purpose                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Helius (devnet RPC + webhooks) | RPC provider (faster/more reliable than the public devnet endpoint) and webhook source for program events |
| Supabase (Postgres)            | Stores indexed campaigns and donations for fast leaderboard/history queries                               |
| Drizzle ORM                    | Typed SQL queries and migrations against the Supabase Postgres instance                                   |
| Backfill script                | Replays full program history from RPC on demand, webhooks can drop events, this keeps the DB honest       |

> **The database is a cache, never a source of truth.** Every read path has a fallback to `getProgramAccounts` directly against chain state, so a stale or empty DB degrades the leaderboard's speed, not its correctness.

### Smart Contract

| Tool       | Purpose                                                                   |
| ---------- | ------------------------------------------------------------------------- |
| Rust       | Language for the Anchor program                                           |
| Anchor 1.1 | Framework — account validation, instruction routing, error handling       |
| Solana CLI | Local validator fallback, program deployment, account inspection          |
| LiteSVM    | Fast Rust unit tests with direct clock control. Needed for deadline logic |
| Surfpool   | Anchor 1.x's local test validator replacement, for TS integration tests   |

### DevOps

| Tool           | Purpose                                                         |
| -------------- | --------------------------------------------------------------- |
| Vercel         | Single deployment. Next.js frontend + API routes, free tier     |
| Solana devnet  | Program deployment. Free, public, no real funds                 |
| GitHub Actions | CI. (lint, type-check & Codama-client-is-current check on push) |

---

## 6. System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                             FRONTEND                               │
│                  Next.js 16 App Router (Vercel)                    │
│         @solana/kit · @solana/react · Codama client · Pinata       │
│                                                                    │
│                trustfund.vercel.app  (single app, all routes)      │
└──────────┬───────────────────────────────────┬─────────────────────┘
           │ image uploads                     │ RPC + signed txns
┌──────────▼──────────┐            ┌───────────▼───────────────────────┐
│        IPFS         │            │          SOLANA DEVNET            │
│    (via Pinata)     │            │        (RPC via Helius)           │
│                     │            │                                   │
│  Campaign cover     │            │  ┌─────────────────────────────┐  │
│  images stored      │            │  │   TrustFund Anchor Program  │  │
│  as CID hash        │            │  │                             │  │
│  referenced         │            │  │  Instructions:              │  │
│  on-chain           │            │  │  • create_campaign          │  │
└─────────────────────┘            │  │  • donate                   │  │
                                   │  │  • withdraw                 │  │
                                   │  │                             │  │
                                   │  │  PDAs:                      │  │
                                   │  │  • UserProfile              │  │
                                   │  │  • CampaignAccount          │  │
                                   │  │  • Vault (data-less)        │  │
                                   │  │  • DonationRecord           │  │
                                   │  └─────────────────────────────┘  │
                                   │                                   │
                                   │   All state publicly readable     │
                                   │   via getProgramAccounts          │
                                   └───────────────┬───────────────────┘
                                                   │ webhook events
                                   ┌───────────────▼───────────────────┐
                                   │             HELIUS                │
                                   │   Watches program ID, fires       │
                                   │   webhook on every transaction    │
                                   └───────────────┬───────────────────┘
                                                   │
                                   ┌───────────────▼────────────────────┐
                                   │       SUPABASE (Postgres)          │
                                   │   campaigns · donations tables     │
                                   │   fed by webhook + backfill script │
                                   │   → powers leaderboard, history    │
                                   └────────────────────────────────────┘
```

### Transaction flow. (create campaign)

```
User fills campaign form + uploads cover image → clicks "Create Campaign"
→ Frontend sends image to Next.js API route: POST /api/upload
→ API route uploads image to IPFS via Pinata SDK (server-side, keys never exposed)
→ Pinata returns IPFS CID (content hash)
→ Wallet Standard prompts user to sign
→ Frontend builds instruction via Codama client: create_campaign(title, description, image_cid, goal, deadline)
→ Program derives/increments UserProfile PDA: ["user_profile", owner] — reads current campaign_count
→ Program derives CampaignAccount PDA: ["campaign", owner, campaign_id.to_le_bytes()]
→ Program derives Vault PDA: ["vault", campaign.key()] — data-less, holds lamports only
→ Transaction sent to devnet via Kit
→ CampaignAccount PDA created on-chain (stores CID, not the image itself)
→ Helius webhook fires — indexes the new campaign event into Postgres
→ Frontend redirects to campaign detail page
→ Campaign data read from PDA + cover image loaded from IPFS via CID
```

### Transaction flow. (donate)

```
Donor clicks "Donate" → enters SOL amount
→ Wallet Standard prompts to sign
→ Frontend builds instruction via Codama client: donate(amount_in_lamports)
→ Anchor validates: Clock::get()?.unix_timestamp < campaign.deadline
→ SOL transferred from donor wallet to campaign's Vault PDA (System Program CPI)
→ CampaignAccount total_raised updated
→ DonationRecord PDA created (init_if_needed) or updated — accumulates total_amount,
  donation_count, first_donated_at, last_donated_at for this donor + campaign pair
→ Helius webhook fires — indexes the donation event for the leaderboard
→ Frontend re-reads PDA → progress bar and total raised update
```

### Transaction flow. (withdraw)

```
Deadline passes (no separate close transaction needed)
→ Campaign owner clicks "Withdraw Funds"
→ Wallet Standard prompts to sign
→ Frontend builds instruction via Codama client: withdraw()
→ Anchor validates inline:
    signer == campaign.owner (has_one)
    Clock::get()?.unix_timestamp >= campaign.deadline
    !campaign.withdrawn
→ Full Vault PDA balance transferred to owner wallet (System Program CPI —
  the vault holds no account data, so it can be drained to zero cleanly)
→ campaign.withdrawn set to true
→ Frontend re-reads PDA → shows withdrawn state, disables the button
```

---

## 7. Smart Contract Design

### Program accounts

```rust
#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub owner: Pubkey,           // wallet this profile belongs to
    pub campaign_count: u64,     // number of campaigns this wallet has created — also the next campaign_id
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CampaignAccount {
    pub owner: Pubkey,           // campaign creator's wallet address
    pub campaign_id: u64,        // this owner's Nth campaign — part of the PDA seed
    #[max_len(50)]
    pub title: String,
    #[max_len(500)]
    pub description: String,
    #[max_len(64)]
    pub image_cid: String,       // IPFS CID of the campaign cover image
    pub goal: u64,                // target amount in lamports
    pub total_raised: u64,       // total SOL donated so far in lamports
    pub deadline: i64,            // Unix timestamp — no donations accepted after this
    pub withdrawn: bool,          // true once owner has withdrawn funds
    pub vault_bump: u8,
    pub bump: u8,
}

// The Vault PDA holds no Anchor account data — it is a plain system-owned
// account tracked only by its address and lamport balance. This is what
// makes withdrawal a clean CPI transfer with no stranded rent.

#[account]
#[derive(InitSpace)]
pub struct DonationRecord {
    pub campaign: Pubkey,          // campaign PDA this donation belongs to
    pub donor: Pubkey,              // donor's wallet address
    pub total_amount: u64,         // cumulative SOL donated to this campaign, in lamports
    pub donation_count: u32,       // how many separate donations this donor has made
    pub first_donated_at: i64,     // Unix timestamp of first donation
    pub last_donated_at: i64,      // Unix timestamp of most recent donation
    pub bump: u8,
}
```

### Instructions

```rust
// Create a new campaign. Reads (and increments) UserProfile.campaign_count
// to derive a fresh campaign_id — init_if_needed on UserProfile so a
// wallet's first campaign doesn't need a separate setup transaction.
pub fn create_campaign(
    ctx: Context<CreateCampaign>,
    title: String,
    description: String,
    image_cid: String,
    goal: u64,
    deadline: i64,
) -> Result<()>

// Donate SOL. Validates deadline, transfers lamports to the Vault PDA,
// and accumulates into DonationRecord (init_if_needed).
pub fn donate(
    ctx: Context<Donate>,
    amount: u64,
) -> Result<()>

// Withdraw funds. Owner-only, deadline must have passed, can only be
// called once. No separate close step — the deadline check is inline.
pub fn withdraw(
    ctx: Context<Withdraw>,
) -> Result<()>
```

### PDA derivation

```
UserProfile PDA seeds:     ["user_profile", owner_pubkey]
→ One per wallet. Tracks campaign_count so campaign_id is always derivable.

Campaign PDA seeds:        ["campaign", owner_pubkey, campaign_id.to_le_bytes()]
→ A wallet can create unlimited campaigns — each gets its own PDA.
→ campaign_id comes from UserProfile.campaign_count at creation time.

Vault PDA seeds:           ["vault", campaign_pubkey]
→ Holds only lamports, no account data — a plain system-owned account.
→ This is what campaign_id.to_le_bytes() and the vault split solve:
  in the original single-PDA design, the same account held both data
  and the SOL, which meant it could never be drained below the
  rent-exempt minimum. Splitting them avoids that entirely.

DonationRecord PDA seeds:  ["donation", campaign_pubkey, donor_pubkey]
→ One record per donor per campaign — donations accumulate into it
  rather than creating a new account (and a new rent payment) every time.
→ Helius indexes writes to this account for the leaderboard.
```

### Anchor constraints

```rust
// Donate — validates deadline, accumulates into DonationRecord
#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(
        mut,
        seeds = [b"campaign", campaign.owner.as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump,
        constraint = Clock::get()?.unix_timestamp < campaign.deadline @ ErrorCode::DeadlinePassed,
    )]
    pub campaign: Account<'info, CampaignAccount>,

    /// CHECK: data-less vault PDA, validated by seeds only
    #[account(
        mut,
        seeds = [b"vault", campaign.key().as_ref()],
        bump = campaign.vault_bump,
    )]
    pub vault: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = donor,
        space = 8 + DonationRecord::INIT_SPACE,
        seeds = [b"donation", campaign.key().as_ref(), donor.key().as_ref()],
        bump,
    )]
    pub donation_record: Account<'info, DonationRecord>,

    #[account(mut)]
    pub donor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Withdraw — owner check, deadline check, single-use check, all inline
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"campaign", owner.key().as_ref(), campaign.campaign_id.to_le_bytes().as_ref()],
        bump = campaign.bump,
        has_one = owner,
        constraint = Clock::get()?.unix_timestamp >= campaign.deadline @ ErrorCode::DeadlineNotReached,
        constraint = !campaign.withdrawn @ ErrorCode::AlreadyWithdrawn,
    )]
    pub campaign: Account<'info, CampaignAccount>,

    /// CHECK: data-less vault PDA, validated by seeds only
    #[account(
        mut,
        seeds = [b"vault", campaign.key().as_ref()],
        bump = campaign.vault_bump,
    )]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

---

## 8. Pages & Routes

Single Next.js app. Public pages are readable without a wallet; write actions (create, donate, withdraw) require a Wallet Standard connection.

| Route             | Access          | Description                                                                                                                      |
| ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | Public          | Landing (product pitch, how it works, featured campaigns, connect wallet button)                                                 |
| `/campaigns`      | Public          | Browse all campaigns (cover images, progress bars, deadline countdown)                                                           |
| `/campaigns/[id]` | Public          | Campaign detail (cover image, description, goal, total raised, donate form, deadline). `id` is the campaign PDA's base58 address |
| `/leaderboard`    | Public          | Donor leaderboard, ranked by total SOL donated. Click a donor to open a panel with their per-campaign totals                     |
| `/create`         | Wallet required | Create campaign (title, description, cover image upload to IPFS, SOL goal, deadline picker)                                      |
| `/dashboard`      | Wallet required | Owner dashboard (campaigns created by connected wallet, withdraw button per eligible campaign)                                   |

> **No traditional auth.** Wallet connection is the identity. A user attempting a write action without a wallet connected sees an inline "Connect wallet to continue" prompt. Not a redirect.

---

## 9. Folder Structure

```
trustfund/
├── program/                                # Anchor smart contract
│   ├── programs/
│   │   └── trustfund/
│   │       └── src/
│   │           ├── lib.rs                  # Program entrypoint, re-exports
│   │           ├── state.rs                # UserProfile, CampaignAccount, DonationRecord
│   │           ├── instructions/
│   │           │   ├── create_campaign.rs
│   │           │   ├── donate.rs
│   │           │   └── withdraw.rs
│   │           └── errors.rs
│   ├── tests/
│   │   ├── litesvm/                        # Rust unit tests — clock-warp deadline cases
│   │   └── ts/                             # Surfpool integration tests
│   ├── Anchor.toml
│   └── Cargo.toml
│
├── app/                                    # Next.js 16 App Router
│   ├── layout.tsx                          # Root layout — Kit client + wallet providers
│   ├── page.tsx                            # / — landing, featured campaigns
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts                    # Server-side IPFS upload via Pinata
│   │   └── helius/
│   │       └── webhook/
│   │           └── route.ts                # Helius webhook handler — verify + write to Postgres
│   ├── campaigns/
│   │   ├── page.tsx                        # /campaigns — browse all
│   │   └── [id]/
│   │       └── page.tsx                    # /campaigns/[id] — detail + donate
│   ├── leaderboard/
│   │   └── page.tsx                        # /leaderboard — donor rankings + detail panel
│   ├── create/
│   │   └── page.tsx                        # /create — campaign creation form
│   └── dashboard/
│       └── page.tsx                        # /dashboard — owner campaigns + withdraw
│
├── components/
│   ├── WalletProvider.tsx                  # @solana/react provider setup
│   ├── CampaignCard.tsx
│   ├── DonateForm.tsx
│   ├── CreateCampaignForm.tsx
│   ├── ConnectWalletButton.tsx
│   ├── ProgressBar.tsx
│   ├── DeadlineCountdown.tsx
│   ├── DonorLeaderboard.tsx
│   └── DonorDetailPanel.tsx
│
├── lib/
│   ├── kit.ts                              # Solana Kit client setup, Helius RPC endpoint
│   ├── generated/                          # Codama-generated client — do not hand-edit
│   ├── pinata.ts                           # Pinata SDK setup — server-side only
│   ├── db/
│   │   ├── schema.ts                       # Drizzle schema — campaigns, donations tables
│   │   └── client.ts                       # Drizzle + Supabase connection
│   └── utils.ts                            # lamports ↔ SOL, timestamp, CID → URL helpers
│
├── hooks/
│   ├── useCampaigns.ts                     # Fetch all CampaignAccount PDAs (with DB-first, RPC-fallback)
│   ├── useCampaign.ts                      # Fetch single campaign PDA by address
│   ├── useLeaderboard.ts                   # Fetch donor rankings from Postgres
│   └── useDonorHistory.ts                  # Fetch a donor's per-campaign totals
│
├── scripts/
│   └── backfill.ts                         # Replays full program history from RPC into Postgres
│
├── .github/
│   └── workflows/
│       └── ci.yml                          # Lint, type-check, Codama-client-is-current check
├── codama.config.ts                        # Codama config — Anchor IDL → Kit client
├── drizzle.config.ts
├── package.json
└── .env.example
```

> **IPFS uploads are server-side only.** Pinata keys live in `app/api/upload/route.ts`. Never exposed to the browser. The client posts the image file to `/api/upload` and gets back a CID.

> **The Codama client is generated, not written.** Run the generation script after every `anchor build`. CI fails if `lib/generated/` is out of sync with the committed IDL, so a stale client can't silently ship.

---

## 10. Environment Variables

```bash
# ── Solana ────────────────────────────────────────────
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_SOLANA_RPC_URL=""          # Helius devnet RPC URL — do not use the public devnet endpoint
NEXT_PUBLIC_PROGRAM_ID=""              # Deployed program ID from Anchor.toml

# ── IPFS (Pinata) ─────────────────────────────────────
PINATA_JWT=""                          # Server-side only — never expose to browser
NEXT_PUBLIC_PINATA_GATEWAY=""          # Your Pinata gateway URL for reading images

# ── Helius ────────────────────────────────────────────
HELIUS_API_KEY=""                      # Helius API key — RPC + webhook access
HELIUS_WEBHOOK_SECRET=""               # Webhook secret for verifying Helius payloads

# ── Database (Supabase) ───────────────────────────────
DATABASE_URL=""                        # Supabase Postgres connection string, for Drizzle

# ── App ───────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **`PINATA_JWT`, `HELIUS_API_KEY`, `HELIUS_WEBHOOK_SECRET` and `DATABASE_URL` are server-side only.**

> They must never appear in a `NEXT_PUBLIC_*` variable. Everything else is safe to expose, devnet program IDs and gateway URLs carry no funds risk.

---

## 11. Project Building Steps

A step-by-step record of the TrustFund build, grouped into phases.

1. Logo and brand identity
2. Core UI component library
3. Project scaffold & repo setup
4. Anchor program scaffold & state design
5. Deploy TrustFund program (campaign, vault and donation instructions)
6. Codama client generation and Solana Kit wiring
7. Database schema setup
8. Landing page
9. Wallet Standard connect flow
10. Campaign dashboard route
11. Discover / browse campaigns page
12. IPFS cover image upload integration
13. Campaign creation flow
14. Campaign detail page & progress tracking
15. Donation flow
16. Owner withdraw flow
17. Refund flow (optional)
18. Helius webhook indexer
19. Backfill script for indexer history
20. Donor leaderboard and detail panel
21. Cross-page polish and QA
22. Devnet validation and smoke test
23. Mainnet deployment (optional)
24. Demo prep & submission

---

## 12. How to Contribute. ⚡👋

- 🔨 Try to break the app by testing real flows and edge cases. If you find a bug, check whether an issue already exists before opening a new one.
- 🎨 Improvements to the design and UI are welcome.
- 💡 Keep application code strongly typed with TypeScript and validate API inputs where appropriate.
- 📱 For UI changes, test both desktop and mobile viewport sizes before submitting.
- 🔐 Never commit private keys, API keys, signing keys, JWTs, `.env.local` files or other secrets.

### 🔃 Steps to make a valid contribution

1. **Fork the repository**

   Fork the [TrustFund](https://github.com/mrinnnmoy/TrustFund) repository to your GitHub account.

2. **Clone your fork**

   ```bash
   git clone https://github.com/<your-github-username>/TrustFund.git
   cd TrustFund
   ```

3. **Create a feature branch**

   Start from the latest `develop` branch:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b <type>/<short-description>
   ```

   Example:

   ```bash
   git checkout -b fix/mobile-campaign-card
   ```

4. **Set up the web application**

   TrustFund is a single Next.js app at the repository root. There's no `app/web` split.

   Install dependencies:

   ```bash
   pnpm install
   ```

   Create your local environment file:

   ```bash
   cp .env.example .env.local
   ```

   Configure the required environment variables locally.

   > Never commit the populated `.env.local` file.

   Start the development server:

   ```bash
   pnpm dev
   ```

   The app is available at:

   ```text
   http://localhost:3000
   ```

5. **Set up the smart contract when needed**

   If your contribution affects the Anchor program, open another terminal from the repository root and move to:

   ```bash
   cd program
   ```

   Make sure Anchor CLI (1.1.x) and the Solana CLI are installed, then run:

   ```bash
   anchor build
   anchor test
   ```

   `anchor test` runs the LiteSVM unit tests (including clock-warp deadline cases) and the Surfpool TypeScript integration tests.

6. **Make your changes**

   Keep changes focused and avoid modifying unrelated files.

   Before committing web application changes, run from the repo root:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```

   If the program was modified, also run from `program`:

   ```bash
   anchor test
   ```

7. **Commit your changes**

   Stage only the files you changed:

   ```bash
   git add <files-you-edited>
   ```

   Use a Conventional Commit message:

   ```bash
   git commit -m "<type>: <short description>"
   ```

   | Prefix      | Use for                                       |
   | ----------- | --------------------------------------------- |
   | `feat:`     | A new feature                                 |
   | `fix:`      | A bug fix                                     |
   | `docs:`     | Documentation changes                         |
   | `style:`    | Formatting with no behavior change            |
   | `refactor:` | Code restructure without a feature/bug change |
   | `test:`     | Adding or updating tests                      |
   | `chore:`    | Build, dependency or tooling work             |

8. **Push your branch**

   ```bash
   git push origin <your-branch-name>
   ```

9. **Create a Pull Request. 👋**

   Open a pull request against the TrustFund `develop` branch and describe your changes clearly.

   **Before opening a PR, check:**
   - [ ] `pnpm lint` passes
   - [ ] `pnpm typecheck` passes
   - [ ] `pnpm build` passes
   - [ ] `anchor test` passes when the Anchor program is affected
   - [ ] The relevant feature works locally
   - [ ] UI changes have been checked at appropriate viewport sizes
   - [ ] No secrets or local environment files are included in the diff
   - [ ] The PR contains only relevant changes

   **Getting help:**
   - Open a [GitHub Discussion](https://github.com/mrinnnmoy/TrustFund/discussions) for general questions
   - Comment directly on the issue you're working on
   - Reach out on [Twitter](https://x.com/mrinnnmoy)

---

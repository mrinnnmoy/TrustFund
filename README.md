# TrustFund.

> A transparent, on-chain donation platform built on Solana. Create campaigns, accept $SOL contributions and withdraw funds. All trustlessly via Anchor smart contracts.

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

| Field              | Detail                                                                              |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Project name**   | TrustFund                                                                           |
| **Type**           | Test project #1. (Solana sandbox) Kosmos                                            |
| **Tagline**        | Crypto fundraising, transparently.                                                  |
| **Chain**          | Solana (devnet)                                                                     |
| **Core value**     | On-chain campaign creation, SOL donations and trustless withdrawals via Anchor.     |
| **Primary stack**  | Next.js 14 · Anchor · @solana/web3.js · Solana Wallet Adapter · IPFS · Tailwind CSS |
| **Timeline**       | 1–2 weeks (keep it simple — devnet only)                                            |
| **Marketing site** | `trustfund.cc` — landing page, how it works, CTA to launch app                      |
| **App**            | `app.trustfund.cc` — the full dApp, wallet connection required for write actions    |
| **Deployment**     | Vercel (marketing + app frontend) · Solana devnet (Anchor program)                  |

---

## 2. Problem & Solution

### The Problem

Donating online often lacks transparency. Donors rarely know where their money goes and campaign creators have no trustless way to prove funds are being managed responsibly.

Traditional platforms don't support crypto natively and most existing Web3 donation tools are either too complex for new users or built on Ethereum with high gas costs.

### The Solution

**TrustFund** is a Solana-based donation platform that uses Anchor smart contracts to manage campaigns and funds entirely on-chain.

Every campaign creation, donation and withdrawal is publicly verifiable on the Solana blockchain. No intermediaries, no hidden fees, no trust required.

Here's how it works:

1. **Campaign creation** — users create a fundraising campaign with a title, description, cover image (uploaded to IPFS), SOL goal, and deadline. Campaign data is stored in a PDA-based on-chain account with the IPFS image CID stored on-chain.
2. **SOL donations** — donors contribute SOL directly to the campaign's PDA vault via a secure Anchor instruction. A `DonationRecord` PDA is created per donation storing the donor address, amount, and timestamp.
3. **Donation pooling** — funds are held in the PDA vault rather than transferred instantly, giving the campaign owner controlled access.
4. **Campaign deadlines** — each campaign has a deadline. Once it passes, the campaign auto-closes and no further donations are accepted.
5. **Fund withdrawal** — the campaign creator can withdraw pooled SOL once the campaign is closed. Only the campaign owner's wallet can trigger this — enforced by Anchor constraints.
6. **On-chain transparency** — all campaign accounts are publicly readable on Solana. Helius webhooks index donation events to power the donor leaderboard and history queries.

---

## 3. Target Users

| User type         | Role                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| Campaign creators | Create a fundraising campaign & withdraw funds on completion          |
| Donors            | Browse active campaigns & contribute SOL                              |
| General public    | View campaign progress, on-chain donation history & donor leaderboard |

---

## 4. Feature Scope

### ✅ Build in MVP

- **Create a campaign** : Title, description, SOL goal, cover image (uploaded to IPFS), stored in a PDA account
- **Browse all active campaigns** : List page with cover images and progress indicators
- **Campaign detail page** : Cover image, description, total raised, goal, owner wallet
- **Donate SOL to a campaign** : Sign and send transaction via wallet adapter
- **Withdraw funds** : Campaign owner only, enforced on-chain by Anchor constraints
- **Connect wallet** : Phantom via Solana Wallet Adapter
- Deploy program to Solana (**devnet**)
- **Indexing with Helius webhooks** : Index campaign creation and donation events for fast data retrieval
- **Campaign deadlines and auto-close logic** : Campaigns have an end date, auto-close when deadline passes
- **Donor leaderboard** : Ranked list of donors showing wallet address and total SOL donated across all campaigns. Clicking a donor address opens a detail panel showing every campaign they have donated to, the amount donated, and the transaction timestamp

---

## 5. Tech Stack

### Frontend

| Tool                    | Purpose                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| Next.js 14 (App Router) | First Next.js project — SSR for public campaign pages, App Router for layouts |
| TypeScript              | Type safety across the frontend                                               |
| Tailwind CSS            | Utility-first styling                                                         |
| Solana Wallet Adapter   | Wallet connection — Phantom support, provider setup                           |
| @solana/web3.js         | Read on-chain data, build and send transactions                               |
| @coral-xyz/anchor       | Anchor client — load IDL, call program instructions from the frontend         |
| Pinata SDK              | Upload campaign cover images to IPFS — returns a CID stored on-chain          |

### Indexing

| Tool   | Purpose                                                                                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Helius | Webhook-based Solana event indexing. Listens to campaign creation and donation events, feeds a lightweight off-chain store for fast leaderboard and donation history queries |

### Smart Contracts

| Tool                | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| Rust                | Language for writing Anchor programs                                |
| Anchor              | Framework — account validation, instruction routing, error handling |
| Solana CLI          | Local validator, program deployment, account inspection             |
| Anchor Test (Mocha) | TypeScript-based integration tests for all program instructions     |

### DevOps

| Tool           | Purpose                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| Vercel         | Two deployments from one repo — marketing site + dApp frontend, both free tier |
| Solana devnet  | Program deployment — free, public, no real funds                               |
| GitHub Actions | CI — lint and type-check on every push                                         |

---

## 6. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                           FRONTEND                               │
│                 Next.js 14 App Router (Vercel)                   │
│    Solana Wallet Adapter · @solana/web3.js · Anchor · Pinata     │
│                                                                  │
│   trustfund.cc (marketing)       app.trustfund.cc (dApp)         │
└──────────┬───────────────────────────────────┬───────────────────┘
           │ image uploads                     │ RPC + signed txns
┌──────────▼──────────┐            ┌───────────▼──────────────────┐
│        IPFS         │            │         SOLANA DEVNET         │
│    (via Pinata)     │            │                               │
│                     │            │  ┌────────────────────────┐   │
│  Campaign cover     │            │  │  TrustFund Anchor      │   │
│  images stored      │            │  │  Program               │   │
│  as CID hash        │            │  │                        │   │
│  referenced         │            │  │  Instructions:         │   │
│  on-chain           │            │  │  • create_campaign     │   │
└─────────────────────┘            │  │  • donate              │   │
                                   │  │  • close_campaign      │   │
                                   │  │  • withdraw            │   │
                                   │  │                        │   │
                                   │  │  PDAs:                 │   │
                                   │  │  • CampaignAccount     │   │
                                   │  │  • DonationRecord      │   │
                                   │  └────────────────────────┘   │
                                   │                               │
                                   │  All state publicly readable  │
                                   └──────────────┬────────────────┘
                                                  │ webhook events
                                   ┌──────────────▼────────────────┐
                                   │            HELIUS              │
                                   │                               │
                                   │  Indexes campaign creation    │
                                   │  and donation events →        │
                                   │  feeds leaderboard and        │
                                   │  donation history queries     │
                                   └───────────────────────────────┘
```

### Transaction flow. (create campaign)

```
User fills campaign form + uploads cover image → clicks "Create Campaign"
→ Frontend sends image to Next.js API route: POST /api/upload
→ API route uploads image to IPFS via Pinata SDK (server-side, keys never exposed)
→ Pinata returns IPFS CID (content hash)
→ Wallet Adapter prompts user to sign
→ Frontend builds instruction: create_campaign(title, description, goal, image_cid, deadline)
→ Anchor derives PDA: ["campaign", owner.publicKey]
→ Transaction sent to devnet
→ CampaignAccount PDA created on-chain (stores CID, not the image itself)
→ Helius webhook fires — indexes the new campaign event
→ Frontend redirects to campaign detail page
→ Campaign data read from PDA + cover image loaded from IPFS via CID
```

### Transaction flow. (donate)

```
Donor clicks "Donate" → enters SOL amount
→ Wallet Adapter prompts to sign
→ Frontend builds instruction: donate(amount_in_lamports)
→ Anchor validates: campaign is active, deadline not passed, amount > 0
→ SOL transferred from donor wallet to campaign PDA vault
→ CampaignAccount total_raised updated
→ DonationRecord PDA created — stores donor pubkey, amount, timestamp
→ Helius webhook fires — indexes the donation event for leaderboard
→ Frontend re-reads PDA → progress bar and total raised update
```

### Transaction flow. (close & withdraw)

```
Deadline passes → anyone can call close_campaign
→ Anchor validates: clock.unix_timestamp >= campaign.deadline
→ campaign.is_closed set to true

Campaign owner clicks "Withdraw Funds"
→ Wallet Adapter prompts to sign
→ Frontend builds instruction: withdraw()
→ Anchor validates: signer == campaign.owner AND campaign.is_closed == true
→ SOL transferred from PDA vault to owner wallet
→ campaign.withdrawn set to true
→ Frontend re-reads PDA → shows withdrawn state
```

---

## 7. Smart Contract Design

### Program accounts

```rust
#[account]
pub struct CampaignAccount {
    pub owner: Pubkey,          // campaign creator's wallet address
    pub title: String,          // max 50 chars
    pub description: String,    // max 500 chars
    pub image_cid: String,      // IPFS CID of the campaign cover image
    pub goal: u64,              // target amount in lamports
    pub total_raised: u64,      // total SOL donated so far in lamports
    pub deadline: i64,          // Unix timestamp — campaign closes after this
    pub is_closed: bool,        // true once deadline has passed
    pub withdrawn: bool,        // true once owner has withdrawn funds
    pub bump: u8,               // PDA canonical bump
}

#[account]
pub struct DonationRecord {
    pub campaign: Pubkey,       // campaign PDA this donation belongs to
    pub donor: Pubkey,          // donor's wallet address
    pub amount: u64,            // SOL donated in lamports
    pub timestamp: i64,         // Unix timestamp of donation
    pub bump: u8,               // PDA canonical bump
}
```

### Instructions

```rust
// Create a new campaign — derives a PDA, stores IPFS CID and deadline
pub fn create_campaign(
    ctx: Context<CreateCampaign>,
    title: String,
    description: String,
    image_cid: String,
    goal: u64,
    deadline: i64,
) -> Result<()>

// Donate SOL — validates deadline, creates DonationRecord PDA
pub fn donate(
    ctx: Context<Donate>,
    amount: u64,
) -> Result<()>

// Close campaign — permissionless, validates deadline has passed
pub fn close_campaign(
    ctx: Context<CloseCampaign>,
) -> Result<()>

// Withdraw funds — owner only, campaign must be closed first
pub fn withdraw(
    ctx: Context<Withdraw>,
) -> Result<()>
```

### PDA derivation

```
Campaign PDA seeds:       ["campaign", owner_pubkey]
→ Each wallet can create one campaign at a time
→ PDA is deterministic — anyone can derive it from the owner's address
→ PDA acts as both the data account and the SOL vault

DonationRecord PDA seeds: ["donation", campaign_pubkey, donor_pubkey]
→ One DonationRecord per donor per campaign
→ Stores donor address, amount, and timestamp on-chain
→ Helius indexes these for the leaderboard and donation history
```

### Anchor constraints

```rust
// Donate — validates campaign is open and deadline not passed
#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(
        mut,
        seeds = [b"campaign", campaign.owner.as_ref()],
        bump = campaign.bump,
        constraint = !campaign.is_closed @ ErrorCode::CampaignClosed,
        constraint = Clock::get()?.unix_timestamp < campaign.deadline @ ErrorCode::DeadlinePassed,
    )]
    pub campaign: Account<'info, CampaignAccount>,
    #[account(
        init,
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

// Withdraw — owner check + campaign must be closed
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"campaign", owner.key().as_ref()],
        bump = campaign.bump,
        has_one = owner,
        constraint = campaign.is_closed @ ErrorCode::CampaignStillActive,
    )]
    pub campaign: Account<'info, CampaignAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

---

## 8. Pages & Routes

### Marketing site — `trustfund.cc`

Static pages — no wallet required. Purpose is to explain the product and funnel visitors to the app.

| Route | Description                                                          |
| ----- | -------------------------------------------------------------------- |
| `/`   | Hero section — product pitch, how it works, CTA → `app.trustfund.cc` |

### App — `app.trustfund.cc`

Full dApp — public pages are readable without a wallet. Write actions (create, donate, withdraw) require wallet connection.

| Route             | Access          | Description                                                                                                                                               |
| ----------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | Public          | Home — featured campaigns, hero section, connect wallet button                                                                                            |
| `/campaigns`      | Public          | Browse all active campaigns — cover images, progress bars, deadline countdown                                                                             |
| `/campaigns/[id]` | Public          | Campaign detail — cover image, description, goal, total raised, donate form, deadline                                                                     |
| `/leaderboard`    | Public          | Donor leaderboard — ranked by total SOL donated. Click any donor address to open a detail panel showing all campaigns donated to, amounts, and timestamps |
| `/create`         | Wallet required | Create campaign — title, description, cover image upload to IPFS, SOL goal, deadline picker                                                               |
| `/dashboard`      | Wallet required | Owner dashboard — campaigns created by connected wallet, close button, withdraw button                                                                    |

> **Note:** There is no traditional auth — wallet connection is the identity. If no wallet is connected and a user attempts a write action, they see a "Connect wallet to continue" prompt inline — not a redirect.

---

## 9. Folder Structure

```
trustfund/
├── program/                              # Anchor smart contract
│   ├── programs/
│   │   └── trustfund/
│   │       └── src/
│   │           └── lib.rs                # All Anchor instructions
│   ├── tests/
│   │   └── trustfund.ts                  # Anchor integration tests (Mocha + Chai)
│   ├── Anchor.toml                       # Program ID, cluster, wallet config
│   └── Cargo.toml
│
├── apps/
│   ├── marketing/                        # Static marketing site (trustfund.cc)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                  # / — hero, how it works, CTA
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── Navbar.tsx
│   │   └── package.json
│   │
│   └── web/                              # Next.js 14 dApp (app.trustfund.cc)
│       ├── app/
│       │   ├── layout.tsx                # Root layout — Wallet Adapter providers
│       │   ├── page.tsx                  # / — home, featured campaigns
│       │   ├── api/
│       │   │   ├── upload/
│       │   │   │   └── route.ts          # Server-side IPFS upload via Pinata
│       │   │   └── helius/
│       │   │       └── webhook/
│       │   │           └── route.ts      # Helius webhook handler — verify + index events
│       │   ├── campaigns/
│       │   │   ├── page.tsx              # /campaigns — browse all
│       │   │   └── [id]/
│       │   │       └── page.tsx          # /campaigns/[id] — detail + donate
│       │   ├── leaderboard/
│       │   │   └── page.tsx              # /leaderboard — donor rankings + detail panel
│       │   ├── create/
│       │   │   └── page.tsx              # /create — campaign creation form
│       │   └── dashboard/
│       │       └── page.tsx              # /dashboard — owner campaigns + actions
│       ├── components/
│       │   ├── WalletProvider.tsx        # Wallet Adapter + RPC provider setup
│       │   ├── CampaignCard.tsx          # Campaign card — cover image, progress bar, deadline
│       │   ├── DonateForm.tsx            # SOL donation form
│       │   ├── CreateCampaignForm.tsx    # Campaign creation — image upload + all fields
│       │   ├── ConnectWalletButton.tsx   # Phantom connect button
│       │   ├── ProgressBar.tsx           # SOL raised / goal visual
│       │   ├── DeadlineCountdown.tsx     # Countdown timer to campaign deadline
│       │   ├── DonorLeaderboard.tsx      # Ranked donor list with total amounts
│       │   └── DonorDetailPanel.tsx      # Slide-out panel — donor's full campaign history
│       ├── lib/
│       │   ├── anchor.ts                 # Anchor program client — load IDL
│       │   ├── idl.json                  # Generated IDL from Anchor build
│       │   ├── pinata.ts                 # Pinata SDK setup — server-side only
│       │   ├── helius.ts                 # Helius client — query indexed events
│       │   └── utils.ts                  # lamports ↔ SOL, timestamp, CID → URL helpers
│       ├── hooks/
│       │   ├── useCampaigns.ts           # Fetch all CampaignAccount PDAs
│       │   ├── useCampaign.ts            # Fetch single campaign PDA by ID
│       │   ├── useLeaderboard.ts         # Fetch donor rankings from Helius index
│       │   ├── useDonorHistory.ts        # Fetch donation history for a wallet address
│       │   └── useAnchorProgram.ts       # Return connected Anchor program instance
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                        # Lint + type-check on every push
├── turbo.json                            # Turborepo config
├── package.json                          # Root workspace
└── .env.example
```

> **Two Vercel deployments from one repo:** Create two Vercel projects pointing at the same GitHub repo — one for `apps/marketing` pointed at `trustfund.cc` and one for `apps/web` pointed at `app.trustfund.cc`. Turborepo builds only what changed.

> **IPFS uploads are server-side only.** Pinata secret keys live in `app/api/upload/route.ts` — never exposed to the browser. The client posts the image file to `/api/upload` and gets back a CID.

---

## 10. Environment Variables

```bash
# ── Solana ────────────────────────────────────────────
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_PROGRAM_ID=""             # Deployed program ID from Anchor.toml

# ── IPFS (Pinata) ─────────────────────────────────────
PINATA_API_KEY=""                     # Server-side only — never expose to browser
PINATA_SECRET_API_KEY=""              # Server-side only — never expose to browser
NEXT_PUBLIC_PINATA_GATEWAY=""         # Your Pinata gateway URL for reading images

# ── Helius ────────────────────────────────────────────
HELIUS_API_KEY=""                     # Helius API key — for webhook + RPC access
HELIUS_WEBHOOK_SECRET=""              # Webhook secret for verifying Helius payloads

# ── App ───────────────────────────────────────────────
NEXT_PUBLIC_MARKETING_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **`PINATA_API_KEY` and `PINATA_SECRET_API_KEY` are server-side only.** They are used exclusively in `app/api/upload/route.ts` and must never appear in any `NEXT_PUBLIC_*` variable. Everything else is safe to expose — they reference public devnet endpoints and gateways.

---

## 11. Project Building Steps

1. **Set up the Anchor project and write the program.**
   - Initialise Anchor workspace : `anchor init trustfund`
   - Write `CampaignAccount` struct : include `image_cid`, `deadline`, `is_closed`, `withdrawn` fields
   - Write `DonationRecord` struct : donor pubkey, amount, timestamp, bump
   - Write `create_campaign` instruction : PDA derivation with seeds `["campaign", owner]`, store all fields including CID and deadline
   - Write `donate` instruction : validates deadline and `is_closed`, transfers SOL via CPI, creates `DonationRecord` PDA
   - Write `close_campaign` instruction : permissionless, validates `clock >= deadline`, sets `is_closed = true`
   - Write `withdraw` instruction : `has_one = owner` + `campaign.is_closed == true` constraints
   - Write Anchor integration tests for all four instructions including edge cases (donate after deadline, withdraw before close)
   - Deploy to devnet : `anchor deploy --provider.cluster devnet`
   - Copy generated IDL to `apps/web/lib/idl.json`

2. **Set up the Turborepo monorepo and Next.js apps.**
   - Initialise Turborepo workspace : `apps/marketing`, `apps/web`
   - Initialise `apps/marketing` : `npx create-next-app@latest marketing --typescript --tailwind --app`
   - Initialise `apps/web` : `npx create-next-app@latest web --typescript --tailwind --app`
   - Install Solana packages in `apps/web` : `@solana/web3.js`, `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`, `@coral-xyz/anchor`
   - Install Pinata SDK in `apps/web` : `@pinata/sdk`
   - Set up `WalletProvider.tsx` : wrap root layout with Wallet Adapter providers
   - Set up `anchor.ts` : load IDL, create Anchor program client from connected wallet
   - Build `app/api/upload/route.ts` : server-side Pinata upload, returns CID to client
   - Build `app/api/helius/webhook/route.ts` : verify Helius signature, parse and store indexed events

3. **Build pages in this order.**
   - `/campaigns` : fetch all `CampaignAccount` PDAs, render `CampaignCard` grid with IPFS cover images
   - `/campaigns/[id]` : fetch single PDA, render cover image, progress bar, deadline countdown, `DonateForm`
   - `/create` : form with image upload (POST to `/api/upload`), calls `create_campaign` on submit
   - `/dashboard` : filter campaigns by connected wallet, show close and withdraw buttons
   - `/leaderboard` : fetch donor rankings from Helius index, render `DonorLeaderboard` + `DonorDetailPanel`
   - `/` (app home) : featured campaigns, hero CTA
   - `apps/marketing /` : landing page, how it works, CTA to `app.trustfund.cc`

4. **Wire up all transactions.**
   - Create campaign : upload image to `/api/upload` → get CID → build instruction → send → redirect to campaign page
   - Donate : build instruction → send → refetch PDA → update progress bar
   - Close campaign : build instruction → send → update dashboard button state
   - Withdraw : build instruction → send → show withdrawn state on dashboard

5. **Set up Helius indexing.**
   - Create a Helius webhook in the Helius dashboard : listen to your program ID for all transactions
   - Set webhook URL to `app.trustfund.cc/api/helius/webhook` (or ngrok URL for local testing)
   - Build the webhook handler : verify `HELIUS_WEBHOOK_SECRET`, parse events
   - Build `useLeaderboard` and `useDonorHistory` hooks that query indexed data via Helius enhanced APIs

6. **Test, debug and deploy.**
   - Test all four instructions end-to-end on devnet with a real Phantom wallet
   - Test IPFS upload : confirm images load from Pinata gateway on campaign pages
   - Test Helius webhook : confirm donations appear in leaderboard after indexing
   - Deploy `apps/marketing` to Vercel : point `trustfund.cc` domain, set env vars
   - Deploy `apps/web` to Vercel : point `app.trustfund.cc` domain, set all env vars
   - Full smoke test on production : create → donate → close → withdraw

---

## 12. How to Contribute

- 🎨 Any improvements to the design & UI are welcome.
- 🔨 Try to break the app by testing it on devnet to find any bugs. If you find any, check if there is an issue already open for it. If there is none, then report it.
- 💡 All code must be written in **TypeScript** — no `any` types.
- 📱 For UI changes, test on both desktop and mobile viewport sizes before submitting.

### 🔃 Steps to be followed in order to make valid contributions to this repo.

1. Fork the [TrustFund](https://github.com/mrinnnmoy/trustfund) repo by clicking on the fork button on the top of the page. This will create a copy of this repository in your account.

2. **Clone the forked repository**

   ```bash
   git clone "https://github.com/<your-github-username>/trustfund"
   ```

   Then set up your local environment:
   - Download and install **Node.js v18** or higher
   - Download and install **Git**
   - Download and install **Rust** : `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - Download and install **Solana CLI** : `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`
   - Download and install **Anchor CLI** : `cargo install --git https://github.com/coral-xyz/anchor avm --locked && avm install latest && avm use latest`
   - Download and install **pnpm** : `npm install -g pnpm`
   - Install a Solana wallet browser extension : [Phantom](https://phantom.app) recommended
   - Switch your Phantom wallet to **devnet** : Settings → Developer Settings → change network to devnet

   Navigate into the project and install dependencies:

   ```bash
   cd trustfund
   pnpm install
   ```

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Fund your devnet wallet with test SOL:

   ```bash
   solana airdrop 2 --url devnet
   ```

   Build and deploy the Anchor program to devnet:

   ```bash
   cd program
   anchor build
   anchor deploy --provider.cluster devnet
   ```

   Copy the deployed Program ID into your `.env` as `NEXT_PUBLIC_PROGRAM_ID`.

   Copy the generated IDL into the frontend:

   ```bash
   cp program/target/idl/trustfund.json apps/web/lib/idl.json
   ```

   Start all apps in development mode:

   ```bash
   cd ..
   pnpm dev
   ```

   After running `pnpm dev` you should have:
   - Marketing site at `http://localhost:3001`
   - App at `http://localhost:3000`

   **Setting up Pinata (IPFS) locally:**
   1. Create a free account at [pinata.cloud](https://pinata.cloud)
   2. Go to **API Keys** → **New Key**
   3. Copy **API Key** and **Secret API Key** into your `.env` as `PINATA_API_KEY` and `PINATA_SECRET_API_KEY`
   4. Copy your gateway URL into `NEXT_PUBLIC_PINATA_GATEWAY`

   **Setting up Helius locally:**
   1. Create a free account at [helius.dev](https://helius.dev)
   2. Create a new project → copy your **API Key** into `.env` as `HELIUS_API_KEY`
   3. For webhook testing locally, use [ngrok](https://ngrok.com) to expose your local server — `ngrok http 3000` — and set the webhook URL in the Helius dashboard to your ngrok URL + `/api/helius/webhook`

3. **Make necessary changes & commit those changes.**

   Remember, **never push anything directly to the `main` branch.**

   Always switch your branch to `develop` first:

   ```bash
   git checkout develop
   ```

   Verify your current branch:

   ```bash
   git branch
   ```

   It should show `* develop`

   Add your changes:

   ```bash
   git add files-you-edited
   ```

   If there are multiple files:

   ```bash
   git add .
   ```

   Create a commit message following the [Conventional Commits](https://www.conventionalcommits.org) standard:

   ```bash
   git commit -m "<type>: <short description>"
   ```

   | Prefix      | Use for                                          |
   | ----------- | ------------------------------------------------ |
   | `feat:`     | A new feature                                    |
   | `fix:`      | A bug fix                                        |
   | `docs:`     | Documentation changes only                       |
   | `style:`    | Formatting, missing semicolons — no logic change |
   | `refactor:` | Code restructure — no feature or bug change      |
   | `test:`     | Adding or updating tests                         |
   | `chore:`    | Build process, dependency updates, tooling       |

   Run lint and type checks before pushing — the CI pipeline will reject failures:

   ```bash
   pnpm lint
   pnpm typecheck
   ```

4. **Push changes to GitHub.**

   ```bash
   git push origin develop
   ```

5. **Create a Pull Request. 👋**

   Go to your repository on GitHub — you'll see a **Compare & pull request** button. Click it and write a summary of what changes you made (attach screenshots for any UI changes). I will review your code and merge it if it passes all checks. ❤️

   **Before opening a PR, always check:**
   - [ ] `pnpm lint` passes with no errors
   - [ ] `pnpm typecheck` passes with no errors
   - [ ] The feature works correctly at `http://localhost:3000` (app) and `http://localhost:3001` (marketing) if applicable
   - [ ] All Anchor instructions involved were tested on devnet with a real Phantom wallet
   - [ ] You've commented on the related issue so others know it's being worked on

   **Getting help:**
   - Open a [GitHub Discussion](https://github.com/mrinnnmoy/trustfund/discussions) for general questions
   - Comment directly on the issue you're working on
   - Reach out on [Twitter](https://twitter.com/mrinnnmoy)

---

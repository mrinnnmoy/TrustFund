import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  bigint,
  integer,
  boolean,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  pubkey: text("pubkey").primaryKey(),
  owner: text("owner").notNull(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageCid: text("image_cid").notNull(),
  goal: bigint("goal", { mode: "bigint" }).notNull(),
  totalRaised: bigint("total_raised", { mode: "bigint" }).notNull().default(sql`0`),
  deadline: bigint("deadline", { mode: "bigint" }).notNull(),
  withdrawn: boolean("withdrawn").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const donations = pgTable(
  "donations",
  {
    campaignPubkey: text("campaign_pubkey").notNull(),
    donor: text("donor").notNull(),
    totalAmount: bigint("total_amount", { mode: "bigint" }).notNull().default(sql`0`),
    donationCount: integer("donation_count").notNull().default(0),
    firstDonatedAt: timestamp("first_donated_at", { withTimezone: true }).notNull(),
    lastDonatedAt: timestamp("last_donated_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.campaignPubkey, table.donor] }),
  }),
);

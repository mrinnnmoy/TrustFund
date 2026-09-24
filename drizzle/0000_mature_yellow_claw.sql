CREATE TABLE "campaigns" (
	"pubkey" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"campaign_id" bigint NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_cid" text NOT NULL,
	"goal" bigint NOT NULL,
	"total_raised" bigint DEFAULT 0 NOT NULL,
	"deadline" bigint NOT NULL,
	"withdrawn" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"campaign_pubkey" text NOT NULL,
	"donor" text NOT NULL,
	"total_amount" bigint DEFAULT 0 NOT NULL,
	"donation_count" integer DEFAULT 0 NOT NULL,
	"first_donated_at" timestamp with time zone NOT NULL,
	"last_donated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "donations_campaign_pubkey_donor_pk" PRIMARY KEY("campaign_pubkey","donor")
);

use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("AYsmGT97ZmgfJmzBxLQ7om8sMGkiCTLNZEf9otevg1g3");

#[program]
pub mod trustfund {
    use super::*;

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        title: String,
        description: String,
        image_cid: String,
        goal: u64,
        deadline: i64,
    ) -> Result<()> {
        instructions::create_campaign(ctx, title, description, image_cid, goal, deadline)
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        instructions::donate(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        instructions::withdraw(ctx)
    }
}

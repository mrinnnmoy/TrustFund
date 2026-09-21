use anchor_lang::prelude::*;

use crate::errors::TrustFundError;
use crate::state::{CampaignAccount, UserProfile};

#[derive(Accounts)]
#[instruction(title: String, description: String, image_cid: String, goal: u64, deadline: i64)]
pub struct CreateCampaign<'info> {
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"user_profile", owner.key().as_ref()],
        bump,
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        init,
        payer = owner,
        space = 8 + CampaignAccount::INIT_SPACE,
        seeds = [
            b"campaign",
            owner.key().as_ref(),
            user_profile.campaign_count.to_le_bytes().as_ref()
        ],
        bump,
    )]
    pub campaign: Account<'info, CampaignAccount>,

    /// CHECK: Data-less vault PDA validated by its seeds. It is funded by `donate`.
    #[account(
        seeds = [b"vault", campaign.key().as_ref()],
        bump,
    )]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_campaign(
    ctx: Context<CreateCampaign>,
    title: String,
    description: String,
    image_cid: String,
    goal: u64,
    deadline: i64,
) -> Result<()> {
    require!(title.len() <= 50, TrustFundError::InvalidAmount);
    require!(goal > 0, TrustFundError::InvalidAmount);

    let campaign = &mut ctx.accounts.campaign;
    let user_profile = &mut ctx.accounts.user_profile;

    campaign.owner = ctx.accounts.owner.key();
    campaign.campaign_id = user_profile.campaign_count;
    campaign.title = title;
    campaign.description = description;
    campaign.image_cid = image_cid;
    campaign.goal = goal;
    campaign.total_raised = 0;
    campaign.deadline = deadline;
    campaign.withdrawn = false;
    campaign.vault_bump = ctx.bumps.vault;
    campaign.bump = ctx.bumps.campaign;

    user_profile.owner = ctx.accounts.owner.key();
    user_profile.campaign_count = user_profile
        .campaign_count
        .checked_add(1)
        .ok_or(TrustFundError::MathOverflow)?;
    user_profile.bump = ctx.bumps.user_profile;

    Ok(())
}

use anchor_lang::prelude::*;

use crate::errors::TrustFundError;
use crate::state::{CampaignAccount, DonationRecord};

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(
        mut,
        seeds = [
            b"campaign",
            campaign.owner.as_ref(),
            campaign.campaign_id.to_le_bytes().as_ref()
        ],
        bump = campaign.bump,
        constraint = Clock::get()?.unix_timestamp < campaign.deadline
            @ TrustFundError::DeadlinePassed,
    )]
    pub campaign: Account<'info, CampaignAccount>,

    /// CHECK: Data-less vault PDA validated by its seeds.
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
        seeds = [
            b"donation",
            campaign.key().as_ref(),
            donor.key().as_ref()
        ],
        bump,
    )]
    pub donation_record: Account<'info, DonationRecord>,

    #[account(mut)]
    pub donor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
    require!(amount > 0, TrustFundError::InvalidAmount);

    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.key(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        ),
        amount,
    )?;

    let campaign = &mut ctx.accounts.campaign;
    campaign.total_raised = campaign
        .total_raised
        .checked_add(amount)
        .ok_or(TrustFundError::MathOverflow)?;

    let donation_record = &mut ctx.accounts.donation_record;
    let now = Clock::get()?.unix_timestamp;

    if donation_record.donation_count == 0 {
        donation_record.campaign = campaign.key();
        donation_record.donor = ctx.accounts.donor.key();
        donation_record.first_donated_at = now;
        donation_record.bump = ctx.bumps.donation_record;
    }

    donation_record.total_amount = donation_record
        .total_amount
        .checked_add(amount)
        .ok_or(TrustFundError::MathOverflow)?;

    donation_record.donation_count = donation_record
        .donation_count
        .checked_add(1)
        .ok_or(TrustFundError::MathOverflow)?;

    donation_record.last_donated_at = now;

    Ok(())
}

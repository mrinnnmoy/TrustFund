use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::system_instruction;

use crate::errors::TrustFundError;
use crate::state::CampaignAccount;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [
            b"campaign",
            owner.key().as_ref(),
            campaign.campaign_id.to_le_bytes().as_ref()
        ],
        bump = campaign.bump,
        has_one = owner,
        constraint = Clock::get()?.unix_timestamp >= campaign.deadline
            @ TrustFundError::DeadlineNotReached,
        constraint = !campaign.withdrawn
            @ TrustFundError::AlreadyWithdrawn,
    )]
    pub campaign: Account<'info, CampaignAccount>,

    /// CHECK: Data-less vault PDA validated by its seeds.
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

pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
    let campaign_key = ctx.accounts.campaign.key();
    let vault_bump = ctx.accounts.campaign.vault_bump;

    let vault_seeds: &[&[u8]] = &[b"vault", campaign_key.as_ref(), &[vault_bump]];

    let vault_balance = ctx.accounts.vault.lamports();

    let transfer_ix = system_instruction::transfer(
        &ctx.accounts.vault.key(),
        &ctx.accounts.owner.key(),
        vault_balance,
    );

    invoke_signed(
        &transfer_ix,
        &[
            ctx.accounts.vault.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[vault_seeds],
    )?;

    ctx.accounts.campaign.withdrawn = true;

    Ok(())
}

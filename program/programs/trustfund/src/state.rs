use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub owner: Pubkey,
    pub campaign_count: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CampaignAccount {
    pub owner: Pubkey,
    pub campaign_id: u64,
    #[max_len(50)]
    pub title: String,
    #[max_len(500)]
    pub description: String,
    #[max_len(64)]
    pub image_cid: String,
    pub goal: u64,
    pub total_raised: u64,
    pub deadline: i64,
    pub withdrawn: bool,
    pub vault_bump: u8,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct DonationRecord {
    pub campaign: Pubkey,
    pub donor: Pubkey,
    pub total_amount: u64,
    pub donation_count: u32,
    pub first_donated_at: i64,
    pub last_donated_at: i64,
    pub bump: u8,
}

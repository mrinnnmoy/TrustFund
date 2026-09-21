use anchor_lang::prelude::*;

#[error_code]
pub enum TrustFundError {
    #[msg("Donations are closed — the campaign deadline has passed.")]
    DeadlinePassed,

    #[msg("Withdrawal isn't available yet — the campaign deadline hasn't passed.")]
    DeadlineNotReached,

    #[msg("This campaign's funds have already been withdrawn.")]
    AlreadyWithdrawn,
}

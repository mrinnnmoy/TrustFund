use anchor_lang::{AccountDeserialize, InstructionData, ToAccountMetas};
use litesvm::LiteSVM;
use solana_clock::Clock;
use solana_instruction::Instruction;
use solana_keypair::Keypair;
use solana_message::Message;
use solana_pubkey::Pubkey;
use solana_signer::Signer;
use solana_system_interface::program as system_program;
use solana_transaction::Transaction;

use trustfund::{
    accounts, instruction,
    state::{CampaignAccount, DonationRecord, UserProfile},
    ID,
};

const START_TIME: i64 = 1_800_000_000;
const FUNDING: u64 = 10_000_000_000;
const DONATION_ONE: u64 = 1_000_000;
const DONATION_TWO: u64 = 2_000_000;

struct TestContext {
    svm: LiteSVM,
    owner: Keypair,
    donor: Keypair,
}

fn setup() -> TestContext {
    let mut svm = LiteSVM::new();

    svm.add_program_from_file(ID, "../../target/deploy/trustfund.so")
        .expect("load TrustFund program");

    let owner = Keypair::new();
    let donor = Keypair::new();

    svm.airdrop(&owner.pubkey(), FUNDING)
        .expect("fund campaign owner");
    svm.airdrop(&donor.pubkey(), FUNDING).expect("fund donor");

    warp_to(&mut svm, START_TIME);

    TestContext { svm, owner, donor }
}

fn warp_to(svm: &mut LiteSVM, unix_timestamp: i64) {
    let mut clock: Clock = svm.get_sysvar();
    clock.unix_timestamp = unix_timestamp;
    svm.set_sysvar(&clock);
}

fn user_profile_pda(owner: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"user_profile", owner.as_ref()], &ID).0
}

fn campaign_pda(owner: &Pubkey, campaign_id: u64) -> Pubkey {
    Pubkey::find_program_address(
        &[b"campaign", owner.as_ref(), &campaign_id.to_le_bytes()],
        &ID,
    )
    .0
}

fn vault_pda(campaign: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"vault", campaign.as_ref()], &ID).0
}

fn donation_record_pda(campaign: &Pubkey, donor: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"donation", campaign.as_ref(), donor.as_ref()], &ID).0
}

fn send(svm: &mut LiteSVM, instruction: Instruction, signer: &Keypair) {
    let message = Message::new(&[instruction], Some(&signer.pubkey()));
    let transaction = Transaction::new(&[signer], message, svm.latest_blockhash());

    svm.send_transaction(transaction)
        .expect("transaction should succeed");
}

fn send_err(svm: &mut LiteSVM, instruction: Instruction, signer: &Keypair) -> String {
    let message = Message::new(&[instruction], Some(&signer.pubkey()));
    let transaction = Transaction::new(&[signer], message, svm.latest_blockhash());

    format!(
        "{:?}",
        svm.send_transaction(transaction)
            .expect_err("transaction should fail")
    )
}

fn read_anchor_account<T: AccountDeserialize>(svm: &LiteSVM, address: &Pubkey) -> T {
    let account = svm.get_account(address).expect("account should exist");
    let mut data = account.data.as_slice();
    T::try_deserialize(&mut data).expect("deserialize Anchor account")
}

fn create_campaign_ix(
    owner: Pubkey,
    campaign_id: u64,
    title: &str,
    goal: u64,
    deadline: i64,
) -> Instruction {
    let user_profile = user_profile_pda(&owner);
    let campaign = campaign_pda(&owner, campaign_id);
    let vault = vault_pda(&campaign);

    Instruction {
        program_id: ID,
        accounts: accounts::CreateCampaign {
            user_profile,
            campaign,
            vault,
            owner,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
        data: instruction::CreateCampaign {
            title: title.to_owned(),
            description: "TrustFund LiteSVM campaign".to_owned(),
            image_cid: "bafy-test-image".to_owned(),
            goal,
            deadline,
        }
        .data(),
    }
}

fn donate_ix(campaign: Pubkey, donor: Pubkey, amount: u64) -> Instruction {
    Instruction {
        program_id: ID,
        accounts: accounts::Donate {
            campaign,
            vault: vault_pda(&campaign),
            donation_record: donation_record_pda(&campaign, &donor),
            donor,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
        data: instruction::Donate { amount }.data(),
    }
}

fn withdraw_ix(campaign: Pubkey, owner: Pubkey) -> Instruction {
    Instruction {
        program_id: ID,
        accounts: accounts::Withdraw {
            campaign,
            vault: vault_pda(&campaign),
            owner,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
        data: instruction::Withdraw {}.data(),
    }
}

fn create_default_campaign(ctx: &mut TestContext) -> Pubkey {
    let campaign = campaign_pda(&ctx.owner.pubkey(), 0);

    send(
        &mut ctx.svm,
        create_campaign_ix(
            ctx.owner.pubkey(),
            0,
            "First campaign",
            5_000_000,
            START_TIME + 1_000,
        ),
        &ctx.owner,
    );

    campaign
}

#[test]
fn create_campaign_initializes_campaign_and_profile() {
    let mut ctx = setup();
    let campaign = create_default_campaign(&mut ctx);

    let campaign_account: CampaignAccount = read_anchor_account(&ctx.svm, &campaign);
    let profile: UserProfile =
        read_anchor_account(&ctx.svm, &user_profile_pda(&ctx.owner.pubkey()));

    assert_eq!(campaign_account.owner, ctx.owner.pubkey());
    assert_eq!(campaign_account.campaign_id, 0);
    assert_eq!(campaign_account.total_raised, 0);
    assert!(!campaign_account.withdrawn);

    assert_eq!(profile.owner, ctx.owner.pubkey());
    assert_eq!(profile.campaign_count, 1);
}

#[test]
fn second_donation_accumulates_in_one_record() {
    let mut ctx = setup();
    let campaign = create_default_campaign(&mut ctx);

    send(
        &mut ctx.svm,
        donate_ix(campaign, ctx.donor.pubkey(), DONATION_ONE),
        &ctx.donor,
    );

    send(
        &mut ctx.svm,
        donate_ix(campaign, ctx.donor.pubkey(), DONATION_TWO),
        &ctx.donor,
    );

    let campaign_account: CampaignAccount = read_anchor_account(&ctx.svm, &campaign);
    let record_address = donation_record_pda(&campaign, &ctx.donor.pubkey());
    let record: DonationRecord = read_anchor_account(&ctx.svm, &record_address);

    assert_eq!(campaign_account.total_raised, DONATION_ONE + DONATION_TWO);
    assert_eq!(record.campaign, campaign);
    assert_eq!(record.donor, ctx.donor.pubkey());
    assert_eq!(record.total_amount, DONATION_ONE + DONATION_TWO);
    assert_eq!(record.donation_count, 2);
    assert!(record.last_donated_at >= record.first_donated_at);
}

#[test]
fn donation_after_deadline_is_rejected() {
    let mut ctx = setup();
    let campaign = create_default_campaign(&mut ctx);

    warp_to(&mut ctx.svm, START_TIME + 1_001);

    let error = send_err(
        &mut ctx.svm,
        donate_ix(campaign, ctx.donor.pubkey(), DONATION_ONE),
        &ctx.donor,
    );

    assert!(
        error.contains("6000") || error.contains("DeadlinePassed"),
        "unexpected error: {error}"
    );
}

#[test]
fn withdraw_before_deadline_is_rejected() {
    let mut ctx = setup();
    let campaign = create_default_campaign(&mut ctx);

    send(
        &mut ctx.svm,
        donate_ix(campaign, ctx.donor.pubkey(), DONATION_ONE),
        &ctx.donor,
    );

    let error = send_err(
        &mut ctx.svm,
        withdraw_ix(campaign, ctx.owner.pubkey()),
        &ctx.owner,
    );

    assert!(
        error.contains("6001") || error.contains("DeadlineNotReached"),
        "unexpected error: {error}"
    );
}

#[test]
fn withdraw_after_deadline_moves_vault_and_cannot_repeat() {
    let mut ctx = setup();
    let campaign = create_default_campaign(&mut ctx);
    let vault = vault_pda(&campaign);

    send(
        &mut ctx.svm,
        donate_ix(campaign, ctx.donor.pubkey(), DONATION_ONE),
        &ctx.donor,
    );

    let vault_before = ctx
        .svm
        .get_account(&vault)
        .expect("vault should exist after donation")
        .lamports;

    let owner_before = ctx
        .svm
        .get_account(&ctx.owner.pubkey())
        .expect("owner should exist")
        .lamports;

    warp_to(&mut ctx.svm, START_TIME + 1_000);

    send(
        &mut ctx.svm,
        withdraw_ix(campaign, ctx.owner.pubkey()),
        &ctx.owner,
    );

    let owner_after = ctx
        .svm
        .get_account(&ctx.owner.pubkey())
        .expect("owner should exist")
        .lamports;

    assert!(
        owner_after > owner_before,
        "owner balance should increase after withdrawal"
    );

    let vault_after = ctx.svm.get_account(&vault).map(|account| account.lamports);
    assert!(
        vault_after.is_none() || vault_after == Some(0),
        "vault should be drained; remaining balance: {vault_after:?}"
    );

    let campaign_account: CampaignAccount = read_anchor_account(&ctx.svm, &campaign);
    assert!(campaign_account.withdrawn);
    assert_eq!(vault_before, DONATION_ONE);

    ctx.svm.expire_blockhash();

    let error = send_err(
        &mut ctx.svm,
        withdraw_ix(campaign, ctx.owner.pubkey()),
        &ctx.owner,
    );

    assert!(
        error.contains("6002") || error.contains("AlreadyWithdrawn"),
        "unexpected error: {error}"
    );
}

#[test]
fn non_owner_cannot_withdraw() {
    let mut ctx = setup();
    let campaign = create_default_campaign(&mut ctx);

    send(
        &mut ctx.svm,
        donate_ix(campaign, ctx.donor.pubkey(), DONATION_ONE),
        &ctx.donor,
    );

    warp_to(&mut ctx.svm, START_TIME + 1_000);

    let attacker = Keypair::new();
    ctx.svm
        .airdrop(&attacker.pubkey(), FUNDING)
        .expect("fund attacker");

    let error = send_err(
        &mut ctx.svm,
        withdraw_ix(campaign, attacker.pubkey()),
        &attacker,
    );

    assert!(!error.is_empty());
}

#[test]
fn two_campaigns_from_same_wallet_have_distinct_ids_and_pdas() {
    let mut ctx = setup();

    let campaign_zero = campaign_pda(&ctx.owner.pubkey(), 0);
    let campaign_one = campaign_pda(&ctx.owner.pubkey(), 1);

    send(
        &mut ctx.svm,
        create_campaign_ix(
            ctx.owner.pubkey(),
            0,
            "Campaign zero",
            5_000_000,
            START_TIME + 1_000,
        ),
        &ctx.owner,
    );

    send(
        &mut ctx.svm,
        create_campaign_ix(
            ctx.owner.pubkey(),
            1,
            "Campaign one",
            7_000_000,
            START_TIME + 2_000,
        ),
        &ctx.owner,
    );

    let zero: CampaignAccount = read_anchor_account(&ctx.svm, &campaign_zero);
    let one: CampaignAccount = read_anchor_account(&ctx.svm, &campaign_one);
    let profile: UserProfile =
        read_anchor_account(&ctx.svm, &user_profile_pda(&ctx.owner.pubkey()));

    assert_ne!(campaign_zero, campaign_one);
    assert_eq!(zero.campaign_id, 0);
    assert_eq!(one.campaign_id, 1);
    assert_eq!(profile.campaign_count, 2);
}

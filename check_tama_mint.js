// Проверка существования tama_mint PDA
const solana = require('@solana/web3.js');

const connection = new solana.Connection('https://api.devnet.solana.com');
const programId = new solana.PublicKey('uY5hZR2uYzkquJDuDkFBj29tfzZRPE96BBTHYGaYnwX');

async function check() {
    // Вычислить tama_mint PDA
    const [tamaMintPDA, bump] = solana.PublicKey.findProgramAddressSync(
        [Buffer.from('tama_mint')],
        programId
    );
    
    console.log('🔍 Checking tama_mint PDA:', tamaMintPDA.toString());
    console.log('🔍 Bump:', bump);
    
    // Проверить существует ли аккаунт
    const accountInfo = await connection.getAccountInfo(tamaMintPDA);
    
    if (accountInfo) {
        console.log('✅ tama_mint EXISTS!');
        console.log('Owner:', accountInfo.owner.toString());
        console.log('Data length:', accountInfo.data.length);
        console.log('Lamports:', accountInfo.lamports);
    } else {
        console.log('❌ tama_mint DOES NOT EXIST!');
        console.log('💡 Solution: Contract needs init_tama_mint instruction');
    }
}

check().catch(console.error);


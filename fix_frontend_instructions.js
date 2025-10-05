// Вычисление правильных Anchor discriminators
const crypto = require('crypto');

const instructions = [
    'create_pet_nft',
    'create_pet_nft_sol',
    'create_pet',
    'feed_pet',
    'play_with_pet',
    'heal_pet',
    'rest_pet',
    'update_decay',
    'resurrect_pet',
    'close_pet'
];

console.log('=== ANCHOR INSTRUCTION DISCRIMINATORS ===\n');

instructions.forEach(instruction => {
    const preimage = `global:${instruction}`;
    const hash = crypto.createHash('sha256').update(preimage).digest();
    const discriminator = hash.slice(0, 8);
    
    console.log(`${instruction}:`);
    console.log(`  Discriminator: [${Array.from(discriminator).join(', ')}]`);
    console.log(`  Hex: ${discriminator.toString('hex')}`);
    console.log('');
});







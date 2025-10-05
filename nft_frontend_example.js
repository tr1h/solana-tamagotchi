/**
 * 🎨 Пример интеграции NFT питомцев с фронтендом
 * 
 * Используй Anchor Web3.js для взаимодействия со смарт-контрактом
 */

import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { 
  PublicKey, 
  SystemProgram, 
  SYSVAR_RENT_PUBKEY,
  Keypair
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress
} from '@solana/spl-token';

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

/**
 * 🐣 Создать NFT питомца
 */
async function createPetNFT(program, wallet) {
  try {
    console.log('🐣 Создаем NFT питомца...');

    // 1. Генерируем новый mint для NFT
    const nftMint = Keypair.generate();
    
    // 2. Получаем PDA для аккаунта питомца
    const [petPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from('pet'),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );

    // 3. Получаем associated token account для NFT
    const nftTokenAccount = await getAssociatedTokenAddress(
      nftMint.publicKey,
      wallet.publicKey
    );

    // 4. Получаем PDA для метаданных (Metaplex)
    const [metadataPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        nftMint.publicKey.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // 5. Подготавливаем метаданные
    const petName = "Мой Тамагочи";
    
    // URI должен указывать на JSON с метаданными
    // Загрузи JSON на IPFS/Arweave сначала!
    const metadataUri = "https://ipfs.io/ipfs/YOUR_CID/metadata.json";

    // 6. Вызываем функцию создания NFT
    const tx = await program.methods
      .createPetNft(petName, metadataUri)
      .accounts({
        pet: petPDA,
        owner: wallet.publicKey,
        nftMint: nftMint.publicKey,
        nftTokenAccount: nftTokenAccount,
        metadata: metadataPDA,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([nftMint])
      .rpc();

    console.log('✅ NFT питомец создан!');
    console.log('🔗 Transaction:', tx);
    console.log('🎨 NFT Mint:', nftMint.publicKey.toString());
    console.log('📦 Pet Account:', petPDA.toString());

    return {
      signature: tx,
      petAccount: petPDA,
      nftMint: nftMint.publicKey
    };

  } catch (error) {
    console.error('❌ Ошибка создания NFT:', error);
    throw error;
  }
}

/**
 * 📖 Получить данные питомца
 */
async function getPetData(program, wallet) {
  try {
    // Получаем PDA питомца
    const [petPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from('pet'),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );

    // Загружаем данные
    const petAccount = await program.account.pet.fetch(petPDA);

    console.log('🐣 Данные питомца:');
    console.log('ID:', petAccount.petId);
    console.log('DNA:', petAccount.dna.toString());
    console.log('Вид:', petAccount.species);
    console.log('Редкость:', getRarityName(petAccount.rarity));
    console.log('Уровень:', petAccount.level);
    console.log('Здоровье:', petAccount.health);
    console.log('Голод:', petAccount.hunger);
    console.log('Счастье:', petAccount.happiness);
    console.log('Энергия:', petAccount.energy);
    console.log('Жив:', petAccount.isAlive);
    console.log('NFT Mint:', petAccount.nftMint.toString());

    return petAccount;

  } catch (error) {
    console.error('❌ Питомец не найден:', error);
    return null;
  }
}

/**
 * 🍖 Покормить питомца
 */
async function feedPet(program, wallet, tokenMint) {
  try {
    console.log('🍖 Кормим питомца...');

    const [petPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('pet'), wallet.publicKey.toBuffer()],
      program.programId
    );

    // User's token account
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
    );

    const tx = await program.methods
      .feedPet()
      .accounts({
        pet: petPDA,
        owner: wallet.publicKey,
        userTokenAccount: userTokenAccount,
        tokenMint: tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log('✅ Питомец покормлен! TX:', tx);
    return tx;

  } catch (error) {
    console.error('❌ Ошибка кормления:', error);
    throw error;
  }
}

/**
 * 🎮 Играть с питомцем
 */
async function playWithPet(program, wallet, tokenMint) {
  try {
    console.log('🎮 Играем с питомцем...');

    const [petPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('pet'), wallet.publicKey.toBuffer()],
      program.programId
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
    );

    const tx = await program.methods
      .playWithPet()
      .accounts({
        pet: petPDA,
        owner: wallet.publicKey,
        userTokenAccount: userTokenAccount,
        tokenMint: tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log('✅ Поиграли с питомцем! TX:', tx);
    return tx;

  } catch (error) {
    console.error('❌ Ошибка игры:', error);
    throw error;
  }
}

/**
 * 💊 Вылечить питомца
 */
async function healPet(program, wallet, tokenMint) {
  try {
    console.log('💊 Лечим питомца...');

    const [petPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('pet'), wallet.publicKey.toBuffer()],
      program.programId
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
    );

    const tx = await program.methods
      .healPet()
      .accounts({
        pet: petPDA,
        owner: wallet.publicKey,
        userTokenAccount: userTokenAccount,
        tokenMint: tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log('✅ Питомец вылечен! TX:', tx);
    return tx;

  } catch (error) {
    console.error('❌ Ошибка лечения:', error);
    throw error;
  }
}

/**
 * 😴 Отдохнуть
 */
async function restPet(program, wallet, tokenMint) {
  try {
    console.log('😴 Питомец отдыхает...');

    const [petPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('pet'), wallet.publicKey.toBuffer()],
      program.programId
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
    );

    const tx = await program.methods
      .restPet()
      .accounts({
        pet: petPDA,
        owner: wallet.publicKey,
        userTokenAccount: userTokenAccount,
        tokenMint: tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log('✅ Питомец отдохнул! TX:', tx);
    return tx;

  } catch (error) {
    console.error('❌ Ошибка отдыха:', error);
    throw error;
  }
}

/**
 * ⏰ Обновить decay
 */
async function updateDecay(program, wallet) {
  try {
    console.log('⏰ Обновляем decay...');

    const [petPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('pet'), wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .updateDecay()
      .accounts({
        pet: petPDA,
      })
      .rpc();

    console.log('✅ Decay обновлен! TX:', tx);
    return tx;

  } catch (error) {
    console.error('❌ Ошибка обновления decay:', error);
    throw error;
  }
}

/**
 * 🎨 Загрузить метаданные на IPFS
 * (Используй Pinata или nft.storage)
 */
async function uploadMetadataToIPFS(petData) {
  // Пример структуры метаданных
  const metadata = {
    name: `Tamagotchi #${petData.petId}`,
    symbol: "TAMA",
    description: "Уникальный крипто-питомец на Solana",
    image: `https://YOUR_DOMAIN/images/pet_${petData.petId}.png`,
    attributes: [
      { trait_type: "DNA", value: petData.dna.toString() },
      { trait_type: "Pet ID", value: petData.petId.toString() },
      { trait_type: "Species", value: petData.species.toString() },
      { trait_type: "Rarity", value: getRarityName(petData.rarity) },
      { trait_type: "Level", value: petData.level.toString() },
      { trait_type: "Health", value: petData.health.toString(), max_value: "100" },
      { trait_type: "Is Alive", value: petData.isAlive ? "Yes" : "No" }
    ],
    properties: {
      category: "image",
      creators: [
        {
          address: "YOUR_WALLET",
          share: 100
        }
      ]
    }
  };

  // TODO: Реальная загрузка на IPFS
  // Используй Pinata SDK или nft.storage
  console.log('📦 Метаданные:', JSON.stringify(metadata, null, 2));
  
  return "ipfs://YOUR_CID/metadata.json";
}

/**
 * 🌟 Получить название редкости
 */
function getRarityName(rarity) {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  return rarities[rarity] || 'Unknown';
}

/**
 * 🔧 Инициализация программы
 */
async function initProgram() {
  // Подключение к Solana
  const connection = new anchor.web3.Connection('https://api.devnet.solana.com');
  
  // Wallet (Phantom/Solflare)
  const wallet = window.solana;
  
  if (!wallet) {
    throw new Error('Phantom кошелек не найден!');
  }

  await wallet.connect();
  
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );

  // Загружаем IDL и создаем программу
  const programId = new PublicKey('YOUR_PROGRAM_ID');
  const idl = await anchor.Program.fetchIdl(programId, provider);
  const program = new anchor.Program(idl, programId, provider);

  return { program, wallet, connection };
}

/**
 * 📊 Пример использования
 */
async function main() {
  try {
    // 1. Инициализация
    const { program, wallet, connection } = await initProgram();
    
    console.log('👛 Кошелек:', wallet.publicKey.toString());

    // 2. Создать NFT питомца
    const result = await createPetNFT(program, wallet);
    
    // 3. Получить данные питомца
    const petData = await getPetData(program, wallet);
    
    // 4. Покормить питомца (если нужно)
    const tokenMint = new PublicKey('YOUR_TOKEN_MINT');
    await feedPet(program, wallet, tokenMint);
    
    // 5. Обновить decay
    await updateDecay(program, wallet);
    
    // 6. Получить обновленные данные
    const updatedData = await getPetData(program, wallet);
    
    console.log('🎉 Готово!');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

// Экспорт функций
export {
  initProgram,
  createPetNFT,
  getPetData,
  feedPet,
  playWithPet,
  healPet,
  restPet,
  updateDecay,
  uploadMetadataToIPFS,
  getRarityName
};

// Запуск (для примера)
// main();


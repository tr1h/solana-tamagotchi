// ============================================================================
// 🔍 ПОЛУЧИТЬ ВСЮ ИНФОРМАЦИЮ ДЛЯ ФРОНТЕНДА
// ============================================================================

describe("Get All Info", () => {
  it("Показать всю информацию", async () => {
    console.log("\n");
    console.log("════════════════════════════════════════════════════════════");
    console.log("🎮 ВСЯ ИНФОРМАЦИЯ ДЛЯ TAMAGOTCHI ФРОНТЕНДА");
    console.log("════════════════════════════════════════════════════════════");
    console.log("");
    
    // 1. Program ID
    console.log("📝 PROGRAM ID (САМОЕ ВАЖНОЕ!):");
    console.log(pg.PROGRAM_ID.toString());
    console.log("");
    
    // 2. Wallet Address
    console.log("💼 Твой Wallet Address:");
    console.log(pg.wallet.publicKey.toString());
    console.log("");
    
    // 3. Баланс
    const balance = await pg.connection.getBalance(pg.wallet.publicKey);
    console.log("💰 Баланс SOL:", (balance / 1e9).toFixed(2), "SOL");
    console.log("");
    
    // 4. Network
    console.log("🌐 Network:", "Devnet");
    console.log("🔗 RPC:", "https://api.devnet.solana.com");
    console.log("");
    
    // 5. Token Mint (TAMA)
    console.log("🪙 TAMA Token Mint:");
    console.log("74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD");
    console.log("");
    
    console.log("════════════════════════════════════════════════════════════");
    console.log("✅ СКОПИРУЙ PROGRAM ID И ДАЙ МНЕ!");
    console.log("════════════════════════════════════════════════════════════");
    console.log("\n");
  });
  
  it("Проверить питомца (если есть)", async () => {
    try {
      const [petPda] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("pet"), pg.wallet.publicKey.toBuffer()],
        pg.PROGRAM_ID
      );
      
      const petAccount = await pg.program.account.pet.fetch(petPda);
      
      console.log("\n");
      console.log("════════════════════════════════════════════════════════════");
      console.log("🐣 ТВОЙ ПИТОМЕЦ НАЙДЕН!");
      console.log("════════════════════════════════════════════════════════════");
      console.log("🆔 Pet ID:", petAccount.petId);
      console.log("🧬 DNA:", petAccount.dna.toString());
      console.log("🎨 Species:", petAccount.species);
      console.log("✨ Rarity:", petAccount.rarity);
      console.log("📊 Level:", petAccount.level);
      console.log("❤️  Health:", petAccount.health);
      console.log("🍖 Hunger:", petAccount.hunger);
      console.log("😊 Happiness:", petAccount.happiness);
      console.log("⚡ Energy:", petAccount.energy);
      console.log("💀 Alive:", petAccount.isAlive);
      console.log("🔥 Tokens burned:", petAccount.totalTokensBurned.toString());
      console.log("════════════════════════════════════════════════════════════");
      console.log("\n");
    } catch (e) {
      console.log("\n❌ Питомец не найден (это нормально, создай нового!)");
    }
  });
});



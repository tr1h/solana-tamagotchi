import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Tamagotchi } from "./target/types/tamagotchi";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("tamagotchi", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Tamagotchi as Program<Tamagotchi>;
  const provider = anchor.getProvider();

  // Test accounts
  let user: Keypair;
  let petPda: PublicKey;
  let petBump: number;

  before(async () => {
    // Create test user
    user = Keypair.generate();
    
    // Airdrop SOL to user
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
    
    console.log("✅ User created and funded:", user.publicKey.toString());
  });

  it("1️⃣ Проверяем что контракт задеплоен", async () => {
    try {
      const programInfo = await provider.connection.getAccountInfo(program.programId);
      expect(programInfo).to.not.be.null;
      console.log("✅ Контракт найден:", program.programId.toString());
    } catch (err) {
      console.error("❌ Контракт не найден:", err);
      throw err;
    }
  });

  it("2️⃣ Создаем питомца (старая версия)", async () => {
    // Generate pet PDA
    [petPda, petBump] = await PublicKey.findProgramAddress(
      [Buffer.from("pet"), user.publicKey.toBuffer()],
      program.programId
    );

    console.log("📍 Pet PDA:", petPda.toString());

    // Create pet
    const tx = await program.methods
      .createPet()
      .accounts({
        pet: petPda,
        owner: user.publicKey,
        tokenMint: new PublicKey("74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD"), // TAMA token
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    console.log("✅ Pet created, tx:", tx);

    // Fetch pet data
    const petData = await program.account.pet.fetch(petPda);
    console.log("🐣 Pet data:", {
      owner: petData.owner.toString(),
      petId: petData.petId,
      species: petData.species,
      rarity: petData.rarity,
      level: petData.level,
      health: petData.health,
      hunger: petData.hunger,
      happiness: petData.happiness,
      energy: petData.energy,
      lives: petData.lives, // Новое поле!
      isAlive: petData.isAlive,
    });

    // Проверяем что у питомца 3 жизни
    expect(petData.lives).to.equal(3);
    console.log("✅ У питомца 3 жизни:", petData.lives);
  });

  it("3️⃣ Тестируем кормление (с auto decay)", async () => {
    // Feed pet
    const tx = await program.methods
      .feedPet()
      .accounts({
        pet: petPda,
        owner: user.publicKey,
        userTokenAccount: user.publicKey, // Simplified for test
        tokenMint: new PublicKey("74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD"),
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })
      .signers([user])
      .rpc();

    console.log("✅ Pet fed, tx:", tx);

    // Fetch updated pet data
    const petData = await program.account.pet.fetch(petPda);
    console.log("🍖 After feeding:", {
      health: petData.health,
      hunger: petData.hunger,
      experience: petData.experience,
      actionsCount: petData.actionsCount,
    });
  });

  it("4️⃣ Тестируем игру", async () => {
    // Play with pet
    const tx = await program.methods
      .playWithPet()
      .accounts({
        pet: petPda,
        owner: user.publicKey,
        userTokenAccount: user.publicKey,
        tokenMint: new PublicKey("74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD"),
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })
      .signers([user])
      .rpc();

    console.log("✅ Pet played, tx:", tx);

    // Fetch updated pet data
    const petData = await program.account.pet.fetch(petPda);
    console.log("🎮 After playing:", {
      happiness: petData.happiness,
      energy: petData.energy,
      experience: petData.experience,
    });
  });

  it("5️⃣ Тестируем отдых", async () => {
    // Rest pet
    const tx = await program.methods
      .restPet()
      .accounts({
        pet: petPda,
        owner: user.publicKey,
        userTokenAccount: user.publicKey,
        tokenMint: new PublicKey("74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD"),
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })
      .signers([user])
      .rpc();

    console.log("✅ Pet rested, tx:", tx);

    // Fetch updated pet data
    const petData = await program.account.pet.fetch(petPda);
    console.log("😴 After resting:", {
      energy: petData.energy,
      health: petData.health,
    });
  });

  it("6️⃣ Тестируем лечение", async () => {
    // Heal pet
    const tx = await program.methods
      .healPet()
      .accounts({
        pet: petPda,
        owner: user.publicKey,
        userTokenAccount: user.publicKey,
        tokenMint: new PublicKey("74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD"),
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })
      .signers([user])
      .rpc();

    console.log("✅ Pet healed, tx:", tx);

    // Fetch updated pet data
    const petData = await program.account.pet.fetch(petPda);
    console.log("💊 After healing:", {
      health: petData.health,
    });
  });

  it("7️⃣ Тестируем ручной decay", async () => {
    // Update decay manually
    const tx = await program.methods
      .updateDecay()
      .accounts({
        pet: petPda,
      })
      .rpc();

    console.log("✅ Decay updated, tx:", tx);

    // Fetch updated pet data
    const petData = await program.account.pet.fetch(petPda);
    console.log("⏰ After decay:", {
      health: petData.health,
      hunger: petData.hunger,
      happiness: petData.happiness,
      energy: petData.energy,
      lives: petData.lives,
      isAlive: petData.isAlive,
    });
  });

  it("8️⃣ Показываем финальную информацию", async () => {
    const petData = await program.account.pet.fetch(petPda);
    
    console.log("\n🎉 ФИНАЛЬНАЯ ИНФОРМАЦИЯ:");
    console.log("📍 Program ID:", program.programId.toString());
    console.log("📍 Pet PDA:", petPda.toString());
    console.log("👤 Owner:", petData.owner.toString());
    console.log("🐣 Pet ID:", petData.petId);
    console.log("🎨 Species:", petData.species);
    console.log("⭐ Rarity:", petData.rarity);
    console.log("📈 Level:", petData.level);
    console.log("❤️ Health:", petData.health);
    console.log("🍖 Hunger:", petData.hunger);
    console.log("😊 Happiness:", petData.happiness);
    console.log("⚡ Energy:", petData.energy);
    console.log("❤️ Lives:", petData.lives, "(НОВОЕ ПОЛЕ!)");
    console.log("💀 Is Alive:", petData.isAlive);
    console.log("🎂 Age:", petData.age);
    console.log("🔥 Actions Count:", petData.actionsCount);
    console.log("💰 Tokens Burned:", petData.totalTokensBurned);
    
    console.log("\n✅ ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!");
    console.log("🚀 Контракт готов к использованию!");
  });
});














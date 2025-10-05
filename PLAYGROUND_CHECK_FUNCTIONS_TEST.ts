// ============================================================================
// 🔍 ПРОВЕРКА ДОСТУПНЫХ ФУНКЦИЙ В КОНТРАКТЕ
// ============================================================================

describe("Check Contract Functions", () => {
  it("Проверить какие функции есть в контракте", async () => {
    console.log("\n");
    console.log("════════════════════════════════════════════════════════════");
    console.log("🔍 ПРОВЕРКА ФУНКЦИЙ В КОНТРАКТЕ");
    console.log("════════════════════════════════════════════════════════════");
    console.log("");
    
    // Получаем IDL
    const idl = pg.program.idl;
    
    console.log("📋 Доступные функции:");
    console.log("");
    
    let hasFeedPet = false;
    let hasPlayWithPet = false;
    let hasHealPet = false;
    let hasRestPet = false;
    let hasUpdateDecay = false;
    
    idl.instructions.forEach((instruction) => {
      const name = instruction.name;
      console.log(`  ✓ ${name}`);
      
      if (name === "feed_pet") hasFeedPet = true;
      if (name === "play_with_pet") hasPlayWithPet = true;
      if (name === "heal_pet") hasHealPet = true;
      if (name === "rest_pet") hasRestPet = true;
      if (name === "update_decay") hasUpdateDecay = true;
    });
    
    console.log("");
    console.log("════════════════════════════════════════════════════════════");
    console.log("📊 СТАТУС ФУНКЦИЙ:");
    console.log("════════════════════════════════════════════════════════════");
    console.log(`  ${hasFeedPet ? "✅" : "❌"} feed_pet`);
    console.log(`  ${hasPlayWithPet ? "✅" : "❌"} play_with_pet`);
    console.log(`  ${hasHealPet ? "✅" : "❌"} heal_pet`);
    console.log(`  ${hasRestPet ? "✅" : "❌"} rest_pet`);
    console.log(`  ${hasUpdateDecay ? "✅" : "❌"} update_decay`);
    console.log("");
    
    if (hasHealPet && hasRestPet) {
      console.log("🎉 ВСЕ ФУНКЦИИ ЕСТЬ! ГОТОВО К ДЕПЛОЮ ФРОНТА!");
    } else {
      console.log("⚠️  НЕТ heal_pet или rest_pet!");
      console.log("📝 НУЖНО:");
      console.log("   1. Замени src/lib.rs на PLAYGROUND_FULL_lib.rs");
      console.log("   2. $ build");
      console.log("   3. $ deploy");
    }
    
    console.log("════════════════════════════════════════════════════════════");
    console.log("\n");
  });
});



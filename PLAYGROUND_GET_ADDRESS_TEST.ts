// ============================================================================
// 🔍 УЗНАЙ СВОЙ WALLET ADDRESS
// ============================================================================

describe("Get Wallet Address", () => {
  it("Показать мой wallet address", async () => {
    // Твой wallet address:
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💼 ТВОЙ WALLET ADDRESS:");
    console.log(pg.wallet.publicKey.toString());
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Баланс:
    const balance = await pg.connection.getBalance(pg.wallet.publicKey);
    console.log("💰 Баланс:", balance / 1e9, "SOL");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
  });
});



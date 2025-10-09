module.exports = {
  async up(db, client) {

    // Indexes for session
    {
      const existingIndexes = await db.collection("session").indexes();
      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '{"user":1}')) {
        await db.collection("session").createIndex({"user":1}, {...{"background":true}, name: "migration_2025_10_09_16_56_10_user"});
        console.log("Created migration index: migration_2025_10_09_16_56_10_user");
      } else { console.log("Index exists, skip"); }
    }

    // Indexes for users
    {
      const existingIndexes = await db.collection("users").indexes();
      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '{"role._id":1}')) {
        await db.collection("users").createIndex({"role._id":1}, {...{"background":true}, name: "migration_2025_10_09_16_56_10_role._id"});
        console.log("Created migration index: migration_2025_10_09_16_56_10_role._id");
      } else { console.log("Index exists, skip"); }
    }
    {
      const existingIndexes = await db.collection("users").indexes();
      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '{"email":1}')) {
        await db.collection("users").createIndex({"email":1}, {...{"unique":true,"sparse":true,"background":true}, name: "migration_2025_10_09_16_56_10_email"});
        console.log("Created migration index: migration_2025_10_09_16_56_10_email");
      } else { console.log("Index exists, skip"); }
    }
    {
      const existingIndexes = await db.collection("users").indexes();
      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '{"username":1}')) {
        await db.collection("users").createIndex({"username":1}, {...{"unique":true,"sparse":true,"background":true}, name: "migration_2025_10_09_16_56_10_username"});
        console.log("Created migration index: migration_2025_10_09_16_56_10_username");
      } else { console.log("Index exists, skip"); }
    }
    {
      const existingIndexes = await db.collection("users").indexes();
      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '{"provider":1,"socialId":1}')) {
        await db.collection("users").createIndex({"provider":1,"socialId":1}, {...{"unique":true,"sparse":true,"background":true}, name: "migration_2025_10_09_16_56_10_provider_socialId"});
        console.log("Created migration index: migration_2025_10_09_16_56_10_provider_socialId");
      } else { console.log("Index exists, skip"); }
    }
    {
      const existingIndexes = await db.collection("users").indexes();
      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '{"status._id":1}')) {
        await db.collection("users").createIndex({"status._id":1}, {...{"background":true}, name: "migration_2025_10_09_16_56_10_status._id"});
        console.log("Created migration index: migration_2025_10_09_16_56_10_status._id");
      } else { console.log("Index exists, skip"); }
    }
    {
      const existingIndexes = await db.collection("users").indexes();
      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '{"deletedAt":1}')) {
        await db.collection("users").createIndex({"deletedAt":1}, {...{"partialFilterExpression":{"deletedAt":null},"background":true}, name: "migration_2025_10_09_16_56_10_deletedAt"});
        console.log("Created migration index: migration_2025_10_09_16_56_10_deletedAt");
      } else { console.log("Index exists, skip"); }
    }
  },
  async down(db, client) {
    await db.collection("session").dropIndex("migration_2025_10_09_16_56_10_user").catch(()=>{});
    await db.collection("users").dropIndex("migration_2025_10_09_16_56_10_role._id").catch(()=>{});
    await db.collection("users").dropIndex("migration_2025_10_09_16_56_10_email").catch(()=>{});
    await db.collection("users").dropIndex("migration_2025_10_09_16_56_10_username").catch(()=>{});
    await db.collection("users").dropIndex("migration_2025_10_09_16_56_10_provider_socialId").catch(()=>{});
    await db.collection("users").dropIndex("migration_2025_10_09_16_56_10_status._id").catch(()=>{});
    await db.collection("users").dropIndex("migration_2025_10_09_16_56_10_deletedAt").catch(()=>{});
  }
};

module.exports = {
  async up(db, client) {
    // sessions indexes from session.schema.ts
    await db
      .collection('sessions')
      .createIndex({ user: 1 }, { background: true });

    // users indexes from user.schema.ts
    await db
      .collection('users')
      .createIndex({ 'role._id': 1 }, { background: true });
    await db
      .collection('users')
      .createIndex(
        { email: 1 },
        { unique: true, sparse: true, background: true },
      );
    await db
      .collection('users')
      .createIndex(
        { username: 1 },
        { unique: true, sparse: true, background: true },
      );
    await db
      .collection('users')
      .createIndex(
        { provider: 1, socialId: 1 },
        { unique: true, sparse: true, background: true },
      );
    await db
      .collection('users')
      .createIndex({ 'status._id': 1 }, { background: true });
    await db
      .collection('users')
      .createIndex(
        { deletedAt: 1 },
        { partialFilterExpression: { deletedAt: null }, background: true },
      );
  },
  async down(db, client) {
    console.log('Rollback not implemented (auto-generated)');
  },
};

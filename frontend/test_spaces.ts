class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value.toString(); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

(global as any).localStorage = new MockLocalStorage();

async function runSpaceTests() {
  const { getSpaces, deleteSpace } = await import('./src/api/spaces');
  const { getMockMemories } = await import('./src/data/mock');

  console.log('Testing CampusMind Delete Space Feature...');

  // 1. Initial spaces
  const initialSpaces = await getSpaces();
  console.assert(initialSpaces.some(s => s.id === 'space_dbms'), 'Expected space_dbms to exist');

  // Verify memories belong to space_dbms initially
  const initialMemories = getMockMemories();
  const dbmsMemories = initialMemories.filter(m => m.space_id === 'space_dbms');
  console.assert(dbmsMemories.length > 0, `Expected dbms memories, found ${dbmsMemories.length}`);
  console.log(`Initial: ${initialSpaces.length} spaces, ${dbmsMemories.length} memories in space_dbms`);

  // 2. Delete space_dbms
  await deleteSpace('space_dbms');

  // 3. Verify space is removed
  const remainingSpaces = await getSpaces();
  console.assert(!remainingSpaces.some(s => s.id === 'space_dbms'), 'space_dbms should be deleted');
  console.assert(remainingSpaces.length === initialSpaces.length - 1, 'Space count should decrease by 1');
  console.log('✔ Space deleted from spaces list');

  // 4. Verify memories were NOT deleted, but moved to unassigned (space_id = undefined/null)
  const afterMemories = getMockMemories();
  console.assert(afterMemories.length === initialMemories.length, 'Total memories count must not change');

  const unassignedMemories = afterMemories.filter(m => dbmsMemories.some(dm => dm.id === m.id));
  unassignedMemories.forEach(m => {
    console.assert(m.space_id === undefined || m.space_id === null, `Memory ${m.id} should have space_id undefined/null`);
  });
  console.log('✔ Memories from deleted space preserved and moved to Unassigned');

  console.log('All delete-space tests passed successfully!');
}

runSpaceTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

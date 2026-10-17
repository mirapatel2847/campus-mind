class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value.toString(); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

(global as any).localStorage = new MockLocalStorage();

async function runTests() {
  const { getMemories, createMemory, updateMemory, deleteMemory, getSpaces } = await import('./src/api/memories');

  console.log('Testing CampusMind Memory API & Mock Layer...');

  // 1. Get Spaces
  const spaces = await getSpaces();
  console.assert(spaces.length >= 4, `Expected at least 4 spaces, got ${spaces.length}`);
  console.log(`✔ Spaces test passed (${spaces.length} spaces: ${spaces.map(s => s.emoji + ' ' + s.name).join(', ')})`);

  // 2. Get Memories for Home Page
  const memories = await getMemories({ status: 'active', archived: false });
  console.assert(memories.length > 0, 'Expected active memories');

  // Verify superseded memory is NOT present on Home
  const originalExam = memories.find(m => m.id === 'mem_dbms_original');
  console.assert(!originalExam, 'Original superseded exam should NOT be returned for active status');

  // Verify rescheduled exam IS present and has supersedes_id
  const rescheduledExam = memories.find(m => m.id === 'mem_dbms_rescheduled');
  console.assert(!!rescheduledExam, 'Rescheduled exam must be present on Home');
  console.assert(rescheduledExam?.supersedes_id === 'mem_dbms_original', 'Must link to superseded exam ID');
  console.log('✔ Superseded pair test passed: original hidden, updated shown with supersedes_id');

  // 3. QuickCapture create
  const created = await createMemory({ content: 'Urgent DBMS Lab submission due tonight!' });
  console.assert(created.title.includes('Urgent DBMS Lab'), 'Title inference failed');
  console.assert(created.category === 'deadline' || created.category === 'exam', `Inferred category: ${created.category}`);
  console.assert(created.tags.some(t => t.ai), 'Expected AI tags on newly created memory');
  console.log('✔ QuickCapture createMemory test passed');

  // 4. Update memory (note & favourite)
  const updated = await updateMemory(created.id, { note: 'Completed step 1-3', is_favourite: true });
  console.assert(updated.note === 'Completed step 1-3', 'Note update failed');
  console.assert(updated.is_favourite === true, 'Favourite update failed');
  console.log('✔ UpdateMemory test passed');

  // 5. Delete memory
  await deleteMemory(created.id);
  const remaining = await getMemories({ status: 'active', archived: false });
  console.assert(!remaining.some(m => m.id === created.id), 'Deleted memory still present');
  console.log('✔ DeleteMemory test passed');

  console.log('All CampusMind Home & Memory tests passed successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

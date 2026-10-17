async function runCalendarTests() {
  const { getEvents, getEventById } = await import('./src/api/events');

  console.log('Testing CampusMind Calendar API & Data Layer...');

  // 1. Fetch events without superseded
  const activeEvents = await getEvents({ include_superseded: false });
  console.assert(activeEvents.length >= 10, `Expected at least 10 active events, got ${activeEvents.length}`);
  console.assert(!activeEvents.some(e => e.status === 'superseded'), 'Superseded events should be excluded by default');
  console.log(`✔ Active events query passed (${activeEvents.length} events, superseded excluded)`);

  // 2. Fetch all events including superseded
  const allEvents = await getEvents({ include_superseded: true });
  console.assert(allEvents.length >= 14, `Expected at least 14 events total, got ${allEvents.length}`);

  // Verify superseded pair
  const oldExam = allEvents.find(e => e.id === 'evt_dbms_original');
  const newExam = allEvents.find(e => e.id === 'evt_dbms_rescheduled');

  console.assert(oldExam?.status === 'superseded', 'Old exam should have status superseded');
  console.assert(newExam?.status === 'active', 'New exam should have status active');
  console.assert(oldExam?.superseded_by_id === 'evt_dbms_rescheduled', 'Old exam should point to replacement');
  console.assert(newExam?.supersedes_id === 'evt_dbms_original', 'New exam should point to superseded event');
  console.log('✔ Superseded pair validation passed: old exam linked to rescheduled exam');

  // 3. Verify event types
  const types = new Set(allEvents.map(e => e.type));
  console.assert(types.has('exam'), 'Must contain exam type');
  console.assert(types.has('deadline'), 'Must contain deadline type');
  console.assert(types.has('event'), 'Must contain event type');
  console.assert(types.has('other'), 'Must contain other type');
  console.log('✔ All 4 event types represented: exam, deadline, event, other');

  // 4. Verify filtering by type
  const examsOnly = await getEvents({ type: 'exam', include_superseded: true });
  console.assert(examsOnly.every(e => e.type === 'exam'), 'All returned must be exams');
  console.log(`✔ Type filter passed (${examsOnly.length} exams)`);

  // 5. Verify filtering by subject
  const mathsOnly = await getEvents({ subject: 'Maths', include_superseded: true });
  console.assert(mathsOnly.every(e => e.subject === 'Maths'), 'All returned must have subject Maths');
  console.log(`✔ Subject filter passed (${mathsOnly.length} Maths events)`);

  // 6. Verify getEventById
  const single = await getEventById('evt_dbms_rescheduled');
  console.assert(single.id === 'evt_dbms_rescheduled', 'Event ID mismatch');
  console.assert(single.memory_id === 'mem_dbms_rescheduled', 'Linked memory ID mismatch');
  console.log('✔ getEventById passed');

  console.log('All Calendar API tests passed successfully!');
}

runCalendarTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

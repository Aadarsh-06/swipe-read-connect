import { createClient } from '@supabase/supabase-js';

// Use the same URL as the app; anon key is sufficient if RLS allows deletes.
const SUPABASE_URL = 'https://yyupyzapcugtgjzubvie.supabase.co';
// Prefer SERVICE_ROLE if provided (for reliability), otherwise fallback to anon.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dXB5emFwY3VndGdqenVidmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODA0MjAsImV4cCI6MjA3MDg1NjQyMH0.OgjJNUmGKAIgVdIPWZ9e0w9DIRgVXxOzRCWp3yDa7MY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Keep exactly these 10 ISBNs
const curatedIsbns = [
  '9780810993136', // Diary of a Wimpy Kid
  '9781444929475', // Five on a Treasure Island
  '9780747532699', // Harry Potter 1
  '9780786838653', // Percy Jackson LT
  '9780261102217', // The Hobbit
  '9780064471046', // The Lion, the Witch and the Wardrobe
  '9780590453653', // Goosebumps: Welcome to Dead House
  '9780439559638', // Geronimo Stilton
  '9780448095011', // Nancy Drew: Secret of the Old Clock
  '9780448089010', // Hardy Boys: Tower Treasure
];

async function main() {
  const BATCH = parseInt(process.env.BATCH_SIZE || '1000', 10);
  let totalDeleted = 0;
  let batchNum = 0;

  while (true) {
    batchNum += 1;
    console.log(`Fetching batch #${batchNum} (limit ${BATCH})...`);
    const { data: batch, error: fetchErr } = await supabase
      .from('BOOKS')
      .select('id, ISBN')
      .order('id', { ascending: true })
      .limit(BATCH);
    if (fetchErr) {
      console.error('Error fetching batch:', fetchErr.message);
      process.exitCode = 1;
      return;
    }
    const idsArray = (batch || [])
      .filter((r) => !(r.ISBN && curatedIsbns.includes(r.ISBN)))
      .map((r) => r.id);
    if (!idsArray.length) {
      console.log('No more non-curated books to delete.');
      break;
    }

    console.log(`Batch #${batchNum}: deleting ${idsArray.length} books and dependents...`);
    const { error: prefErr } = await supabase
      .from('user_book_preferences')
      .delete()
      .in('book_id', idsArray);
    if (prefErr) console.warn('user_book_preferences delete warning:', prefErr.message);

    const { error: matchesErr } = await supabase
      .from('matches')
      .delete()
      .in('book_id', idsArray);
    if (matchesErr) console.warn('matches delete warning:', matchesErr.message);

    const { error: booksErr } = await supabase
      .from('BOOKS')
      .delete()
      .in('id', idsArray);
    if (booksErr) {
      console.error('BOOKS delete error:', booksErr.message);
      process.exitCode = 1;
      return;
    }
    totalDeleted += idsArray.length;
    console.log(`Deleted so far: ${totalDeleted}`);
  }

  console.log(`Cleanup complete. Total books deleted: ${totalDeleted}`);
}

main().catch((e) => {
  console.error('Cleanup failed:', e);
  process.exitCode = 1;
});
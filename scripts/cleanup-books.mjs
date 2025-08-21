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
  console.log('Fetching BOOKS to evaluate...');
  const ids = new Set();

  // Fetch a broad set and filter client-side to avoid operator quirks
  const { data: allBooks, error: allErr } = await supabase
    .from('BOOKS')
    .select('id, ISBN')
    .limit(10000);
  if (allErr) {
    console.error('Error fetching BOOKS:', allErr.message);
    process.exitCode = 1;
    return;
  }
  (allBooks || []).forEach((r) => {
    const keep = r.ISBN && curatedIsbns.includes(r.ISBN);
    if (!keep) ids.add(r.id);
  });

  const idsArray = Array.from(ids);
  console.log('Found', idsArray.length, 'BOOKS to delete');
  if (idsArray.length === 0) {
    console.log('Nothing to delete. Exiting.');
    return;
  }

  // Delete dependent rows first to satisfy FKs / RLS
  console.log('Deleting dependent user_book_preferences...');
  const { error: prefErr } = await supabase
    .from('user_book_preferences')
    .delete()
    .in('book_id', idsArray);
  if (prefErr) console.warn('user_book_preferences delete warning:', prefErr.message);

  console.log('Deleting dependent matches...');
  const { error: matchesErr } = await supabase
    .from('matches')
    .delete()
    .in('book_id', idsArray);
  if (matchesErr) console.warn('matches delete warning:', matchesErr.message);

  console.log('Deleting BOOKS rows...');
  const { error: booksErr } = await supabase
    .from('BOOKS')
    .delete()
    .in('id', idsArray);
  if (booksErr) {
    console.error('BOOKS delete error:', booksErr.message);
    process.exitCode = 1;
    return;
  }

  console.log('Cleanup complete.');
}

main().catch((e) => {
  console.error('Cleanup failed:', e);
  process.exitCode = 1;
});


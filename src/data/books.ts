import { supabase } from "@/integrations/supabase/client";

export interface CuratedBook {
  id?: number; // Supabase BOOKS id after sync
  title: string;
  author: string;
  publisher?: string;
  year?: number;
  imageUrl: string;
  isbn: string;
  summary: string;
  authorBio?: string;
}

export const curatedBooks: CuratedBook[] = [
  {
    title: "Diary of a Wimpy Kid",
    author: "Jeff Kinney",
    publisher: "Amulet Books",
    year: 2007,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780810993136-L.jpg",
    isbn: "9780810993136",
    summary: "Greg Heffley chronicles the awkward, hilarious trials of middle school in his illustrated diary.",
    authorBio: "Jeff Kinney is an American author and cartoonist, best known for creating the Diary of a Wimpy Kid series.",
  },
  {
    title: "Five on a Treasure Island (Famous Five #1)",
    author: "Enid Blyton",
    publisher: "Hodder Children's Books",
    year: 1942,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781444929475-L.jpg",
    isbn: "9781444929475",
    summary: "Julian, Dick, Anne, George and Timmy the dog discover a shipwreck and a secret treasure on Kirrin Island.",
    authorBio: "Enid Blyton wrote hundreds of children's books, including the Famous Five and Secret Seven series.",
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    publisher: "Bloomsbury",
    year: 1997,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg",
    isbn: "9780747532699",
    summary: "An orphan discovers he is a wizard and attends Hogwarts, beginning an adventure against dark forces.",
    authorBio: "J.K. Rowling is the author of the Harry Potter series, a global phenomenon in children's literature.",
  },
  {
    title: "Percy Jackson and the Lightning Thief",
    author: "Rick Riordan",
    publisher: "Disney-Hyperion",
    year: 2005,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780786838653-L.jpg",
    isbn: "9780786838653",
    summary: "Percy discovers he is a demigod and embarks on a quest to retrieve Zeus's stolen lightning bolt.",
    authorBio: "Rick Riordan is known for myth-inspired series like Percy Jackson and the Olympians.",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publisher: "George Allen & Unwin",
    year: 1937,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780261102217-L.jpg",
    isbn: "9780261102217",
    summary: "Bilbo Baggins joins a company of dwarves to reclaim their treasure from the dragon Smaug.",
    authorBio: "J.R.R. Tolkien was an English writer and philologist, author of The Hobbit and The Lord of the Rings.",
  },
  {
    title: "The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    publisher: "Geoffrey Bles",
    year: 1950,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780064471046-L.jpg",
    isbn: "9780064471046",
    summary: "Four siblings discover the magical land of Narnia and help Aslan defeat the White Witch.",
    authorBio: "C.S. Lewis was a British writer and scholar, best known for The Chronicles of Narnia.",
  },
  {
    title: "Goosebumps: Welcome to Dead House",
    author: "R.L. Stine",
    publisher: "Scholastic",
    year: 1992,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780590453653-L.jpg",
    isbn: "9780590453653",
    summary: "Siblings Josh and Amanda move into a creepy old house in a town with a terrifying secret.",
    authorBio: "R.L. Stine is an American novelist, known as the 'Stephen King of children's literature'.",
  },
  {
    title: "Geronimo Stilton: The Lost Treasure of the Emerald Eye",
    author: "Geronimo Stilton",
    publisher: "Scholastic",
    year: 2000,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780439559638-L.jpg",
    isbn: "9780439559638",
    summary: "Geronimo and his sister Thea set off on a treasure hunt filled with clues and surprises.",
    authorBio: "Elisabetta Dami created the Geronimo Stilton series under the titular pen name.",
  },
  {
    title: "Nancy Drew: The Secret of the Old Clock",
    author: "Carolyn Keene",
    publisher: "Grosset & Dunlap",
    year: 1930,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780448095011-L.jpg",
    isbn: "9780448095011",
    summary: "Teen sleuth Nancy Drew uncovers a hidden will while investigating a puzzling inheritance.",
    authorBio: "'Carolyn Keene' is the collective pseudonym for authors of the Nancy Drew series.",
  },
  {
    title: "The Hardy Boys: The Tower Treasure",
    author: "Franklin W. Dixon",
    publisher: "Grosset & Dunlap",
    year: 1927,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780448089010-L.jpg",
    isbn: "9780448089010",
    summary: "Frank and Joe Hardy investigate a jewel theft linked to a mysterious tower.",
    authorBio: "'Franklin W. Dixon' is a pen name used by various writers for the Hardy Boys series.",
  },
];

export async function syncCuratedBooks(): Promise<CuratedBook[]> {
  try {
    const isbns = curatedBooks.map((b) => b.isbn);
    // Fetch existing IDs by ISBN
    const { data: existing, error: selectError } = await supabase
      .from("BOOKS")
      .select("id, ISBN")
      .in("ISBN", isbns);

    if (selectError) {
      // eslint-disable-next-line no-console
      console.warn("BOOKS select error:", selectError.message);
    }

    const isbnToId = new Map<string, number>();
    for (const row of existing || []) {
      if (row.ISBN && row.id) isbnToId.set(row.ISBN, row.id);
    }

    // Determine which need inserting
    const toInsert = curatedBooks.filter((b) => !isbnToId.has(b.isbn)).map((b) => ({
      "Book-Title": b.title,
      "Book-Author": b.author,
      "Image-URL-S": b.imageUrl,
      "Image-URL-M": b.imageUrl,
      "Image-URL-L": b.imageUrl,
      ISBN: b.isbn,
      Publisher: b.publisher ?? null,
      "Year-Of-Publication": b.year ?? null,
    }));

    if (toInsert.length > 0) {
      const { data: inserted, error: insertError } = await supabase
        .from("BOOKS")
        .insert(toInsert)
        .select("id, ISBN");
      if (insertError) {
        // eslint-disable-next-line no-console
        console.warn("BOOKS insert error:", insertError.message);
      } else {
        for (const row of inserted || []) {
          if (row.ISBN && row.id) isbnToId.set(row.ISBN, row.id);
        }
      }
    }

    // Return curated books with Supabase IDs attached
    return curatedBooks.map((b) => ({ ...b, id: isbnToId.get(b.isbn) }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("syncCuratedBooks error", e);
    // Return without ids if something fails so UI still works (but likes may fail)
    return curatedBooks;
  }
}
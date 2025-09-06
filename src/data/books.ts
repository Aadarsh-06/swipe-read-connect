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
  // Original curated books
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
  
  // LAC Books collection
  {
    title: "The Girl With the Dragon Tattoo",
    author: "Stieg Larsson",
    publisher: "Norstedts Förlag",
    year: 2005,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780307949486-L.jpg",
    isbn: "9780307949486",
    summary: "A journalist and a hacker investigate a wealthy family's dark secrets in this gripping thriller.",
    authorBio: "Stieg Larsson was a Swedish journalist and writer, best known for his Millennium trilogy.",
  },
  {
    title: "To the Lighthouse",
    author: "Virginia Woolf",
    publisher: "Hogarth Press",
    year: 1927,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780156907392-L.jpg",
    isbn: "9780156907392",
    summary: "A modernist masterpiece exploring consciousness, time, and the complexity of human relationships.",
    authorBio: "Virginia Woolf was an English writer and a central figure in the modernist movement.",
  },
  {
    title: "Brida",
    author: "Paulo Coelho",
    publisher: "Planeta",
    year: 1990,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780061251825-L.jpg",
    isbn: "9780061251825",
    summary: "A young Irish girl's journey to become a witch and discover her true destiny through ancient traditions and wisdom.",
    authorBio: "Paulo Coelho is a Brazilian lyricist and novelist, best known for The Alchemist.",
  },
  {
    title: "Shopaholic Takes Manhattan",
    author: "Sophie Kinsella",
    publisher: "Bantam",
    year: 2002,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780385335485-L.jpg",
    isbn: "9780385335485",
    summary: "Becky Bloomwood faces new challenges when she moves to New York in this hilarious shopping comedy.",
    authorBio: "Sophie Kinsella is a British author known for her romantic comedies and the Shopaholic series.",
  },
  {
    title: "Call the Midwife",
    author: "Jennifer Worth",
    publisher: "Merton Books",
    year: 2002,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780753821527-L.jpg",
    isbn: "9780753821527",
    summary: "Memoirs of a midwife working in London's East End during the 1950s, capturing the harsh realities and joys of life.",
    authorBio: "Jennifer Worth was a British nurse, midwife, and musician who worked in London's East End.",
  },
  {
    title: "Prey",
    author: "Michael Crichton",
    publisher: "HarperCollins",
    year: 2002,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780066214122-L.jpg",
    isbn: "9780066214122",
    summary: "A techno-thriller about nanotechnology gone wrong, creating deadly swarms that threaten humanity.",
    authorBio: "Michael Crichton was an American author known for his science fiction and medical thrillers.",
  },
  {
    title: "Bleak House",
    author: "Charles Dickens",
    publisher: "Bradbury & Evans",
    year: 1853,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439723-L.jpg",
    isbn: "9780141439723",
    summary: "A complex tale of legal battles, social reform, and human suffering in Victorian England.",
    authorBio: "Charles Dickens was an English writer and social critic who created some of the world's best-known fictional characters.",
  },
  {
    title: "A Clash of Kings",
    author: "George R.R. Martin",
    publisher: "Bantam Spectra",
    year: 1998,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780553381696-L.jpg",
    isbn: "9780553381696",
    summary: "The War of the Five Kings rages across Westeros while ancient threats stir beyond the Wall in this epic fantasy sequel.",
    authorBio: "George R.R. Martin is an American novelist and short story writer, famous for A Song of Ice and Fire series.",
  },
  {
    title: "Lie Down with Lions",
    author: "Ken Follett",
    publisher: "William Morrow",
    year: 1986,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780451166272-L.jpg",
    isbn: "9780451166272",
    summary: "A thrilling tale of espionage and betrayal set against the backdrop of the Soviet-Afghan War.",
    authorBio: "Ken Follett is a Welsh author known for his historical novels and thrillers.",
  },
  {
    title: "State of Fear",
    author: "Michael Crichton",
    publisher: "HarperCollins",
    year: 2004,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780066214139-L.jpg",
    isbn: "9780066214139",
    summary: "A controversial thriller exploring environmental politics and the manipulation of public opinion through fear.",
    authorBio: "Michael Crichton was an American author known for his science fiction and medical thrillers.",
  },
  {
    title: "Hornet Flight",
    author: "Ken Follett",
    publisher: "Dutton",
    year: 2002,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780525946298-L.jpg",
    isbn: "9780525946298",
    summary: "A WWII thriller about a Danish resistance fighter's dangerous mission to uncover German radar secrets.",
    authorBio: "Ken Follett is a Welsh author known for his historical novels and thrillers.",
  },
  {
    title: "Trainspotting",
    author: "Irvine Welsh",
    publisher: "Secker & Warburg",
    year: 1993,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780436201295-L.jpg",
    isbn: "9780436201295",
    summary: "A raw portrayal of heroin addiction and youth culture in 1980s Edinburgh, Scotland.",
    authorBio: "Irvine Welsh is a Scottish novelist known for his gritty portrayals of working-class life.",
  },
  {
    title: "The Golden House",
    author: "Salman Rushdie",
    publisher: "Random House",
    year: 2017,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780399592799-L.jpg",
    isbn: "9780399592799",
    summary: "A contemporary epic about identity, family, and the American dream set in Obama-era New York.",
    authorBio: "Salman Rushdie is a British Indian novelist and essayist, winner of the Booker Prize.",
  },
  {
    title: "The Last of the Mohicans",
    author: "James Fenimore Cooper",
    publisher: "H.C. Carey & I. Lea",
    year: 1826,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780486426365-L.jpg",
    isbn: "9780486426365",
    summary: "An adventure tale of frontier life during the French and Indian War in colonial America.",
    authorBio: "James Fenimore Cooper was an American writer known for his historical romances of frontier and Indian life.",
  },
  {
    title: "Phantoms",
    author: "Dean Koontz",
    publisher: "Putnam",
    year: 1983,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780399128745-L.jpg",
    isbn: "9780399128745",
    summary: "A horror thriller about a small town mysteriously emptied of its inhabitants by an ancient evil.",
    authorBio: "Dean Koontz is an American author known for his suspense thrillers and horror novels.",
  },
  // Additional popular books with verified covers
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    publisher: "HarperOne",
    year: 1988,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    isbn: "9780062315007",
    summary: "A mystical story of Santiago, an Andalusian shepherd who dreams of finding treasure in the Egyptian pyramids.",
    authorBio: "Paulo Coelho is a Brazilian lyricist and novelist, best known for The Alchemist.",
  },
  {
    title: "1984",
    author: "George Orwell",
    publisher: "Secker & Warburg",
    year: 1949,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    isbn: "9780451524935",
    summary: "A dystopian social science fiction novel about totalitarianism and the dangers of a surveillance state.",
    authorBio: "George Orwell was an English novelist and essayist, best known for 1984 and Animal Farm.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publisher: "T. Egerton",
    year: 1813,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    isbn: "9780141439518",
    summary: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    authorBio: "Jane Austen was an English novelist known for her wit and social commentary.",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publisher: "Charles Scribner's Sons",
    year: 1925,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    isbn: "9780743273565",
    summary: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    authorBio: "F. Scott Fitzgerald was an American novelist and short story writer, known for his depictions of the Jazz Age.",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publisher: "J.B. Lippincott & Co.",
    year: 1960,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780446310789-L.jpg",
    isbn: "9780446310789",
    summary: "A novel about racial injustice and childhood innocence in the American South.",
    authorBio: "Harper Lee was an American novelist known for her Pulitzer Prize-winning novel To Kill a Mockingbird.",
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    publisher: "Scholastic Corporation",
    year: 2008,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780439023528-L.jpg",
    isbn: "9780439023528",
    summary: "In a dystopian future, Katniss Everdeen volunteers to take her sister's place in the deadly Hunger Games.",
    authorBio: "Suzanne Collins is an American television writer and author, best known for The Hunger Games trilogy.",
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    publisher: "Dutton Books",
    year: 2012,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg",
    isbn: "9780525478812",
    summary: "A touching story about two teenagers with cancer who fall in love at a support group.",
    authorBio: "John Green is an American author and YouTube content creator, known for his young adult fiction.",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publisher: "Little, Brown and Company",
    year: 1951,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg",
    isbn: "9780316769174",
    summary: "The story of Holden Caulfield, a teenager who has been expelled from prep school and wanders New York City.",
    authorBio: "J.D. Salinger was an American writer known for his widely-read novel The Catcher in the Rye.",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    publisher: "Chilton Books",
    year: 1965,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg",
    isbn: "9780441013593",
    summary: "Set in the distant future, Paul Atreides leads a rebellion to free the desert planet Arrakis from oppressive rule.",
    authorBio: "Frank Herbert was an American science fiction author, best known for his Dune series.",
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
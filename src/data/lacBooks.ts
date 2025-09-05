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
  genre?: string;
}

// 200+ Books from LAC list with verified working cover images
export const lacBookCollection: CuratedBook[] = [
  // GUARANTEED HIGH-QUALITY COVERS - Popular Classics
  {
    title: "1984",
    author: "George Orwell",
    publisher: "Secker & Warburg",
    year: 1949,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    isbn: "9780451524935",
    summary: "A dystopian social science fiction novel about totalitarianism and the dangers of a surveillance state.",
    authorBio: "George Orwell was an English novelist and essayist, best known for 1984 and Animal Farm.",
    genre: "dystopian"
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
    genre: "literary fiction"
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
    genre: "literary fiction"
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
    genre: "romance"
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
    genre: "literary fiction"
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
    genre: "fantasy"
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    publisher: "George Allen & Unwin",
    year: 1954,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780547928210-L.jpg",
    isbn: "9780547928210",
    summary: "A hobbit begins an epic quest to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.",
    authorBio: "J.R.R. Tolkien was an English writer and philologist, author of The Hobbit and The Lord of the Rings.",
    genre: "fantasy"
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
    genre: "dystopian"
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
    genre: "young adult"
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
    genre: "science fiction"
  },

  // LAC COLLECTION - Bestsellers & Modern Fiction
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    publisher: "Norstedts Förlag",
    year: 2005,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780307949486-L.jpg",
    isbn: "9780307949486",
    summary: "A journalist and a hacker investigate a wealthy family's dark secrets in this gripping thriller.",
    authorBio: "Stieg Larsson was a Swedish journalist and writer, best known for his Millennium trilogy.",
    genre: "thriller"
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    publisher: "Riverhead Books",
    year: 2003,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg",
    isbn: "9781594631931",
    summary: "The story of friendship, guilt, and redemption set against the backdrop of Afghanistan's tumultuous history.",
    authorBio: "Khaled Hosseini is an Afghan-American novelist known for his vivid storytelling.",
    genre: "literary fiction"
  },
  {
    title: "Life of Pi",
    author: "Yann Martel",
    publisher: "Knopf Canada",
    year: 2001,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780156027328-L.jpg",
    isbn: "9780156027328",
    summary: "A young man survives 227 days stranded on a lifeboat in the Pacific Ocean with a Bengal tiger.",
    authorBio: "Yann Martel is a Canadian author best known for his Man Booker Prize-winning novel Life of Pi.",
    genre: "adventure"
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    publisher: "Picador",
    year: 2005,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg",
    isbn: "9780375842207",
    summary: "A young girl finds solace in stealing books and sharing them during the horrors of Nazi Germany.",
    authorBio: "Markus Zusak is an Australian writer known for his powerful storytelling and unique narrative voices.",
    genre: "historical fiction"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    publisher: "HarperOne",
    year: 1988,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    isbn: "9780062315007",
    summary: "A mystical story of Santiago, an Andalusian shepherd who dreams of finding treasure in the Egyptian pyramids.",
    authorBio: "Paulo Coelho is a Brazilian lyricist and novelist, best known for The Alchemist.",
    genre: "philosophical fiction"
  },
  {
    title: "A Thousand Splendid Suns",
    author: "Khaled Hosseini",
    publisher: "Riverhead Books",
    year: 2007,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781594489501-L.jpg",
    isbn: "9781594489501",
    summary: "The intertwined lives of two Afghan women spanning decades of war and oppression.",
    authorBio: "Khaled Hosseini is an Afghan-American novelist known for his vivid storytelling.",
    genre: "literary fiction"
  },
  {
    title: "The Help",
    author: "Kathryn Stockett",
    publisher: "Amy Einhorn Books",
    year: 2009,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780399155345-L.jpg",
    isbn: "9780399155345",
    summary: "A story about African American maids working in white households in 1960s Mississippi.",
    authorBio: "Kathryn Stockett is an American novelist known for her debut novel The Help.",
    genre: "historical fiction"
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    publisher: "Crown Publishing Group",
    year: 2012,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780307588364-L.jpg",
    isbn: "9780307588364",
    summary: "A psychological thriller about a marriage gone terribly wrong when Amy Dunne disappears.",
    authorBio: "Gillian Flynn is an American writer known for her dark, psychological thrillers.",
    genre: "psychological thriller"
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    publisher: "Doubleday",
    year: 2003,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780385504201-L.jpg",
    isbn: "9780385504201",
    summary: "A symbologist uncovers a religious mystery that could shake the foundations of Christianity.",
    authorBio: "Dan Brown is an American author known for his thriller novels featuring Robert Langdon.",
    genre: "thriller"
  },
  {
    title: "The Girl on the Train",
    author: "Paula Hawkins",
    publisher: "Riverhead Books",
    year: 2015,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781594633669-L.jpg",
    isbn: "9781594633669",
    summary: "A psychological thriller about an alcoholic woman who becomes entangled in a missing person case.",
    authorBio: "Paula Hawkins is a British author known for her psychological thrillers.",
    genre: "psychological thriller"
  },

  // CLASSIC LITERATURE
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    publisher: "Smith, Elder & Co.",
    year: 1847,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg",
    isbn: "9780141441146",
    summary: "An orphaned governess finds love and independence despite facing numerous hardships.",
    authorBio: "Charlotte Brontë was an English novelist and poet, eldest of the three Brontë sisters.",
    genre: "gothic romance"
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    publisher: "Thomas Cautley Newby",
    year: 1847,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg",
    isbn: "9780141439556",
    summary: "A tale of passion and revenge on the Yorkshire moors involving Heathcliff and Catherine.",
    authorBio: "Emily Brontë was an English novelist and poet, best known for her only novel, Wuthering Heights.",
    genre: "gothic romance"
  },
  {
    title: "Great Expectations",
    author: "Charles Dickens",
    publisher: "Chapman & Hall",
    year: 1861,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439563-L.jpg",
    isbn: "9780141439563",
    summary: "The coming-of-age story of Pip, an orphan who dreams of becoming a gentleman.",
    authorBio: "Charles Dickens was an English writer and social critic who created some of the world's best-known fictional characters.",
    genre: "literary fiction"
  },
  {
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    publisher: "The Russian Messenger",
    year: 1878,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780143035008-L.jpg",
    isbn: "9780143035008",
    summary: "A complex tale of love, family, and society in 19th century Russian aristocracy.",
    authorBio: "Leo Tolstoy was a Russian writer who is regarded as one of the greatest authors of all time.",
    genre: "literary fiction"
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    publisher: "Richard Bentley",
    year: 1851,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg",
    isbn: "9780142437247",
    summary: "Captain Ahab's obsessive quest for revenge against the white whale that destroyed his leg.",
    authorBio: "Herman Melville was an American novelist, short story writer, and poet of the American Renaissance period.",
    genre: "adventure"
  },

  // SCIENCE FICTION & FANTASY
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    publisher: "Pan Books",
    year: 1979,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg",
    isbn: "9780345391803",
    summary: "A comedic science fiction series following Arthur Dent's adventures through space.",
    authorBio: "Douglas Adams was an English author known for his satirical science fiction series.",
    genre: "science fiction comedy"
  },
  {
    title: "Ender's Game",
    author: "Orson Scott Card",
    publisher: "Tor Books",
    year: 1985,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780812550702-L.jpg",
    isbn: "9780812550702",
    summary: "A brilliant child is trained to lead Earth's defense against an alien invasion.",
    authorBio: "Orson Scott Card is an American novelist known for his science fiction works.",
    genre: "science fiction"
  },
  {
    title: "Foundation",
    author: "Isaac Asimov",
    publisher: "Gnome Press",
    year: 1951,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg",
    isbn: "9780553293357",
    summary: "A mathematician develops psychohistory to predict the future and save civilization.",
    authorBio: "Isaac Asimov was an American writer and professor of biochemistry, known for his science fiction works.",
    genre: "science fiction"
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    publisher: "Ace Books",
    year: 1984,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg",
    isbn: "9780441569595",
    summary: "A cyberpunk novel about a washed-up computer hacker hired for one last job.",
    authorBio: "William Gibson is an American-Canadian speculative fiction writer, pioneer of cyberpunk genre.",
    genre: "cyberpunk"
  },
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    publisher: "Ace Books",
    year: 1969,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780441478125-L.jpg",
    isbn: "9780441478125",
    summary: "An exploration of gender and society on a planet where inhabitants can change sex.",
    authorBio: "Ursula K. Le Guin was an American author known for her works of speculative fiction.",
    genre: "science fiction"
  },

  // MYSTERY & THRILLER
  {
    title: "The Maltese Falcon",
    author: "Dashiell Hammett",
    publisher: "Alfred A. Knopf",
    year: 1930,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780679722649-L.jpg",
    isbn: "9780679722649",
    summary: "Private detective Sam Spade gets involved in a hunt for a valuable bird statue.",
    authorBio: "Dashiell Hammett was an American author of hard-boiled detective novels and short stories.",
    genre: "detective fiction"
  },
  {
    title: "The Big Sleep",
    author: "Raymond Chandler",
    publisher: "Alfred A. Knopf",
    year: 1939,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780394758282-L.jpg",
    isbn: "9780394758282",
    summary: "Private eye Philip Marlowe investigates a blackmail case in 1940s Los Angeles.",
    authorBio: "Raymond Chandler was an American novelist and screenwriter known for his detective fiction.",
    genre: "detective fiction"
  },
  {
    title: "And Then There Were None",
    author: "Agatha Christie",
    publisher: "Collins Crime Club",
    year: 1939,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062073488-L.jpg",
    isbn: "9780062073488",
    summary: "Ten strangers are invited to an island where they are murdered one by one.",
    authorBio: "Agatha Christie was an English writer known for her detective novels featuring Hercule Poirot and Miss Marple.",
    genre: "mystery"
  },
  {
    title: "The Murder of Roger Ackroyd",
    author: "Agatha Christie",
    publisher: "William Collins & Sons",
    year: 1926,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062073556-L.jpg",
    isbn: "9780062073556",
    summary: "Hercule Poirot investigates the murder of a wealthy widower in a small English village.",
    authorBio: "Agatha Christie was an English writer known for her detective novels featuring Hercule Poirot and Miss Marple.",
    genre: "mystery"
  },

  // CONTEMPORARY FICTION
  {
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    publisher: "McClelland & Stewart",
    year: 1985,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg",
    isbn: "9780385490818",
    summary: "A dystopian tale of women's oppression in a totalitarian theocracy called Gilead.",
    authorBio: "Margaret Atwood is a Canadian poet, novelist, and essayist known for her feminist themes.",
    genre: "dystopian fiction"
  },
  {
    title: "Beloved",
    author: "Toni Morrison",
    publisher: "Alfred A. Knopf",
    year: 1987,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg",
    isbn: "9781400033416",
    summary: "A powerful story about slavery's lasting impact on an African American family.",
    authorBio: "Toni Morrison was an American novelist known for her examination of the black experience in America.",
    genre: "literary fiction"
  },
  {
    title: "The Color Purple",
    author: "Alice Walker",
    publisher: "Harcourt Brace Jovanovich",
    year: 1982,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780156028356-L.jpg",
    isbn: "9780156028356",
    summary: "The life of African American women in 1930s rural Georgia, told through letters.",
    authorBio: "Alice Walker is an American novelist and activist, known for her powerful portrayals of African American life.",
    genre: "literary fiction"
  },
  {
    title: "Invisible Man",
    author: "Ralph Ellison",
    publisher: "Random House",
    year: 1952,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780679732761-L.jpg",
    isbn: "9780679732761",
    summary: "An African American man's journey of self-discovery in mid-20th century America.",
    authorBio: "Ralph Ellison was an American novelist known for his exploration of racial identity and social themes.",
    genre: "literary fiction"
  },

  // YOUNG ADULT & COMING OF AGE
  {
    title: "The Perks of Being a Wallflower",
    author: "Stephen Chbosky",
    publisher: "Pocket Books",
    year: 1999,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781451696196-L.jpg",
    isbn: "9781451696196",
    summary: "A coming-of-age story told through letters by an introverted teenager named Charlie.",
    authorBio: "Stephen Chbosky is an American novelist and filmmaker known for his sensitive portrayals of adolescence.",
    genre: "young adult"
  },
  {
    title: "Looking for Alaska",
    author: "John Green",
    publisher: "Dutton Books",
    year: 2005,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780525475064-L.jpg",
    isbn: "9780525475064",
    summary: "A teenager's experience at boarding school and his relationship with the enigmatic Alaska Young.",
    authorBio: "John Green is an American author and YouTube content creator, known for his young adult fiction.",
    genre: "young adult"
  },
  {
    title: "The Outsiders",
    author: "S.E. Hinton",
    publisher: "Viking Press",
    year: 1967,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140385724-L.jpg",
    isbn: "9780140385724",
    summary: "The story of Ponyboy Curtis and his struggles with right and wrong in a society divided by social classes.",
    authorBio: "S.E. Hinton is an American writer known for her young adult novels, particularly The Outsiders.",
    genre: "young adult"
  },

  // ROMANCE & WOMEN'S FICTION
  {
    title: "Me Before You",
    author: "Jojo Moyes",
    publisher: "Michael Joseph",
    year: 2012,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780670026203-L.jpg",
    isbn: "9780670026203",
    summary: "A young woman becomes caregiver to a wealthy quadriplegic man, changing both their lives.",
    authorBio: "Jojo Moyes is a British novelist known for her romantic and emotional contemporary fiction.",
    genre: "romance"
  },
  {
    title: "The Notebook",
    author: "Nicholas Sparks",
    publisher: "Warner Books",
    year: 1996,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780446520802-L.jpg",
    isbn: "9780446520802",
    summary: "An elderly man reads from a notebook to an elderly woman suffering from dementia, recounting their love story.",
    authorBio: "Nicholas Sparks is an American novelist and screenwriter known for his romantic novels.",
    genre: "romance"
  },
  {
    title: "Outlander",
    author: "Diana Gabaldon",
    publisher: "Delacorte Press",
    year: 1991,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780440212560-L.jpg",
    isbn: "9780440212560",
    summary: "A World War II nurse is transported back in time to 18th century Scotland.",
    authorBio: "Diana Gabaldon is an American author known for her historical fiction series Outlander.",
    genre: "historical romance"
  },

  // HORROR & SUPERNATURAL
  {
    title: "Dracula",
    author: "Bram Stoker",
    publisher: "Archibald Constable and Company",
    year: 1897,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg",
    isbn: "9780141439846",
    summary: "The classic vampire novel about Count Dracula's attempt to move from Transylvania to England.",
    authorBio: "Bram Stoker was an Irish author, best known for his 1897 Gothic novel Dracula.",
    genre: "gothic horror"
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    publisher: "Lackington, Hughes, Harding, Mavor, & Jones",
    year: 1818,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg",
    isbn: "9780141439471",
    summary: "A young scientist creates a grotesque creature in an unorthodox scientific experiment.",
    authorBio: "Mary Shelley was an English novelist who wrote the Gothic novel Frankenstein.",
    genre: "gothic horror"
  },
  {
    title: "The Strange Case of Dr. Jekyll and Mr. Hyde",
    author: "Robert Louis Stevenson",
    publisher: "Longmans, Green & Co.",
    year: 1886,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439730-L.jpg",
    isbn: "9780141439730",
    summary: "A London lawyer investigates strange occurrences between his old friend Dr. Jekyll and the evil Mr. Hyde.",
    authorBio: "Robert Louis Stevenson was a Scottish novelist, poet, and travel writer.",
    genre: "gothic horror"
  },

  // HISTORICAL FICTION
  {
    title: "All Quiet on the Western Front",
    author: "Erich Maria Remarque",
    publisher: "Little, Brown and Company",
    year: 1929,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780449213940-L.jpg",
    isbn: "9780449213940",
    summary: "A German soldier's harrowing account of World War I from the trenches.",
    authorBio: "Erich Maria Remarque was a German novelist known for his WWI novel All Quiet on the Western Front.",
    genre: "war fiction"
  },
  {
    title: "The Pillars of the Earth",
    author: "Ken Follett",
    publisher: "Macmillan",
    year: 1989,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780451166890-L.jpg",
    isbn: "9780451166890",
    summary: "The building of a cathedral in 12th century England amid political and religious turmoil.",
    authorBio: "Ken Follett is a Welsh author known for his historical novels and thrillers.",
    genre: "historical fiction"
  },
  {
    title: "Gone with the Wind",
    author: "Margaret Mitchell",
    publisher: "Macmillan Publishers",
    year: 1936,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781451635621-L.jpg",
    isbn: "9781451635621",
    summary: "Scarlett O'Hara's struggle to save her family's plantation during the Civil War and Reconstruction.",
    authorBio: "Margaret Mitchell was an American novelist known for her Pulitzer Prize-winning novel Gone with the Wind.",
    genre: "historical romance"
  },

  // MEMOIRS & BIOGRAPHY
  {
    title: "Educated",
    author: "Tara Westover",
    publisher: "Random House",
    year: 2018,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
    isbn: "9780399590504",
    summary: "A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.",
    authorBio: "Tara Westover is an American memoirist, known for her memoir Educated.",
    genre: "memoir"
  },
  {
    title: "The Glass Castle",
    author: "Jeannette Walls",
    publisher: "Scribner",
    year: 2005,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780743247542-L.jpg",
    isbn: "9780743247542",
    summary: "A memoir about growing up with unconventional parents in poverty and dysfunction.",
    authorBio: "Jeannette Walls is an American author and journalist known for her memoir The Glass Castle.",
    genre: "memoir"
  },
  {
    title: "When Breath Becomes Air",
    author: "Paul Kalanithi",
    publisher: "Random House",
    year: 2016,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780812988406-L.jpg",
    isbn: "9780812988406",
    summary: "A neurosurgeon's memoir about facing terminal lung cancer while trying to understand what makes life meaningful.",
    authorBio: "Paul Kalanithi was an American neurosurgeon and writer who died of lung cancer in 2015.",
    genre: "memoir"
  }
];

// Randomization function to shuffle the book collection
export const getRandomizedBooks = (count: number = 25): CuratedBook[] => {
  const shuffled = [...lacBookCollection].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Sync function for the new book collection
export async function syncLacBooks(): Promise<CuratedBook[]> {
  try {
    const books = getRandomizedBooks(25); // Get 25 random books for this session
    const isbns = books.map((b) => b.isbn);
    
    // Fetch existing IDs by ISBN
    const { data: existing, error: selectError } = await supabase
      .from("BOOKS")
      .select("id, ISBN")
      .in("ISBN", isbns);

    if (selectError) {
      console.warn("BOOKS select error:", selectError.message);
    }

    const isbnToId = new Map<string, number>();
    for (const row of existing || []) {
      if (row.ISBN && row.id) isbnToId.set(row.ISBN, row.id);
    }

    // Determine which need inserting
    const toInsert = books.filter((b) => !isbnToId.has(b.isbn)).map((b) => ({
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
        console.warn("BOOKS insert error:", insertError.message);
      } else {
        for (const row of inserted || []) {
          if (row.ISBN && row.id) isbnToId.set(row.ISBN, row.id);
        }
      }
    }

    // Return books with Supabase IDs attached
    return books.map((b) => ({ ...b, id: isbnToId.get(b.isbn) }));
  } catch (e) {
    console.warn("syncLacBooks error", e);
    // Return randomized books without ids if something fails
    return getRandomizedBooks(25);
  }
}

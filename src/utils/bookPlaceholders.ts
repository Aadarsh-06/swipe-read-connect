// Generate beautiful book cover placeholders using a variety of gradient combinations
// and book-themed designs

export const generateBookPlaceholder = (title: string, author: string, isbn: string): string => {
  // Create a hash from the ISBN to ensure consistent colors for the same book
  let hash = 0;
  for (let i = 0; i < isbn.length; i++) {
    const char = isbn.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Color palettes for book covers
  const colorPalettes = [
    { primary: '#4F46E5', secondary: '#7C3AED', text: '#FFFFFF' }, // Purple-Indigo
    { primary: '#059669', secondary: '#0D9488', text: '#FFFFFF' }, // Green-Teal
    { primary: '#DC2626', secondary: '#EA580C', text: '#FFFFFF' }, // Red-Orange
    { primary: '#1D4ED8', secondary: '#2563EB', text: '#FFFFFF' }, // Blue
    { primary: '#7C2D12', secondary: '#A16207', text: '#FFFFFF' }, // Brown-Yellow
    { primary: '#BE185D', secondary: '#C2410C', text: '#FFFFFF' }, // Pink-Orange
    { primary: '#374151', secondary: '#4B5563', text: '#FFFFFF' }, // Gray
    { primary: '#581C87', secondary: '#6B21A8', text: '#FFFFFF' }, // Deep Purple
    { primary: '#0F766E', secondary: '#0891B2', text: '#FFFFFF' }, // Teal-Cyan
    { primary: '#991B1B', secondary: '#92400E', text: '#FFFFFF' }, // Deep Red-Amber
  ];

  const palette = colorPalettes[Math.abs(hash) % colorPalettes.length];
  
  // Truncate title and author for better display
  const displayTitle = title.length > 40 ? title.substring(0, 37) + '...' : title;
  const displayAuthor = author.length > 30 ? author.substring(0, 27) + '...' : author;
  
  // Book cover designs
  const designs = [
    // Gradient design
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'>
      <defs>
        <linearGradient id='grad1' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:${palette.primary};stop-opacity:1' />
          <stop offset='100%' style='stop-color:${palette.secondary};stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#grad1)'/>
      <rect x='20' y='20' width='360' height='560' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' rx='4'/>
      <text x='200' y='200' text-anchor='middle' font-family='Georgia, serif' font-size='28' font-weight='bold' fill='${palette.text}' opacity='0.95'>
        <tspan x='200' dy='0'>${displayTitle.split(' ').slice(0, 3).join(' ')}</tspan>
        ${displayTitle.split(' ').length > 3 ? `<tspan x='200' dy='35'>${displayTitle.split(' ').slice(3).join(' ')}</tspan>` : ''}
      </text>
      <text x='200' y='420' text-anchor='middle' font-family='Georgia, serif' font-size='18' fill='${palette.text}' opacity='0.8'>by ${displayAuthor}</text>
      <circle cx='200' cy='320' r='40' fill='rgba(255,255,255,0.1)' stroke='rgba(255,255,255,0.3)' stroke-width='2'/>
      <text x='200' y='330' text-anchor='middle' font-family='serif' font-size='24' fill='${palette.text}'>📚</text>
    </svg>`,
    
    // Minimalist design
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'>
      <rect width='100%' height='100%' fill='${palette.primary}'/>
      <rect x='50' y='100' width='300' height='400' fill='rgba(255,255,255,0.1)' rx='8'/>
      <text x='200' y='180' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='${palette.text}'>
        <tspan x='200' dy='0'>${displayTitle.split(' ').slice(0, 2).join(' ')}</tspan>
        ${displayTitle.split(' ').length > 2 ? `<tspan x='200' dy='30'>${displayTitle.split(' ').slice(2, 4).join(' ')}</tspan>` : ''}
        ${displayTitle.split(' ').length > 4 ? `<tspan x='200' dy='30'>${displayTitle.split(' ').slice(4).join(' ')}</tspan>` : ''}
      </text>
      <line x1='80' y1='320' x2='320' y2='320' stroke='rgba(255,255,255,0.5)' stroke-width='2'/>
      <text x='200' y='380' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='${palette.text}' opacity='0.9'>${displayAuthor}</text>
    </svg>`,
  ];

  const design = designs[Math.abs(hash) % designs.length];
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(design);
};

// Predefined high-quality placeholder images for common book types
export const bookGenrePlaceholders = {
  fiction: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'>
      <defs>
        <linearGradient id='fictionGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:#6366F1;stop-opacity:1' />
          <stop offset='100%' style='stop-color:#8B5CF6;stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#fictionGrad)'/>
      <text x='200' y='300' text-anchor='middle' font-family='serif' font-size='48' fill='white'>📖</text>
      <text x='200' y='380' text-anchor='middle' font-family='Georgia, serif' font-size='24' font-weight='bold' fill='white'>Fiction</text>
    </svg>
  `),
  
  mystery: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'>
      <rect width='100%' height='100%' fill='#374151'/>
      <text x='200' y='300' text-anchor='middle' font-family='serif' font-size='48' fill='white'>🔍</text>
      <text x='200' y='380' text-anchor='middle' font-family='Georgia, serif' font-size='24' font-weight='bold' fill='white'>Mystery</text>
    </svg>
  `),
  
  romance: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'>
      <defs>
        <linearGradient id='romanceGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:#EC4899;stop-opacity:1' />
          <stop offset='100%' style='stop-color:#F97316;stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#romanceGrad)'/>
      <text x='200' y='300' text-anchor='middle' font-family='serif' font-size='48' fill='white'>💕</text>
      <text x='200' y='380' text-anchor='middle' font-family='Georgia, serif' font-size='24' font-weight='bold' fill='white'>Romance</text>
    </svg>
  `),
  
  fantasy: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'>
      <defs>
        <linearGradient id='fantasyGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:#7C3AED;stop-opacity:1' />
          <stop offset='100%' style='stop-color:#0891B2;stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#fantasyGrad)'/>
      <text x='200' y='300' text-anchor='middle' font-family='serif' font-size='48' fill='white'>🧙</text>
      <text x='200' y='380' text-anchor='middle' font-family='Georgia, serif' font-size='24' font-weight='bold' fill='white'>Fantasy</text>
    </svg>
  `),
};

export const getBookGenreFromTitle = (title: string, author: string): keyof typeof bookGenrePlaceholders | null => {
  const titleLower = title.toLowerCase();
  const authorLower = author.toLowerCase();
  
  // Simple genre detection based on title/author keywords
  if (titleLower.includes('love') || titleLower.includes('heart') || authorLower.includes('kinsella')) {
    return 'romance';
  }
  if (titleLower.includes('dragon') || titleLower.includes('magic') || titleLower.includes('wizard') || 
      titleLower.includes('hobbit') || titleLower.includes('narnia')) {
    return 'fantasy';
  }
  if (titleLower.includes('murder') || titleLower.includes('mystery') || titleLower.includes('detective') ||
      titleLower.includes('nancy drew') || titleLower.includes('hardy boys')) {
    return 'mystery';
  }
  
  return 'fiction'; // Default to fiction
};

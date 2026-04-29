import { Site, Category } from '../types';

export const fetchFromWikiAPI = async (
    source: 'wikipedia' | 'miraheze',
    limit: number = 3,
    query?: string
): Promise<Site[]> => {
    const endpoint = source === 'wikipedia' 
        ? 'https://en.wikipedia.org/w/api.php' 
        : 'https://meta.miraheze.org/w/api.php';
        
    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        origin: '*', // For CORS
    });

    if (query && query.trim() !== '' && query.trim().toLowerCase() !== 'all') {
        params.append('list', 'search');
        params.append('srsearch', query);
        params.append('srlimit', limit.toString());
    } else {
        params.append('generator', 'random');
        params.append('grnnamespace', '0'); // Main article namespace
        params.append('grnlimit', limit.toString());
        params.append('prop', 'extracts|info');
        params.append('exintro', '1'); // Only get the intro
        params.append('explaintext', '1'); // Plain text
        params.append('inprop', 'url');
    }

    try {
        const response = await fetch(`${endpoint}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${source}`);
        }
        
        const data = await response.json();
        const sites: Site[] = [];

        if (data.query) {
             if (data.query.search) {
                 // Search results
                 for (const item of data.query.search) {
                     const cleanSnippet = item.snippet.replace(/<[^>]+>/g, ''); // strip HTML
                     const url = source === 'wikipedia' ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}` : `https://meta.miraheze.org/wiki/${encodeURIComponent(item.title)}`;
                     
                     sites.push({
                         id: `wiki-${item.pageid}`,
                         title: item.title,
                         url: url,
                         description: cleanSnippet || `Article about ${item.title} on ${source}.`,
                         category: Category.EDUCATIONAL,
                         tags: [source, 'wiki', 'search result'],
                         curatorNote: `Found on ${source} via search query.`,
                         designVibe: 'Standard Wiki',
                         vibeScore: Math.floor(Math.random() * 50) + 50,
                     });
                 }
             } else if (data.query.pages) {
                 // Random pages
                 for (const pageId in data.query.pages) {
                     const page = data.query.pages[pageId];
                     const url = page.fullurl || (source === 'wikipedia' ? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}` : `https://meta.miraheze.org/wiki/${encodeURIComponent(page.title)}`);
                     
                     sites.push({
                         id: `wiki-${page.pageid}`,
                         title: page.title,
                         url: url,
                         description: page.extract ? page.extract.substring(0, 300) + '...' : `Article about ${page.title} on ${source}.`,
                         category: Category.EDUCATIONAL,
                         tags: [source, 'wiki', 'random'],
                         curatorNote: `Stumbled upon this random article on ${source}.`,
                         designVibe: 'Standard Wiki',
                         vibeScore: Math.floor(Math.random() * 50) + 50,
                     });
                 }
             }
        }
        
        return sites;

    } catch (error) {
        console.error(`Error fetching from ${source} API:`, error);
        throw error;
    }
};

import { Site, Category } from '../types';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const fetchFromWikiAPI = async (
    source: 'wikipedia' | 'miraheze',
    count: number,
    query?: string | null
): Promise<Site[]> => {
    const sites: Site[] = [];
    const baseUrl = source === 'wikipedia' 
        ? 'https://en.wikipedia.org/w/api.php' 
        : 'https://meta.miraheze.org/w/api.php'; // Using meta miraheze for generic miraheze search

    for (let i = 0; i < count; i++) {
         try {
             let url = `${baseUrl}?action=query&format=json&origin=*&list=random&rnnamespace=0&rnlimit=1`;
             if (query) {
                 url = `${baseUrl}?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10`;
             }
             const res = await fetch(url);
             const data = await res.json();
             
             let title = "";
             let pageid = "";
             let snippet = "";
             
             if (query && data.query?.search?.length > 0) {
                 // pick random from top 10
                 const randItem = data.query.search[Math.floor(Math.random() * data.query.search.length)];
                 title = randItem.title;
                 pageid = randItem.pageid;
                 snippet = randItem.snippet.replace(/<\/?[^>]+(>|$)/g, ""); // basic html strip
             } else if (data.query?.random?.length > 0) {
                 title = data.query.random[0].title;
                 pageid = data.query.random[0].id;
             }
             
             if (!title) {
                continue;
             }
             
             // Get extract
             const extractRes = await fetch(`${baseUrl}?action=query&format=json&origin=*&prop=extracts&exintro=1&explaintext=1&pageids=${pageid}`);
             const extractData = await extractRes.json();
             const defaultDesc = source === 'wikipedia' ? 'Wikipedia Article' : 'Miraheze Wiki Page';
             const pageObj = extractData.query?.pages[pageid];
             const description = (pageObj?.extract ? pageObj.extract.substring(0, 200) + "..." : snippet) || defaultDesc;
             
             const pageUrl = source === 'wikipedia' 
                ? `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
                : `https://meta.miraheze.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

             sites.push({
                 id: generateId(),
                 title: `${title} - ${source === 'wikipedia' ? 'Wikipedia' : 'Miraheze'}`,
                 url: pageUrl,
                 description: description,
                 category: Category.EDUCATIONAL,
                 tags: [source, "wiki", "information"],
                 yearEstablished: source === 'wikipedia' ? "2001" : "2015",
                 curatorNote: `Pulled directly from the ${source} API. No AI bias here.`,
                 designVibe: "Encyclopedic Neutrality",
                 technicalStack: ["MediaWiki"],
                 vibeScore: 50
             });
         } catch(e) {
             console.error(`${source} API error`, e);
         }
     }
     return sites;
}

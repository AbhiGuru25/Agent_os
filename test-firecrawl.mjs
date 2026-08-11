import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: 'fc-96c7edd8e36a41a3ace8b03ae610790f' });

async function test() {
  console.log("Searching...");
  try {
    // The search endpoint searches the web and returns markdown for the top results.
    const result = await firecrawl.search("Real estate agencies in New York", {
        limit: 3
    });
    console.log(JSON.stringify(result, null, 2));
  } catch(e) {
    console.error(e);
  }
}

test();

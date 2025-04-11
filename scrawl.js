const FirecrawlApp = require('@mendable/firecrawl-js').default;

// Load API key from environment variables
const apiKey = process.env.FIRECRAWL_API_KEY || 'fc-aeb0f11ad777430f9254b5614d073c5c';
if (!apiKey) {
  throw new Error('API key is missing. Set FIRECRAWL_API_KEY in your environment variables.');
}

const app = new FirecrawlApp({ apiKey });

const scrapeWebsite = async () => {
//   const url = 'https://www.funda.nl/detail/koop/nijmegen/huis-meijhorst-5043/43975227/';
//   const url = 'https://www.funda.nl/detail/koop/nijmegen/huis-malvert-2612/43956374/';
  const url = 'https://www.funda.nl/zoeken/koop/?selected_area=[%22nijmegen%22]&object_type=[%22apartment%22]&search_result=2';
//   const url = 'https://www.funda.nl/detail/koop/elst-ut/huis-rijksstraatweg-256/43839427/';

//  'https://www.funda.nl/zoeken/koop/?selected_area=\[%22nijmegen%22]&object_type=[%22house%22]&availability=[%22unavailable%22]'
  try {
    // Scrape a website
    const scrapeResult = await app.scrapeUrl(url, { formats: ['markdown', 'html'] });

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }

    const html = scrapeResult.html;

    console.log(html)

    // Function to extract data from HTML based on unique markers
    const extractData = (startMarker, endMarker) => {
        const startIndex = html.indexOf(startMarker);
        if (startIndex === -1) return null;  // Return null if startMarker is not found
      
        const startExtract = startIndex + startMarker.length;  // Move past the startMarker
      
        // If no endMarker is specified, just extract until the end of the string
        if (!endMarker) {
          return html.slice(startExtract).trim();
        }
      
        // Otherwise, extract between the start and end markers
        const endIndex = html.indexOf(endMarker, startExtract);
        if (endIndex === -1) return null;  // Return null if endMarker is not found
      
        return html.slice(startExtract, endIndex).trim();  // Extract the string between markers
      };
      

    // Extract address (Adjust the markers if needed)
    const address = [
        extractData("housenumber=", " province"),
        extractData("neighborhoodidentifier=", "city"),
        extractData("postcode=", " housenumber"),
        extractData("province=", " country"),
        extractData("country=", " isinternational")
      ]
        .filter(Boolean) // Remove any null or undefined values
        .join(", "); // Concatenate with a comma and space

    // Extract status (Beschikbaar = available for sale)
    const status = extractData('Status</dt><dd class="flex border-b border-neutral-20 pb-2 md:py-2"><!--[-->', '<!--]--><!----></dd>');
    
    // Extract price
    const price = extractData('Vraagprijs</dt><dd class="flex border-b border-neutral-20 pb-2 md:py-2"><!--[--><span class="mr-2">€', 'kosten koper');
    
    // Extract bedrooms (may appear in description as well)
    const bedrooms = extractData('Aantal kamers</dt><dd class="flex border-b border-neutral-20 pb-2 md:py-2"><!--[-->', '<!--]--><!----></dd>');
    ///////////////////////////////
    // Extract bathrooms
    const bathrooms = extractData('Aantal badkamers</dt><dd class="flex border-b border-neutral-20 pb-2 md:py-2"><!--[-->', '<!--]--><!----></dd>');
    
    // Extract size (Woonoppervlakte or m²)
    const size = extractData('Wonen</dt><dd class=\"max-md:pl-4 flex border-b border-neutral-20 pb-2 md:py-2\"><!--[-->', '<!--]--><!----></dd>');
    
    // Extract posted date
    const postedDate = extractData('Aangeboden sinds', ' Log in om te bekijken') || null;
    
    // Sale date (Not mentioned)
    const saleDate = null;
    
    // Extract realtor
    const realtor = extractData('title="Makelaar Martijn Willems">', '</a></h3></div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="currentColor"') || null;
    // const realtor = extractData('<div><!--[--><div class="bg-white border border-neutral-20 overflow-hidden rounded-lg"><header class="flex justify-between gap-3 bg-[#f2f2f2] px-6 py-4 items-center"><div class="flex items-center gap-3 overflow-hidden"><a href="https://www.funda.nl', '</span></div></div><div class="group px') || null;

    // Extract type (Soort woonhuis)
    const type = extractData('Soort woonhuis</dt><dd class="flex border-b border-neutral-20 pb-2 md:py-2"><!--[-->', '<!--]--><!----></dd>') || null;
    
    // Price per m² calculation
    const priceValue = price ? parseFloat(price.replace('€', '').replace(',', '').trim()) : 0;
    const sizeValue = size ? parseFloat(size.replace('m²', '').trim()) : 0;
    const pricePerM2 = sizeValue ? priceValue / sizeValue : 0;

    const propertyData = {
      address,
      status,
      price,
      bedrooms,
      bathrooms,
      size,
      postedDate,
      saleDate,
      url,
      realtor,
      type,
      pricePerM2
    };

    console.log(propertyData);
    return html; // Return the extracted data as an object
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

module.exports = { scrapeWebsite };

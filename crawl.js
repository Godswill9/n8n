const express = require('express');
const fs = require('fs');
const path = require('path');
const FirecrawlApp = require('@mendable/firecrawl-js').default;

// Load API key from environment variables
const apiKey = process.env.FIRECRAWL_API_KEY
if (!apiKey) {
  throw new Error('API key is missing. Set FIRECRAWL_API_KEY in your environment variables.');
}
const app = new FirecrawlApp({ apiKey });
  
// REAL CODE
  // Helper functions for data extraction
  const extractBetween = (text, start, end) => {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return null;

    const endIndex = text.indexOf(end, startIndex + start.length);
    if (endIndex === -1) return text.slice(startIndex + start.length).trim();

    return text.slice(startIndex + start.length, endIndex).trim();
  };
  const extractAllBetween = (text, start1, start2, start3, end) => {
    const results = [];
    let currentIndex = 0;
  
    while (currentIndex < text.length) {
      const index1 = text.indexOf(start1, currentIndex);
      const index2 = start2 ? text.indexOf(start2, currentIndex) : -1;
      const index3 = start3 ? text.indexOf(start3, currentIndex) : -1;
  
      // Choose the closest valid start match
      let startIndex;
      let activeStart;
      if (index1 === -1 && index2 === -1 && index3 === -1) break;
      if (
        (index1 === -1 || (index2 !== -1 && index2 < index1)) &&
        (index3 === -1 || (index2 !== -1 && index2 < index3))
      ) {
        startIndex = index2;
        activeStart = start2;
      } else if (
        (index2 === -1 || (index1 !== -1 && index1 < index2)) &&
        (index3 === -1 || (index1 !== -1 && index1 < index3))
      ) {
        startIndex = index1;
        activeStart = start1;
      } else {
        startIndex = index3;
        activeStart = start3;
      }
  
      const contentStart = startIndex + activeStart.length;
      const endIndex = text.indexOf(end, contentStart);
      if (endIndex === -1) break;
  
      const snippet = text.slice(contentStart, endIndex).trim();
      results.push(snippet);
  
      currentIndex = endIndex + end.length;
    }
  
    return results;
  };

  const extractData = (html, startMarker, endMarker) => {
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) return null;

    const startExtract = startIndex + startMarker.length;

    if (!endMarker) {
      return html.slice(startExtract).trim();
    }

    const endIndex = html.indexOf(endMarker, startExtract);
    if (endIndex === -1) return null;

    return html.slice(startExtract, endIndex).trim();
  };

  function handleSearchResultParam(url,num) {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
  
    // Check if the `search_result` parameter exists
    if (params.has('search_result')) {
      // Remove the existing `search_result` parameter
      params.delete('search_result');
    }
  
    // Append `search_result=1` to the end
    params.set('search_result', String(num));
    urlObj.search = params.toString(); // Update the URL with the modified query string
  
    return {
      updatedUrl: urlObj.toString(),
      search_result: 1
    };
  }

  const decodeAndFormatUrl = (formattedUrl) => {
    // First, remove escape characters like \[ and \]
    let cleanedUrl = formattedUrl
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']')
      .replace(/\\_/g, '_');
  
    // Then decode encoded characters like %22
    let decodedUrl = decodeURIComponent(cleanedUrl);
  
    return decodedUrl;
  };
  

  const scrapeWebsite = async (req, res) => {
    // const urls = [
    //   'https://www.funda.nl/zoeken/koop?selected_area=\[%22nijmegen%22]&publication_date=%2230%22&availability=[]'
    // ];

    const urls = req.body.url
    const allHtmlPages = [];
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty URLs array.' });
    }
  
    const finalResult = {
      linksScraped: [],
      houses: []
    };
  
    const scrapeAndParsePage = async (pageUrl) => {
      const decodedUrl = decodeAndFormatUrl(pageUrl);
      const scrapeResult = await app.scrapeUrl(decodedUrl, { formats: ['markdown', 'html'] });
      if (!scrapeResult.success) {
        console.error(`Failed to scrape URL: ${decodedUrl}, Error: ${scrapeResult.error}`);
        return { link: decodedUrl, houses: [], html: null, totalItems: 0 };
      }
  
      const html = scrapeResult.html;
  
      const htmlOfConcern = extractBetween(
        html,
        '<div class="flex flex-col gap-3 mt-4"><!----><!--[-->',
        '<nav data-testid="pagination">'
      ) || '';
  
      const arrayOfConcern = extractAllBetween(
        htmlOfConcern,
        '<div class="flex border">',
        '<div class="border-b pb-3">',
        '<div><header class="bg',
        '</path></svg></div></div></div>'
      ) || [];
  
      const houses = arrayOfConcern.map((item) => {
        const address = [
          extractData(item, '<div class="flex font-semibold"><span class="truncate">', '&nbsp;</span><span class="ml-1 whitespace-nowrap">&nbsp;</span></div>'),
          extractData(item, '<div class="truncate text-neutral-80">', '</div></a></h2>')
        ].filter(Boolean).join(', ');
  
        const size = extractData(item, '<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M38.5 32.25v-16.5a5 5 0 10-6.25-6.25h-16.5a5 5 0 10-6.25 6.25v16.5a5 5 0 106.25 6.25h16.5a5 5 0 106.25-6.25zm-6.25 3.25h-16.5a5 5 0 00-3.25-3.25v-16.5a5 5 0 003.25-3.25h16.5a5 5 0 003.25 3.25v16.5a5 5 0 00-3.25 3.25zM37 9a2 2 0 11-2 2 2 2 0 012-2zM11 9a2 2 0 11-2 2 2 2 0 012-2zm0 30a2 2 0 112-2 2 2 0 01-2 2zm26 0a2 2 0 112-2 2 2 0 01-2 2z"></path></svg><span>', '</span></li>');
        const status = extractData(item, '<span class="mb-1 mr-1 inline-block rounded px-2 py-0.5 text-xs font-semibold bg-red-70 text-white"><!--[-->', '<!--]--></span>');
        const url = extractData(item, '<h2><a href="', '" class="text-secondary-70');
        let price = extractData(item, '<div class=\"font-semibold mt-2 mb-0\"><div class=\"truncate\">', 'k.k.</div><!----></div>');
        const canceledPrice = extractData(item, '<div class=\"font-semibold mt-2 mb-0\"><div class=\"line-through truncate\">', 'k.k.</div>');
  
        const realtor =
          extractData(item, 'truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2"><span>', '</span></a>') ||
          extractData(item, '/" target="_blank" class="truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2 min-w-0 truncate"><span>', '</span></a>');
  
        const bedrooms = extractData(item, '<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M11 20l-3.999 5.999h33.998L37 20h3l3.999 5.999L44 26v9.5a1.5 1.5 0 01-1.5 1.5H39v1.5a1.5 1.5 0 01-3 0V37H12v1.5a1.5 1.5 0 01-3 0V37H5.5A1.5 1.5 0 014 35.5V26l.001-.001L8 20h3zm30 9H7v5h34v-5zM38.5 8A1.5 1.5 0 0140 9.5V20l-9-.001V21.5a1.5 1.5 0 01-1.5 1.5h-11a1.5 1.5 0 01-1.5-1.5v-1.501L8 20V9.5A1.5 1.5 0 019.5 8h29zM28 17h-8v3h8v-3zm9-6H11v5.999h6V15.5a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v1.499h6V11z"></path></svg><span>', '</span></li>');
        const sizeValue = size ? parseFloat(size.replace('m²', '').trim()) : 0;
        const priceValue = price
          ? parseFloat(price.replace(/[€,.\s]/g, '').trim())
          : canceledPrice
          ? parseFloat(canceledPrice.replace(/[€,.\s]/g, '').trim())
          : 0;
        const pricePerM2 = sizeValue ? (priceValue / sizeValue).toFixed(2) : 0;
  
        return { address, price: price === null ? canceledPrice : price, bedrooms, status: status === null ? "Beschikbaar" : status, size, url, realtor, pricePerM2: ` € ${pricePerM2}` };
      });
  
      return { link: decodedUrl, houses, html };
    };
  
    try {
      for (const baseUrl of urls) {
        let page = 1;
        let morePages = true;
        let maxPages = Infinity;
  
        while (morePages && page <= maxPages) {
          const { updatedUrl } = handleSearchResultParam(baseUrl, page);
          console.log(`🔁 Fetching page ${page} for ${updatedUrl}`);
  
          const result = await scrapeAndParsePage(updatedUrl);
          finalResult.linksScraped.push(result.link);
          finalResult.houses.push(...result.houses);
          allHtmlPages.push(result.html);
  
          if (page === 1 && result.html) {
            const totalHomesText = extractBetween(result.html, '? Op Funda vind je momenteel ', ' huizen te koop in');
            if (totalHomesText) {
              const totalItems = parseInt(totalHomesText.replace(/[^\d]/g, ''), 10);
              // maxPages = Math.ceil(totalItems / 15);
              maxPages = Math.min(Math.ceil(totalItems / 15), 23);
              console.log(`📊 Total items: ${totalItems}, Estimated pages: ${maxPages}`);
            }
          }
  
          if (result.houses.length < 10) {
            morePages = false;
          } else {
            page++;
          }
        }
      }
  
      return res.json({ ...finalResult, totalItems: finalResult.houses.length }); // Return the extracted data as an object
    } catch (error) {
      console.error('Error during scraping:', error);
      res.json({ ...finalResult, message: `An error occurred during scraping. ${ Math.ceil(Number(finalResult.houses.length) / 15)} pages scraped.` });
    }
  };
  
  module.exports = { scrapeWebsite };
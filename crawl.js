const express = require('express');
const fs = require('fs');
const path = require('path');
const FirecrawlApp = require('@mendable/firecrawl-js').default;

// Load API key from environment variables
const apiKey = process.env.FIRECRAWL_API_KEY || 'fc-fc9f3eb875c245dcadbab0eacf4591ad';
// const apiKey = process.env.FIRECRAWL_API_KEY || 'fc-a905412283064414a6f9ce87aa533cf7';
// const apiKey = process.env.FIRECRAWL_API_KEY || 'fc-aeb0f11ad777430f9254b5614d073c5c';
if (!apiKey) {
  throw new Error('API key is missing. Set FIRECRAWL_API_KEY in your environment variables.');
}

const app = new FirecrawlApp({ apiKey });

// const scrapeWebsite = async (req, res) => {
// // const url = 'https://www.funda.nl/zoeken/koop/?selected_area=[%22nijmegen%22]&object_type=[%22apartment%22]&search_result=3';
// const url = 'https://www.funda.nl/zoeken/koop/?selected_area=[%22nijmegen%22]&object_type=[%22house%22]&availability=[%22available%22]&search_result=2&construction_period=[%22before_1906%22,%22from_1906_to_1930%22]'
//  try {
//     // Scrape a website
//     const scrapeResult = await app.scrapeUrl(url, { formats: ['markdown', 'html'] });

//     if (!scrapeResult.success) {
//       throw new Error(`Failed to scrape: ${scrapeResult.error}`);
//     }

//     const html = scrapeResult.html;

//     function extractBetween(text, start, end) {
//         const startIndex = text.indexOf(start);
//         if (startIndex === -1) return null;
      
//         const endIndex = text.indexOf(end, startIndex + start.length);
//         if (endIndex === -1) return text.slice(startIndex + start.length).trim();
      
//         return text.slice(startIndex + start.length, endIndex).trim();
//       }

//       function extractAllBetween(text, start1, start2, end) {
//         const results = [];
//         let currentIndex = 0;
      
//         while (currentIndex < text.length) {
//           const index1 = text.indexOf(start1, currentIndex);
//           const index2 = start2 ? text.indexOf(start2, currentIndex) : -1;
      
//           // Choose the closest valid start match
//           let startIndex;
//           let activeStart;
//           if (index1 === -1 && index2 === -1) break;
//           if (index1 === -1 || (index2 !== -1 && index2 < index1)) {
//             startIndex = index2;
//             activeStart = start2;
//           } else {
//             startIndex = index1;
//             activeStart = start1;
//           }
      
//           const contentStart = startIndex + activeStart.length;
//           const endIndex = text.indexOf(end, contentStart);
//           if (endIndex === -1) break;
      
//           const snippet = text.slice(contentStart, endIndex).trim();
//           results.push(snippet);
      
//           currentIndex = endIndex + end.length;
//         }
      
//         return results;
//       }

//       const extractData = (html, startMarker, endMarker) => {
//         const startIndex = html.indexOf(startMarker);
//         if (startIndex === -1) return null;  // Return null if startMarker is not found
      
//         const startExtract = startIndex + startMarker.length;  // Move past the startMarker
      
//         // If no endMarker is specified, just extract until the end of the string
//         if (!endMarker) {
//           return html.slice(startExtract).trim();
//         }
      
//         // Otherwise, extract between the start and end markers
//         const endIndex = html.indexOf(endMarker, startExtract);
//         if (endIndex === -1) return null;  // Return null if endMarker is not found
      
//         return html.slice(startExtract, endIndex).trim();  // Extract the string between markers
//       };
      
      
      
//     //   console.log(html)
//     const htmlOfConcern = extractBetween(html, '<div class="flex flex-col gap-3 mt-4"><!----><!--[-->', '"></path></svg></div></div></div></div><!----></div></div><!--]--></div>') || null;
//     //   const htmlOfConcern = extractBetween(html, '<div class="flex flex-col gap-3 mt-4"><!----><!--[--><div><!----><!----><div>', '"></path></svg></div></div></div></div><!----></div></div><!--]--></div>') || null;
//     //   console.log(htmlOfConcern)
//       const arrayOfConcern = extractAllBetween(htmlOfConcern, '<div class="flex border">','<div class="relative flex w-full min-w-0 flex-col pl-0 pt-4 sm:pl-4 sm:pt-0">', '</path></svg></div></div></div>') || null;
// //     //   const arrayOfConcern = extractAllBetween(htmlOfConcern, '<div><!---->', '<div><div id', 'path>') || null;
// arrayOfConcern.forEach((item, index) => {
// const address = [
//     extractData(item, '<div class="flex font-semibold"><span class="truncate">', '&nbsp;</span><span class="ml-1 whitespace-nowrap">&nbsp;</span></div>'),
//     extractData(item, '<div class="truncate text-neutral-80">', '</div></a></h2>'),
//   ]
//     .filter(Boolean) // Remove any null or undefined values
//     .join(", "); // Concatenate with a comma and space

// const size = extractData(item,'<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M38.5 32.25v-16.5a5 5 0 10-6.25-6.25h-16.5a5 5 0 10-6.25 6.25v16.5a5 5 0 106.25 6.25h16.5a5 5 0 106.25-6.25zm-6.25 3.25h-16.5a5 5 0 00-3.25-3.25v-16.5a5 5 0 003.25-3.25h16.5a5 5 0 003.25 3.25v16.5a5 5 0 00-3.25 3.25zM37 9a2 2 0 11-2 2 2 2 0 012-2zM11 9a2 2 0 11-2 2 2 2 0 012-2zm0 30a2 2 0 112-2 2 2 0 01-2 2zm26 0a2 2 0 112-2 2 2 0 01-2 2z"></path></svg><span>', '</span></li>');
// const url = extractData(item,'<h2><a href="', '" class="text-secondary-70');
//      const price = extractData(item,'<div class="font-semibold mt-2 mb-0"><div class="truncate">', 'k.k.</div><!----></div>');
// const bedrooms = extractData(item,'<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M11 20l-3.999 5.999h33.998L37 20h3l3.999 5.999L44 26v9.5a1.5 1.5 0 01-1.5 1.5H39v1.5a1.5 1.5 0 01-3 0V37H12v1.5a1.5 1.5 0 01-3 0V37H5.5A1.5 1.5 0 014 35.5V26l.001-.001L8 20h3zm30 9H7v5h34v-5zM38.5 8A1.5 1.5 0 0140 9.5V20l-9-.001V21.5a1.5 1.5 0 01-1.5 1.5h-11a1.5 1.5 0 01-1.5-1.5v-1.501L8 20V9.5A1.5 1.5 0 019.5 8h29zM28 17h-8v3h8v-3zm9-6H11v5.999h6V15.5a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v1.499h6V11z"></path></svg><span>', '</span></li>');
// const realtor = extractData(item,'truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2"><span>', '</span></a>') || extractData(item,'/" target="_blank" class="truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2 min-w-0 truncate"><span>', '</span></a>');

// // const realtor = extractData(item,'/" target="_blank" class="truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2 min-w-0 truncate"><span>', '</span></a>');

// const priceValue = price ? parseFloat(price.replace('€', '').replace(',', '').replace('.', '').trim()) : 0;
// const sizeValue = size ? parseFloat(size.replace('m²', '').trim()) : 0;
// const pricePerM2 = sizeValue ? (priceValue / sizeValue).toFixed(2) : 0;
// const propertyData = {
// address,
// // status,
// price,
// bedrooms,
// // bathrooms,
// size,
// // postedDate,
// // saleDate,
// url,
// realtor,
// // type,
// pricePerM2
// };

// console.log(propertyData)
// })

// // console.log(arrayOfConcern)
//    res.contentType('text/html'); // Set the content type to HTML
//     res.send(htmlOfConcern) // Return the extracted data as an object
//   } catch (error) {
//     console.error('Error during scraping:', error);
//     throw error; // Re-throw the error for the caller to handle
//   }
// };

  


// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
// REAL CODE
  // Helper functions for data extraction
  const extractBetween = (text, start, end) => {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return null;

    const endIndex = text.indexOf(end, startIndex + start.length);
    if (endIndex === -1) return text.slice(startIndex + start.length).trim();

    return text.slice(startIndex + start.length, endIndex).trim();
  };

  // const extractAllBetween = (text, start1, start2, end) => {
  //   const results = [];
  //   let currentIndex = 0;

  //   while (currentIndex < text.length) {
  //     const index1 = text.indexOf(start1, currentIndex);
  //     const index2 = start2 ? text.indexOf(start2, currentIndex) : -1;

  //     // Choose the closest valid start match
  //     let startIndex;
  //     let activeStart;
  //     if (index1 === -1 && index2 === -1) break;
  //     if (index1 === -1 || (index2 !== -1 && index2 < index1)) {
  //       startIndex = index2;
  //       activeStart = start2;
  //     } else {
  //       startIndex = index1;
  //       activeStart = start1;
  //     }

  //     const contentStart = startIndex + activeStart.length;
  //     const endIndex = text.indexOf(end, contentStart);
  //     if (endIndex === -1) break;

  //     const snippet = text.slice(contentStart, endIndex).trim();
  //     results.push(snippet);

  //     currentIndex = endIndex + end.length;
  //   }

  //   return results;
  // };

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

  // function handleSearchResultParam(url, num) {
  //   const urlObj = new URL(url);
  //   const params = urlObj.searchParams;
  
  //   if (params.has('search_result')) {
  //     // Already has the parameter
  //     const value = parseInt(params.get('search_result'), 10);
  //     return {
  //       updatedUrl: url,
  //       search_result: value
  //     };
  //   } else {
  //     // Add search_result=1
  //     params.set('search_result', String(num));
  //     urlObj.search = params.toString(); // update the URL
  //     return {
  //       updatedUrl: urlObj.toString(),
  //       search_result: 1
  //     };
  //   }
  // }

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
              maxPages = Math.ceil(totalItems / 15);
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
      return res.status(500).json({
        ...finalResult,
        totalItems: finalResult.houses.length,
        message: `An error occurred during scraping. ${ Math.ceil(Number(finalResult.houses.length) / 15)} pages scraped.`
      });
    }
  };


  // const scrapeWebsite = async (req, res) => {
  //   const urls = [
  //     'https://www.funda.nl/zoeken/koop?selected_area=\[%22nijmegen%22]&publication_date=%2230%22&availability=[]'
  //   ];
  //   // const urls = [
  //   //   'https://www.funda.nl/zoeken/koop?selected_area=\[%22nijmegen%22]&object_type=[%22house%22]&availability=[%22available%22,%22unavailable%22]'
  //   // ];
  //   // const urls = [
  //   //   'https://www.funda.nl/zoeken/koop/?selected_area=[%22nijmegen%22]&object_type=[%22house%22,%22apartment%22,%22land%22]&availability=[%22negotiations%22,%22available%22]&search_result=4&construction_type=[%22resale%22]&construction_period=[%22before_1906%22,%22from_1931_to_1944%22]&amenities=[%22central_heating_boiler%22]'
  //   // ];
  //   const allHtmlPages= []
  //   // const urls = req.body.url; // Array of URLs
  //   if (!Array.isArray(urls) || urls.length === 0) {
  //     return res.status(400).json({ error: 'Invalid or empty URLs array.' });
  //   }
  
  //   const finalResult = {
  //     linksScraped: [],
  //     houses: []
  //   };
  
  //   const scrapeAndParsePage = async (pageUrl) => {
  //     const decodedUrl = decodeAndFormatUrl(pageUrl);
  //     const scrapeResult = await app.scrapeUrl(decodedUrl, { formats: ['markdown', 'html'] });
  //     if (!scrapeResult.success) {
  //       console.error(`Failed to scrape URL: ${decodedUrl}, Error: ${scrapeResult.error}`);
  //       return { link: decodedUrl, houses: [], html: null, totalItems: 0 };
  //     }
  
  //     const html = scrapeResult.html;
  
  //     const htmlOfConcern = extractBetween(
  //       html,
  //       '<div class="flex flex-col gap-3 mt-4"><!----><!--[-->',
  //       '<nav data-testid="pagination">'
  //     ) || '';
  
  //     // const htmlOfConcern = extractBetween(
  //     //   html,
  //     //   '<div class="flex flex-col gap-3 mt-4"><!----><!--[-->',
  //     //   '"></path></svg></div></div></div></div><!----></div></div><!--]--></div>'
  //     // ) || '';
  
  //     const arrayOfConcern = extractAllBetween(
  //       htmlOfConcern,
  //       '<div class="flex border">',
  //       '<div class="border-b pb-3">',
  //       // '<div class="relative flex w-full min-w-0 flex-col pl-0 pt-4 sm:pl-4 sm:pt-0">',
  //       '<div><header class="bg',
  //       '</path></svg></div></div></div>'
  //     ) || [];
  //     // const arrayOfConcern = extractAllBetween(
  //     //   htmlOfConcern,
  //     //   '<div class="flex border">',
  //     //   '<div class="relative flex w-full min-w-0 flex-col pl-0 pt-4 sm:pl-4 sm:pt-0">',
  //     //   '</path></svg></div></div></div>'
  //     // ) || [];
  
  //     const houses = arrayOfConcern.map((item) => {
  //       const address = [
  //         extractData(item, '<div class="flex font-semibold"><span class="truncate">', '&nbsp;</span><span class="ml-1 whitespace-nowrap">&nbsp;</span></div>'),
  //         extractData(item, '<div class="truncate text-neutral-80">', '</div></a></h2>')
  //       ].filter(Boolean).join(', ');
  
  //       const size = extractData(item,'<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M38.5 32.25v-16.5a5 5 0 10-6.25-6.25h-16.5a5 5 0 10-6.25 6.25v16.5a5 5 0 106.25 6.25h16.5a5 5 0 106.25-6.25zm-6.25 3.25h-16.5a5 5 0 00-3.25-3.25v-16.5a5 5 0 003.25-3.25h16.5a5 5 0 003.25 3.25v16.5a5 5 0 00-3.25 3.25zM37 9a2 2 0 11-2 2 2 2 0 012-2zM11 9a2 2 0 11-2 2 2 2 0 012-2zm0 30a2 2 0 112-2 2 2 0 01-2 2zm26 0a2 2 0 112-2 2 2 0 01-2 2z"></path></svg><span>', '</span></li>');
  //       const status= extractData(item, '<span class="mb-1 mr-1 inline-block rounded px-2 py-0.5 text-xs font-semibold bg-red-70 text-white"><!--[-->', '<!--]--></span>') 
  //       // const status= extractData(item, '<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">', '</font></font>') 
  //       const url = extractData(item, '<h2><a href="', '" class="text-secondary-70');
  //       let price = extractData(item, '<div class=\"font-semibold mt-2 mb-0\"><div class=\"truncate\">', 'k.k.</div><!----></div>');
  //       // let price = extractData(item, '<div class="font-semibold mt-2 mb-0"><div class="truncate">', 'k.k.</div><!----></div>');

  //         const canceledPrice= extractData(item, '<div class=\"font-semibold mt-2 mb-0\"><div class=\"line-through truncate\">', 'k.k.</div>');

  //       // const price = extractData(item, '<div class="font-semibold mt-2 mb-0"><div class="truncate">', 'k.k.</div><!----></div>');
  
  //       const realtor =
  //         extractData(item, 'truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2"><span>', '</span></a>') ||
  //         extractData(item, '/" target="_blank" class="truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2 min-w-0 truncate"><span>', '</span></a>');
  
  //         const bedrooms = extractData(item,'<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M11 20l-3.999 5.999h33.998L37 20h3l3.999 5.999L44 26v9.5a1.5 1.5 0 01-1.5 1.5H39v1.5a1.5 1.5 0 01-3 0V37H12v1.5a1.5 1.5 0 01-3 0V37H5.5A1.5 1.5 0 014 35.5V26l.001-.001L8 20h3zm30 9H7v5h34v-5zM38.5 8A1.5 1.5 0 0140 9.5V20l-9-.001V21.5a1.5 1.5 0 01-1.5 1.5h-11a1.5 1.5 0 01-1.5-1.5v-1.501L8 20V9.5A1.5 1.5 0 019.5 8h29zM28 17h-8v3h8v-3zm9-6H11v5.999h6V15.5a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v1.499h6V11z"></path></svg><span>', '</span></li>');
  //       const sizeValue = size ? parseFloat(size.replace('m²', '').trim()) : 0;
  //          const priceValue = price 
  // ? parseFloat(price.replace(/[€,.\s]/g, '').trim()) 
  // : canceledPrice 
  // ? parseFloat(canceledPrice.replace(/[€,.\s]/g, '').trim()) 
  // : 0;
  //       const pricePerM2 = sizeValue ? (priceValue / sizeValue).toFixed(2) : 0;
  
  //       return { address, price:price===null? canceledPrice:price, bedrooms, status: status === null ? null : status, size, url, realtor, pricePerM2: ` € ${pricePerM2}` };
  //     });
  
  //     return { link: decodedUrl, houses, html };
  //   };
  
  //   for (const baseUrl of urls) {
  //     let page = 1;
  //     let morePages = true;
  //     let maxPages = Infinity;
  
  //     while (morePages && page <= maxPages) {
  //       const { updatedUrl } = handleSearchResultParam(baseUrl, page);
  //       console.log(`🔁 Fetching page ${page} for ${updatedUrl}`);
  //       // console.log(`🔁 Fetching page ${page} for ${baseUrl}`);
  
  //       const result = await scrapeAndParsePage(updatedUrl);
  //       finalResult.linksScraped.push(result.link);
  //       finalResult.houses.push(...result.houses);
  //       allHtmlPages.push(result.html)
  //       if (page === 1 && result.html) {
  //         const totalHomesText = extractBetween(result.html, '? Op Funda vind je momenteel ', ' huizen te koop in');
  //         if (totalHomesText) {
  //           const totalItems = parseInt(totalHomesText.replace(/[^\d]/g, ''), 10);
  //           maxPages = Math.ceil(totalItems / 15);
  //           console.log(`📊 Total items: ${totalItems}, Estimated pages: ${maxPages}`);
  //         }
  //       }
  
  //       if (result.houses.length < 10) {
  //         morePages = false;
  //       } else {
  //         page++;
  //       }
  //     }
  //   }
  
  //   // return res.json(allHtmlPages); // Return the extracted data as an object
  //   return res.json({ ...finalResult, totalItems: finalResult.houses.length }); // Return the extracted data as an object
    
  // };
  
  


// const scrapeWebsite = (req, res) => {
//     const filePath = path.join(__dirname, 'n8n file.txt'); // replace with your actual file
  
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading file:', err);
//         return res.status(500).send('Error reading file');
//       }


//       function extractBetween(text, start, end) {
//                 const startIndex = text.indexOf(start);
//                 if (startIndex === -1) return null;
              
//                 const endIndex = text.indexOf(end, startIndex + start.length);
//                 if (endIndex === -1) return text.slice(startIndex + start.length).trim();
              
//                 return text.slice(startIndex + start.length, endIndex).trim();
//               }
        
//               function extractAllBetween(text, start1, start2, end) {
//                 const results = [];
//                 let currentIndex = 0;
              
//                 while (currentIndex < text.length) {
//                   const index1 = text.indexOf(start1, currentIndex);
//                   const index2 = start2 ? text.indexOf(start2, currentIndex) : -1;
              
//                   // Choose the closest valid start match
//                   let startIndex;
//                   let activeStart;
//                   if (index1 === -1 && index2 === -1) break;
//                   if (index1 === -1 || (index2 !== -1 && index2 < index1)) {
//                     startIndex = index2;
//                     activeStart = start2;
//                   } else {
//                     startIndex = index1;
//                     activeStart = start1;
//                   }
              
//                   const contentStart = startIndex + activeStart.length;
//                   const endIndex = text.indexOf(end, contentStart);
//                   if (endIndex === -1) break;
              
//                   const snippet = text.slice(contentStart, endIndex).trim();
//                   results.push(snippet);
              
//                   currentIndex = endIndex + end.length;
//                 }
              
//                 return results;
//               }

//               const extractData = (html, startMarker, endMarker) => {
//                 const startIndex = html.indexOf(startMarker);
//                 if (startIndex === -1) return null;  // Return null if startMarker is not found
              
//                 const startExtract = startIndex + startMarker.length;  // Move past the startMarker
              
//                 // If no endMarker is specified, just extract until the end of the string
//                 if (!endMarker) {
//                   return html.slice(startExtract).trim();
//                 }
              
//                 // Otherwise, extract between the start and end markers
//                 const endIndex = html.indexOf(endMarker, startExtract);
//                 if (endIndex === -1) return null;  // Return null if endMarker is not found
              
//                 return html.slice(startExtract, endIndex).trim();  // Extract the string between markers
//               };
              
              
              
//               console.log(data)
//               const htmlOfConcern = extractBetween(data, '<p>Op zoek naar huizen in Nijmegen? Op Funda vind je momenteel ', ' huizen te koop in Nijmegen.</p>') || null;
//               console.log(htmlOfConcern)
//     //           const arrayOfConcern = extractAllBetween(htmlOfConcern, '<div class="flex border">','<div class="relative flex w-full min-w-0 flex-col pl-0 pt-4 sm:pl-4 sm:pt-0">', '</path></svg></div></div></div>') || null;
//     //         //   const arrayOfConcern = extractAllBetween(htmlOfConcern, '<div><!---->', '<div><div id', 'path>') || null;
//     //    arrayOfConcern.forEach((item, index) => {
//     //     const address = [
//     //         extractData(item, '<div class="flex font-semibold"><span class="truncate">', '&nbsp;</span><span class="ml-1 whitespace-nowrap">&nbsp;</span></div>'),
//     //         extractData(item, '<div class="truncate text-neutral-80">', '</div></a></h2>'),
//     //       ]
//     //         .filter(Boolean) // Remove any null or undefined values
//     //         .join(", "); // Concatenate with a comma and space
    
   // const size = extractData(item,'<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M38.5 32.25v-16.5a5 5 0 10-6.25-6.25h-16.5a5 5 0 10-6.25 6.25v16.5a5 5 0 106.25 6.25h16.5a5 5 0 106.25-6.25zm-6.25 3.25h-16.5a5 5 0 00-3.25-3.25v-16.5a5 5 0 003.25-3.25h16.5a5 5 0 003.25 3.25v16.5a5 5 0 00-3.25 3.25zM37 9a2 2 0 11-2 2 2 2 0 012-2zM11 9a2 2 0 11-2 2 2 2 0 012-2zm0 30a2 2 0 112-2 2 2 0 01-2 2zm26 0a2 2 0 112-2 2 2 0 01-2 2z"></path></svg><span>', '</span></li>');
//     //     const url = extractData(item,'<h2><a href="', '" class="text-secondary-70');
//     //          const price = extractData(item,'<div class="font-semibold mt-2 mb-0"><div class="truncate">', 'k.k.</div><!----></div>');
//   const bedrooms = extractData(item,'<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M11 20l-3.999 5.999h33.998L37 20h3l3.999 5.999L44 26v9.5a1.5 1.5 0 01-1.5 1.5H39v1.5a1.5 1.5 0 01-3 0V37H12v1.5a1.5 1.5 0 01-3 0V37H5.5A1.5 1.5 0 014 35.5V26l.001-.001L8 20h3zm30 9H7v5h34v-5zM38.5 8A1.5 1.5 0 0140 9.5V20l-9-.001V21.5a1.5 1.5 0 01-1.5 1.5h-11a1.5 1.5 0 01-1.5-1.5v-1.501L8 20V9.5A1.5 1.5 0 019.5 8h29zM28 17h-8v3h8v-3zm9-6H11v5.999h6V15.5a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v1.499h6V11z"></path></svg><span>', '</span></li>');
// //     //  const realtor = extractData(item,'truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2"><span>', '</span></a>') || extractData(item,'/" target="_blank" class="truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2 min-w-0 truncate"><span>', '</span></a>');
    
//     //  // const realtor = extractData(item,'/" target="_blank" class="truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2 min-w-0 truncate"><span>', '</span></a>');
    
//     //  const priceValue = price ? parseFloat(price.replace('€', '').replace(',', '').replace('.', '').trim()) : 0;
//     //  const sizeValue = size ? parseFloat(size.replace('m²', '').trim()) : 0;
//     //  const pricePerM2 = sizeValue ? (priceValue / sizeValue).toFixed(2) : 0;
//     //  const propertyData = {
//     //     address,
//     //     // status,
//     //     price,
//     //     bedrooms,
//     //     // bathrooms,
//     //     size,
//     //     // postedDate,
//     //     // saleDate,
//     //     url,
//     //     realtor,
//     //     // type,
//     //     pricePerM2
//     //   };

//     //  console.log(propertyData)
//     //    })
//             res.send(data); // Send the extracted data as a response
//     });
//   };
  
  module.exports = { scrapeWebsite };


// FORMER CODE
// FORMER CODE
// FORMER CODE
// FORMER CODE
// FORMER CODE
  // const scrapeWebsite = async (req, res) => {
  //   const urls = req.body.url; // Array of URLs
  //   if (!Array.isArray(urls) || urls.length === 0) {
  //     return res.status(400).json({ error: 'Invalid or empty URLs array.' });
  //   }
  
  //   try {
  //     const results = []; // Array to hold the result for each URL
  
  //     // Loop through each URL and scrape data
  //     for (const url of urls) {
  //       const scrapeResult = await app.scrapeUrl(decodeAndFormatUrl(url), { formats: ['markdown', 'html'] });
  
  //       if (!scrapeResult.success) {
  //         console.error(`Failed to scrape URL: ${decodeAndFormatUrl(url)}, Error: ${scrapeResult.error}`);
  //         results.push({ link: decodeAndFormatUrl(url), houses: [] }); // Add an empty array for failed URLs
  //         continue; // Skip this URL if scraping fails
  //       }
  
  //       const html = scrapeResult.html;
  
  //       // Helper functions for data extraction
  //       const extractBetween = (text, start, end) => {
  //         const startIndex = text.indexOf(start);
  //         if (startIndex === -1) return null;
  
  //         const endIndex = text.indexOf(end, startIndex + start.length);
  //         if (endIndex === -1) return text.slice(startIndex + start.length).trim();
  
  //         return text.slice(startIndex + start.length, endIndex).trim();
  //       };
  
  //       const extractAllBetween = (text, start1, start2, end) => {
  //         const results = [];
  //         let currentIndex = 0;
  
  //         while (currentIndex < text.length) {
  //           const index1 = text.indexOf(start1, currentIndex);
  //           const index2 = start2 ? text.indexOf(start2, currentIndex) : -1;
  
  //           // Choose the closest valid start match
  //           let startIndex;
  //           let activeStart;
  //           if (index1 === -1 && index2 === -1) break;
  //           if (index1 === -1 || (index2 !== -1 && index2 < index1)) {
  //             startIndex = index2;
  //             activeStart = start2;
  //           } else {
  //             startIndex = index1;
  //             activeStart = start1;
  //           }
  
  //           const contentStart = startIndex + activeStart.length;
  //           const endIndex = text.indexOf(end, contentStart);
  //           if (endIndex === -1) break;
  
  //           const snippet = text.slice(contentStart, endIndex).trim();
  //           results.push(snippet);
  
  //           currentIndex = endIndex + end.length;
  //         }
  
  //         return results;
  //       };
  
  //       const extractData = (html, startMarker, endMarker) => {
  //         const startIndex = html.indexOf(startMarker);
  //         if (startIndex === -1) return null;
  
  //         const startExtract = startIndex + startMarker.length;
  
  //         if (!endMarker) {
  //           return html.slice(startExtract).trim();
  //         }
  
  //         const endIndex = html.indexOf(endMarker, startExtract);
  //         if (endIndex === -1) return null;
  
  //         return html.slice(startExtract, endIndex).trim();
  //       };
  
  //       // Extract relevant data
  //       const htmlOfConcern = extractBetween(
  //         html,
  //         '<div class="flex flex-col gap-3 mt-4"><!----><!--[-->',
  //         '"></path></svg></div></div></div></div><!----></div></div><!--]--></div>'
  //       ) || null;
  
  //       const arrayOfConcern = extractAllBetween(
  //         htmlOfConcern,
  //         '<div class="flex border">',
  //         '<div class="relative flex w-full min-w-0 flex-col pl-0 pt-4 sm:pl-4 sm:pt-0">',
  //         '</path></svg></div></div></div>'
  //       ) || null;
  
  //       const houses = []; // Array to hold house data for the current URL
  
  //       arrayOfConcern.forEach((item) => {
  //         const address = [
  //           extractData(item, '<div class="flex font-semibold"><span class="truncate">', '&nbsp;</span><span class="ml-1 whitespace-nowrap">&nbsp;</span></div>'),
  //           extractData(item, '<div class="truncate text-neutral-80">', '</div></a></h2>'),
  //         ]
  //           .filter(Boolean)
  //           .join(", ");
  
  //         const size = extractData(
  //           item,
  //           '<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M38.5 32.25v-16.5a5 5 0 10-6.25-6.25h-16.5a5 5 0 10-6.25 6.25v16.5a5 5 0 106.25 6.25h16.5a5 5 0 106.25-6.25zm-6.25 3.25h-16.5a5 5 0 00-3.25-3.25v-16.5a5 5 0 003.25-3.25h16.5a5 5 0 003.25 3.25v16.5a5 5 0 00-3.25 3.25zM37 9a2 2 0 11-2 2 2 2 0 012-2zM11 9a2 2 0 11-2 2 2 2 0 012-2zm0 30a2 2 0 112-2 2 2 0 01-2 2zm26 0a2 2 0 112-2 2 2 0 01-2 2z"></path></svg><span>',
  //           '</span></li>'
  //         );
  //         const url = extractData(item, '<h2><a href="', '" class="text-secondary-70');
  //         const price = extractData(item, '<div class="font-semibold mt-2 mb-0"><div class="truncate">', 'k.k.</div><!----></div>');
  //         const bedrooms = extractData(
  //           item,
  //           '<li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="mr-1"><path d="M11 20l-3.999 5.999h33.998L37 20h3l3.999 5.999L44 26v9.5a1.5 1.5 0 01-1.5 1.5H39v1.5a1.5 1.5 0 01-3 0V37H12v1.5a1.5 1.5 0 01-3 0V37H5.5A1.5 1.5 0 014 35.5V26l.001-.001L8 20h3zm30 9H7v5h34v-5zM38.5 8A1.5 1.5 0 0140 9.5V20l-9-.001V21.5a1.5 1.5 0 01-1.5 1.5h-11a1.5 1.5 0 01-1.5-1.5v-1.501L8 20V9.5A1.5 1.5 0 019.5 8h29zM28 17h-8v3h8v-3zm9-6H11v5.999h6V15.5a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v1.499h6V11z"></path></svg><span>',
  //           '</span></li>'
  //         );
  //         const realtor =
  //           extractData(item, 'truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2"><span>', '</span></a>') ||
  //           extractData(item, '/" target="_blank" class="truncate text-secondary-70 hover:text-secondary-70-darken-1 active:text-secondary-70-darken-2 min-w-0 truncate"><span>', '</span></a>');
  
  //         const priceValue = price ? parseFloat(price.replace('€', '').replace(',', '').replace('.', '').trim()) : 0;
  //         const sizeValue = size ? parseFloat(size.replace('m²', '').trim()) : 0;
  //         const pricePerM2 = sizeValue ? (priceValue / sizeValue).toFixed(2) : 0;
  
  //         const propertyData = {
  //           address,
  //           price,
  //           bedrooms,
  //           size,
  //           url,
  //           realtor,
  //           pricePerM2,
  //         };
  
  //         houses.push(propertyData); // Push each house data into the houses array
  //       });
  
  //       results.push({ link: url, houses }); // Add the link and its houses to the results array
  //     }
  
  //     // Send the results as JSON
  //     res.json(results);
  //   } catch (error) {
  //     console.error('Error during scraping:', error);
  //     res.status(500).json({ error: 'Failed to scrape the websites.' });
  //   }
  // };
  
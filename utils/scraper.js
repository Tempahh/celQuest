const axios = require('axios');

async function scrapeQuestionsFromGoogleCustomSearchApi(celebrity) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const query = `${celebrity}`;

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

  try {
    console.log('Fetching from URL:', url);
    const response = await axios.get(url);
    console.log('Response status:', response.status);

    const items = response.data.items || [];
    
    if (items.length === 0) {
      console.log('No search results found for:', celebrity);
      return null;
    }

    console.log('Number of search results:', items.length);
    console.log('First search result title:', items[0].title);

    // Return the entire response data for AI analysis
    return JSON.stringify(response.data, null, 2);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    if (error.response) {
      console.error('Error response:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

module.exports = { scrapeQuestionsFromGoogleCustomSearchApi };
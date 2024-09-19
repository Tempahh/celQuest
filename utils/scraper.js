const axios = require('axios');

async function scrapeQuestionsFromGoogleCustomSearchApiUsing(InputtedCelebrityNameFromUser) {
  const apiKeyToConnectWithGoogleCustomSearchApi = process.env.GOOGLE_API_KEY;
  const searchEngineIdFromGoogleCustomSearchEngine = process.env.GOOGLE_SEARCH_ENGINE_ID;

  const googleApiUrlToScrapResultsFrom = `https://www.googleapis.com/customsearch/v1?key=${apiKeyToConnectWithGoogleCustomSearchApi}&cx=${searchEngineIdFromGoogleSearchEngine}&q=${encodeURIComponent(InputtedCelebrityNameFromUser)}`;

  let functionToReturnTheListOfQuestionsInJsonFormat = async () => { // Changed to an async arrow function
    try {
      console.log('Fetching from URL:', googleApiUrlToScrapResultsFrom); // Fixed variable name
      const response = await axios.get(googleApiUrlToScrapResultsFrom); // Fixed variable name
      console.log('Response status:', response.status);

      const items = response.data.items || [];
      
      if (items.length === 0) {
        console.log('No search results found for:', InputtedCelebrityNameFromUser);
        return null;
      }

      console.log('Number of search results:', items.length);
      console.log('First search result title:', items[0].title);
      
      let jsonListOfQuestionsInJsonFormat = response.data;

      // Return the entire response data for AI analysis
      return JSON.stringify(jsonListOfQuestionsInJsonFormat, null, 2);
    } catch (error) { // Ensure this is inside the async function
      console.error('Error fetching questions:', error.message);
      if (error.response) {
        console.error('Error response:', JSON.stringify(error.response.data, null, 2));
      }
      return null;
    }
  };

  return await functionToReturnTheListOfQuestionsInJsonFormat(); // Call the function
}

module.exports = { scrapeQuestionsFromGoogleCustomSearchApi };
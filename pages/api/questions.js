import { scrapeQuestionsFromGoogleCustomSearchApi } from '../../utils/scraper';
import { generateQuestionsAboutCelebrityFromSearchResults } from '../../utils/ai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('API keys:', {
        GOOGLE_SEARCH_ENGINE_ID: process.env.GOOGLE_SEARCH_ENGINE_ID,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      });

      const { InputtedCelebrityFromUser } = req.body;
      console.log('Received celebrity:', InputtedCelebrityFromUser);
      const searchResults = await scrapeQuestionsFromGoogleCustomSearchApi(InputtedCelebrityFromUser);
      
      if (searchResults === null) {
        console.log('No search results found');
        return res.status(404).json({ error: 'No information found for this celebrity.' });
      }

      //console.log('Search results received');
      const generatedQuestions = await generateQuestionsAboutCelebrityFromSearchResults(InputtedCelebrityFromUser, searchResults);
      //console.log('Generated questions:', generatedQuestions);
      
      if (generatedQuestions.length === 0) {
        return res.status(404).json({ error: 'No questions could be generated.' });
      }
      
      res.status(200).json({ questions: generatedQuestions });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
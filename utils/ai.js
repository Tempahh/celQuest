const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function generateQuestionsAboutCelebrityFromSearchResults(InputtedCelebrityNameFromUser, searchResultsFromGoogleCustomSearchApi) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
  You are an AI assistant tasked with generating interesting and insightful questions about ${InputtedCelebrityNameFromUser} based on the provided search results.

  Here are the search results in JSON format:
  ${searchResultsFromGoogleCustomSearchApi}

  Please perform the following tasks:
  1. Analyze the search results to understand key aspects of ${InputtedCelebrityNameFromUser}'s life, career, and public persona.
  2. Generate 5 thought-provoking questions about ${InputtedCelebrityNameFromUser} that:
     a) Are based on factual information from the search results
     b) Cover different aspects of ${InputtedCelebrityNameFromUser}'s life or career
     c) Encourage deeper discussion or reflection
     d) Are not easily answerable with a simple yes or no
  3. For each question, provide a brief context or explanation of why it's interesting or relevant.
  4. Format your response as a numbered list of questions and contexts.

  Example format:
  1. Question: How has [Celebrity]'s approach to [specific aspect] evolved throughout their career?
  Context: Based on the search results, [Celebrity] has been known for [specific trait]. This question explores how that has changed over time.

  2. Question: [Next question]
  Context: [Next context]

  ... and so on for 5 questions.
  `;

  let functionToReturnTheListOfQuestionsInJsonFormat = async () => {
    try {

      console.log('Sending prompt to AI model');
      const result = await model.generateContent(prompt);
      const AiResponse = await result.response;
      const text = AiResponse.text();
      console.log('AI response received:', text);
    
    // Parse the text response into an array of question-context pairs
    let questionsAndContext = [];
    const sections = text.split(/\d+\.\s+/).filter(Boolean);

    for (const section of sections) {
      const [questionPart, contextPart] = section.split(/Context:/i);
      if (questionPart && contextPart) {
        const question = questionPart.replace(/^Question:\s*/i, '').trim();
        const context = contextPart.trim();
        questionsAndContext.push({ question, context });
      }
    }

    console.log('Parsed questions and context:', questionsAndContext);
    return questionsAndContext;
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}

  return functionToReturnTheListOfQuestionsInJsonFormat(); // Added parentheses to call the function
}
module.exports = { generateQuestionsAboutCelebrityFromSearchResults };

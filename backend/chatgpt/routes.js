import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Initialize OpenAI client with your API key
const openai = new OpenAI({ apiKey : `${process.env.OPEN_API_KEY}`});

// Function to generate AI chat response
async function chatGPTResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, an error occurred while processing your request.";
  }
}

// Define Express route handler for /chatgpt endpoint
function chatGPTRoutes(app) {
  app.post("/chatgpt", async (req, res) => {
    const { message } = req.body;
    const response = await chatGPTResponse(message);
    res.json({ response });
  });

  app.post("/image", async (req, res) => {
    const { message } = req.body;
    try {
      // Hypothetical updated method for image generation
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: message,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0].url; // Adjust based on actual response structure
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).send("Error generating image");
    }
  });
}

export default chatGPTRoutes;

const { generateContent } = require("../config/gemini");

async function generateText(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    const response = await generateContent(
      `Answer the following question in one short paragraph in a supportive tone:\n\n${message}`,
    );

    const aiText = response?.text || "No response generated.";

    res.json({ reply: aiText });
  } catch (err) {
    console.error("Error in aiController:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { generateText };

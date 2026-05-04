
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Sample financial news articles for demonstration
const sampleArticles = [
  {
    title:
      "Tech stocks surge as AI adoption accelerates across industries globally",
    content:
      "Major technology companies reported record earnings this quarter, driven by increased adoption of artificial intelligence solutions. Investors showed strong confidence in the sector.",
    date: "2024-01-15",
  },
  {
    title: "Market faces headwinds as inflation concerns resurface in Q4",
    content:
      "Economic indicators suggest persistent inflation pressures may impact consumer spending. Analysts warn of potential market corrections in the coming months.",
    date: "2024-01-14",
  },
  {
    title: "Banking sector shows resilience despite rising interest rates",
    content:
      "Financial institutions reported stable performance metrics. Net interest margins improved, offsetting concerns about loan defaults.",
    date: "2024-01-13",
  },
  {
    title: "Energy stocks decline as renewable energy investments accelerate",
    content:
      "Traditional fossil fuel companies face headwinds as capital flows toward clean energy. Market sentiment shifts toward sustainable alternatives.",
    date: "2024-01-12",
  },
  {
    title: "Real estate market stabilizes after months of decline",
    content:
      "Housing prices show signs of stabilization as mortgage rates moderate slightly. Industry experts project cautious optimism for the coming year.",
    date: "2024-01-11",
  },
];

// Conversation history for multi-turn analysis
let conversationHistory = [];

async function analyzeSentiment(article) {
  const analysisPrompt = `You are a financial sentiment analysis expert. Analyze the following financial news article and provide:
1. Overall sentiment (Positive, Negative, Neutral)
2. Sentiment score (-1.0 to 1.0, where -1 is extremely negative, 0 is neutral, 1 is extremely positive)
3. Key sentiment indicators (list of words/phrases that drove the sentiment)
4. Impact assessment (potential market impact: High, Medium, Low)
5. Affected sectors or asset classes
6. Confidence level in the analysis (0-100%)

Article Title: ${article.title}
Article Content: ${article.content}
Publication Date: ${article.date}

Provide a structured JSON response.`;

  conversationHistory.push({
    role: "user",
    content: analysisPrompt,
  });

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system:
      "You are a professional financial analyst specializing in sentiment analysis of news articles. Always provide detailed, accurate analysis in structured JSON format.",
    messages: conversationHistory,
  });

  const assistantMessage = response.content[0].text;
  conversationHistory.push({
    role: "assistant",
    content: assistantMessage,
  });

  return assistantMessage;
}

async function generateMarketInsight() {
  const insightPrompt = `Based on the articles we've analyzed in this conversation, provide a comprehensive market insight that:
1. Summarizes overall market sentiment
2. Identifies key themes and trends
3. Highlights potential risks and opportunities
4. Suggests strategic considerations for investors
5. Provides a market outlook for the near term

Please provide this in a well-structured narrative format suitable for investment professionals.`;

  conversationHistory.push({
    role: "user",
    content: insightPrompt,
  });

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system:
      "You are a professional financial analyst specializing in sentiment analysis of news articles. Provide insightful, actionable analysis based on the conversation history.",
    messages: conversationHistory,
  });

  const assistantMessage = response.content[0].text;
  conversationHistory.push({
    role: "assistant",
    content: assistantMessage,
  });

  return assistantMessage;
}

async function compareArticleSentiments() {
  const comparisonPrompt = `Based on all the articles we've analyzed, compare and contrast their sentiment profiles. Identify:
1. Which articles are most bullish and which are most bearish
2. Correlations between different sectors mentioned
3. Any contradictory signals that might confuse investors
4. The overall market narrative emerging from these articles`;

  conversationHistory.push({
    role: "user",
    content: comparisonPrompt,
  });

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1200,
    system:
      "You are a professional financial analyst specializing in sentiment analysis of news articles. Provide comparative analysis of sentiments across multiple articles.",
    messages: conversationHistory,
  });

  const assistantMessage = response.content[0].text;
  conversationHistory.push({
    role: "assistant",
    content: assistantMessage,
  });

  return assistantMessage;
}

async function runInteractiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  console.log("\n=== Financial News Sentiment Analysis Bot ===");
  console.log(
    "This bot analyzes sentiment in financial news articles using Claude AI.\n"
  );

  while (true) {
    console.log("\nOptions:");
    console.log("1. Analyze a sample article");
    console.log("2. Generate market insight");
    console.log("3. Compare article sentiments");
    console.log("4. Ask custom question about analyzed articles");
    console.log("5. Exit");

    const choice = await question("\nSelect an option (1-5): ");

    if (choice === "1") {
      console.log("\nAvailable articles
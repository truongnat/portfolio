import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const JOURNAL_DIR = "src/content/journal";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

async function generateWeeklySummary() {
  const files = fs.readdirSync(JOURNAL_DIR);
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const dailyLogs = files
    .filter(f => f.endsWith(".md"))
    .map(f => {
      const content = fs.readFileSync(path.join(JOURNAL_DIR, f), "utf-8");
      const { data, content: body } = matter(content);
      return { data, body, filename: f };
    })
    .filter(log => log.data.type === "day" && new Date(log.data.date) >= lastWeek);

  if (dailyLogs.length === 0) {
    console.log("No daily logs found for this week.");
    return;
  }

  const logsText = dailyLogs.map(l => `Date: ${l.data.date}\nTitle: ${l.data.title}\nContent: ${l.body}`).join("\n\n---\n\n");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    You are an expert technical writer and AI Engineer.
    Based on the following daily logs from the past week, write a comprehensive "Weekly Summary" blog post.
    The tone should be professional, insightful, and technical.
    Include sections like: "Key Highlights", "Challenges Overcome", and "Focus for Next Week".
    Return the output in Markdown format with frontmatter.
    
    Frontmatter schema:
    title: string
    date: YYYY-MM-DD (today's date)
    type: "week"
    summary: string (brief overview)
    tags: string[]
    
    Daily Logs:
    ${logsText}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const fileName = `${now.toISOString().split('T')[0]}-weekly-summary.md`;
  fs.writeFileSync(path.join(JOURNAL_DIR, fileName), text);
  console.log(`Generated weekly summary: ${fileName}`);
}

generateWeeklySummary().catch(console.error);

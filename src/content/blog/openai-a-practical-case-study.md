---
title: "The Data Analyst Bot: A Case Study with OpenAI Assistants API"
date: "2023-11-12"
description: "How we replaced a dashboard with a conversation. Building a bot that can query databases, run Python code, and generate charts on the fly."
slug: "openai-a-practical-case-study"
published: true
tags: ["AI/ML", "OpenAI"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
---

# The Data Analyst Bot: A Case Study with OpenAI Assistants API

Dashboards are static. Questions are dynamic. This case study explores how we used the OpenAI **Assistants API** with **Code Interpreter** to build a tool that allows executives to "talk to their data."

## The Challenge: "Death by Dashboard"

Our executives needed answers like: *"Show me the correlation between marketing spend and churn rate for Q3."*
*   **Old Way:** Request a ticket -> Data Team writes SQL -> Export CSV -> Make Chart (3 Days).
*   **New Way:** Ask the bot (30 Seconds).

## The Solution: Assistants API + Code Interpreter

We didn't need to teach the LLM math. We just needed to give it a Python sandbox.

### 1. File Upload
We upload the sanitized CSV dataset to the Assistant's file storage.

### 2. Code Execution
When a user asks a question, the Assistant writes and executes Pandas code to analyze the data.

### 3. Chart Generation
The Assistant uses `matplotlib` to generate a `.png` file, which is then returned to the user in the chat UI.

## Implementation (Node.js)

```javascript
const assistant = await openai.beta.assistants.create({
  name: "Data Analyst",
  instructions: "You are a data expert. Write Python code to visualize data.",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4-turbo",
});

// Create a thread with the user's file
const thread = await openai.beta.threads.create({
  messages: [
    {
      role: "user",
      content: "Graph the monthly revenue trend.",
      file_ids: [file.id]
    }
  ]
});
```

## Results

| Metric | SQL Dashboard | Analyst Bot |
| :--- | :--- | :--- |
| **Time to Insight** | Days | Seconds |
| **Flexibility** | Rigid | Infinite |
| **Cost** | High (Staff time) | Low (API cost) |

## Conclusion

The Code Interpreter tool is a game changer. It turns the LLM from a "Guesser" into a "Calculator," making it reliable enough for business intelligence.
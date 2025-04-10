from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os


# Load .env file
load_dotenv()

# Set up OpenAI client (new SDK v1+)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI app setup
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to receive POST data
class TopicRequest(BaseModel):
    topic: str

# Endpoint to generate quiz
@app.post("/generate")
async def generate_quiz(data: TopicRequest):
    prompt = f"""
You are a smart tutor generating a quiz based on the following input. The input may be a single topic (e.g., "Photosynthesis") or detailed study content (e.g., full textbook excerpts). Your task is to generate a quiz that tests deep understanding, critical thinking, and long-term retention.

- If only a **topic** is provided, generate questions that reflect how students are typically tested in academic courses (high school or college-level) or language learning contexts.
- If **detailed content** is provided, generate questions directly from the material. Break the content into logical subdomains (e.g., for “Nervous System”: structure, function, disorders, processes, etc.).

You must generate as many questions as needed to fully test the material:
- Common academic topics (e.g., DNA replication, nervous system, photosynthesis): **generate at least 15**, ideally **20–25** questions.
- Only reduce the number if the topic is truly simple or narrow in scope.

---

INPUT:
\"\"\"{data.topic}\"\"\"

---

OUTPUT FORMAT:

<One-paragraph summary of the topic or content. The length and depth should match the complexity.>

1. <Question text>  
a) <Option A>  

b) <Option B>  

c) <Option C>  

d) <Option D>  

2. <Question text>  
a) <Option A>  

b) <Option B>  

c) <Option C>  

d) <Option D>  

3. <fill-in-the-blank question text> (example question: "The powerhouse of the cell is the __________.")
<Answer choices not needed, but include the correct answer in the answer key.>

4. <true/false question text>
a) True
b) False

... (continue as needed)

---

Answer Key:  
1. A  
2. D  
3. <correct answer for fill-in-the-blank>  example: mitochondria
4. A
...

---

RULES:
- Every question must be numbered.
- Each answer choice must be on its own line, with a **blank line between choices**.
- **Do not place the answer right after the question.**
- Include all answers **only once**, at the end under the heading: `Answer Key:`
- Keep numbering consistent even if question types change.
- If a question is True/False, format choices like:  
  a) True  
  b) False
- If a question is Fill-in-the-Blank, do **not** include choices — but do include the correct answer in the answer key using the same number.
- Even for True/False and Fill-in-the-Blank, you MUST preserve numbering and ensure consistent structure.
- The Answer Key must include ALL answers with correct numbering (e.g., 1. A, 2. B, 3. True, 4. mitochondria, etc.).


"""





    response = client.chat.completions.create(
        model="gpt-4", 
        messages=[{"role": "user", "content": prompt}]
    )

    return {"output": response.choices[0].message.content}

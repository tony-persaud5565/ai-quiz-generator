
# AI Quiz Maker

AI Quiz Maker is a full-stack web application that generates quizzes based on any topic or block of text. It's designed to help students, educators, and self-learners test their understanding of complex material with automatically generated questions and a clean, responsive interface.

## Features

- Automatically generates multiple choice, true/false, and fill-in-the-blank questions  
- Accepts single-topic prompts or full paragraphs of study material  
- Dynamically adjusts the number of questions based on topic complexity  
- Summary of each topic is generated before the quiz  
- Clean UI with collapsible answer key for easy self-testing  
- Recent topics sidebar for quick access to past quizzes

## Tech Stack

- **Frontend**: React, Chakra UI  
- **Backend**: FastAPI (Python)  
- **AI Integration**: OpenAI API  
- **State Management**: React Hooks  
- **HTTP Client**: Axios

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/quizmaker-ai.git
cd quizmaker-ai
```

### Backend Setup

```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will be available at `http://localhost:3000`  
Backend will run on `http://localhost:8000`

## Example Use Case

Input a topic like:

```
Photosynthesis
```

The app will generate a summary followed by 15–25 questions covering key processes, terms, and reasoning related to the topic.

## Future Improvements

- Support for PDF/textbook uploads  
- Scoring and performance tracking  
- Quiz export as printable PDF  
- Authentication and user profiles

## License

This project is licensed under the MIT License.


# Cybersecurity Simulator 
An AI-powered tool that generates vulnerabilities and attacks based on the user's demand. Also, it evaluates if the use correctly identifies and fixes vulnerabiliteis. This AI-powered app is supposed to solve the problem of training people for cybersecurity jobs. 
Built for AI Builders Hackathon

## How it works 
The application bridges a **React (.tsx)** frontend with a **FastAPI** backend, leveraging the **Gemini API** for dynamic cybersecurity scenario generation, evaluation, and quiz creation:
1. **Request/Generation:** The user selects a mode via the UI. FastAPI calls the Gemini API to generate scenarios, attacks, or quiz questions based on the parameters.
2. **User Interaction:** The user analyzes the problem, inputs an answer (text-based solution or multi-choice selection), and submits it.
3. **AI Evaluation & Feedback:** The backend processes the input, uses Gemini to grade or verify correctness, and returns detailed feedback, scores, or explanations.
## Building stages 
1. Take the API key from Gemini and configure the .env connection to main.py
2. Creating entry points that take text and generate an output 
3. The 3 modes generating challenge(getting a random attack and having to guess the type and provide a solution, specifying what attack you want to receive and provide a solution, quiz challenge)
4. Add evaluation endpoints
5. Build the frontend using React to call the 2 endpoints(generate and evaluation)

## Technologies 
Backend: Python, FastAPI, Gemini API  


Frontend: React  


Tooling: Visual Studio Code

## Setup and installation 
To run and test this project locally, folloow the following steps 
### Prerequisites 
* Python 3.x installed
* Node.js and npm installed
* A Gemini API key from Google AI Studio

### 1. Clone the repository

git clone [https://github.com/SacaliuTania/Cybersecurity_Simulator.git](https://github.com/SacaliuTania/Cybersecurity_Simulator.git)
cd Cybersecurity_Simulator

### 2. Setup Backend(Fast API) 
Navigate to your backend folder: pip install -r requirements.txt  
Create a .env file and add your API key: GEMINI_API_KEY=your_api_key_here  


Run the FastAPI server: uvicorn main:app --reload

### 3. Setup Frontend
Open a new terminal window:
Navigate to your frontend folder(cd frontend)
Install dependencies: npm install
Run the React app: npm run dev

# Open your browser at the indicated port to test the application


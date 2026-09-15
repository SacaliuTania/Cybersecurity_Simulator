# Cybersecurity Simulator 
An AI-powered tool that generates vulnerabilities and attacks based on the user's demand. Also, it evaluates if the use correctly identifies and fixes vulnerabiliteis. This AI-powered app is supposed to solve the problem of training people for cybersecurity jobs. 
Built for AI Builders Hackathon

## How it works 

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


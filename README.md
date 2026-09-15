# Cybersecurity Simulator 
An AI-powered tool that generates vulnerabilities and attacks based on the user's demand. Also, it evaluates if the use correctly identifies and fixes vulnerabiliteis. This AI-powered app is supposed to solve the problem of training people for cybersecurity jobs. 
Built for AI Builders Hackathon
## Application Flow 

### 1. Welcome Page 
When opening the application, the Welcome page in Figure 1.1 presents the three types of challenges the user can select from: random challenge, known attack challenge and test your knowledge with descriptions. 

<img width="940" height="567" alt="image" src="https://github.com/user-attachments/assets/fc5b9155-bbfa-4c8b-a213-3f4def150e7c" />  

**Figure 1.1:** Welcome page 

### 2. Choosing the Challenge 
The user chooses what challenge wants to try. 

#### 1. Random challenge
After clicking the random challenge button the user is redirected to the Random Challenge page presented in Figure 2.1.

<img width="940" height="562" alt="image" src="https://github.com/user-attachments/assets/28e282f0-7c1a-486c-9ae5-674b3c32fded" />  

**Figure 2.1:** Random Challenge page 

After the user sends the request to generate a description after clicking the button "Generate description" a random challenge is provided and the user needs to correctly identify the attack and propose a solution that can fix the problem as presented in Figure 2.2. 

<img width="940" height="564" alt="image" src="https://github.com/user-attachments/assets/95b5e193-b7c7-4b63-b290-d600f51e33de" />  

**Figure 2.2** 

After the user decides the answer provided is good enough, there is the option of submitting the answer and receiving a feedback as in Figure 2.3. The answers are evaluated by the AI that powers this app. 

<img width="940" height="572" alt="image" src="https://github.com/user-attachments/assets/da236d81-3ac0-4e9d-bdeb-979d6d4554f3" />  

**Figure 2.3:** Submission and feedback

#### 2. Known attack challenge
The user has the chance to try and provide a solution to a challenge that is no longer random. At the Known attack challenge, the user can choose the kind of incident they want to handle as presented in the Figure 2.4. 

<img width="940" height="554" alt="image" src="https://github.com/user-attachments/assets/6a6d681f-b295-4406-8113-479c39a692ec" />

**Figure 2.4:** Known attack challenge

Based on the preference, the user selects an attack, gets a description of the selected attack and has to provide a solution as shown in Figure 2.5. 

<img width="940" height="562" alt="image" src="https://github.com/user-attachments/assets/1e85f958-242a-45d8-8aa8-32d5b00ffc74" />  

**Figure 2.5:** Attack selection  

After the description is provided, the user must find a solution. When the answer is good enough, the user can submit the solution and get a feedback from the AI powering the app like in Figure 2.6. 

<img width="940" height="559" alt="image" src="https://github.com/user-attachments/assets/dae932e8-03ac-4fda-a91c-66c8c45f2178" />  

**Figure 2.6:** Known attack solution feedback

#### 3. Test your knowledge challenge
This kind of challenge is meant to help future cybersecurity engineers test their theoretical knowledge about cyber attacks. For this challenge there aare three difficulties: easy, medium and hard. The user can choose which difficulty to try from the interface presented in Figure 2.7.

<img width="940" height="561" alt="image" src="https://github.com/user-attachments/assets/56fb2dbb-9332-495e-8fd0-9d1c5f0bced8" />

**Figure 2.7:** Test your knowledge challenge

After the difficulty is chosen, the AI powering the app will generate 10 multiple choice questions of the selected difficulty as in Figure 2.8. There is only one right answer.  

<img width="940" height="571" alt="image" src="https://github.com/user-attachments/assets/83b7d71a-d8e1-43fe-bf94-dbd05b1c4aae" />  

**Figure 2.8:** Generated quiz  

After all the questions are answered, the answers can be submitted and feedback will be given as presented in Figure 2.9. If the user needs, they can click the button "Show explanation" and an explanation will be provided, describing why the answer is incorrect, what is correct and why.   

<img width="940" height="556" alt="image" src="https://github.com/user-attachments/assets/f2260337-d982-415a-ba64-a1ac1213b7e5" />  

**Figure 2.9:** Feedback and explanation of the wrong answers

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


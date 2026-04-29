# AI Resume Analyzer (MERN + Cohere AI)
An AI-powered Resume Screening Web Application that analyzes resumes against job descriptions and provides a score with feedback.
## Features
- Upload Resume (PDF only)
- AI-powered resume analysis using Cohere API
- Score generation based on job description
- Smart feedback suggestions
- Google Authentication (Firebase)
- Resume history tracking
- Admin panel to view all resumes

## Tech Stack
### Frontend
- React.js
- Axios
- Firebase Auth
### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Multer (file upload)
- PDF Parser (`pdf2json`)
- Cohere AI API
- 
## Project Structure
```
AI_Resume_Analyzer/
│
├── backend/
│   ├── Controllers/
│   ├── Modules/
│   ├── Routes/
│   ├── uploads/
│   ├── index.js
│   ├── conn.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
```
## How AI Works
1. Upload resume PDF  
2. Extract text using PDF parser  
3. Send text + job description to Cohere AI  
4. AI returns:
   - Score (%)
   - Feedback points  

## Example Output
```
Score: 82%
Feedback:
- Improve technical skills section
- Add more project details
- Tailor resume to job description
```
## Important Notes
- MongoDB is connected using Mongoose :contentReference[oaicite:1]{index=1}  
- Backend serves frontend build using Express :contentReference[oaicite:2]{index=2}  
- Make sure `.env` file is NOT pushed to GitHub  

## Deployment
- Backend: AWS EC2 / Ubuntu Server  
- Database: MongoDB Atlas  
- Frontend: Build and serve via backend  

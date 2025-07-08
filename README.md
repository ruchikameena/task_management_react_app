# 🚀 Task Manager App

A Kanban Task Management web application built using **React (Create React App)** and **Firebase**. It allows admins to assign tasks, users to submit them via links, and handles task tracking and status updates.

## ✨ Features

- 🔐 Firebase Authentication (Email/Password) with email verification and forgot password
- ✅ Task submission via links (Google Drive, GitHub, etc. as they take less storage in our database)
- 📅 Task deadlines with submission date comparison
- 🔁 Admin can reject and reassign tasks to same person or another person
- 🔎 Filter & sort submissions by date or submission-rate
- 📦 Responsive UI for all type of devices
- 🔥 Hosted on [Vercel](http://task-management-react-app-omega.vercel.app/), use this link to access the application.

## 🔧 Tech Stack

- **React (CRA)**
- **Firebase**
  - Authentication - for personalized access to the Kanban board
  - Firestore - Used as database to store the application data
- **Vercel** for deployment of the application
- **Lottie** and **Canva** for animations used in the application
- **https://getemoji.com/** for adding emojis to make the UI more attractive

## Project Overview

This project comprise of four routes :-

- **Profile** 👤 - Here users can see - Username and Email, with an Daily Login Tracker and Logout button to leave the application.

- **Tasks** 📋 - Here users can see their assigned tasks with discription and can submit their work.

- **Board** 🔲 - Kanban Board, where tasks are assigned according to the task status, with feature where they can change the assigned person and can change the due date, new tasks are also created from here with an edit option.

Here Tasks are arranged in four stages where :-

- To-Do 📝 - Here those tasks are arranged in which either due date or person is not assigned or both not set.
- On-going 📋 - Here those tasks are arranged in which both due date and assigned person are set.
- Completed ✅ - If the user submit the task.
- Pending ⚠️ - if the due date is passed and user didn't submit the work, else it would be arranged in completed if the task is submitted even when due date is passed.

- **Work** 📑 - Here users can see the submitted work and can reject and re-assign the task with new due date, even with the message indicating what changes to be done.

# To use the application create a .env file in the root directory :-
 
Create these variable in that file :-

REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

🔍 To view the application - http://task-management-react-app-omega.vercel.app/
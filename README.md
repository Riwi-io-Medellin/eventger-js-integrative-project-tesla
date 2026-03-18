#  Eventger JS

![bannerImage](/Banner.jpeg)

<p align="center">
<img src="https://cdn.simpleicons.org/html5/E34F26" height="40" alt="HTML"/> <img src="https://cdn.simpleicons.org/css/1572B6" height="40" alt="CSS"/> <img src="https://cdn.simpleicons.org/javascript/F7DF1E" height="40" alt="JavaScript"/> <img src="https://cdn.simpleicons.org/nodedotjs/339933" height="40" alt="Node.js"/> <img src="https://cdn.simpleicons.org/express/000000" height="40" alt="Express"/> <img src="https://cdn.simpleicons.org/postgresql/4169E1" height="40" alt="PostgreSQL"/>
</p>

> Real-time handling of physical events with AI assistance

## 🔗 Live Demo

See our live demo clicking [here](https://eventger-js-integrative-project-tesla.onrender.com/)

## 📌 Description

Social network for managing primarily corporate events, where all app users can view company events and receive notifications both within the app and through other digital communication channels. Ideal for companies that manage non-digital, synchronous events.

This aplication resolves problems about event management, visualization and mostly communication.

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | ---: |
| HTML, CSS & JS | Front-End Development |
| NodeJS & Express | Backend Development |
| Argon2 | Protection of passwords |
| JWT | Protect communication between client-server |
| OpenAI | Handling event creation as a fastest way |
| Nodemailer | Email notifications to members |
| Twilio | Whatsapp notifications to members & event creation quick access |
| Node-cron | Scheduled reviews |
| Postgres | Database Development |

## 📁 Project Structure

### Frontend
```text
frontend/                 # Frontend client folder (Vanilla JS SPA)
├── dist/                 # Compiled assets (Production-ready CSS)
├── node_modules/         # Installed npm packages (Tailwind, PostCSS)
├── public/               # Static assets
│   ├── icons/            # App favicons and small icons
│   └── images/           # Brand logos, banners, and user avatars
├── src/                  # All frontend source code
│   ├── components/       # Reusable UI pieces (Navbar, Sidebar, Modals)
│   ├── pages/            # View components (Home, Dashboard, Login, etc.)
│   ├── services/         # API client logic (Fetch requests to backend)
│   ├── store/            # Global state management (Auth status, user info)
│   ├── styles/           # Tailwind source CSS and PostCSS inputs
│   ├── utils/            # Helper functions (Session, Toasts, Formatters)
│   ├── main.js           # Main entry point that initializes the app
│   └── router.js         # Client-side routing logic (SPA Handler)
├── .gitignore            # Files to ignore in git (node_modules, .env)
├── API.md                # Frontend-specific API integration notes
├── index.html            # Single entry point for the entire application
├── package-lock.json     # Lock file for npm dependencies
├── package.json          # Project metadata and build scripts
├── postcss.config.js     # PostCSS configuration for Tailwind
└── tailwind.config.js    # Tailwind CSS custom themes and plugins
 ``` 

### Backend
```text
backend/                  # Backend server folder
├── node_modules/         # Installed npm packages 
├── src/                  # All sources of the code
│   ├── controllers/      # Handler of incoming requests
│   ├── db/               # Database models and connection
│   ├── infrastructure/   # Setup and config files for backend (twilio, openai)
│   ├── middlewares/      # Middleware functions for express(Validation and error handle)
│   ├── repositories/     # Data saved on database
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic and services
│   └── utils/            # Util function (hash, nodemailer, validate)
├── prompts.js            # AI prompts
├── .env                  # Environment variables (not committed)
├── .gitignore            # Files to ignore in git
├── API.md                # API documentation
├── app.js                # Main app file that starts the server
├── package-lock.json     # Lock file for npm dependencies
└── package.json          # Project info and npm scripts
 ``` 
## 🚀 Setup
1. **Clone the repository**
```bash
git clone https://github.com/Riwi-io-Medellin/eventger-js-integrative-project-tesla.git
cd <project-folder>
```

2. **Install Dependencies** 
```bash
npm build
```
It will install all the required dependencies of the frontend and backend for the application running.

3. **Set up enviroment variables**

- Go to the `backend` folder.
- Create a `.env` file inside the `backend` folder defining the next vars:
```bash
# PORT
PORT=

# Postgres DB Settings
DB_SQL_HOST= 
DB_SQL_USER=
DB_SQL_PASSWORD=
DB_SQL_NAME= # DB Name

# JWT
JWT_SECRET= # Choose a secret word for each token
JWT_EXPIRES= # Choose an expiration time for the JWT Tokens

# NODEMAILER
EMAIL_USER= # Email for send notifications

# API KEYS
## Twilio Config
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
TWILIO_SENDGRID_KEY=

## OPENAI
API_OPENAI_KEY=
API_OPENAI_MODEL=
```

4. **Run server**
```bash
npm start
```
Server usually runs at: http://localhost:3000 or your configured PORT on .env


## 🧑‍💻 Team

- Sara as Scrum Master [LinkedIn](http://www.linkedin.com/in/sara-calderon-anacona-681637175)
- Jose Henao as Product Owner [LinkedIn](https://www.linkedin.com/in/jose-david-henao-camacho-b7597119b/)
- John Cadavid as Developer [LinkedIn](https://www.linkedin.com/in/jhon-cadavid-376220360)
- Jeronimo Gallego as Developer [LinkedIn](https://www.linkedin.com/in/jero-gallego-10a5b61b9/)

⭐️ If you like it, please give us a Star! ⭐️

## 📚 Learnings

Inside the development of this app, we learned concepts that before of this we don't knowed. 

- We learn that in a database system, the most important thing it's protect the data and handle with the minor requests as possible.
- We understand the concept of hash and token in the web development, and the role it plays in the security.
- Learned about architecture and development of scalable systems.
- Learned about HTTP process, handling requests and responses developing and RESTful API.
- Learned about connecting external APIs as OpenAI and WhatsApp.
- Understood about nodemailer and how to send emails from an app.
- And the most important: we understand the value of the teamwork and how, if it's well managed, can be helpful for create big systems.

## 📄 License
> RIWI S. A. S.

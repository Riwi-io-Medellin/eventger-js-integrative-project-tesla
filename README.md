#  Eventger JS

![bannerImage](/Banner.jpeg)

<p align="center">
<img src="https://cdn.simpleicons.org/html5/E34F26" height="40" alt="HTML"/> <img src="https://cdn.simpleicons.org/css/1572B6" height="40" alt="CSS"/> <img src="https://cdn.simpleicons.org/javascript/F7DF1E" height="40" alt="JavaScript"/> <img src="https://cdn.simpleicons.org/nodedotjs/339933" height="40" alt="Node.js"/> <img src="https://cdn.simpleicons.org/express/000000" height="40" alt="Express"/> <img src="https://cdn.simpleicons.org/postgresql/4169E1" height="40" alt="PostgreSQL"/>
</p>

> Real-time handling of physical events with AI assistance

## 🔗 Live Demo

See our live demo clicking [here](url)

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

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```
4. **Set up enviroment variables**

- Go to the `backend` folder.
- Create a `.env` file (you can use `.env.example` as a template):

5. **Run backend server**
```bash
cd ../backend
npm run dev
```
Backend usually runs at: http://localhost:3000 or your configured PORT on .env

6. **Run frontend**

Use live server extension to open frontend/index.html


## 🧑‍💻 Team

- Sara as Scrum Master [LinkedIn](url)
- Jose Henao as Product Owner [LinkedIn](url)
- John Cadavid as Developer [LinkedIn](url)
- Jeronimo Gallego as Developer [LinkedIn](url)

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

# CodeAstra - AI-Powered Online Judge 🚀

[![Next.js](https://img.shields.io/badge/Next.js-14.x-black?logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.x-darkgreen?logo=django)](https://www.djangoproject.com/)
[![Docker](https://img.shields.io/badge/Docker-blue?logo=docker)](https://www.docker.com/)

An intelligent, scalable, AI-powered online coding platform designed for competitive programming, learning, and skill assessment.

---

🌐 **Live Project:** <https://www.codeastra.me>
<br>
🎥 **Demo Video:** <https://www.loom.com/share/53baea46a13e4fb681098339d70afc4b>

## 📖 Table of Contents
- [Project Description](#-project-description)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🤝 How to Contribute](#-how-to-contribute)
- [🙏 Acknowledgements](#-acknowledgements)
- [📄 License](#-license)

---

## 📝 Project Description

CodeAstra is a modern online judge platform built to provide a seamless and feature-rich experience for programmers. It allows users to write, submit, and test their code against predefined test cases. The platform is enhanced with AI capabilities to provide intelligent feedback, code reviews, and hints, making it a powerful tool for both beginners and experienced coders. The entire application is containerized with Docker and deployed on AWS for scalability and reliability.

---

## ✨ Key Features

*   **💻 Code Execution:** Run and submit code in multiple languages.
*   **🤖 AI-Powered Assistance:**
    *   Get instant **code reviews** and suggestions for improvement.
    *   Receive **hints** when you're stuck on a problem.
    *   Automatically **fix bugs** in your code.
    *   Generate **boilerplate code** to get started quickly.
*   **📊 Submission History:** Track and review all your past submissions in one place.
*   **🎨 Enhanced Frontend:** A sleek, responsive, and user-friendly interface built with Next.js and Shadcn/ui for an optimal user experience.
*   **🔐 Admin Panel:** A powerful built-in Django admin panel to manage problems, test cases, and users with ease.
*   **🐳 Dockerized:** Fully containerized backend and frontend for consistent development, testing, and deployment environments.
*   **☁️ Cloud Hosted:** Deployed on AWS EC2 for high availability and scalability.

### 🌟 Coming Soon in V2
*   **Contest Module:** Participate in time-bound coding contests.
*   **Real-time Leaderboard:** See your rank update live during contests with WebSockets.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** [Next.js](https://nextjs.org/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
*   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

### Backend
*   **Framework:** [Django](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (Recommended) / SQLite3

### DevOps
*   **Containerization:** [Docker](https://www.docker.com/)
*   **Hosting:** [AWS EC2](https://aws.amazon.com/ec2/)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [Python](https://www.python.org/downloads/) (v3.10 or higher)
*   [Docker](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/codeastra.git
    cd codeastra
    ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install dependencies
    pip install -r requirements.txt

    # Create a .env file from the example
    cp .env.example .env
    # (Update the .env file with your database and secret keys)

    # Run database migrations
    python manage.py migrate

    # Start the Django development server
    python manage.py runserver
    ```
    The backend will be running at `http://127.0.0.1:8000`.

3.  **Frontend Setup:**
    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install

    # Create a .env.local file from the example
    cp .env.example .env.local
    # (Update VITE_API_URL to point to your backend: http://127.0.0.1:8000)

    # Start the Next.js development server
    npm run dev
    ```
    The frontend will be running at `http://localhost:3000`.

### Alternative: Using Docker

For a more streamlined setup, you can use Docker to run the entire application.

1.  **Ensure Docker is running.**

2.  **From the root of the project directory, build and run the containers:**
    ```bash
    # build the image of project.
    docker build -t <image_name> .
    # run container
    docker run -d -p8000:8000 <image_name or images_id>
    ```
    This command will build the images for both the frontend and backend services and start them. The frontend will be accessible at `http://localhost:3000` and the backend at `http://localhost:8000`.

---

## 🤝 How to Contribute

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Don't forget to give the project a star! Thanks again!


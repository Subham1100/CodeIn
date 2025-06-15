# CodeIn v1.0

CodeIn is a real-time collaborative platform where developers, instructors, and teams can sketch ideas on a whiteboard, write and run code live, and collaborate effectively. Ideal for technical interviews, pair programming, and team discussions.

---

# Live Demo

# Frontend: https://whiteboard-liart-phi.vercel.app/

# Backend: Hosted on AWS EC2 (use environment variables to connect from frontend)

# Documentation : https://whiteboard-liart-phi.vercel.app/docs

# Working Video Tutorial : https://vimeo.com/1093543484?share=copy

---

## Tech Stack

- **Frontend**: React.js (Vite), TailwindCSS, CodeMirror
- **Backend**: Node.js, WebSockets (Socket.IO)
- **Whiteboard**: TLDraw (open source)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), AWS EC2 (backend)
- **Containerization**: Docker

---

## Features

- Real-time code editing and whiteboard sharing via WebSockets
- Private room creation with permission control
- Built-in code runner with multi-language support
- Code judge system with input/output validation and test case checking
- JWT-based user authentication system
- Dockerized backend for isolated and scalable deployment
- CI/CD pipeline using GitHub Actions
- TLDraw integration for drawing diagrams and pseudocode
- Export whiteboard as high-quality PNG or SVG

---

## Folder Structure

├── public/
│ └── images/ Static assets (images, banners)
│
├── src/ Frontend source code
│ ├── components/ Reusable UI components
│ ├── hooks/ Custom React hooks
│ ├── context/ React context (Auth, Socket)
│ ├── pages/ App pages and routes
│ └── utils/ Helper functions and utilities
│
├── server/ Backend (Node.js + WebSocket)
│ ├── config/ Environment config and constants
│ ├── controllers/ Request handlers
│ ├── models/ Mongoose/DB models
│ ├── routes/ Express API routes
│ ├── services/ Business logic
│ └── Dockerfile Container setup
│
├── problemQuestions/ Set of coding problems with metadata

---

## Real-time Collaboration

Rooms are created using WebSocket events such as:

- `createRoom`
- `joinRoom`
- `codeUpdate`
- `whiteboardUpdate`

Changes in code and whiteboard content are synced live across connected clients.

---

## Deployment Overview

| Component | Platform       | Details                     |
| --------- | -------------- | --------------------------- |
| Frontend  | Vercel         | Auto-deployment from GitHub |
| Backend   | AWS EC2        | Dockerized Node.js server   |
| CI/CD     | GitHub Actions | Build and deploy pipelines  |

---

## Docker Instructions (Backend)

```bash
# Build the Docker image
docker build -t codein-backend .

# Run the container
docker run -p 5000:5000 codein-backend


# License
MIT License
© 2025 CodeIn Team

# Contribution
We welcome contributions. To report bugs or request features, open an issue on GitHub. For major changes, please open a discussion first.

```

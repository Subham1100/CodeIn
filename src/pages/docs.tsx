import React from "react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-10 py-16 font-sans">
      <p className="text-6xl flex  justify-center mb-7 font-bold">
        Documentation
      </p>
      <div className="max-w-5xl mx-auto space-y-12">
        <section>
          <h1 className="text-4xl font-bold">
            CodeIn <span className="">v1.0</span>
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            <span className="text-white font-semibold">CodeIn</span> is a
            real-time collaborative platform where developers, instructors, and
            teams can sketch ideas on a whiteboard, write and run code live, and
            collaborate.
          </p>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-2xl font-semibold ">Tech Stack</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-200">
            <li>Frontend: React.js (Vite), TailwindCSS, CodeMirror</li>
            <li>Backend: Node.js, WebSockets (socket.io)</li>
            <li>Whiteboard: Tldraw (open source)</li>
            <li>CI/CD: GitHub Actions</li>
            <li>Deployment: Vercel (frontend), AWS EC2 (backend)</li>
            <li>Containerization: Docker</li>
          </ul>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold ">Technical Features</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-200 text-base leading-relaxed">
            <li>
              {" "}
              Real-time code editing and whiteboard sharing using WebSockets
            </li>
            <li>Private room creation with permission control</li>
            <li> Built-in code runner with multi-language support</li>
            <li>Code judge system with input/output & test case validation</li>
            <li>JWT-based user authentication system</li>
            <li>Dockerized backend for isolated and scalable deployment</li>
            <li>
              CI/CD with GitHub Actions and deployment on AWS EC2 (backend) &
              Vercel (frontend)
            </li>
            <li>
              Integrated TLDraw for diagram drawing and pseudocode visualization
            </li>
            <li> Export whiteboard as high-quality PNG/SVG</li>
          </ul>
        </section>

        {/* Folder Structure */}
        <section>
          <h2 className="text-2xl font-semibold  mb-2">Folder Structure</h2>
          <pre className="bg-gray-800 text-gray-300 p-4 rounded-xl overflow-x-auto text-sm leading-6">
            {`
/public/images            → Static assets like images

/src                     → Frontend source code
  /components             → Reusable UI components
  /hooks                  → Custom React hooks
  /context                → React context (e.g. Auth, Socket)
  /pages                  → App pages and routes
  /utils                  → Helper functions and utilities

/server                  → Backend (Node.js + WebSocket)
  /config                 → Environment config and constants
  /controllers            → Request handlers
  /models                 → Mongoose/DB models
  /routes                 → Express API routes
  /services               → Business logic
  Dockerfile              → Container setup for deployment

/problemQuestions        → Set of coding problems with metadata
`}
          </pre>
        </section>

        {/* How Real-Time Works */}
        <section>
          <h2 className="text-2xl font-semibold ">Real-time Collaboration</h2>
          <p className="mt-2 text-gray-300">
            Rooms are created using WebSocket events (<code>createRoom</code>,{" "}
            <code>joinRoom</code>), and code + drawing changes are synced in
            real-time between users using socket channels.
          </p>
        </section>

        {/* Deployment */}
        <section>
          <h2 className="text-2xl font-semibold ">Deployment</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-200">
            <li>
              <strong>Frontend</strong>: Deployed on Vercel
            </li>
            <li>
              <strong>Backend</strong>: Hosted on AWS EC2 (Ubuntu)
            </li>
            <li>
              <strong>CI/CD</strong>: GitHub Actions (build & deploy)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Docs;

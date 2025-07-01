const About = () => {
  return (
    <div className="w-full px-6 py-16 md:px-20 bg-[#b6842827] text-[#1e1e1e] rounded-2xl">
      <h1 className="text-4xl md:text-6xl font-bold text-center text-[#783612] mb-12">
        About
      </h1>

      <div className="bg-[#e2cbb0] p-6 md:p-10 rounded-2xl shadow-md text-lg md:text-xl tracking-wide leading-relaxed mb-12">
        <p className="mb-2">
          CodeIn is a collaborative platform built for coders, educators, and
          teams who love to think visually and work together in real time.
        </p>
        <p className="mb-2">
          Whether you're solving algorithm problems, conducting mock interviews,
          or teaching code.CodeIn provides a seamless environment that combines
          a powerful code editor with an intuitive whiteboard.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#783612] mb-4">
          What You Can Do With CodeIn:
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
          <li>
            <span className="font-medium">Sketch ideas</span> live with our
            real-time whiteboard
          </li>
          <li>
            <span className="font-medium">Write and run code</span> in an
            integrated code editor
          </li>
          <li>
            <span className="font-medium">Collaborate</span> with teammates or
            friends
          </li>
          <li>
            <span className="font-medium">Share sessions</span> without worrying
            about setup
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#783612] mb-4">
          Built For:
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
          <li>
            <span className="font-medium">Developers</span> prepping for
            interviews
          </li>
          <li>
            <span className="font-medium">Instructors</span> conducting live
            sessions
          </li>
          <li>
            <span className="font-medium">Friends</span> building projects
            together
          </li>
          <li>
            <span className="font-medium">Startups</span> running brainstorming
            sessions
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;

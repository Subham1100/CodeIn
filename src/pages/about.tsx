const About = () => {
  return (
    <div>
      <p className="about-heading text-6xl p-4">About</p>
      <p className="w-3/4 tracking-wide  px-20 text-xl rounded-2xl mb">
        CodeIn is a collaborative platform built for coders, educators, and
        teams who love to think visually and work together in real time. Whether
        you're solving algorithm problems, conducting mock interviews, or
        teaching code. Codein provides a seamless environment that combines a
        powerful code editor with an intuitive whiteboard.
      </p>
      <br />

      <h1 className="text-3xl"> What You Can Do With CodeIn:</h1>
      <ul className="list-none space-y-2 text-base leading-relaxed px-20 py-4">
        <li className="text-xl">
          <span className="font-medium ">Sketch ideas</span> live with our
          real-time whiteboard
        </li>
        <li className="text-xl">
          <span className="font-medium">Write and run code</span> in an
          integrated code editor
        </li>
        <li className="text-xl">
          <span className="font-medium">Collaborate</span> with teammates or
          friends.
        </li>
        <li className="text-xl">
          <span className="font-medium">Share sessions </span> without worrying
          about setup
        </li>
      </ul>
      <h1 className="text-3xl">Built For:</h1>
      <ul className="list-none space-y-2 text-base leading-relaxed px-20 py-4">
        <li className="text-xl">
          <span className="font-medium">Developers</span> prepping for
          interviews
        </li>
        <li className="text-xl">
          <span className="font-medium">Instructors</span> conducting live
          sessions
        </li>
        <li className="text-xl">
          <span className="font-medium">Friends</span> building projects
          together
        </li>
        <li className="text-xl">
          <span className="font-medium">Startups</span> running brainstorming
          sessions
        </li>
      </ul>
    </div>
  );
};

export default About;

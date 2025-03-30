import Feature from "../components/feature";

const HomePage = () => {
  return (
    <div id="main-container" className="bg-[#FFF7E3]">
      <section
        id="hero"
        className="p-[75px] flex flex-col center items-center gap-[50px]  "
      >
        <h1 className="text-title font-bold font-sans  ">Whiteboard</h1>

        <img
          src="../../public/images/hero_image.avif"
          alt="Image"
          className="w-[800px] h-[450px] object-cover rounded-3xl "
        />
        <div
          id="hero_description"
          className="flex flex-col items-center justify-center gap-[20px] w-[800px]"
        >
          <p
            id="hero_description_title"
            className="text-2xl text-[#888888] font-bold font-Merriweather "
          >
            "Collaborate Seamlessly, Draw Ideas Together!"
          </p>
          <p
            id="hero_description_text"
            className="text-2xl text-[#888888] font-Merriweather italic text-center "
          >
            Whiteboard lets you and your team brainstorm, sketch, and create in
            real-time — anytime,anywhere.
          </p>
          <button
            id="hero_button_cta"
            className="bg-black p-2 rounded-xl shadow-black shadow-md"
          >
            <p className="text-button text-white font-sans">Get Started</p>
          </button>
        </div>
      </section>
      <section id="contact">
        <div id="social_links">
          <img
            src="../../public/images/twitter.png"
            alt="twitter"
            id="social_media_icons"
          />
          <img
            src="../../public/images/instagram.png"
            alt="instagram"
            id="social_media_icons"
          />
          <img
            src="../../public/images/linkedin.png"
            alt="linkedin"
            id="social_media_icons"
          />
          <img
            src="../../public/images/youtube.png"
            alt="youtube"
            id="social_media_icons"
          />
        </div>
      </section>
      <section id="features">
        <Feature
          title="AI-Powered Suggestions"
          description="Leverage AI to suggest shapes, diagrams, or text based on user sketches, enhancing brainstorming sessions."
          image_src="../../public/images/ai-suggestions.avif"
          flip={true}
        />
        <Feature
          title="Real-Time Collaboration"
          description="Collaborate with your team in real-time, enabling seamless brainstorming and idea sharing."
          image_src="../../public//images/collaboration.avif"
          flip={false}
        />
      </section>

      <section id="footer">
        <div id="footer_cta">
          <p id="footer_cta_title">Sign up today</p>
          <button id="footer_cta_button">Get started</button>
        </div>
        <div id="copyright_info">
          <div id="copyright_tag">© 2025 Whiteboard. All rights reserved. </div>
          <div id="footer_links">
            <button id="footer_links_button">Instagram</button>
            <button id="footer_links_button">Email</button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;

import Feature from "../components/feature";
import "./css/homepage.css";

const HomePage = () => {
  return (
    <div id="main-container" className="bg-[#FFF7E3] ">
      <section
        id="hero"
        className=" flex flex-col center items-center gap-[50px] animate-slide-in "
      >
        <h1 className="text-title font-bold font-sans">Whiteboard</h1>

        <img
          src="../../public/images/hero_image.jpg"
          alt="Image"
          className="w-[800px] h-[450px] object-cover rounded-3xl animate-flip-vertical"
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
      <section
        id="contact"
        className="flex justify-center px-[100px] py-[100px]"
      >
        <div id="social_links" className="flex gap-[50px] px-[100px] ">
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
      <section id="features" className="px-[100px] py-[50px] ">
        <Feature
          title="AI-Powered Suggestions"
          description="Leverage AI to suggest shapes, diagrams, or text based on user sketches, enhancing brainstorming sessions."
          image_src="../../public/images/ai-suggestions.avif"
          link=""
          flip={true}
        />
        <Feature
          title="Real-Time Collaborations"
          description="Collaborate with your team in real-time, enabling seamless brainstorming and idea sharing."
          image_src="../../public//images/collaboration.avif"
          flip={false}
          link=""
        />
      </section>

      <section id="footer" className="mt-[50px] flex flex-col gap-[50px]">
        <div
          id="footer_cta"
          className="h-[330px] flex flex-col items-center justify-center gap-[50px] px-[100px] "
        >
          <p id="footer_cta_title" className="text-5xl font-bold">
            Sign up today
          </p>
          <button
            id="footer_cta_button"
            className="bg-black text-white p-2 rounded-xl shadow-lg shadow-black"
          >
            Get started
          </button>
        </div>
        <div
          id="footer"
          className="bg-[#222222] h-[100px] flex justify-between gap-2.5 items-center p-[50px]"
        >
          <div id="copyright_tag" className="text-[#CCCACA] text-tiny ">
            © 2025 Whiteboard. All rights reserved.{" "}
          </div>
          <div id="footer_links" className="flex gap-2">
            <button
              id="footer_links_button"
              className="text-[#CCCACA] text-tiny"
            >
              Instagram
            </button>
            <button
              id="footer_links_button"
              className="text-[#CCCACA] text-tiny"
            >
              Email
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;

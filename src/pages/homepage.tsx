import { useNavigate } from "react-router-dom";
import "./css/homepage.css";
import { logEvent, LogLevel } from "../utils/logger";

import Feature from "../components/feature";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    try {
      logEvent("CTA_Clicked", {
        location: "Hero Section",
        button: "Get Started",
      });
      navigate("/auth");
      logEvent("Navigation_Success", { to: "/auth" });
    } catch (error) {
      logEvent(
        "Navigation_Failure",
        { to: "/auth", error: getErrorMessage(error) },
        LogLevel.ERROR
      );
    }
  };
  return (
    <div id="main-container" className="bg-[#FFF7E3] ">
      <section
        id="hero"
        className=" flex flex-col center items-center gap-[50px] animate-slide-in "
      >
        <h1 className="text-title font-bold font-sans">Whiteboard</h1>

        <img
          src="/images/hero_image.jpg"
          alt="Image"
          id="hero_image"
          className=" object-cover rounded-3xl animate-flip-vertical"
        />
        <div
          id="hero_description"
          className="flex flex-col items-center justify-center gap-[30px]"
        >
          <p
            id="hero_description_title"
            className="text-2xl md:text-xl text-[#888888] font-bold font-Merriweather text-center"
          >
            "Collaborate Seamlessly, Draw Ideas Together!"
          </p>
          <p
            id="hero_description_text"
            className="text-2xl md:text-xl text-[#888888] font-Merriweather italic text-center "
          >
            Whiteboard lets you and your team brainstorm, sketch, and create in
            real-time — anytime,anywhere.
          </p>
          <button
            id="hero_button_cta"
            className="bg-black p-2 rounded-xl shadow-black shadow-md"
            onClick={handleGetStarted}
          >
            <p className="text-button text-white font-sans">Get Started</p>
          </button>
        </div>
      </section>
      <section id="contact" className="flex justify-center  py-[100px]">
        <div
          id="social_links"
          className="flex flex-wrap gap-[50px] px-[100px] w-[full] items-center justify-center "
        >
          <img
            src="/images/twitter.png"
            alt="twitter"
            id="social_media_icons"
          />
          <img
            src="/images/instagram.png"
            alt="instagram"
            id="social_media_icons"
          />
          <img
            src="/images/linkedin.png"
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
      <section
        id="features"
        className="px-[100px] py-[50px] flex flex-col gap-[50px] "
      >
        <Feature
          title="AI-Powered Suggestions"
          description="Leverage AI to suggest shapes, diagrams, or text based on user sketches, enhancing brainstorming sessions."
          image_src="/images/ai-suggestions.avif"
          link=""
          flip={true}
          button_text="Read me"
        />
        <Feature
          title="Real-Time Collaborations"
          description="Collaborate with your team in real-time, enabling seamless brainstorming and idea sharing."
          image_src="/images/collaboration.avif"
          flip={false}
          link=""
          button_text="Read me"
        />
      </section>

      <section id="footer" className="mt-[50px] flex flex-col gap-[50px]">
        <div
          id="footer_cta"
          className="h-[330px] flex flex-col items-center justify-center gap-[50px] px-[100px] "
        >
          <p id="footer_cta_title" className="text-6xl font-bold">
            Sign up today.
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
function getErrorMessage(error: unknown) {
  throw new Error("Function not implemented.");
}

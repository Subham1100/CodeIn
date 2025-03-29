import React from "react";
import Feature from "../components/feature";

const HomePage = () => {
  return (
    <div>
      <section id="hero">
        <div id="title">Whiteboard</div>
        <div id="hero_image"></div>
        <div id="hero_description">
          <p id="hero_description_title"></p>
          <p id="hero_description_text"></p>
          <button id="hero_button_cta">Get Started</button>
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
          <div id="copyright_tag">© 2025 Whiteboard. All rights reserved.</div>
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

import { useNavigate } from "react-router-dom";
import { logEvent } from "../utils/logger";
import UseCasesSlider from "../components/useCasesSlider";
import FeaturesSection from "../components/featureSection";
import PricingSection from "../components/pricingSection";
import About from "../components/about";
import Team from "../components/team";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import HeroImage from "/images/Code_typing_cuate.svg";

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
      // logEvent(
      //   "Navigation_Failure",
      //   { to: "/auth", error: getErrorMessage(error) },
      //   LogLevel.ERROR
      // );
    }
  };
  const UseCaseData = [
    {
      title: "Coding Interviews",
      title_color: "#5A4E3C", // Muted Brown
      description_color: "#B8AFA1", // Soft Beige
      description:
        "Conduct live technical interviews with shared whiteboards and code editors.",
      image_src: "/images/interview.svg",
      color: "#FAF4EB",
    },
    {
      title: "Teaching and More",
      title_color: "#476D7C", // Slate Blue
      description_color: "#A9C0C9", // Light Dusty Blue
      description:
        "Host coding sessions and share problems with students in real time.",
      image_src: "/images/teacher.svg",
      color: "#EDF6F9",
    },
    {
      title: "Code with Friends",
      title_color: "#635A4F", // Taupe Brown
      description_color: "#C9C1B8", // Light Warm Gray
      description:
        "Pair program, debug together, or just code for fun with your friends.",
      image_src: "/images/friends.svg",
      color: "#F7F4F0",
    },
    {
      title: "Solo Coders",
      title_color: "#545454", // Muted Charcoal Gray
      description_color: "#B5B5B5", // Soft Light Gray
      description:
        "Practice DSA, write code, and visualize logic using whiteboards solo.",
      image_src: "/images/solo.svg",
      color: "#F5F5F5", // Light Cloud White
    },
  ];

  const FeatureData = [
    {
      title: "Real-Time Collaborative Code Editor and Whiteboard",
      description_color: "#121213",
      title_color: "#223D52",
      description:
        "A fully synchronized, real-time collaborative coding environment paired with a digital whiteboard. Users can write and edit code together with permission control, while also sketching diagrams, writing pseudocode, or discussing logic visually on the whiteboard. Designed to streamline technical discussions, pair programming, and remote interviews in one seamless interface.",
      image_src: "/images/realtime.svg",
      color: "#ffffff",
    },
    {
      title: "Built-in Code Runner and Judge System",
      description_color: "#121213",
      title_color: "#215489",
      description:
        "Submit and test your solutions just like on LeetCode. The platform supports real-time code execution with multiple programming languages, input/output handling, and automatic test case validation. Instantly see which test cases pass or fail, making practice and assessment fast and effective.",
      image_src: "/images/coderunner.svg",
      color: "#123123",
    },
    {
      title: "Smart Whiteboard with Export Functionality",
      description_color: "#121213",
      title_color: "#2a2d52",
      description:
        "Enhance your coding sessions with a feature-rich digital whiteboard.Export your whiteboard content as high-quality PNG or SVG files for easy sharing, documentation, or revision. Ideal for interviews, presentations, and study notes.",
      image_src: "/images/whiteboard.svg",
      color: "#8589A7",
    },
    {
      title: "Host-Controlled Access Permissions",
      description_color: "#121213",
      title_color: "#4A3F35",
      description:
        "Maintain full control over your collaborative sessions. Hosts can manage who can view, edit, or run code and whiteboard, ensuring a secure and focused collaboration environment.",
      image_src: "/images/host-control.svg",
      color: "#F4EDE4",
    },
  ];

  const PricingData = [
    {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      features: ["CodeEditor", "Whiteboard", " Sharing (up to 3 members)"],
      mostPopular: false,
    },
    {
      name: "Basic",
      monthlyPrice: 20,
      annualPrice: 240, // 20% off annual
      features: ["CodeEditor", "Whiteboard", " Sharing (up to 15 members)"],
      mostPopular: true,
    },
    {
      name: "Pro",
      monthlyPrice: 30,
      annualPrice: 360, // 20% off annual
      features: ["CodeEditor", "Whiteboard", " Sharing (with 15+ members)"],
      mostPopular: false,
    },
  ];

  return (
    <div>
      <div className="main-container px-4 md:px-6 overflow-hidden">
        <NavBar />

        {/* HERO SECTION */}
        <div
          className="hero-section flex flex-col-reverse md:flex-row gap-10 items-center mt-10 md:mt-20"
          id="hero-section"
        >
          <div className="hero-sectoin-elements w-full md:w-1/2 flex flex-col gap-4 md:p-10 text-center md:text-left items-center md:items-start">
            <h1 className="hero-text-h1 text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Collaborate
              <br />
              Code Ideas Together!
            </h1>
            <p className="hero-text-h2 text-base sm:text-lg md:text-xl text-gray-700">
              Whiteboard lets you and your team brainstorm, code, sketch, and
              create in real time.
            </p>
            <button
              className="bg-black text-white px-6 py-2 rounded-xl cursor-pointer shadow-md mt-4"
              onClick={handleGetStarted}
            >
              Get started
            </button>
          </div>
          <div className="hero-section-image w-full md:w-1/2 flex justify-center">
            <img src={HeroImage} alt="Hero" className="w-full max-w-md" />
          </div>
        </div>

        {/* USE CASE SECTION */}
        <div
          className="usecase-section mt-20 flex flex-col items-center"
          id="usecase-section"
        >
          <UseCasesSlider sliderItems={UseCaseData} />
        </div>

        {/* FEATURES SECTION */}
        <div className="features-section mt-20" id="features-section">
          <FeaturesSection sliderItems={FeatureData} />
        </div>

        {/* PRICING SECTION */}
        <div
          className="pricing-section flex flex-col items-center mt-20"
          id="pricing-section"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center p-5">
            Pricing Plans
          </h2>
          <PricingSection sliderItems={PricingData} />
        </div>

        {/* ABOUT SECTION */}
        <div
          className="about-section mt-20 px-4 sm:px-6 md:px-10 py-2"
          id="about-section"
        >
          <About />
        </div>

        {/* TEAM SECTION */}
        <div className="team-section mt-20 px-4" id="team-section">
          <Team />
        </div>

        {/* FOOTER */}
        <div className="footer mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

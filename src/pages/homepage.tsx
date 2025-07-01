import { useNavigate } from "react-router-dom";
import { logEvent } from "../utils/logger";
import UseCasesSlider from "../components/useCasesSlider";
import FeaturesSection from "../components/featureSection";
import PricingSection from "../components/pricingSection";
import About from "../components/about";
import Team from "../components/team";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/footer";
import HeroImage from "/images/Code_typing_cuate.svg";

const HomePage = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef2 &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropdownRef2.current?.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="main-container p-6 ">
        <div className="fixed inset-0  bg-black text-white flex items-center justify-center text-center px-4 md:hidden  z-90">
          <p className="text-lg font-semibold">
            Currently not available for mobile screen
          </p>
        </div>
        {/* <div className="absolute bg-[#1cdcd5] h-200 w-200 rounded-full blur-2xl opacity-20 -left-70 -top-70"></div> */}
        <div className="nav-bar w-full sticky top-0 backdrop-blur-3xl  flex items-center justify-between z-50">
          <div className="nav-left-side w-3/5 flex justify-between ">
            <div className="logo text-6xl ">
              <a href="/">Code-In</a>
            </div>
            <div className="nav-links flex items-center gap-13 text-2xl ">
              <a
                href="#features-section"
                className=" hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
              >
                Features
              </a>
              <a
                href="/docs"
                className=" hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
              >
                Docs
              </a>
              <a
                href="#pricing-section"
                className=" hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
              >
                Pricing
              </a>
              <p
                ref={dropdownRef2}
                className=" hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
                onClick={(e) => {
                  e.preventDefault();
                  setToggle((prev) => !prev);
                }}
                onMouseEnter={() => setToggle(true)}
              >
                About
              </p>
            </div>
          </div>
          {toggle && (
            <div
              className="absolute mt-2 w-48 bg-[#4b3b42b7] left-190 top-20  shadow-lg z-10  p-2 rounded-2xl"
              ref={dropdownRef}
            >
              <ul className="py-2 text-sm text-black">
                <li className=" hover:bg-gray-100 cursor-pointer rounded-xl ">
                  <a
                    href="#about-section"
                    className="block w-full h-full px-4 py-2  "
                  >
                    About Us
                  </a>
                </li>
                <li className=" hover:bg-gray-100 cursor-pointer rounded-xl">
                  <a
                    href="#team-section"
                    className="block w-full h-full px-4 py-2  "
                  >
                    Our Team
                  </a>
                </li>
                <li className=" hover:bg-gray-100 cursor-pointer rounded-xl">
                  <a
                    href="#contact"
                    className="block w-full h-full px-4 py-2  "
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          )}
          <div className="nav-right-side mr-30 text-2xl">
            <div className="auth-links">
              <button
                onClick={handleGetStarted}
                className="border-2 p-2 border-black text-gray-300 rounded-2xl bg-black  "
              >
                Get started
              </button>
            </div>
          </div>
        </div>
        <div className="hero-section  flex  gap-10" id="hero-section">
          <div className="hero-sectoin-elements w-1/2 flex flex-col gap-4 p-10">
            <div className="hero-text-h1 text-6xl mt-30 ">
              Collaborate
              <br />
              Code Ideas Together!
            </div>
            <div className="hero-text-h2 text-xl">
              Whiteboard lets you and your team <br />
              brainstorm, code, sketch,and create in realtime <br />
            </div>
            <div className="hero-button ">
              <button
                className=" bg-black text-white p-2 rounded-xl cursor-pointer shadow-md shadow-yellow-100"
                onClick={handleGetStarted}
              >
                Get started
              </button>
            </div>
          </div>
          <div className="hero-section-image  w-1/2">
            <img src={HeroImage} alt="" />
          </div>
        </div>
        <div
          className="usecase-section  mt-50 flex flex-col items-center gap-2.5"
          id="usecase-section"
        >
          <UseCasesSlider sliderItems={UseCaseData} />
        </div>
        <div className="features-section mt-37 " id="features-section">
          <FeaturesSection sliderItems={FeatureData} />
        </div>

        <div
          className="pricing-section flex flex-col items-center gap-5  mt-20"
          id="pricing-section"
        >
          <p className="text-6xl flex justify-center items-center p-5">
            Pricing Plans
          </p>
          <PricingSection sliderItems={PricingData} />
        </div>

        <div
          className="about-section mt-20  rounded-2xl px-10 py-2"
          id="about-section"
        >
          <About />
        </div>
        <div className="team-section mt-20" id="team-section">
          <Team />
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

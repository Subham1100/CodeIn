import { Link, useNavigate } from "react-router-dom";
import { logEvent, LogLevel } from "../utils/logger";
import UseCasesSlider from "../hooks/useCasesSlider";
import FeaturesSection from "../hooks/featureSection";
import PricingSection from "../hooks/pricingSection";
import About from "./about";
import Team from "./team";
import { useEffect, useRef, useState } from "react";
import { LineChart, Mail } from "lucide-react";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

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
      logEvent(
        "Navigation_Failure",
        { to: "/auth", error: getErrorMessage(error) },
        LogLevel.ERROR
      );
    }
  };
  const UseCaseData = [
    {
      title: "Coding Interviews",
      description_color: "#121213",
      title_color: "#223D52",
      description:
        "Conduct live technical interviews with shared whiteboards and code editors.",
      image_src: "/images/interview.jpg",
      color: "#ffffff",
    },
    {
      title: "Teachers",
      description_color: "#121213",
      title_color: "#215489",
      description:
        "Host coding sessions and share problems with students in real time.",
      image_src: "/images/teacher.png",
      color: "#123123",
    },
    {
      title: "Code with Friends",
      description_color: "#121213",
      title_color: "#2a2d52",
      description:
        "Pair program, debug together, or just code for fun with your friends.",
      image_src: "/images/friends.png",
      color: "#8589A7",
    },
    {
      title: "Solo Coders",
      description_color: "#121213",
      title_color: "#121213",
      description:
        "Practice DSA, write code, and visualize logic using whiteboards solo.",
      image_src: "/images/solo.png",
      color: "#135B7A",
    },
  ];
  const FeatureData = [
    {
      title: "Real-Time Collaborative Code Editor and Whiteboard",
      description_color: "#121213",
      title_color: "#223D52",
      description:
        "A fully synchronized, real-time collaborative coding environment paired with a digital whiteboard. Users can write and edit code together with permission control, while also sketching diagrams, writing pseudocode, or discussing logic visually on the whiteboard. Designed to streamline technical discussions, pair programming, and remote interviews in one seamless interface.",
      image_src: "/images/interview.jpg",
      color: "#ffffff",
    },
    {
      title: "Built-in Code Runner and Judge System",
      description_color: "#121213",
      title_color: "#215489",
      description:
        "Submit and test your solutions just like on LeetCode. The platform supports real-time code execution with multiple programming languages, input/output handling, and automatic test case validation. Instantly see which test cases pass or fail, making practice and assessment fast and effective.",
      image_src: "/images/teacher.png",
      color: "#123123",
    },
    {
      title: "Smart Whiteboard with Export Functionality",
      description_color: "#121213",
      title_color: "#2a2d52",
      description:
        "Enhance your coding sessions with a feature-rich digital whiteboard.Export your whiteboard content as high-quality PNG or SVG files for easy sharing, documentation, or revision. Ideal for interviews, presentations, and study notes.",
      image_src: "/images/friends.png",
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

  const [showAlert, setShowAlert] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("chauhan.subham.2017070@gmail.com");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 1000);
  };

  return (
    <div className="main-container p-6 bg-gradient-to-b from-[#a2f0d2be] via-[#62f0cf]  to-[#16352e] ">
      {/* <div className="absolute bg-[#1cdcd5] h-200 w-200 rounded-full blur-2xl opacity-20 -left-70 -top-70"></div> */}
      <div className="nav-bar w-full  flex items-center justify-between ">
        <div className="nav-left-side w-3/5 flex justify-between ">
          <div className="logo text-6xl ">
            <a href="/">Code-In</a>
          </div>
          <div className="nav-links flex items-center gap-13 text-2xl ">
            <a
              href="#features"
              className="hover:border-b-2 hover:text-[#687833] p-2"
            >
              Features
            </a>
            <a
              href="/docs"
              className="hover:border-b-2 hover:text-[#687833] p-2"
            >
              Docs
            </a>
            <a
              href="#pricing"
              className="hover:border-b-2 hover:text-[#687833] p-2"
            >
              Pricing
            </a>
            <p
              ref={dropdownRef2}
              className="hover:border-b-2 hover:text-[#687833] p-2 cursor-pointer"
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
            className="absolute mt-2 w-48 bg-[#32a681] left-190 top-20 rounded shadow-lg z-10 "
            ref={dropdownRef}
          >
            <ul className="py-2 text-sm text-black">
              <li className=" hover:bg-gray-100 cursor-pointer ">
                <a href="#about" className="block w-full h-full px-4 py-2  ">
                  About Us
                </a>
              </li>
              <li className=" hover:bg-gray-100 cursor-pointer ">
                <a href="#team" className="block w-full h-full px-4 py-2  ">
                  Our Team
                </a>
              </li>
              <li className=" hover:bg-gray-100 cursor-pointer ">
                <a href="#contact" className="block w-full h-full px-4 py-2  ">
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
      <div className="hero-section  flex items-center gap-10">
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
        <div className="usecase-slider w-1/2 mt-10 flex flex-col items-center gap-2.5">
          {/* <p className="usecase-heading text-3xl flex justify-center font-bold text-white shadow-md ">
            Tailored for Everyone
          </p> */}
          <UseCasesSlider sliderItems={UseCaseData} />
        </div>
      </div>
      <div className="features-section mt-37 " id="features">
        <p className="feature-section bg-[#a8e9b37e] text-6xl flex justify-center items-center p-7">
          Features
        </p>
        <FeaturesSection sliderItems={FeatureData} />
      </div>

      <div
        className="pricing flex flex-col items-center gap-5  mt-20"
        id="pricing"
      >
        <p className="pricing-section text-6xl flex justify-center items-center p-5">
          Pricing Plans
        </p>
        <PricingSection sliderItems={PricingData} />
      </div>

      <div
        className="about mt-20 bg-[#ffffff6f] rounded-2xl px-10 py-2"
        id="about"
      >
        <About />
      </div>
      <div className="team-section mt-20" id="team">
        <Team />
      </div>

      <footer className=" text-gray-400 w-full h py-6 mt-10 object-contain">
        {showAlert && (
          <div className=" absolute p-2 w-1/3 ml-90  bg-black text-white  rounded shadow-md text-sm ">
            Email copied to clipboard!
          </div>
        )}
        <div className="flex   gap-4 items-start px-20" id="contact">
          <p>Feel free to reach out to our teams at:</p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:your.email@example.com"
              className="hover:underline "
              onClick={(e) => {
                e.preventDefault();
                handleCopyEmail();
              }}
            >
              <div className="flex gap-2">
                <Mail /> <p>Mail</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/subham-chauhan-30b52822b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline "
            >
              <div className="flex gap-2">
                <LinkedInLogoIcon className="h-5" />
                <p>LinkedIn</p>
              </div>
            </a>
            <a
              href="https://x.com/mayi_codes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline "
            >
              <div className="flex gap-2">
                <TwitterLogoIcon className="h-5" />
                <p> Twitter</p>
              </div>
            </a>
            <a
              href="https://github.com/Subham1100"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline "
            >
              <div className="flex gap-2">
                <GitHubLogoIcon className="h-5" />
                <p> GitHub</p>
              </div>
            </a>
          </div>
        </div>
        <div className="text-center text-sm mt-10">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Codein</span>. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
export default HomePage;
function getErrorMessage(error: unknown) {
  throw new Error("Function not implemented.");
}

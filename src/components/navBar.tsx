import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [toggle, setToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    try {
      navigate("/auth");
    } catch (error) {}
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef2.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropdownRef2.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="  nav-bar w-full sticky top-0 backdrop-blur-3xl flex items-center justify-between z-50 px-4 py-2">
      {/* Left side */}
      <div className="flex items-center justify-between w-full md:w-3/5">
        <div className="logo text-4xl md:text-6xl">
          <a href="/">Code-In</a>
        </div>

        {/* Hamburger Icon (shown on md and below) */}
        <button
          className="text-3xl md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Nav links (hidden on small screens) */}
        <div className="nav-links hidden md:flex items-center gap-10 text-2xl">
          <a
            href="#features-section"
            className="hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
          >
            Features
          </a>
          <a
            href="/docs"
            className="hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
          >
            Docs
          </a>
          <a
            href="#pricing-section"
            className="hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
          >
            Pricing
          </a>
          <p
            ref={dropdownRef2}
            className="hover:bg-gradient-to-b from-[faf0e6] to-[#f0d5b2] p-3 rounded-2xl"
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

      {/* Right side button (hidden in mobile menu, shown on md+) */}
      <div className=" hero-button hidden md:flex nav-right-side text-2xl">
        <button
          onClick={handleGetStarted}
          className="hero-button border-2 p-2 border-black text-gray-300 rounded-2xl bg-black"
        >
          Get started
        </button>
      </div>

      {/* Dropdown (About) */}
      {toggle && (
        <div
          className="absolute mt-2 w-48 bg-[#4b3b42b7] left-190 top-20 shadow-lg z-10 p-2 rounded-2xl"
          ref={dropdownRef}
        >
          <ul className="py-2 text-sm text-black">
            <li className="hover:bg-gray-100 cursor-pointer rounded-xl">
              <a href="#about-section" className="block w-full px-4 py-2">
                About Us
              </a>
            </li>
            <li className="hover:bg-gray-100 cursor-pointer rounded-xl">
              <a href="#team-section" className="block w-full px-4 py-2">
                Our Team
              </a>
            </li>
            <li className="hover:bg-gray-100 cursor-pointer rounded-xl">
              <a href="#contact" className="block w-full px-4 py-2">
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-40 flex flex-col p-4 md:hidden text-lg gap-4">
          <a
            href="#features-section"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a href="/docs" onClick={() => setIsMobileMenuOpen(false)}>
            Docs
          </a>
          <a href="#pricing-section" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </a>
          <a href="#about-section" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </a>
          <a href="#team-section" onClick={() => setIsMobileMenuOpen(false)}>
            Our Team
          </a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleGetStarted();
            }}
            className="mt-2 border-2 p-2 border-black text-gray-300 rounded-2xl bg-black"
          >
            Get started
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;

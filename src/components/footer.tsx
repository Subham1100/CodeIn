import { Mail } from "lucide-react";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";

const Footer = () => {
  const [showAlert, setShowAlert] = useState(false);
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("chauhan.subham.2017070@gmail.com");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 1000);
  };
  return (
    <footer className=" text-gray-400 w-full h py-6  object-contain bg-[#513f47d2] ">
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
              <Mail /> <p>{showAlert ? "Copied !" : "Mail"}</p>
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
  );
};

export default Footer;

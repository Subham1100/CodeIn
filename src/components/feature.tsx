import "./css/feature.css";
type FeatureProps = {
  title?: string;
  description?: React.ReactNode;
  image_src?: string;
  flip?: boolean;
  link?: string;
  button_text?: string;
};

const Feature = ({
  title = "Default Title",
  description = "Default description goes here.",
  image_src = "/default-image.jpg", // Path to a default image
  flip = false,
  link = "#",
  button_text = "button",
}: FeatureProps) => {
  if (flip) {
    return (
      <div
        id="container"
        className="grid grid-cols-2  animate-delay transform transition delay-500"
      >
        <div
          id="first_section"
          className="w-[80%] flex items-center justify-center"
        >
          <img
            id="feature_image"
            src={image_src}
            className="rounded-xl h-[40vw] w-[40vw] max-h-[356px]"
          />
        </div>
        <div id="second_section" className="flex flex-col gap-[20px] w-[80%] ">
          <h1 id="feature_description_title" className="font-bold ">
            {title}
          </h1>
          <p
            id="feature_description_text"
            className=" text-[#888888] font-serif  "
          >
            {description}
          </p>
          {button_text !== "button" && (
            <button
              onClick={() => (window.location.href = link)}
              className="bg-black rounded-xl text-white p-2 w-[100px] "
            >
              {button_text}
            </button>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div
        id="container"
        className="grid  grid-cols-2 gap-[50px] animate-delay transform transition delay-500"
      >
        <div id="second_section" className="flex flex-col gap-[20px] w-[80%] ">
          <h1 id="feature_description_title" className="font-bold ">
            {title}
          </h1>
          <p
            id="feature_description_text"
            className=" text-[#888888] font-serif "
          >
            {description}
          </p>
          {button_text !== "button" && (
            <button
              onClick={() => (window.location.href = link)}
              className="bg-black rounded-xl text-white p-2 w-[100px] "
            >
              {button_text}
            </button>
          )}
        </div>
        <div
          id="first_section"
          className="w-[80%] flex items-center justify-center"
        >
          <img
            id="feature_image"
            src={image_src}
            className="rounded-xl h-[40vw] w-[40vw] max-h-[356px]"
          ></img>
        </div>
      </div>
    );
  }
};

export default Feature;

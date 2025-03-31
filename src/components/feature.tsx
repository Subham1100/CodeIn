import "./css/feature.css";
type FeatureProps = {
  title: string;
  description: string;
  image_src: string;
  flip: boolean;
  link: string;
};

const Feature = ({
  title,
  description,
  image_src,
  flip,
  link,
}: FeatureProps) => {
  if (flip) {
    return (
      <div
        id="container"
        className="grid grid-cols-2 h-[356px] justify-aroundp-[20px] animate-delay transform transition delay-1000"
      >
        <div id="first_section" className="w-[80%] mx-16">
          <img src={image_src} className="rounded-xl " />
        </div>
        <div id="second_section" className="flex flex-col gap-[20px] w-[80%]">
          <h1 className="font-bold text-5xl">{title}</h1>
          <p className="text-2xl text-[#888888] font-serif  ">{description}</p>
          <button
            onClick={() => (window.location.href = link)}
            className="bg-black rounded-xl text-white p-2 text-tiny w-[20%]"
          >
            Read more
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div
        id="container"
        className="grid grid-cols-2 gap-[50px h-[356px] p-[30px] animate-delay"
      >
        <div
          id="second_section"
          className="flex flex-col gap-[20px] w-[80%] mx-10"
        >
          <h1 className="font-bold text-5xl">{title}</h1>
          <p className="text-2xl text-[#888888] font-serif ">{description}</p>
          <button
            onClick={() => (window.location.href = link)}
            className="bg-black rounded-xl text-white p-2 text-tiny w-[20%]"
          >
            Read more
          </button>
        </div>
        <div id="first_section" className="w-[80%] ">
          <img src={image_src} className="rounded-xl"></img>
        </div>
      </div>
    );
  }
};

export default Feature;

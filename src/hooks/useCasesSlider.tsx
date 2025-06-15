import React, { useState } from "react";
import { useEffect } from "react";

interface SliderItem {
  title: string;
  description: string;
  image_src: string;
  color: string;
  description_color: string;
  title_color: string;
}

interface UseCasesSliderProps {
  sliderItems: SliderItem[];
}

const UseCasesSlider: React.FC<UseCasesSliderProps> = ({ sliderItems }) => {
  const [option, setOption] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setOption((prev) => (prev === 3 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div
      className=" slider-content flex flex-col gap-6 p-4 w-5/7 rounded-2xl "
      //   style={{ backgroundColor: sliderItems[option].color }}
    >
      <div className="flex flex-col items-center rounded-3xl ">
        <h1
          className=" flex justify-center font-bold text-3xl mb-4 "
          style={{ color: sliderItems[option].title_color }}
        >
          {sliderItems[option].title}
        </h1>
        <img
          src={sliderItems[option].image_src}
          className="w-80 h-50 object-cover rounded-2xl "
        ></img>
        <h2
          className="flex justify-center  text-center w-5/6 shadow-md mt-5  rounded-2xl tracking-wider text-white p-2"
          style={{ backgroundColor: sliderItems[option].title_color }}
        >
          {sliderItems[option].description}
        </h2>
      </div>
      <div className="slider-buttons flex gap-4 justify-center">
        {[0, 1, 2, 3].map((num) => (
          <button
            onClick={() => {
              setOption(num);
            }}
            className="cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-full bg-[#a8a8a8]"
              style={{
                backgroundColor:
                  option === num
                    ? `${sliderItems[option].title_color}`
                    : "#a8a8a8",
              }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UseCasesSlider;

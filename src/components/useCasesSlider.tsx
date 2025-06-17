import React, { useEffect, useState, useRef } from "react";

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
  const [displayedTitle, setDisplayedTitle] = useState(sliderItems[0].title);

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const nextTitle = sliderItems[option].title;
    let step = 0;
    const totalSteps = 100;

    // Clear any running animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    function animateTitle() {
      const progress = step / totalSteps;
      const ease = progress * progress * (3 - 2 * progress);
      const length = Math.ceil(nextTitle.length * ease);
      const partial = nextTitle.substring(0, length);
      setDisplayedTitle(partial);

      if (step < totalSteps) {
        step++;
        animationRef.current = requestAnimationFrame(animateTitle);
      }
    }

    animateTitle();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [option, sliderItems]);
  useEffect(() => {
    const interval = setInterval(() => {
      setOption((prev) => (prev === 3 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="slider-content flex flex-col gap-6 p-4 w-full h-full rounded-2xl items-center justify-center">
      <div className="flex flex-col items-center rounded-3xl">
        <h1
          className="flex justify-center font-bold text-6xl mb-10 transition-all"
          style={{ color: sliderItems[option].title_color }}
        >
          <span>{displayedTitle}</span>
        </h1>
        <div className="flex  items-center justify-center gap-10">
          <img
            src={sliderItems[option].image_src}
            className="w-150 h-100  rounded-2xl"
            alt="slider visual"
          />
          <h2 className="flex justify-center text-center w-100 h-100 shadow-lg items-center  rounded-2xl tracking-wider text-2xl text-black p-4">
            {sliderItems[option].description}
          </h2>
        </div>
      </div>

      <div className="slider-buttons flex gap-4 justify-center">
        {sliderItems.map((_, num) => (
          <button
            key={num}
            onClick={() => setOption(num)}
            className="cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  option === num ? sliderItems[option].title_color : "#a8a8a8",
              }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UseCasesSlider;

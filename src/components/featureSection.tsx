import React from "react";

interface SliderItem {
  title: string;
  description: string;
  image_src: string;
  color: string;
  description_color: string;
  title_color: string;
}

interface FeaturesSectionProps {
  sliderItems: SliderItem[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ sliderItems }) => {
  return (
    <div className="w-full overflow-hidden">
      <p className="feature-section text-4xl sm:text-5xl md:text-6xl lg:text-7xl flex justify-center items-center p-7">
        Features
      </p>
      <div className="features flex flex-col md:flex-row md:flex-wrap gap-10 md:gap-10 p-4 md:p-10 w-full">
        {sliderItems.map((feature, idx) => (
          <div
            key={idx}
            className="bg-[#e7cbb1] flex flex-col w-full md:w-[48%] p-6 md:p-10 rounded-2xl"
          >
            <img src={feature.image_src} className="h-20 w-40" />
            <h1 className="mt-5 md:mt-7 text-xl md:text-2xl font-bold">
              {feature.title}
            </h1>
            <h2 className="mt-2 text-sm md:text-base">{feature.description}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;

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
    <div className="flex">
      <p className="feature-section bg-red-500 text-7xl flex  justify-center items-center p-7">
        Features
      </p>
      <div className="features flex flex-col gap-20 p-10 bg-blue-600 overflow-scroll h-[500px]">
        {sliderItems.map((feature, idx) => (
          <div
            key={idx}
            className="bg-[#e7cbb1] flex flex-col w-1/2 p-10 rounded-2xl "
          >
            <img src={feature.image_src} className="h-20 w-40 " />
            <h1 className="mt-7 text-2xl font-bold">{feature.title}</h1>
            <h2 className="mt-2 text-sm">{feature.description}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;

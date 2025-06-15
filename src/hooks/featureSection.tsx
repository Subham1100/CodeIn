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

interface FeaturesSectionProps {
  sliderItems: SliderItem[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ sliderItems }) => {
  return (
    <div className="features flex bg-[#a8e9b37e] gap-20 p-10">
      {sliderItems.map((feature, idx) => (
        <div
          key={idx}
          className="bg-white flex flex-col w-1/2 p-10 rounded-2xl"
        >
          <img src={feature.image_src} className="h-20 w-20 rounded-r-full" />
          <h1 className="mt-7 text-2xl font-bold">{feature.title}</h1>
          <h2 className="mt-2 text-sm">{feature.description}</h2>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSection;

import { CheckCheck, icons, TicketCheck, TicketPlus } from "lucide-react";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface SliderItem {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  mostPopular: boolean;
}

interface PricingSectionProps {
  sliderItems: SliderItem[];
}

const PricingSection: React.FC<PricingSectionProps> = ({ sliderItems }) => {
  const navigate = useNavigate();
  return (
    <div className="features flex  gap-20 p-10  items-center justify-center bg-[#147558] rounded-2xl">
      {sliderItems.map((plan, idx) => (
        <div
          key={idx}
          className="bg-white flex flex-col  px-10 py-2 rounded-2xl gap-4 items-center"
          style={{
            border: plan.mostPopular ? "2px solid #4CAF50" : "none",
            height: plan.mostPopular ? "470px" : "410px",
            background: plan.mostPopular ? "#99dd96" : "",
          }}
        >
          <h1
            className="flex justify-center text-2xl"
            style={{ padding: plan.mostPopular ? "18px" : "" }}
          >
            {plan.name}
          </h1>
          <div className="flex gap-2">
            <TicketPlus />
            <p className="">
              Montly Price :$<s>{plan.monthlyPrice}</s> <span>Free</span>
            </p>
          </div>
          <div className="flex gap-2">
            <TicketPlus />
            <p>
              Montly Price :$<s>{plan.monthlyPrice}</s> <span>Free</span>
            </p>
          </div>

          {plan.features.map((feature) => (
            <div className="flex  gap-2">
              <TicketCheck />
              <p>{feature}</p>
            </div>
          ))}
          <button
            className="p-4 bg-[#358f6b] rounded-2xl text-white mt-10"
            onClick={() => navigate("/auth")}
          >
            Sign up
          </button>
        </div>
      ))}
    </div>
  );
};

export default PricingSection;

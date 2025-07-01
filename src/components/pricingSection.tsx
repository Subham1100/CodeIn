import { TicketCheck, TicketPlus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="relative flex flex-col lg:flex-row flex-wrap justify-center items-center gap-10 px-4 py-10 lg:py-20 w-full max-w-[1200px] mx-auto lg:h-[700px] rounded-2xl ">
      <div className="absolute inset-0 backdrop-blur-3xl bg-[#4b3d3574] rounded-2xl  z-0" />
      {sliderItems.map((plan, idx) => (
        <div
          key={idx}
          className="z-10 bg-white w-full md:w-[300px] flex flex-col px-6 py-8 rounded-2xl gap-6 items-center transition-transform duration-300 transform hover:-translate-y-4 hover:shadow-2xl shadow-amber-200 hover:border-4"
          style={{
            background: plan.mostPopular ? "#e2cbb0" : "#aeb6a0",
          }}
        >
          <h1
            className="flex justify-center text-xl font-semibold"
            style={{ padding: plan.mostPopular ? "18px" : "" }}
          >
            {plan.name}
          </h1>

          <div className="flex gap-2 items-center text-sm">
            <TicketPlus />
            <p>
              Monthly Price: <s>${plan.monthlyPrice}</s>{" "}
              <span className="text-green-700 font-bold">Free</span>
            </p>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <TicketPlus />
            <p>
              Annual Price: <s>${plan.annualPrice}</s>{" "}
              <span className="text-green-700 font-bold">Free</span>
            </p>
          </div>

          {plan.features.map((feature, i) => (
            <div
              key={i}
              className="flex gap-2 items-center text-sm text-center"
            >
              <TicketCheck />
              <p>{feature}</p>
            </div>
          ))}

          <button
            className="p-3 bg-[#358f6b] rounded-2xl text-white mt-6 text-sm"
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

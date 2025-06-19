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
    <div className=" relative flex  gap-20 px-10 py-20  items-center justify-center  rounded-2xl border-2 ">
      <div className="absolute inset-0 backdrop-blur-3xl bg-[#783612] rounded-2xl border-2 z-0" />
      {sliderItems.map((plan, idx) => (
        <div
          key={idx}
          className="bg-white flex flex-col  px-10 pb-10 rounded-2xl gap-10 items-center transition-transform duration-400 transform hover:-translate-y-4 hover:shadow-2xl shadow-amber-200 hover:border-4  "
          style={{
            background: plan.mostPopular ? "#e2cbb0" : "#aeb6a0",
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

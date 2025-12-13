import React from "react";

const StepBar = ({ currentStep }) => {
  const steps = ["Input Data", "Rekomendasi", "Finalisasi"];
  const completedSteps = steps.indexOf(currentStep) + 1;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex w-full h-4 rounded-lg overflow-hidden gap-x-2 ">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-full flex-1 transition-colors duration-300
              ${index < completedSteps ? "bg-primary" : "bg-gray-700"}
              ${index < steps.length - 1 ? "border-r border-black border-opacity-30" : ""}
            `}
          ></div>
        ))}
      </div>

      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className="w-1/3 text-center px-1 font-p hover:cursor-pointer">
            <p
              className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                index < completedSteps ? "text-purple-400" : "text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepBar;
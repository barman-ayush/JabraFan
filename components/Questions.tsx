"use client";
import React from "react";
import { useTheme } from "next-themes";

type QuestionProps = {
  id: number;
  question: string;
  options: string[];
};

export default function Questions({ id, question, options }: QuestionProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  const containerClasses = `max-w-md mx-auto bg-gradient-to-b ${
    isDark
      ? "from-slate-800 to-slate-900 text-white border border-slate-700"
      : "from-sky-50 to-blue-50 text-black border border-sky-200"
  } rounded-lg shadow-lg md:max-w-2xl m-4 p-6`;

  const headerClasses = `text-xl font-semibold ${
    isDark
      ? "text-white border-b border-slate-700 pb-3"
      : "text-black border-b border-sky-200 pb-3"
  }`;

  const optionSelectedClasses = isDark
    ? "bg-purple-600 text-white border-purple-600 shadow-md"
    : "bg-blue-400 text-white border-blue-400 shadow-md";

  const optionDefaultClasses = isDark
    ? "border-slate-400 hover:bg-slate-700 hover:border-purple-400"
    : "border-slate-400 hover:bg-sky-100 hover:border-blue-400";

  const radioSelectedClasses = isDark
    ? "bg-white border-purple-600"
    : "bg-white border-blue-600";

  const radioInnerClasses = isDark ? "bg-purple-600" : "bg-blue-600";

  const buttonClasses = isDark
    ? "bg-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-400"
    : "bg-blue-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-400";

  return (
    <div className={containerClasses}>
      <div className="space-y-6">
        {/* Question Header */}
        <h2 className={headerClasses}>{question}</h2>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                selectedOption === option
                  ? optionSelectedClasses
                  : optionDefaultClasses
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <input
                type="radio"
                name={`question-${id}`}
                id={`${option}-${id}`}
                value={option}
                checked={selectedOption === option}
                className="hidden"
                readOnly
              />
              <label
                htmlFor={`${option}-${id}`}
                className="w-full cursor-pointer flex items-center"
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center border rounded-full mr-3 ${
                    selectedOption === option
                      ? radioSelectedClasses
                      : "border-gray-400"
                  }`}
                >
                  {selectedOption === option && (
                    <span
                      className={`w-3 h-3 ${radioInnerClasses} rounded-full`}
                    ></span>
                  )}
                </span>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-end mt-6">
          <button className={buttonClasses}>Start Bet</button>
        </div>
      </div>
    </div>
  );
}

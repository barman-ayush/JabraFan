"use client";
import React from "react";

type QuestionProps = {
  id: number;
  question: string;
  options: string[];
};

export default function Questions({ id, question, options }: QuestionProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-slate-500 to-slate-700 text-white rounded-lg border border-slate-500 shadow-lg md:max-w-2xl m-4 p-6">
      <div className="space-y-6">
        {/* Question Header */}
        <h2 className="text-xl font-semibold text-white border-b border-slate-500 pb-3">
          {question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                selectedOption === option
                  ? "bg-green-500 text-white border-green-500 shadow-md"
                  : "border-slate-400 hover:bg-slate-600 hover:border-green-400"
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
                      ? "bg-white border-green-600"
                      : "border-gray-400"
                  }`}
                >
                  {selectedOption === option && (
                    <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                  )}
                </span>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-end mt-6">
          <button className="bg-green-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-400">
            Start Bet
          </button>
        </div>
      </div>
    </div>
  );
}

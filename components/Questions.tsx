"use client";
import React from "react";
import ConfirmBetDialog from "./ConfirmBetDialog";

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
    <div className="max-w-md mx-auto bg-gradient-to-b from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] rounded-lg shadow-lg md:max-w-2xl m-4 p-6 border border-[hsl(var(--border-color))]">
      <div className="space-y-6">
        {/* Question Header */}
        <h2 className="text-xl font-semibold border-b border-[hsl(var(--border-color))] pb-3">
          {question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                selectedOption === option
                  ? "bg-[hsl(var(--primary-button))] text-white border-[hsl(var(--primary-button))] shadow-md"
                  : "border-[hsl(var(--border-color))] hover:bg-[hsl(var(--gradient-end))]"
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
                      ? "bg-white border-[hsl(var(--primary-button))]"
                      : "border-gray-400"
                  }`}
                >
                  {selectedOption === option && (
                    <span className="w-3 h-3 bg-[hsl(var(--primary-button))] rounded-full"></span>
                  )}
                </span>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-end mt-6">
          <ConfirmBetDialog
            question={question}
            selectedOption={selectedOption}
            trigger={
              <button
                className="bg-[hsl(var(--primary-button))] text-white py-3 px-8 rounded-lg font-medium hover:bg-[hsl(var(--primary-button-hover))] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Bet
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}

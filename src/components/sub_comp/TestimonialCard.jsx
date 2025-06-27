import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({
  text,
  name,
  role,
  rating = 5,
  image
}) => {
  return (
    <div className="transition-all duration-300 ease-in-out bg-white/10 group-[.dark-mode]:bg-[#1d2229]/50 text-st w-[350px] h-[150px] md:w-[400px] md:h-[200px] rounded-xl p-4 shadow-lg flex flex-col justify-between hover:scale-105 hover:shadow-2xl hover:bg-blue-200 group-[.dark-mode]:hover:bg-[#2a2f38] hover:cursor-pointer">
      <p className="text-lt text-lg leading-relaxed line-clamp-3">
        {text}
      </p>

      <div>
        <hr className="border-gray-600 my-2" />
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{name}</h3>
            <p className="text-xs text-lt">{role}</p>
          </div>
          <div className="text-yellow-400 flex items-center gap-1">
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill="currentColor" stroke="none" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

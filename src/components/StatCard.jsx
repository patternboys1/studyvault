import React from 'react';

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white min-h-30 p-4 md:p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:border-blue-100 hover:shadow-md">
      <div className={`mb-3 ${color} flex items-center justify-center`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>

      <div className="min-w-0 w-full">
        <p className="text-2xl md:text-3xl font-black text-gray-950 leading-tight truncate">
          {value}
        </p>
        <p className="text-[9px] md:text-[10px] font-extrabold text-gray-500 uppercase mt-1 truncate">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;

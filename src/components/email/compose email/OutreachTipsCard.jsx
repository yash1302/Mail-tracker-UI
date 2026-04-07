const tips = [
  "Personalise the opening line",
  "Keep it under 150 words",
  "One clear call-to-action",
  "Follow up after 7 days"
];

const OutreachTipsCard = () => {

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-[16px] p-[20px] pb-0 text-white">

      <h3 className="text-[11.5px] font-bold uppercase tracking-[0.05em] mb-[11px] opacity-80">
        Outreach Tips
      </h3>

      {tips.map((tip,i)=>(
        <div key={i} className="flex items-start gap-[8px] mb-[8px]">

          <div className="w-[17px] h-[17px] rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">
            {i+1}
          </div>

          <p className="text-[12.5px] leading-[1.5] opacity-90">
            {tip}
          </p>

        </div>
      ))}

    </div>
  );
};

export default OutreachTipsCard;
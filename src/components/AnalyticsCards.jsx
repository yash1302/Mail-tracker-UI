const cardData = [
  {
    title: "Outreach sent",
    stats: [
      { label: "Drafted", value: 42, change: "+14%" },
      { label: "Sent", value: 68, change: "+17%" }
    ]
  },
  {
    title: "Lead activity",
    stats: [
      { label: "Opened", value: 13, change: "+5%" },
      { label: "Replied", value: 12, change: "+2%" }
    ]
  },
  {
    title: "Conversions",
    stats: [
      { label: "Booked", value: 7, change: "+1%" },
      { label: "Ignored", value: 16, change: "-5%" }
    ]
  }
];

const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-3 gap-4">

      {cardData.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border p-5"
        >

          <div className="flex justify-between mb-4">

            <h3 className="text-sm font-medium text-gray-600">
              {card.title}
            </h3>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {card.stats.map((stat, i) => (
              <div key={i}>

                <p className="text-xs text-gray-500">
                  {stat.label}
                </p>

                <div className="flex items-center gap-2">

                  <span className="text-lg font-semibold">
                    {stat.value}
                  </span>

                  <span
                    className={`text-xs ${
                      stat.change.includes("-")
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {stat.change}
                  </span>

                </div>

                <p className="text-xs text-gray-400">
                  vs last week
                </p>

              </div>
            ))}

          </div>

        </div>
      ))}

    </div>
  );
};

export default AnalyticsCards;
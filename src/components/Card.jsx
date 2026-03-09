const Card = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex justify-between">

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>

      <div className="text-blue-600 text-2xl">
        {icon}
      </div>

    </div>
  );
};

export default Card;
const Button = ({ children, onClick, icon, variant = "primary" }) => {

  const styles = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-gray-700",
    danger: "bg-red-500 text-white"
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${styles[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
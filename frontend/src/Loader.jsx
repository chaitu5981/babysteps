const Loader = ({ color = "blue", size = "1.5rem" }) => {
  return (
    <div
      style={{
        borderColor: color,
        borderWidth: "0px 2px 2px 2px",
        width: size,
        height: size,
      }}
      className="animate-spin rounded-full mx-auto"
    ></div>
  );
};
export default Loader;

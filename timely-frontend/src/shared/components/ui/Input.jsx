import PropTypes from "prop-types";

const Input = ({ label, id, error, className = "", ...props }) => (
  <label className="flex flex-col gap-1 text-sm text-foreground" htmlFor={id}>
    {label && <span className="font-medium opacity-75">{label}</span>}
    <input
      id={id}
      className={`h-10 rounded-sm border border-input bg-white px-3 text-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${className}`}
      {...props}
    />
    {error && <span className="text-sm text-danger">{error}</span>}
  </label>
);

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default Input;

import PropTypes from "prop-types";

const Select = ({ label, id, children, className = "", ...props }) => (
  <label className="flex flex-col gap-1 text-sm text-foreground" htmlFor={id}>
    {label && <span className="font-medium opacity-75">{label}</span>}
    <select
      id={id}
      className={`h-10 rounded-sm border border-input bg-white px-3 text-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${className}`}
      {...props}
    >
      {children}
    </select>
  </label>
);

Select.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Select;

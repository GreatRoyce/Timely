import PropTypes from "prop-types";

const Textarea = ({ label, id, className = "", ...props }) => (
  <label className="flex flex-col gap-1 text-sm text-foreground" htmlFor={id}>
    {label && <span className="font-medium opacity-75">{label}</span>}
    <textarea
      id={id}
      className={`min-h-20 resize-y rounded-sm border border-input bg-white px-3 py-2 text-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${className}`}
      {...props}
    />
  </label>
);

Textarea.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Textarea;

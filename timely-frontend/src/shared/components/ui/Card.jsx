import PropTypes from "prop-types";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-md border border-primary/20 bg-surface p-4 shadow-sm ${className}`}
  >
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;

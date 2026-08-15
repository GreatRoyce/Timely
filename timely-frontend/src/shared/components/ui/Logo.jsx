import PropTypes from "prop-types";

function Logo({ className = "", alt = "Timely Logo" }) {
  return (
    <img
      src="/timely-logo.png"
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}

Logo.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
};

export default Logo;

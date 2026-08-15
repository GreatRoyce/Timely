import PropTypes from "prop-types";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-700 shadow-md",

  secondary:
    "bg-secondary text-secondary-foreground border border-border hover:bg-muted",

  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary-50",

  ghost:
    "bg-transparent text-foreground hover:bg-muted",

  success:
    "bg-success text-success-foreground hover:opacity-90",

  warning:
    "bg-warning text-warning-foreground hover:opacity-90",

  danger:
    "bg-danger text-danger-foreground hover:opacity-90",
};

const sizes = {
  sm: "h-8 px-2 text-md rounded-sm",
  md: "h-10 px-4 text-lg rounded-sm",
  lg: "h-12 px-14 text-lg rounded-md",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        shadow-lg
        gap-2
        tracking-wider
        font-semibold
        transition-all
        duration-250
        ease-smooth
        select-none
        whitespace-nowrap
        active:scale-[0.98]
        focus:outline-none
        focus:ring-2
        focus:ring-ring
        disabled:opacity-50
        disabled:pointer-events-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {LeftIcon && <LeftIcon size={18} className="shrink-0" />}

      <span>{children}</span>

      {RightIcon && <RightIcon size={18} className="shrink-0" />}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "success",
    "warning",
    "danger",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
};

export default Button;
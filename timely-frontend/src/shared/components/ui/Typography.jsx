export const H1 = ({ children, className = "" }) => (
  <h1 className={`text-5xl font-extrabold text-foreground ${className}`}>
    {children}
  </h1>
);

export const H2 = ({ children, className = "" }) => (
  <h2 className={`text-4xl font-bold text-foreground ${className}`}>
    {children}
  </h2>
);

export const H3 = ({ children, className = "" }) => (
  <h3 className={`text-3xl font-bold text-foreground ${className}`}>
    {children}
  </h3>
);

export const H4 = ({ children, className = "" }) => (
  <h4 className={`text-2xl font-bold text-foreground ${className}`}>
    {children}
  </h4>
);

export const H5 = ({ children, className = "" }) => (
  <h5 className={`text-xl font-bold text-foreground ${className}`}>
    {children}
  </h5>
);

export const P = ({ children, className = "" }) => (
  <p className={`text-sm text-muted-foreground leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Small = ({ children, className = "" }) => (
  <span className={`text-xs text-muted-foreground ${className}`}>
    {children}
  </span>
);

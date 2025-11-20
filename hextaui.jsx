// components/ui/hextaui.jsx
export function HCard({ children }) {
    return <div className="h-card">{children}</div>;
  }
  
  export function HButton({ children, variant = "primary", ...props }) {
    const className = [
      "h-button",
      variant === "primary" && "h-button-primary",
      variant === "secondary" && "h-button-secondary",
      variant === "outline" && "h-button-outline",
      variant === "ghost" && "h-button-ghost",
      variant === "subtle" && "h-button-subtle",
    ]
      .filter(Boolean)
      .join(" ");
  
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  }
  
  export function TagPill({ label }) {
    return <span className="tag-pill">{label}</span>;
  }
  
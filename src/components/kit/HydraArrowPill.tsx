type HydraArrowPillProps = {
  text: string;
  href?: string;
  tone?: "lime" | "deep";
  className?: string;
};

const HydraArrowPill = ({ text, href = "#", tone = "lime", className = "" }: HydraArrowPillProps) => {
  const button = tone === "lime" ? "btn-primary" : "btn-secondary";
  return (
    <a href={href} className={`btn-pair group inline-flex items-center gap-[2px] rounded-full ${className}`}>
      <div className={button}>
        <p className="btn-label">{text}</p>
      </div>
      <div className={`${button} size-[2.5rem] shrink-0 px-0`}>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[0.875rem] group-hover:rotate-45 group-focus-visible:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
      </div>
    </a>
  );
};

export default HydraArrowPill;

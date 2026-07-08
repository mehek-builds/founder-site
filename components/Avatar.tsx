export default function Avatar({
  size = 296,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Mehek Mandal avatar"
    >
      <circle cx="12" cy="12" r="12" fill="#f0f3f6" />
      <g fill="#6cc78f">
        <rect x="5" y="7" width="3" height="10" />
        <rect x="8" y="10" width="3" height="3" />
        <rect x="11" y="7" width="3" height="3" />
        <rect x="11" y="13" width="3" height="4" />
        <rect x="16" y="7" width="3" height="10" />
      </g>
    </svg>
  );
}

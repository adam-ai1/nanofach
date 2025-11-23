import type { SVGProps } from "react";

const Wifi0 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12.55a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" />
    <path d="M17 12.55V9a5 5 0 0 0-10 0v3.55" />
  </svg>
);

const Wifi1 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h.01" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
  </svg>
);

const Wifi2 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h.01" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
    <path d="M5 12.85A10 10 0 0 1 19 12.85" />
  </svg>
);

const WifiFull = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h.01" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
    <path d="M5 12.85A10 10 0 0 1 19 12.85" />
    <path d="M8.5 16.42a5 5 0 0 1 7 0" />
  </svg>
);

const WifiIcon = ({ strength, ...props }: { strength: number } & SVGProps<SVGSVGElement>) => {
  if (strength <= 0) return <Wifi0 {...props} />;
  if (strength === 1) return <Wifi1 {...props} />;
  if (strength === 2) return <Wifi2 {...props} />;
  return <WifiFull {...props} />;
};

export const Icons = {
  wifi: WifiIcon,
};

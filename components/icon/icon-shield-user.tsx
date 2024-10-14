import { FC } from "react";

interface IconShieldUserProps {
  className?: string;
}

const IconShieldUser: FC<IconShieldUserProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="#1C274C"
        d="M3 10.417c0-3.198 0-4.797.378-5.335.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2c.811 0 1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22c-1.02 0-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991v-1.574z"
        opacity="0.5"
        stroke="currentColor"
      ></path>
      <path
        fill="#1C274C"
        stroke="currentColor"
        d="M14 9a2 2 0 11-4 0 2 2 0 014 0zM12 17c4 0 4-.895 4-2s-1.79-2-4-2-4 .895-4 2 0 2 4 2z"
      ></path>
    </svg>
  );
}

export default IconShieldUser;
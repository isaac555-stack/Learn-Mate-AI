import { keyframes } from "@mui/system";

export const shimmer = keyframes`
  0% { background-position: 0% 50%; transform: scale(0.98); }
  50% { background-position: 100% 50%; transform: scale(1); }
  100% { background-position: 0% 50%; transform: scale(0.98); }
`;
export const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.98); }
`;
export const scanMove = keyframes`
  0% { top: 10%; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
`;

export const aurora = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

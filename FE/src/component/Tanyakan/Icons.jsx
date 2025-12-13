import React from "react";

const IconPlaceholder = ({ name, className = "" }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {name === "Check" && <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />}
    {name === "Cloud" && <path d="M18 10h-1.26a8 8 0 1 0-14.73 6h.02" />}
    {name === "Truck" && (
      <path d="M1 3h15v12H1zM16 8h4l2 3v5h-2M15 19h-5M8 19h-5" />
    )}
    {name === "Tool" && (
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    )}
    {name === "Anchor" && (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    )}
    {name === "Person" && <circle cx="12" cy="7" r="4" />}
    {name === "Sunny" && <circle cx="12" cy="12" r="5" />}
    {name === "Warning" && <path d="M12 2L1 21h22L12 2zm0 13V9" />}
    {name === "Time" && <circle cx="12" cy="12" r="10" />} 
    {name === "Box" && <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />}
    {name === "Down" && <polyline points="6 9 12 15 18 9" />}
    {name === "Up" && <polyline points="18 15 12 9 6 15" />}
    {name === "Close" && <line x1="18" y1="6" x2="6" y2="18" />}
    {!name && <circle cx="12" cy="12" r="10" />}
  </svg>
);

export const FiCheckCircle = (props) => <IconPlaceholder name="Check" {...props} />;
export const FiCloud = (props) => <IconPlaceholder name="Cloud" {...props} />;
export const FiTruck = (props) => <IconPlaceholder name="Truck" {...props} />;
export const FiTool = (props) => <IconPlaceholder name="Tool" {...props} />;
export const FiAnchor = (props) => <IconPlaceholder name="Anchor" {...props} />;

export const MdOutlineKeyboardArrowDown = (props) => <IconPlaceholder name="Down" {...props} />;
export const MdOutlineKeyboardArrowUp = (props) => <IconPlaceholder name="Up" {...props} />;
export const MdCheckCircleOutline = (props) => <IconPlaceholder name="Check" {...props} />;
export const MdClose = (props) => <IconPlaceholder name="Close" {...props} />;
export const MdTruck = (props) => <IconPlaceholder name="Truck" {...props} />;
export const MdEngineering = (props) => <IconPlaceholder name="Tool" {...props} />;
export const MdPerson = (props) => <IconPlaceholder name="Person" {...props} />;
export const MdWbSunny = (props) => <IconPlaceholder name="Sunny" {...props} />;
export const MdWarning = (props) => <IconPlaceholder name="Warning" {...props} />;
export const MdInventory = (props) => <IconPlaceholder name="Box" {...props} />; 
export const MdAccessTime = (props) => <IconPlaceholder name="Time" {...props} />;
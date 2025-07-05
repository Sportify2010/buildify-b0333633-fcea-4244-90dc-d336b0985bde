
import React from 'react';

export const PaypalIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7.144 19.532l1.049-5.751c.11-.545.677-1.005 1.252-1.005h2.048c2.88 0 5.097-1.81 5.097-4.057 0-2.166-1.649-3.719-4.446-3.719H7.43c-.584 0-1.055.48-1.144 1.056L4.436 18.475c-.066.354.2.698.577.803.174.048.361.054.536.014l1.595-.184z" />
      <path d="M7.43 5h4.715c2.796 0 4.445 1.553 4.445 3.72 0 2.246-2.217 4.057-5.097 4.057H9.445c-.575 0-1.142.46-1.252 1.005l-1.049 5.751" />
      <path d="M13.5 9.001h-6" />
    </svg>
  );
};

export default PaypalIcon;
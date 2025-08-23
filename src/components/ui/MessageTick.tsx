import { messageStatus } from "@/types/message";

const CheckIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      // Apply base styles and any additional classes
      className={`w-4 h-4 inline-block ${className}`}
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
  
  export const MessageStatusTicks = ({ status }: { status: messageStatus }) => {
    if (status === "SENT") {
      // Single gray tick
      return <CheckIcon className="text-gray-400 transition-colors duration-300" />;
    }
  
    // For DELIVERED and READ, show two ticks
    const tickColor =
      status === "READ" ? "text-sky-300" : "text-gray-400";
  
    return (
      <div className="flex items-center">
        <CheckIcon className={`${tickColor} transition-colors duration-300`} />
        <CheckIcon className={`${tickColor} -ml-2.5 transition-colors duration-300`} />
      </div>
    );
  };
  
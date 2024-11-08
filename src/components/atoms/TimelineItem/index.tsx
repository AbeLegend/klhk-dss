import { HiCheckCircle } from "react-icons/hi";

interface TimelineItemProps {
  title: string;
  timestamp: string;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  timestamp,
  isLast = false,
}) => {
  return (
    <div className="flex items-center gap-x-4">
      {/* Icon and Line */}
      <div className="flex flex-col items-center relative">
        <HiCheckCircle className="w-6 h-6 text-[#43A047]" />
        {!isLast && (
          <div className="absolute -bottom-7 w-px h-5 bg-gray-300 mt-0" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
};

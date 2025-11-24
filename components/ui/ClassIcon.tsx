import Image from 'next/image';
import { ClassType } from '@/types';
import { CLASS_ICON_PATHS } from '@/utils/constants';

type ClassIconSize = 'small' | 'medium' | 'large';

interface ClassIconProps {
  className: ClassType;
  size?: ClassIconSize;
  showLabel?: boolean;
  labelClassName?: string;
}

const sizeMap = {
  small: { width: 16, height: 16, textSize: 'text-xs' },
  medium: { width: 24, height: 24, textSize: 'text-sm' },
  large: { width: 32, height: 32, textSize: 'text-base' }
};

export default function ClassIcon({
  className,
  size = 'medium',
  showLabel = false,
  labelClassName = ''
}: ClassIconProps) {
  const { width, height, textSize } = sizeMap[size];
  const iconPath = CLASS_ICON_PATHS[className];

  return (
    <div className="flex items-center gap-1.5">
      <Image
        src={iconPath}
        alt={`${className}のアイコン`}
        width={width}
        height={height}
        className="flex-shrink-0"
      />
      {showLabel && (
        <span className={`${textSize} ${labelClassName || 'text-slate-200'}`}>
          {className}
        </span>
      )}
    </div>
  );
}

import Avatar from '@/components/ui/avatar';
import cn from '@/utils/cn';
import { StaticImageData } from 'next/image';

type AuthorCardProps = {
  image: StaticImageData;
  name?: string;
  role?: string;
  onClick?: () => void;
};

export default function AuthorCard({
  image,
  name,
  role,
  onClick,
}: AuthorCardProps) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center rounded-lg p-4',
        name
          ? 'bg-gray-100   dark:bg-light-dark'
          : 'ml-3 justify-center bg-none dark:mr-3 dark:bg-none',
      )}
      onClick={onClick ? () => onClick() : undefined}
    >
      <Avatar
        image={image}
        alt={name ? name : ''}
        className="dark:border-gray-400"
      />
      <div className="ltr:pl-3 rtl:pr-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 dark:text-white">
          {name}
        </h3>
        <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">
          {role}
        </span>
      </div>
    </div>
  );
}

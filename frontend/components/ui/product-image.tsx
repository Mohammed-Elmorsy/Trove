import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, className, priority = false }: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn('object-cover transition-transform duration-300 ease-out', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading={priority ? undefined : 'lazy'}
      priority={priority}
    />
  );
}

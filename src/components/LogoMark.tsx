import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function LogoMark({
  alt = "ZOR logo",
  className,
  imageClassName,
  priority = false,
  sizes = "3rem",
}: LogoMarkProps) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden bg-white", className)}>
      <Image
        alt={alt}
        className={cn("h-full w-full object-contain", imageClassName)}
        fill
        priority={priority}
        sizes={sizes}
        src="/brand/zor-icon.png"
      />
    </span>
  );
}

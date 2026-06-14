import Image from "next/image";
import { cn } from "@/lib/utils";

type VisualFrameProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function VisualFrame({
  src,
  alt,
  caption,
  priority = false,
  className,
}: VisualFrameProps) {
  return (
    <div
      className={cn(
        "relative min-h-[320px] w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-zor-soft",
        "sm:min-h-[420px] lg:min-h-[540px]",
        className,
      )}
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 48vw, 100vw"
        src={src}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_44%,rgba(6,36,75,0.16))]" />
      {caption ? (
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/45 bg-white/76 px-4 py-3 text-sm font-medium text-zor-blue-deep shadow-sm backdrop-blur">
          {caption}
        </div>
      ) : null}
    </div>
  );
}

import Image from "next/image";

import { BRAND_LOGO_URL } from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  /** CSS height in px; width scales with aspect ratio */
  height?: number;
};

export function BrandLogo({
  className,
  priority,
  height = 44,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO_URL}
      alt="Troymintos Properties — Home is where your story begins"
      width={280}
      height={112}
      priority={priority}
      className={className}
      style={{ height, width: "auto", maxWidth: "min(100%, 280px)" }}
    />
  );
}

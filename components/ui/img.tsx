import type { ImgHTMLAttributes } from "react";

/**
 * Single place that renders remote images. Swap the body for next/image
 * (and add the host to next.config `images.remotePatterns`) when the API is live.
 */
export function Img({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement> & { alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading="lazy" decoding="async" {...props} />;
}

import React, { useEffect, useState } from 'react';

/**
 * @interface SvgIconProps
 * @description Defines props for the `SvgIcon` component.
 * @property src The source URL of the SVG file.
 * @property preserveColors If true, preserves the original colors of the SVG. Defaults to false (applies `currentColor` to fill).
 * @property width Optional width for the SVG.
 * @property height Optional height for the SVG.
 */
interface SvgIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  src: string;
  preserveColors?: boolean;
  width?: string | number;
  height?: string | number;
}

/**
 * @component SvgIcon
 * @description A component to fetch and render an SVG icon. It can optionally preserve original colors or apply `currentColor` for dynamic styling. It also sanitizes SVG content by removing script tags and applies width/height props.
 */
const SvgIcon: React.FC<SvgIconProps> = ({ src, className, preserveColors = false, width, height, ...props }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to fetch SVG: ${response.statusText}`);
        }
        const text = await response.text();
        let sanitizedText = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        try {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(sanitizedText, "image/svg+xml");
          const svgElement = svgDoc.documentElement;
          const parserError = svgElement.querySelector('parsererror');

          if (parserError) {
            console.error('Error parsing SVG:', parserError.textContent);
            setSvgContent(sanitizedText);
            return;
          }

          if (svgElement instanceof Element) {
            if (width) {
              svgElement.setAttribute('width', String(width));
            }
            if (height) {
              svgElement.setAttribute('height', String(height));
            }

            let hasSizeClass = false;
            for (let i = 0; i < svgElement.classList.length; i++) {
              if (svgElement.classList[i].startsWith('size-')) {
                hasSizeClass = true;
                break;
              }
            }
            if (!hasSizeClass) {
              svgElement.classList.add('size-from-svgicon-props');
            }

            if (!preserveColors) {
              const unsetAttributes = (el: Element) => {
                el.removeAttribute('fill');
                el.removeAttribute('stroke');
                Array.from(el.children).forEach(child => unsetAttributes(child as Element));
              };
              unsetAttributes(svgElement);
              svgElement.setAttribute('fill', 'currentColor');
            }
            // Always serialize back after modifications or just after parsing if preserveColors is true
            const serializer = new XMLSerializer();
            sanitizedText = serializer.serializeToString(svgElement);
            setSvgContent(sanitizedText);

          } else {
            // Fallback if svgElement is not an Element (e.g., parse error resulted in DocumentFragment)
            setSvgContent(sanitizedText); // Use the script-sanitized version
          }
        } catch (parseOrModifyError) {
          console.error('Could not parse or modify SVG:', parseOrModifyError);
          // Fallback to the script-sanitized text if DOM manipulation fails
          setSvgContent(sanitizedText);
        }
      } catch (fetchErr) {
        console.error(`Error fetching SVG: ${src}`, fetchErr);
        setError(fetchErr instanceof Error ? fetchErr.message : 'Failed to load SVG');
        setSvgContent(null);
      }
    };

    fetchSvg();
  }, [src, preserveColors, width, height]); // Added width and height to dependency array

  if (error) {
    return <span className={className} style={{ display: 'inline-block', width: width || '16px', height: height || '16px', color: 'red' }} title={error}>⚠️</span>;
  }

  if (!svgContent) {
    return <span className={className} style={{ display: 'inline-block', width: width || '16px', height: height || '16px' }} />;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{ display: 'inline-flex', width, height, alignItems: 'center', justifyContent: 'center', ...props.style }}
      {...props}
    />
  );
};

export default SvgIcon; 
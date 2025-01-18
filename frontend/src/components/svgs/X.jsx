/*
 * A reusable Svg component for rendering a cross icon.
 *
 * This code defines a React component named XSvg that renders an SVG (Scalable Vector Graphics) icon.
 * The icon is defined by a single path element with a complex d attribute that specifies the shape of the icon.
 * The aria-hidden attribute is set to true to indicate that the icon is purely decorative and should not be announced by screen readers.
 * The viewBox attribute sets the coordinate system for the SVG. The component accepts any additional props ({...props}) to allow for customization.
 *
 * @type {React.FC<React.SVGProps<SVGSVGElement>>}
 */
const XSvg = (props) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
export default XSvg;

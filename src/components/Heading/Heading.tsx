import "./Heading.scss";

interface HeadingProps {
  connected: boolean;
}

export const Heading = ({ connected }: HeadingProps) => {
  const slowWormUnicode = "\uE599";
  return (
    <div
      className={`slowworm-heading ${
        connected ? "slowworm-heading--connected" : ""
      }`}
    >
      <span className="slowworm-heading-icon">{slowWormUnicode}</span>
      low Worm
    </div>
  );
};

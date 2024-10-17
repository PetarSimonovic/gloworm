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
      Slo
      <span className="slowworm-heading-icon slowworm-heading-icon--face-right">
        {slowWormUnicode}
      </span>
      <span className="slowworm-heading-icon slowworm-heading-icon--face-left">
        {slowWormUnicode}
      </span>
      orm
    </div>
  );
};

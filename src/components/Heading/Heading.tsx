import "./Heading.scss";

interface HeadingProps {
  connected: boolean;
}

export const Heading = ({ connected }: HeadingProps) => {
  const glowWormUnicode = "\uE599";
  return (
    <div
      className={`glowworm-heading ${
        connected ? "glowworm-heading--connected" : ""
      }`}
    >
      Glo
      <span className="glowworm-heading-icon glowworm-heading-icon--face-right">
        {glowWormUnicode}
      </span>
      <span className="glowworm-heading-icon glowworm-heading-icon--face-left">
        {glowWormUnicode}
      </span>
      orm
    </div>
  );
};

import "./Heading.scss";

interface HeadingProps {
  connected: boolean;
}

export const Heading = ({ connected }: HeadingProps) => {
  const glowormUnicode = "\uE599";
  return (
    <div
      className={`gloworm-heading ${
        connected ? "gloworm-heading--connected" : ""
      }`}
    >
      Glo
      <span className="gloworm-heading-icon gloworm-heading-icon--face-right">
        {glowormUnicode}
      </span>
      <span className="gloworm-heading-icon gloworm-heading-icon--face-left">
        {glowormUnicode}
      </span>
      orm
    </div>
  );
};

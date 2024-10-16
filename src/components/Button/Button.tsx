import "./Button.scss";

interface ButtonProps {
  onClick: () => void;
  connected: boolean;
  label: string;
}

export const Button = ({ onClick, label, connected }: ButtonProps) => {
  return (
    <button
      className={`slowworm-button ${
        connected ? "slowworm-button--connected" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

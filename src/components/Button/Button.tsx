import "./Button.scss";

interface ButtonProps {
  onClick: () => void;
  connected: boolean;
  label: string;
}

export const Button = ({ onClick, label, connected }: ButtonProps) => {
  return (
    <button
      className={`glowworm-button ${
        connected ? "glowworm-button--connected" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

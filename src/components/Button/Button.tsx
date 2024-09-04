import "./Button.scss";

interface ButtonProps {
  onClick: () => void;
  label: string;
}

export const Button = ({ onClick, label }: ButtonProps) => {
  return (
    <button className="slowworm-button" onClick={onClick}>
      {label}
    </button>
  );
};

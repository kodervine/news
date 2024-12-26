/**
 * Button component with customizable properties.
 * @param onClick - Function to be executed on button click.
 * @param type - Type of the button (e.g., 'button', 'submit', 'reset').
 * @param text - Text content to be displayed on the button.
 */

interface ButtonProps {
  onClick: () => void;
  type: 'button' | 'submit' | 'reset';
  text: string;
}
const Button = ({ onClick, type, text }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className="bg-green-100 text-teal-800 px-5 py-2 rounded-lg"
    >
      {text}
    </button>
  );
};

export default Button;

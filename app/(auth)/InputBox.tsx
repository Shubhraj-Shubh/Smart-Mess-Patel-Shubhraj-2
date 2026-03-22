
import { Input } from "@/components/ui/input";
interface InputBoxProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
  name,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className="px-4 py-3 h-auto text-black text-base placeholder:text-gray-400 placeholder:font-semibold focus:font-semibold"
      />
    </>
  );
};

export default InputBox;
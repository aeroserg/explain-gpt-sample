import { FC } from "react";

interface SocialIconProps {
  name: string;
  onClick?: () => void;
}

export const SocialIcon: FC<SocialIconProps> = ({ name, onClick }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 flex items-center justify-center bg-[#3D7EFF] rounded-lg text-white font-bold text-2xl"
  >
    {name.charAt(0)}
  </button>
); 
import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "primary" | "secondary" | "danger";
  variant?: "normal" | "pill" | "rounded";
}

export const Button = ({
  className,
  children,
  variant = "normal",
  color = "primary",
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        "w-full h-[44px] flex items-center justify-center font-normal text-[14px] rounded-[8px] base-transition",
        {
          "bg-blue-600 hover:bg-blue-700 text-white":
            color === "primary" && !disabled,
        },
        {
          "bg-[#B5CEFF] text-white pointer-events-none":
            color === "primary" && disabled,
        },
        {
          "bg-white border border-[#3D7EFF] text-[#3D7EFF] hover:bg-gray-100":
            color === "secondary",
        },
        {
          "bg-[#FF3D40] text-white": color === "danger",
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

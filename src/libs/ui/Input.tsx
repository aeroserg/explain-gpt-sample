import classNames from "classnames";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, success, icon, ...rest }, ref) => {
    const hasIcon = !!icon;

    return (
      <div className="w-full">
        <div className="relative">
        <input
            className={classNames(
              "w-full h-[40px] p-[10px] border rounded-[8px] bg-white text-[#2B2B2B] focus:outline-none focus:border-[#3D7EFF]",
              { "pr-[40px]": hasIcon },
              {
                "border-[#3D7EFF] placeholder:text-[#93B7FF]":
                  !error && !success,
                "border-red-500 placeholder:text-red-500": error,
                "border-green-500": success,
              },
              className
            )}
          ref={ref}
          {...rest}
        />
          {icon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {error && error.trim() && (
          <p className="text-red-500 text-[12px] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

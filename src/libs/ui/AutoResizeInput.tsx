import classNames from "classnames";
import { useRef, useEffect, InputHTMLAttributes } from "react";

export const AutoResizeInput = (
  props: InputHTMLAttributes<HTMLTextAreaElement>
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { value, onChange, className, placeholder, ...rest } = props;

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!value && textarea) {
      textarea.style.height = "22px";
      return;
    }
    if (textarea) {
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = "auto";

      textarea.style.height = `${scrollHeight > 22 ? scrollHeight : 22}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <textarea
      className={classNames(
        "w-full text-[12px] resize-none overflow-hidden outline-none bg-background placeholder:text-blue-gray-light",
        className
      )}
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      {...rest}
    />
  );
};

export default AutoResizeInput;

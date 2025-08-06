import classNames from "classnames";

export const Divider = ({ className }: { className?: string }) => {
  return <div className={classNames("h-[1px] bg-blue-gray-lighter w-full", className)} />;
};

import { cn } from "@/libs/utils/shadcnUtils"

export interface LoaderProps {
  variant?:
    | "circular"
    | "classic"
    | "pulse"
    | "pulse-dot"
    | "dots"
    | "typing"
    | "wave"
    | "bars"
    | "terminal"
    | "text-blink"
    | "text-shimmer"
    | "loading-dots"
  size?: "xsm" | "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function CircularLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    xsm: "size-3",
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <div
      className={cn(
        "border-primary animate-spin rounded-full border-2 border-t-transparent",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function ClassicLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    xsm: "size-3",
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  const barSizes = {
    xsm: { height: "5px", width: "1.25px" },
    sm: { height: "6px", width: "1.5px" },
    md: { height: "8px", width: "2px" },
    lg: { height: "10px", width: "2.5px" },
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute h-full w-full">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-primary absolute animate-[spinner-fade_1.2s_linear_infinite] rounded-full"
            style={{
              top: "0",
              left: "50%",
              marginLeft:
                size === "xsm" ? "-0.625px" : size === "sm" ? "-0.75px" : size === "lg" ? "-1.25px" : "-1px",
              transformOrigin: `${size === "xsm" ? "0.625px" : size === "sm" ? "0.75px" : size === "lg" ? "1.25px" : "1px"} ${size === "xsm" ? "8px" : size === "sm" ? "10px" : size === "lg" ? "14px" : "12px"}`,
              transform: `rotate(${i * 30}deg)`,
              opacity: 0,
              animationDelay: `${i * 0.1}s`,
              height: barSizes[size].height,
              width: barSizes[size].width,
            }}
          />
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function PulseLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    xsm: "size-3",
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="border-primary absolute inset-0 animate-[thin-pulse_1.5s_ease-in-out_infinite] rounded-full border-2" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function PulseDotLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    xsm: "size-0.5",
    sm: "size-1",
    md: "size-2",
    lg: "size-3",
  };

  return (
    <div
      className={cn(
        "bg-primary animate-[pulse-dot_1.2s_ease-in-out_infinite] rounded-full",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function DotsLoader({
  className,
  size = "md",
}: {
  className?: string
  size?: "xsm" | "sm" | "md" | "lg"
}) {
  const dotSizes = {
    xsm: "h-0.5 w-0.5",
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  }

  const containerSizes = {
    xsm: "h-2",
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-1",
        size === "xsm" && "space-x-0.5",
        containerSizes[size],
        className
      )}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-current animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full",
            dotSizes[size]
          )}
          style={{
            animationDelay: `${i * 160}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function TypingLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const dotSizes = {
    xsm: "h-0.5 w-0.5",
    sm: "h-1 w-1",
    md: "h-1.5 w-1.5",
    lg: "h-2 w-2",
  };

  const containerSizes = {
    xsm: "h-2",
    sm: "h-3",
    md: "h-4",
    lg: "h-5",
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-1",
        containerSizes[size],
        className
      )}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary animate-[typing_1s_infinite] rounded-full",
            dotSizes[size]
          )}
          style={{
            animationDelay: `${i * 250}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function WaveLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const barSizes = {
    xsm: "w-0.5",
    sm: "w-1",
    md: "w-1",
    lg: "w-1.5",
  };
  const containerSizes = {
    xsm: "h-3",
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  };

  const heights = {
    sm: ["h-2.5", "h-4", "h-2.5"],
    md: ["h-3", "h-5", "h-3"],
    lg: ["h-4", "h-6", "h-4"],
    xsm: ["h-2", "h-3", "h-2"],
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        containerSizes[size],
        className
      )}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary animate-[wave_1s_ease-in-out_infinite] rounded-full",
            barSizes[size]
          )}
          style={{
            animationDelay: `${i * 100}ms`,
            height: heights[size][i],
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function BarsLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const barSizes = {
    xsm: "w-0.5",
    sm: "w-1",
    md: "w-1",
    lg: "w-1.5",
  };
  const containerSizes = {
    xsm: "h-3",
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  };

  return (
    <div className={cn("flex", containerSizes[size], className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary h-full animate-[wave-bars_1.2s_ease-in-out_infinite]",
            barSizes[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}

export function TerminalLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const textSizes = {
    xsm: "text-[0.5rem]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  const containerSizes = {
    xsm: "h-4",
    sm: "h-5",
    md: "h-6",
    lg: "h-7",
  };
   const cursorSizes = {
    xsm: "h-2.5 w-1.5",
    sm: "h-3 w-1.5",
    md: "h-4 w-2",
    lg: "h-5 w-2.5",
  };

  return (
    <div
      className={cn(
        "bg-primary-foreground text-primary flex items-center justify-center font-mono",
        containerSizes[size],
        textSizes[size],
        className
      )}
    >
      <span className="mr-1">Loading</span>
      <div
        className={cn(
          "bg-current animate-[terminal-cursor_1s_step-end_infinite]",
          cursorSizes[size]
        )}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TextBlinkLoader({
  text = "Thinking",
  className,
  size = "md",
}: {
  text?: string;
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const textSizes = {
    xsm: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "animate-[text-blink_2s_ease-in-out_infinite] font-medium",
        textSizes[size],
        className
      )}
    >
      {text}
    </div>
  )
}

export function TextShimmerLoader({
  text = "Thinking",
  className,
  size = "md",
}: {
  text?: string;
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const textSizes = {
    xsm: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)]",
        "bg-size-[200%_auto] bg-clip-text font-medium text-transparent",
        "animate-[shimmer_4s_infinite_linear]",
        textSizes[size],
        className
      )}
    >
      {text}
    </div>
  )
}

export function TextDotsLoader({
  className,
  text = "Thinking",
  size = "md",
}: {
  className?: string;
  text?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}) {
  const textSizes = {
    xsm: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <p className={cn(textSizes[size])}>{text}</p>
      <div className="ml-1 flex items-center space-x-0.5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full bg-current",
              size === "lg" && "size-1.5",
              size === "md" && "size-1",
              size === "sm" && "size-0.5",
              size === "xsm" && "size-0.5"
            )}
            style={{
              animationDelay: `${i * 160}ms`,
            }}
          />
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

function Loader({
  variant = "circular",
  size = "md",
  text,
  className,
}: LoaderProps) {
  const sizeProp = { size: size }
  const textProp = { text: text }
  const classNameProp = { className: className }

  const componentMap = {
    circular: <CircularLoader {...sizeProp} {...classNameProp} />,
    classic: <ClassicLoader {...sizeProp} {...classNameProp} />,
    pulse: <PulseLoader {...sizeProp} {...classNameProp} />,
    "pulse-dot": <PulseDotLoader {...sizeProp} {...classNameProp} />,
    dots: <DotsLoader {...sizeProp} {...classNameProp} />,
    typing: <TypingLoader {...sizeProp} {...classNameProp} />,
    wave: <WaveLoader {...sizeProp} {...classNameProp} />,
    bars: <BarsLoader {...sizeProp} {...classNameProp} />,
    terminal: <TerminalLoader {...sizeProp} {...classNameProp} />,
    "text-blink": <TextBlinkLoader {...sizeProp} {...textProp} {...classNameProp} />,
    "text-shimmer": (
      <TextShimmerLoader {...sizeProp} {...textProp} {...classNameProp} />
    ),
    "loading-dots": (
      <TextDotsLoader {...sizeProp} {...textProp} {...classNameProp} />
    ),
  }

  return componentMap[variant] || null
}

export { Loader }

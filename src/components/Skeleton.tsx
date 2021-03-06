interface SkeletonProps {
  children?: React.ReactNode;
  isLoaded?: boolean;
  isError?: boolean;
  className?: string;
  variant?: "default" | "list" | "circle";
}

interface SkeletonTextProps extends SkeletonProps {
  fontStyles?: string;
  errorFontStyles?: string;
}

export const SkeletonText = ({
  children,
  isLoaded = false,
  isError = false,
  fontStyles,
  errorFontStyles,
  className,
}: SkeletonTextProps) => {
  if (isError) {
    return <p className={errorFontStyles}>Error loading content</p>;
  }
  if (isLoaded) {
    return <p className={fontStyles}>{children}</p>;
  }

  return (
    <div
      className={`h-4 w-full rounded-full bg-champagne animate-pulse ${className}`}
    />
  );
};

export const Skeleton = ({
  children,
  isLoaded = false,
  isError = false,
  className,
  variant = "default",
}: SkeletonProps) => {
  if (isLoaded) {
    return <div>{children}</div>;
  }

  if (variant === "list") {
    return (
      <div className="flex flex-col w-full">
        <div
          className={`rounded-xl w-full bg-champagne animate-pulse ${className}`}
        />
        <div
          className={`rounded-xl w-full bg-champagne animate-pulse ${className}`}
        />
        <div
          className={`rounded-xl w-full bg-champagne animate-pulse ${className}`}
        />
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <div className={`rounded-full bg-champagne animate-pulse ${className}`} />
    );
  }

  return (
    <div className={`rounded-xl bg-champagne animate-pulse ${className}`} />
  );
};

export function Card({ className = "", ...props }) {
  return (
    <div
      className={
        "rounded-xl border border-slate-800 bg-slate-900/40 text-slate-100 " +
        className
      }
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div
      className={"flex flex-col space-y-1.5 p-4 md:p-5 " + className}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3
      className={
        "text-base md:text-sm font-semibold leading-none tracking-tight " +
        className
      }
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }) {
  return (
    <p
      className={"text-xs md:text-sm text-slate-400 " + className}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={"p-4 md:p-5 pt-0 " + className} {...props} />;
}


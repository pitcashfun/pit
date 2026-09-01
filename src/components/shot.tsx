export function Shot({
  src,
  kicker,
  title,
  tall,
  align = "left",
}: {
  src: string;
  kicker?: string;
  title?: string;
  tall?: boolean;
  align?: "left" | "right";
}) {
  const right = align === "right";
  return (
    <section className="relative overflow-hidden rounded-2xl bg-night">
      <img
        src={src}
        alt=""
        className={tall ? "h-72 w-full object-cover sm:h-[26rem]" : "h-52 w-full object-cover sm:h-72"}
      />
      <div
        className={
          right
            ? "pointer-events-none absolute inset-0 bg-gradient-to-l from-night/80 via-night/20 to-transparent"
            : "pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-transparent"
        }
      />
      {title ? (
        <div
          className={
            right
              ? "absolute bottom-5 right-5 max-w-md text-right sm:bottom-8 sm:right-8"
              : "absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7"
          }
        >
          {kicker ? (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{kicker}</p>
          ) : null}
          <h1 className="font-display text-4xl font-black italic leading-none text-white sm:text-6xl">{title}</h1>
        </div>
      ) : null}
    </section>
  );
}

export function Shot({
  src,
  kicker,
  title,
  tall,
}: {
  src: string;
  kicker?: string;
  title?: string;
  tall?: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-night">
      <img
        src={src}
        alt=""
        className={tall ? "h-72 w-full object-cover sm:h-[26rem]" : "h-52 w-full object-cover sm:h-72"}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-transparent" />
      {title ? (
        <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
          {kicker ? (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{kicker}</p>
          ) : null}
          <h1 className="font-display text-4xl font-black italic leading-none text-white sm:text-6xl">{title}</h1>
        </div>
      ) : null}
    </section>
  );
}

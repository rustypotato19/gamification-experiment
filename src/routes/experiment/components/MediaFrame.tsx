type Props = {
  src: string;
  alt?: string;
};

export default function MediaFrame({ src, alt }: Props) {
  return (
    <div
      className="
      w-full
      max-w-2xl
      mx-auto
      flex
      items-center
      justify-center
      overflow-hidden
      rounded-xl
      bg-slate-100
      p-2
    "
    >
      <img
        src={src}
        alt={alt ?? "media"}
        className="
        w-full
        max-h-48 sm:max-h-72
        object-contain
        rounded-lg
      "
      />
    </div>
  );
}

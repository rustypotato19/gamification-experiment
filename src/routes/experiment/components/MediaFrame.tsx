type Props = {
  src: string;
  alt?: string;
};

export default function MediaFrame({ src, alt }: Props) {
  return (
    <div
      className="
        w-full
        max-w-3xl
        mx-auto
        flex
        items-center
        justify-center
        min-w-0
        overflow-hidden
        rounded-xl
        bg-slate-100
        p-2 sm:p-3
      "
    >
      <img
        src={src}
        alt={alt ?? "media"}
        className="
          w-full
          h-auto
          max-h-56 sm:max-h-72
          object-contain
          rounded-lg
        "
      />
    </div>
  );
}

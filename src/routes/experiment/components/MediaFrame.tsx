type Props = {
  src: string;
  alt?: string;
};

export default function MediaFrame({ src, alt }: Props) {
  return (
    <div
      className="
      w-full
      max-w-130
      h-55 sm:h-70
      flex
      items-center
      justify-center
      overflow-hidden
      rounded-xl
      bg-slate-100
    "
    >
      <img
        src={src}
        alt={alt ?? "media"}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}

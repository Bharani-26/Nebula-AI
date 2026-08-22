import cosmos1 from "@/assets/cosmos-1.jpg";

export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cosmos">
      <img
        src={cosmos1}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
    </div>
  );
}

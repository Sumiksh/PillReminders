"use client";

export default function VisualPillId({ data }) {
  if (!data) return null;

  // Logic to determine CSS shape
  const shapeClass = data.shape?.toLowerCase().includes("round") 
    ? "rounded-full w-16 h-16" 
    : "rounded-2xl w-24 h-12";

  // Logic for the color (handles RxNav multi-color strings like "WHITE;BLUE")
  const primaryColor = data.color?.split(";")[0].toLowerCase() || "zinc";
  
  // Custom color mapping for common pill colors
  const colorMap = {
    white: "bg-zinc-100",
    blue: "bg-blue-500",
    pink: "bg-pink-400",
    yellow: "bg-yellow-400",
    green: "bg-emerald-500",
    peach: "bg-orange-300",
    lavender: "bg-purple-300",
    zinc: "bg-zinc-700"
  };

  const bgColor = colorMap[primaryColor] || "bg-zinc-700";

  return (
    <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 group">
      {/* 3D Pill Visual */}
      <div className="flex flex-col items-center gap-3">
        <div 
          className={`${shapeClass} ${bgColor} border-2 border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-transform duration-500 group-hover:scale-110`}
        >
          {data.imprint !== "N/A" && (
            <span className="text-[10px] font-black text-black/40 uppercase tracking-tighter rotate-12 select-none">
              {data.imprint}
            </span>
          )}
        </div>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
          {data.shape}
        </span>
      </div>

      {/* Text Data */}
      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Physical Verification</h4>
          <p className="text-xl font-bold text-white italic leading-snug">
            "{data.visualDescription}"
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <div className="px-3 py-1 bg-black/40 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 uppercase">
            Color: <span className="text-zinc-200">{data.color}</span>
          </div>
          <div className="px-3 py-1 bg-black/40 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 uppercase">
            Imprint: <span className="text-zinc-200">{data.imprint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// --- Place your PNG/JPG URLs here ---
const sliderImages = [
  "/assets/img1.jpg",
  "/assets/img2.jpg",
  "/assets/img3.jpg",
  "/assets/img4.jpg",
  "/assets/img5.jpg"
];

export default function Home() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Netflix-style snap-hold-slide effect
  useEffect(() => {
    let showTimeout, animateTimeout;
    showTimeout = setTimeout(() => {
      setAnimating(true);
      animateTimeout = setTimeout(() => {
        setAnimating(false);
        setIndex((prev) => (prev + 1) % sliderImages.length);
      }, 700); // Slide animation duration
    }, 2000); // Hold duration
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(animateTimeout);
    };
  }, [index]);

  const features = [
    {
      title: "AI-Powered Matching",
      desc: "Advanced algorithm matches you with schemes.",
      image: "https://img.icons8.com/fluency/48/000000/artificial-intelligence.png",
    },
    {
      title: "Multilingual Support",
      desc: "Assistance in multiple languages.",
      image: "https://img.icons8.com/fluency/48/000000/language.png",
    },
    {
      title: "Secure & Private",
      desc: "Your data is encrypted and safe.",
      image: "https://img.icons8.com/fluency/48/000000/lock.png",
    },
    {
      title: "Real-time Updates",
      desc: "Stay updated with latest schemes.",
      image: "https://img.icons8.com/fluency/48/000000/clock.png",
    },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle animated background canvas */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-400 to-orange-700 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-800 to-amber-900 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="w-full bg-gradient-to-r from-orange-700 to-amber-600 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-lg shadow-orange-900/30">
          <div className="text-white font-bold text-3xl tracking-tight">FinWise</div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 bg-white text-orange-700 font-semibold rounded-xl shadow-md hover:bg-orange-50 hover:scale-105 transition-all duration-300 border-2 border-orange-300 hover:border-orange-500"
              onClick={() => router.push("/voice")}>
              Speak Your Query
            </button>
            <button className="px-6 py-2.5 bg-white text-orange-700 font-semibold rounded-xl shadow-md hover:bg-orange-50 hover:scale-105 transition-all duration-300 border-2 border-orange-300 hover:border-orange-500"
              onClick={() => router.push("/upload")}>
              Upload Documents
            </button>
            <button className="px-6 py-2.5 bg-white text-orange-700 font-semibold rounded-xl shadow-md hover:bg-orange-50 hover:scale-105 transition-all duration-300 border-2 border-orange-300 hover:border-orange-500"
              onClick={() => router.push("/form")}>
              Proceed to Form
            </button>
          </div>
        </div>

        <div className="py-15 px-4 text-white max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-6 mb-10 ml-24">
            <div className="ml-10">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mb-4">
                FinWise
              </h1>
              <p className="text-xl text-gray-200 mb-2 font-light tracking-wide">AI Powered Financial Scheme Advisor</p>
              <p className="text-lg text-gray-400 font-medium">Discover Government Schemes You Qualify For</p>
            </div>
            
            {/* Enhanced Carousel with softer shadows */}
            <div className="w-[550px] h-[340px] flex items-center justify-end relative overflow-hidden rounded-2xl bg-transparent ml-20" style={{
              perspective: "1200px"
            }}>
              <div
                className="absolute left-0 top-0 h-full w-full"
                style={{
                  transition: animating ? "transform 0.7s cubic-bezier(.55,.06,.68,.19)" : "none",
                  transform: animating ? "translateX(-100%) rotateY(-10deg) scale(0.96)" : "translateX(0) rotateY(0deg) scale(1)",
                  boxShadow: "0 15px 35px -8px rgba(255, 140, 0, 0.25), 0 8px 20px -10px rgba(0, 0, 0, 0.6)",
                  willChange: "transform"
                }}
              >
                <img
                  src={sliderImages[index]}
                  alt={`slide${index + 1}`}
                  className="w-[520px] h-[320px] object-contain rounded-2xl"
                  style={{
                    margin: "0 auto",
                    boxShadow: "0 12px 30px rgba(255, 140, 0, 0.2), 0 6px 15px rgba(50, 50, 50, 0.2)",
                    border: "2px solid rgba(255, 165, 0, 0.5)",
                    filter: "brightness(1.05) contrast(1.1)",
                  }}
                />
              </div>
              <div
                className="absolute left-0 top-0 h-full w-full"
                style={{
                  pointerEvents: "none",
                  transition: animating ? "transform 0.7s cubic-bezier(.55,.06,.68,.19)" : "none",
                  transform: animating ? "translateX(0) rotateY(0deg) scale(1)" : "translateX(100%) rotateY(10deg) scale(0.96)",
                  boxShadow: "0 15px 35px -8px rgba(255, 140, 0, 0.25), 0 8px 20px -10px rgba(0, 0, 0, 0.6)",
                  willChange: "transform"
                }}
              >
                <img
                  src={sliderImages[(index + 1) % sliderImages.length]}
                  alt={`slide${((index + 1) % sliderImages.length) + 1}`}
                  className="w-[520px] h-[320px] object-contain rounded-2xl"
                  style={{
                    margin: "0 auto",
                    boxShadow: "0 12px 30px rgba(255, 140, 0, 0.2), 0 6px 15px rgba(50, 50, 50, 0.2)",
                    border: "2px solid rgba(255, 165, 0, 0.5)",
                    filter: "brightness(1.05) contrast(1.1)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cards with softer shadows and dimmed effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 mt-12">
            {features.map((f, i) => (
              <div
                key={i}
                className="relative group cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <div
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-500 group-hover:scale-[1.03] border-2 border-amber-700/20 group-hover:border-amber-400/40 relative overflow-hidden"
                  style={{
                    boxShadow: "0 12px 25px rgba(255, 140, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                    transform: "rotateY(-3deg) scale(1.01)",
                    minHeight: "220px"
                  }}
                >
                  {/* Subtle animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/3 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2 transition-all duration-500 group-hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, rgba(255, 140, 0, 0.08), rgba(255, 165, 0, 0.15))",
                        boxShadow: "0 6px 18px rgba(255, 140, 0, 0.15), 0 3px 10px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        border: "1.5px solid rgba(255, 165, 0, 0.3)"
                      }}
                    >
                      <img
                        src={f.image}
                        alt={f.title}
                        className="w-12 h-12 object-contain"
                        style={{
                          filter: "brightness(1.1) drop-shadow(0 1px 2px rgba(255, 140, 0, 0.2))"
                        }}
                      />
                    </div>
                    
                    <h3 className="font-bold text-xl bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent text-center mb-3">
                      {f.title}
                    </h3>
                    <p className="text-gray-300 text-center text-sm leading-relaxed font-medium group-hover:text-gray-100 transition-colors duration-300">
                      {f.desc}
                    </p>
                  </div>

                  {/* Subtle hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: "0 0 25px 5px rgba(255, 140, 0, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.05)",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
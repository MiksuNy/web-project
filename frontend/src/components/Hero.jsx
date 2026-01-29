import { FaHandsHelping, FaUsers } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-gray-700 text-white px-10 py-16 flex items-center justify-between">
      
      <div className="max-w-xl z-10">
        <h2 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-white">HelpConnect</span>
        </h2>

        <p className="text-lg opacity-90 mb-8">
          Join our community where neighbors help neighbors.
        </p>

        <div className="flex gap-10">
          <div className="flex items-center gap-3">
            <FaUsers className="text-2xl" />
            <div>
              <p className="text-2xl font-semibold">1,200+</p>
              <span className="text-sm opacity-80">Community Members</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaHandsHelping className="text-2xl" />
            <div>
              <p className="text-2xl font-semibold">500+</p>
              <span className="text-sm opacity-80">Connections Made</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/20" />

        <div className="relative w-40 h-40 rounded-full bg-white/30 flex items-center justify-center">
          <img src="/logo.svg" alt="HelpConnect logo" className="w-20 h-20" />
        </div>
      </div>
    </section>
  );
};

export default Hero;


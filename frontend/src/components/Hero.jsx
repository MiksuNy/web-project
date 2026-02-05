import { FaHandsHelping, FaUsers } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-green-600 via-green-500 to-gray-700 text-white px-10 py-16 mx-auto mt-6 flex items-center justify-between  max-w-5xl">

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

      <div className="absolute -right-15 w-lg h-128 rounded-full bg-white/10 flex items-center justify-center">
        <div className="relative w-96 h-96 rounded-full bg-white/20 flex items-center justify-center">
          <div className="relative w-72 h-72 rounded-full bg-white/30 flex items-center justify-center">
            <img src="/logo-white.svg" alt="HelpConnect logo" className="w-48 h-48" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


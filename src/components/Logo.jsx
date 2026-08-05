import logo from "../assets/logo.png";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Logo Wrapper */}
      <div className="flex-shrink-0 flex items-center">
        <img
          src={logo}
          alt="Logo"
          /* Mobile: w-10 (40px) | Desktop: md:w-16 (64px) */
          className="w-10 h-10 md:w-16 md:h-16 object-contain"
        />
      </div>

      {/* Text Wrapper */}
      {/* Mobile: -mt-3 to match smaller logo | Desktop: md:-mt-5 */}
      <div className="flex flex-col justify-center -mt-3 md:-mt-5">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-none">
          Study Vault
        </h1>
        <p className="text-[8px] md:text-[10px] text-gray-400 font-medium mt-0.5 md:mt-1 uppercase tracking-wider">
          Your Academic Success Partner
        </p>
      </div>
    </div>
  );
}
// burger button component on navbar for mobile view
export default function BurgerButton({  onClick }) {
  return (
    <button
    onClick={onClick}
    className="group flex h-10 w-10 flex-col items-center justify-center gap-1.5 p-2 focus:outline-none md:hidden"
    aria-label="Toggle menu">
      <span className={`block h-0.5 w-6 origin-center bg-[#2f6a8f] transition-[transform,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus:translate-y-2 group-focus:rotate-45`}></span>
      <span className={`block h-0.5 w-6 origin-center bg-[#2f6a8f] transition-[transform,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus:opacity-0`}></span>
      <span className={`block h-0.5 w-6 origin-center bg-[#2f6a8f] transition-[transform,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus:-translate-y-2 group-focus:-rotate-45`}></span>
    </button>
  )
};
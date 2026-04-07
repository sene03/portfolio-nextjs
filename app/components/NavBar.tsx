"use client";

const NAV_ITEMS = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
] as const;

export function NavBar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <button
          onClick={() => scrollTo("about")}
          className="text-sm font-semibold tracking-tight text-zinc-950 transition hover:text-zinc-500"
        >
          남인서
        </button>
        <nav className="flex items-center gap-5 sm:gap-7">
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-xs font-medium text-zinc-500 transition hover:text-zinc-950 sm:text-sm"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

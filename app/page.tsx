import { experiences, profile, projects, skillGroups } from "./data/portfolio";
import { NavBar } from "./components/NavBar";
import { ProjectsSection } from "./components/ProjectsSection";
import { ChatWidget } from "./components/ChatWidget";

const maxSkillCount = Math.max(...skillGroups.map((group) => group.items.length));

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
      {title}
    </h2>
  );
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5 py-10 sm:px-8">

          {/* Hero */}
          <section
            id="about"
            className="rounded-[28px] border border-zinc-200 bg-white px-8 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:px-10 sm:py-12"
          >
            <div className="space-y-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                Portfolio
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl">
                {profile.nameKo}
                <span className="ml-3 text-zinc-400">{profile.nameEn}</span>
              </h1>
              <p className="text-lg leading-8 text-zinc-700">
                {profile.headline}
              </p>
              <p className="text-sm leading-7 text-zinc-500 sm:text-base">
                {profile.intro}
              </p>
            </div>
          </section>

          {/* Skills */}
          <section
            id="skills"
            className="rounded-[28px] border border-zinc-200 bg-white px-8 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:px-10"
          >
            <SectionHeading title="Skills" />
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              {skillGroups.map((group) => {
                const percent = Math.round(
                  (group.items.length / maxSkillCount) * 100,
                );
                return (
                  <div key={group.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-zinc-700">
                        {group.label}
                      </p>
                      <p className="text-xs text-zinc-400">{percent}%</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-zinc-900"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs leading-6 text-zinc-500">
                      {group.items.join(" · ")}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Experiences & Education */}
          <section
            id="experience"
            className="rounded-[28px] border border-zinc-200 bg-white px-8 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:px-10"
          >
            <SectionHeading title="Experiences & Education" />
            <div className="relative mt-8">
              <div className="absolute bottom-0 left-0 top-0 w-px bg-zinc-200" />
              <div className="space-y-8 pl-8">
                {experiences.map((experience) => (
                  <div key={experience.title} className="relative">
                    <div className="absolute -left-[2.125rem] top-1.5 h-3 w-3 rounded-full bg-zinc-900 ring-2 ring-white" />
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold tracking-tight text-zinc-950">
                        {experience.title}
                      </h3>
                      <p className="text-sm text-zinc-400">{experience.period}</p>
                    </div>
                    {experience.details.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm leading-7 text-zinc-600">
                        {experience.details.map((detail) => (
                          <li
                            key={`${experience.title}-${detail}`}
                            className="flex gap-2"
                          >
                            <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-zinc-300" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <ProjectsSection projects={projects} />

        </div>
      </main>
      <ChatWidget />
    </>
  );
}

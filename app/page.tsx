import { experiences, profile, projects, skillGroups } from "./data/portfolio";
import { NavBar } from "./components/NavBar";
import { ProjectsSection } from "./components/ProjectsSection";

const maxSkillCount = Math.max(...skillGroups.map((group) => group.items.length));

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm leading-7 text-zinc-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">

          {/* Hero */}
          <section
            id="about"
            className="rounded-[28px] border border-zinc-200 bg-white px-6 py-7 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                  Portfolio
                </p>
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl lg:text-6xl">
                  {profile.nameKo}
                  <span className="ml-3 text-zinc-400">{profile.nameEn}</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-700">
                  {profile.headline}
                </p>
                <p className="max-w-3xl text-sm leading-7 text-zinc-500 sm:text-base">
                  {profile.intro}
                </p>
              </div>

              <div className="grid gap-3 rounded-[24px] border border-zinc-200 bg-zinc-50 p-5 sm:min-w-[18rem]">
                <div className="space-y-1">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    Contact Hero
                  </p>
                  <p className="text-sm leading-6 text-zinc-600">
                    이름과 소개를 중심으로 구성한 상단 Hero 섹션입니다.
                  </p>
                </div>
                <div className="h-px bg-zinc-200" />
                <div className="grid gap-2 text-sm text-zinc-600">
                  <p>Projects {projects.length}</p>
                  <p>Experience {experiences.length}</p>
                  <p>Skills {skillGroups.length}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
            {/* Sidebar */}
            <aside id="skills" className="space-y-6">
              <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <div className="space-y-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                    Basic Info
                  </p>
                  <div className="h-20 w-px bg-zinc-200" />
                  <div className="space-y-3">
                    <p className="text-lg font-semibold tracking-tight text-zinc-950">
                      About Me
                    </p>
                    <p className="text-sm leading-7 text-zinc-600">
                      반복 업무를 자동화하고, 현장의 불편을 제품으로 바꾸는
                      방식으로 문제를 풀어왔습니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <SectionHeading
                  title="Skills"
                  subtitle="Notion 스타일의 간결한 진행도 바 형태로 재구성했습니다."
                />
                <div className="mt-6 space-y-5">
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
            </aside>

            {/* Main content */}
            <div className="space-y-8">
              {/* Experiences & Education */}
              <section
                id="experience"
                className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8"
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
                          <p className="text-sm text-zinc-400">
                            {experience.period}
                          </p>
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
          </div>
        </div>
      </main>
    </>
  );
}

"use client";

import { useState } from "react";
import type { Project } from "../data/portfolio";
import { ProjectModal } from "./ProjectModal";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section id="projects" className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Projects
        </h2>
        <p className="text-sm leading-7 text-zinc-500">
          각 프로젝트는 카드 UI로 구성하고, 클릭하면 상세 내용을 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {sorted.map((project) => (
          <button
            key={project.slug}
            onClick={() => setSelectedProject(project)}
            className="group rounded-[28px] border border-zinc-200 bg-white text-left shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
          >
            {/* Thumbnail */}
            <div className="h-40 overflow-hidden rounded-t-[28px] bg-zinc-100">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Project {String(project.order).padStart(2, "0")}
                </p>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-500 transition group-hover:bg-zinc-900 group-hover:text-white">
                  View
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {project.title}
                </h3>
                <p className="text-sm leading-7 text-zinc-700">
                  {project.summary}
                </p>
                <p className="text-sm leading-7 text-zinc-500">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 grid gap-2 text-sm text-zinc-500">
                {project.meta.slice(0, 2).map((item) => (
                  <div
                    key={`${project.slug}-${item.label}`}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3"
                  >
                    <span>{item.label}</span>
                    <span className="text-right text-zinc-700">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.slice(0, 4).map((stack) => (
                  <span
                    key={`${project.slug}-${stack}`}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

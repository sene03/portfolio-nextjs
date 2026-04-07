"use client";

import { useEffect, useRef } from "react";
import type { Project } from "../data/portfolio";

const SECTION_ICONS: Record<string, string> = {
  "기획 배경": "📌",
  "주요 구현": "🔨",
  "Troubleshooting": "🛠",
  "성과": "✅",
};

function getSectionIcon(title: string): string {
  return SECTION_ICONS[title] ?? "📄";
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onClose();
    }
  };

  const period = project.meta.find((m) => m.label === "기간")?.value;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[28px] bg-white p-0 shadow-[0_40px_100px_rgba(15,23,42,0.15)] backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="overflow-y-auto max-h-[90vh] px-6 py-7 sm:px-8 sm:py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {period && (
                <span className="text-sm text-zinc-400">{period}</span>
              )}
              {project.teamType && (
                <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs text-zinc-600">
                  {project.teamType}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-1 shrink-0 rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="닫기"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.854 3.146a.5.5 0 0 1 0 .708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 0 1 .708-.708L8 7.293l4.146-4.147a.5.5 0 0 1 .708 0z" />
            </svg>
          </button>
        </div>

        {/* Links */}
        {project.links && (project.links.github || project.links.service) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-950 hover:text-white"
              >
                GitHub 바로가기
              </a>
            )}
            {project.links.service && (
              <a
                href={project.links.service}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-950 hover:text-white"
              >
                서비스 바로가기
              </a>
            )}
          </div>
        )}

        {/* Divider + Tech Stack */}
        <div className="my-5 h-px bg-zinc-100" />
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((stack) => (
            <span
              key={stack}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600"
            >
              {stack}
            </span>
          ))}
        </div>
        <div className="my-5 h-px bg-zinc-100" />

        {/* Summary / Description */}
        <div className="space-y-3">
          <p className="text-sm font-medium leading-7 text-zinc-800 sm:text-base">
            {project.summary}
          </p>
          <p className="text-sm leading-7 text-zinc-500">
            {project.description}
          </p>
        </div>

        {/* Sections */}
        <div className="mt-6 space-y-6">
          {project.sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
                <span role="img" aria-hidden="true">
                  {getSectionIcon(section.title)}
                </span>
                {section.title}
              </h3>
              {section.body && (
                <div className="space-y-2">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-7 text-zinc-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {section.bullets && (
                <ul className="space-y-2 text-sm leading-7 text-zinc-600">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Screenshot images */}
        {project.images && project.images.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
              <span role="img" aria-hidden="true">🖥</span>
              작업 화면
            </h3>
            <p className="text-xs text-zinc-400">
              이미지를 클릭하면 크게 볼 수 있습니다.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.images.map((src, i) => (
                <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                  <img
                    src={src}
                    alt={`${project.title} 화면 ${i + 1}`}
                    className="rounded-xl border border-zinc-200 object-cover transition hover:opacity-80"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

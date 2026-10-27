import type { Metadata } from 'next';
import Image from 'next/image';
import { getSite, getWorks, formatDate } from '../lib/content';
import { Markdown } from '../components/markdown';

export const metadata: Metadata = { alternates: { canonical: 'https://nyanlintun.me/works/' } };

export default function WorksPage() {
  const page = getSite();
  const works = getWorks();
  return (
    <>
      <section className="intro pt-10 sm:pt-12">
        <p className="mb-4 text-base text-muted">{page.title}</p>
        <h1 className="max-w-4xl text-3xl leading-snug font-normal tracking-tight sm:text-[2.4rem]">
          {page.headline}
        </h1>
        {page.body && (
          <div className="intro-copy mt-6 max-w-xl text-sm leading-7 text-muted">
            <Markdown>{page.body}</Markdown>
          </div>
        )}
      </section>
      <ol className="timeline mt-20 sm:mt-28" aria-label="Work timeline">
        {works.map((work) => (
          <li className="timeline-entry" key={work.id}>
            <div
              className={`date-rail ${work.end === 'present' && !work.draft ? 'is-current' : ''}`}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <p className="date-range">
                <time dateTime={work.start}>{formatDate(work.start)}</time>
                <span aria-hidden="true">—</span>
                <span>
                  {work.end === 'present' ? (
                    'Now'
                  ) : (
                    <time dateTime={work.end}>{formatDate(work.end)}</time>
                  )}
                </span>
              </p>
            </div>
            <article className="entry-body pb-16 sm:pb-20" aria-labelledby={work.id}>
              <h2
                id={work.id}
                className="entry-title flex flex-wrap items-baseline gap-x-2 text-lg leading-relaxed sm:text-xl"
              >
                {work.icon ? (
                  <Image
                    className="company-icon"
                    src={`/works${work.icon}`}
                    width={23}
                    height={23}
                    alt=""
                    unoptimized
                  />
                ) : (
                  <span className="project-mark" aria-hidden="true">
                    {work.mark}
                  </span>
                )}
                {work.url ? (
                  <a className="project-link" href={work.url}>
                    {work.title}
                    <span className="link-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : (
                  <span>{work.title}</span>
                )}
                <span className="text-muted">— {work.role}</span>
              </h2>
              {work.status && (
                <p className={`entry-status ${work.draft ? 'sample-status' : ''}`}>{work.status}</p>
              )}
              <Markdown>{work.body}</Markdown>
            </article>
          </li>
        ))}
      </ol>
    </>
  );
}

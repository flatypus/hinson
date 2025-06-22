/* eslint-disable react/jsx-key -- key not needed for static content */
import Link from "next/link";
import { LinkIcon, MarkGithubIcon } from "@primer/octicons-react";
import DownloadButton from "./download-button";
import {
  contact,
  education,
  experience,
  projects,
  awards,
  skills,
} from "./content";

function FLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-blue-500 underline" href={href} target="_blank">
      {children}
    </Link>
  );
}

function Title() {
  return (
    <div className="flex flex-col gap-2 pb-2 pt-1">
      <h1 className="text-center text-3xl font-bold">{contact.name}</h1>
      <div className="flex flex-row justify-center gap-1 text-xs">
        <div>{contact.email}</div>
        {/* <span>•</span> */}
        {/* <div>{contact.address}</div> */}
        <span>•</span>
        <div>{contact.phone}</div>
        <span>•</span>
        <FLink href={contact.linkedin}>LinkedIn</FLink>
        <span>•</span>
        <FLink href={contact.github}>GitHub</FLink>
      </div>
      {/* <p className="text-xs">{contact.tag}</p> */}
    </div>
  );
}

function Education() {
  return (
    <div className="pb-2 pt-1 text-xs">
      <div className="mb-1 text-xl font-bold">Education</div>
      <div className="font-semibold">{education.school}</div>
      <div className="text-[11.5px]">{education.info}</div>
    </div>
  );
}

function Experience() {
  return (
    <div className="pb-2 pt-1 text-xs">
      <div className="mb-2 text-xl font-bold">Experience</div>
      <div className="flex flex-col gap-3">
        {experience.map((item) => (
          <div>
            <Link
              className="mb-2 flex flex-row justify-between"
              href={item.link}
              target="_blank"
            >
              <div>
                <div className="font-bold">{item.title}</div>
                <div className="font-medium">{item.company}</div>
              </div>
              <div className="font-bold">{item.date}</div>
            </Link>
            {item.description.map((desc) => (
              <div className="ml-2 mt-1">• {desc}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div className="pb-2 pt-1 text-xs">
      <div className="mb-2 text-xl font-bold">Projects</div>
      <div className="flex flex-col gap-3">
        {projects.map((item) => (
          <div>
            {item.link ? (
              <Link href={item.link} target="_blank">
                <div className="flex flex-row items-center gap-1">
                  <div className="font-bold">{item.title}</div>
                  {item.link.includes("github") ? (
                    <MarkGithubIcon size={12} />
                  ) : (
                    <LinkIcon size={12} />
                  )}
                </div>
              </Link>
            ) : (
              <div className="mb-1">
                <div className="font-bold">{item.title}</div>
              </div>
            )}
            {item.description.map((desc) => (
              <div className="ml-2 mt-1">• {desc}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Awards() {
  return (
    <div className="pb-2 pt-1 text-xs">
      <div className="text-xl font-bold">Awards</div>
      <div className="flex flex-col">
        {awards.map((item) => (
          <div className="ml-2 mt-1">
            {item.link ? (
              <Link className="mb-[2px]" href={item.link} target="_blank">
                <div>• {item.title}</div>
              </Link>
            ) : (
              <div className="mb-[2px]">
                <div>• {item.title}</div>
              </div>
            )}
            {/* {item.description.map((desc) => (
              <div className="ml-2 mt-1">• {desc}</div>
            ))} */}
          </div>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="pb-2 pt-1 text-xs">
      <div className="mb-1 text-xl font-bold">Skills</div>
      <div className="flex flex-col gap-1">
        {Object.entries(skills).map(([title, items]) => (
          <div className="flex flex-row gap-1" key={title}>
            <div className="font-bold">{title}:</div>{" "}
            <div>{items.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="flex flex-col divide-y-2 divide-black">
      <Title />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Awards />
    </div>
  );
}

export function Resume() {
  // uncomment for printing
  // return <Content />;
  return (
    <div className="h-full bg-white text-left text-black">
      <DownloadButton />
      <div className="absolute z-[100] flex h-full w-full flex-row">
        <div className="h-full flex-1 bg-black opacity-10" />
        <div className="h-full w-full max-w-[1000px] shrink-0 overflow-y-scroll p-10 shadow-lg">
          <Content />
        </div>
        <div className="h-full flex-1 bg-black opacity-10" />
      </div>
    </div>
  );
}

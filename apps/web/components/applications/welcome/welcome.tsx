import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function Blobs(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 -top-20 transform-gpu overflow-hidden blur-3xl"
    >
      <div
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#c680ff] to-[#9089fc] opacity-30 sm:left-[calc(50%-35rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />

      <div
        className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9089fc] to-[#c680ff] opacity-30 sm:left-[calc(50%-35rem)] sm:w-[72.1875rem]"
        style={{
          clipPath: "ellipse(7% 50% at 50% 50%)",
        }}
      />
    </div>
  );
}

function AnimationDelay({
  delay,
  children,
  className,
}: {
  delay: number;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationReady(true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return animationReady ? (
    <div className={`fade-in ${className}`}>{children}</div>
  ) : (
    <div className={`opacity-0 ${className}`}>{children}</div>
  );
}

function Card({
  image,
  title,
  description,
  link,
}: {
  image: string;
  title: string;
  description: string;
  link: string;
}): JSX.Element {
  const [mouseHover, setMouseHover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const SCALE = 8;
  const cardRef = useRef<HTMLAnchorElement>(null);

  return (
    <a
      className="grid h-full w-full transform-gpu place-items-center rounded-3xl bg-white/50 p-8 ring-1 ring-gray-900/10 backdrop-blur-lg transition-transform duration-300 ease-out"
      href={link}
      onBlur={() => {
        setMouseHover(false);
      }}
      onFocus={() => {
        setMouseHover(true);
      }}
      onMouseMove={(e) => {
        if (!mouseHover) return;
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
        setCardSize({
          width: cardRef.current?.offsetWidth || 0,
          height: cardRef.current?.offsetHeight || 0,
        });
      }}
      onMouseOut={() => {
        setMouseHover(false);
      }}
      onMouseOver={() => {
        setMouseHover(true);
      }}
      ref={cardRef}
      style={{
        transform: mouseHover
          ? `perspective(1000px) rotateX(${
              (mousePosition.y / cardSize.height) * -(SCALE * 2) + SCALE
            }deg) rotateY(${
              (mousePosition.x / cardSize.width) * (SCALE * 2) - SCALE
            }deg) translateZ(10px)`
          : "perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      }}
    >
      <Image
        alt={`${title}-image`}
        className="rounded-xl"
        height={48}
        src={image}
        width={48}
      />
      <div className="mt-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
}

export default function Welcome(): JSX.Element {
  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <Blobs />
      <div className="flex h-full items-center justify-center">
        <div className="grid h-full w-full max-w-[500px] place-items-center overflow-y-scroll p-2 md:max-w-[800px]">
          <div className="px-8 md:px-16">
            <AnimationDelay
              className="text-left text-2xl font-bold md:text-4xl"
              delay={200}
            >
              Hi, I&apos;m Hinson.
            </AnimationDelay>
            <AnimationDelay
              className="mt-4 text-left text-sm font-light text-gray-600 md:text-xl"
              delay={300}
            >
              Full Stack Developer, AI Researcher, Bubble Tea Enthusiast
            </AnimationDelay>
            <AnimationDelay className="mt-8" delay={400}>
              <div className="grid w-full grid-cols-1 place-items-center gap-8 md:grid-cols-2">
                <Card
                  description="Lead full-stack developer for UN accredited edtech startup, building an AI-driven learning platform"
                  image="/images/edubeyond.png"
                  link="https://edubeyond.org/"
                  title="EduBeyond"
                />
                <Card
                  description="Channel for engineering and history videos about random projects. We're at 1,200 subscribers and 120k views!"
                  image="/images/flatypus.png"
                  link="https://youtube.com/flatypus"
                  title="YouTube"
                />
              </div>
            </AnimationDelay>
          </div>
        </div>
      </div>
    </div>
  );
}

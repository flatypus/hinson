"use client";

import Background from "@components/background";
import Content from "@components/content";
import Dock from "@components/dock/dock";

export default function Page({
  params,
}: {
  params: { path: string[] };
}): JSX.Element {
  return (
    <main>
      <Background>
        <div className="flex h-full flex-col gap-1">
          <Content path={params.path} />
          <Dock />
        </div>
      </Background>
    </main>
  );
}

"use client";

import Background from "../components/background";
import Content from "../components/content";
import Dock from "../components/dock";

export default function Page(): JSX.Element {
  return (
    <main>
      <Background>
        <Content />
        <Dock />
      </Background>
    </main>
  );
}

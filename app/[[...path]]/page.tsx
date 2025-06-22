import Background from "@components/background";
import Content from "@components/content";
import Dock from "@components/dock/dock";

export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  return (
    <main>
      <Background>
        <div className="flex h-full flex-col gap-1">
          <Content path={path} />
          <Dock />
        </div>
      </Background>
    </main>
  );
}

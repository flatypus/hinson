import Background from "../components/background";
import Dock from "../components/dock";

export default function Page(): JSX.Element {
  return (
    <main>
      <Background>
        <Dock />
      </Background>
    </main>
  );
}

import Sidebar from "./sidebar";
import Header from "./header";
import Files from "./files";
import Footer from "./footer";

export default function Finder() {
  return (
    <div className="flex h-full w-full flex-row font-sf">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <Files />
        <Footer />
      </div>
    </div>
  );
}

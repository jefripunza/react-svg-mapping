import Diagram from "./components/Diagram";
import { nodes, edges, texts } from "./data";
import templates from "./template";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="bg-lime-600 shadow-lg flex-shrink-0">
        <div className="flex justify-between items-center px-8 py-4 max-w-6xl mx-auto md:flex-col md:gap-4 md:px-4 md:py-3 sm:px-2 sm:py-2">
          <h1 className="text-white text-2xl font-semibold m-0 drop-shadow-md md:text-xl sm:text-lg">
            React SVG Mapping
          </h1>
          <nav className="flex gap-4 md:justify-center md:flex-wrap">
            <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 backdrop-blur-sm hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 md:px-3 md:py-1.5 md:text-xs sm:px-2.5 sm:py-1 sm:text-xs">
              Diagram
            </button>
            <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 backdrop-blur-sm hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 md:px-3 md:py-1.5 md:text-xs sm:px-2.5 sm:py-1 sm:text-xs">
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <Diagram
          templates={templates}
          nodes={nodes}
          edges={edges}
          texts={texts}
          useChatAI={true}
          useAutoFocus={true}
        />
      </main>
    </div>
  );
}

export default App;

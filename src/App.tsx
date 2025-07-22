import Diagram from "./components/Diagram";
import { nodes, links } from "./data";
import templates from "./template";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="nav-container">
          <h1 className="app-title">React SVG Mapping</h1>
          <nav className="nav-menu">
            <button className="nav-item">Home</button>
            <button className="nav-item">Diagram</button>
            <button className="nav-item">Settings</button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Diagram templates={templates} nodes={nodes} links={links} />
      </main>
    </div>
  );
}

export default App;

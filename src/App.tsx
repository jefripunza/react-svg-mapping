import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Diagram from "./components/Diagram";
import { nodes, links } from "./data";
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
        <div className="zoom-container">
          <TransformWrapper
            initialScale={1}
            minScale={0.1}
            maxScale={3}
            centerOnInit={true}
            limitToBounds={false}
            panning={{
              disabled: false,
              velocityDisabled: false,
            }}
            wheel={{
              disabled: false,
            }}
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
              contentStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <Diagram nodes={nodes} links={links} />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </main>
    </div>
  );
}

export default App;

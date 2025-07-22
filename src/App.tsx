import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Diagram from "./components/Diagram";
import { nodes, links } from "./data";

function App() {
  return (
    <TransformWrapper>
      <TransformComponent>
        <Diagram nodes={nodes} links={links} />
      </TransformComponent>
    </TransformWrapper>
  );
}

export default App;

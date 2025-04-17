import "./App.css";

import Navbar from "./components/Navbar";
import { text } from "./constants/sampleProblemStatement";
import Description from "./pages/Description/Description";

function App() {
  return (
    <>
      <Navbar />
      <Description text={text} />
    </>
  );
}
export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Focus from "./pages/Focus";
import Progress from "./pages/Progress";
import Insights from "./pages/Insights";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main style={{ padding: "30px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
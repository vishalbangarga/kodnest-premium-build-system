import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import TopNav from "./components/TopNav.jsx";
import Home from "./pages/Home.jsx";
import Builder from "./pages/Builder.jsx";
import Preview from "./pages/Preview.jsx";
import Proof from "./pages/Proof.jsx";

function Layout() {
    return (
        <div className="app-shell">
            <TopNav />
            <Outlet />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/builder" element={<Builder />} />
                    <Route path="/preview" element={<Preview />} />
                    <Route path="/proof" element={<Proof />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

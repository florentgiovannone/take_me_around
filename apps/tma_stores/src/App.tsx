import { Navigate, Route, Routes } from "react-router-dom"
import CharlesPetersPage from "./pages/CharlesPetersPage"
import StoreDashboard from "./pages/StoreDashboard"
import WaitburysProductPage from "./pages/WaitburysProductPage"

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/charlespeters" replace />} />
        <Route path="/charles-peter" element={<Navigate to="/charlespeters" replace />} />
        <Route path="/charlespeters" element={<CharlesPetersPage />} />
        <Route path="/charlespeters/dashboard" element={<StoreDashboard store="charles_peters" />} />
        <Route path="/waitburys" element={<WaitburysProductPage />} />
        <Route path="/waitburys/product" element={<Navigate to="/waitburys" replace />} />
        <Route path="/waitburys/deashboard" element={<Navigate to="/waitburys/dashboard" replace />} />
        <Route path="/waitburys/dashboard" element={<StoreDashboard store="waitburys" />} />
    </Routes>
  )
}

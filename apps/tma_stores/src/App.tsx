import { Navigate, Route, Routes } from "react-router-dom"
import CharlesPetersPage from "./pages/CharlesPetersPage"
import WaitburysProductPage from "./pages/WaitburysProductPage"

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/charlespeters" replace />} />
        <Route path="/charles-peter" element={<Navigate to="/charlespeters" replace />} />
        <Route path="/charlespeters" element={<CharlesPetersPage />} />
        <Route path="/waitburys" element={<WaitburysProductPage />} />
        <Route path="/waitburys/product" element={<Navigate to="/waitburys" replace />} />
    </Routes>
  )
}

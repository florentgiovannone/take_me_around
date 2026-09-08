import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import { TMA_DEMO_OPERATOR_ID } from "./config/operators"
import "./styles/style.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/demodashboard"
        element={<Dashboard fixedOperatorId={TMA_DEMO_OPERATOR_ID} />}
      />
      <Route path="/demo" element={<Navigate to="/demodashboard" replace />} />
      <Route path="/dashboard/tma-demo" element={<Navigate to="/demodashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard fixedScope="gallery" />} />
      <Route path="/dashboard/museum" element={<Dashboard fixedScope="museum" />} />
      <Route
        path="/dashboard/church-of-england"
        element={<Dashboard fixedScope="church_of_england" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

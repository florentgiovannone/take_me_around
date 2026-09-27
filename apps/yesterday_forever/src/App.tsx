import { Route, Routes } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"

function HomePage() {
  return (
    <main className="page">
      <video
        className="film"
        src="/yesterday-forever.mp4"
        controls
        playsInline
        preload="metadata"
      >
        Your browser does not support this video.
      </video>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

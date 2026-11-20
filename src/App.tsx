import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CarCreatePage from './pages/CarCreatePage'
import CarEditPage from './pages/CarEditPage'
import CarListPage from './pages/CarListPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CarListPage />} />
        <Route path="/cars/new" element={<CarCreatePage />} />
        <Route path="/cars/:id/edit" element={<CarEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}

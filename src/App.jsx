import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Favorites from './pages/favorites'
import MovieDetails from './pages/MovieDetails'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

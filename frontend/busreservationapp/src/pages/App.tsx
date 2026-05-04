import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopBar from './TopBar'
import Dashboard from './Dashboard'
import Reservation from './Reservation'
import OpenTickets from './OpenTickets'
import ClosedTickets from './ClosedTickets'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/tickets/open" element={<OpenTickets />} />
            <Route path="/tickets/closed" element={<ClosedTickets />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './sections/Home'
import Dashboard from './pages/Dashboard'
import {Inbox} from './pages/Inbox'
import AIWorkbench from './pages/AIWorkbench'
import Matching from './pages/Matching'
import Exception from './pages/Exception'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="AIWorkbench" element={<AIWorkbench />} />
          <Route path="invoices/:invoiceId" element={<AIWorkbench/>} />
          <Route path="Matching" element={<Matching />} />
          <Route path="Exception" element={<Exception/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
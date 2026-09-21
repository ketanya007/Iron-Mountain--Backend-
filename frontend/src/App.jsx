import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import GroupsList from './components/GroupsList'
import GroupDetails from './components/GroupDetails'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <Wallet className="h-6 w-6" />
              Expense Manager
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<GroupsList />} />
            <Route path="/groups/:groupId" element={<GroupDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

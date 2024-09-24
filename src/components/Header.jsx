import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciador de Orçamento Pessoal</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Início</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            </li>
            <li>
              <Link to="/transactions" className="hover:text-gray-300">Transações</Link>
            </li>
            <li>
              <Link to="/budget" className="hover:text-gray-300">Orçamento</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
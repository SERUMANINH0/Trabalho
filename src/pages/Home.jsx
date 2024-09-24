import React, { useState } from 'react';
import BudgetItem from '../components/BudgetItem';

const Home = () => {
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, description: 'Salário', amount: 3000, type: 'income' },
    { id: 2, description: 'Aluguel', amount: 1000, type: 'expense' },
    { id: 3, description: 'Supermercado', amount: 500, type: 'expense' },
  ]);

  const totalIncome = budgetItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = budgetItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="home">
      <h2>Orçamento Pessoal</h2>
      <div className="summary">
        <p>Renda Total: R$ {totalIncome.toFixed(2)}</p>
        <p>Despesas Totais: R$ {totalExpenses.toFixed(2)}</p>
        <p>Saldo: R$ {balance.toFixed(2)}</p>
      </div>
      <div className="budget-list">
        {budgetItems.map(item => (
          <BudgetItem
            key={item.id}
            description={item.description}
            amount={item.amount}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
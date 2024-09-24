import React from 'react';

const BudgetItem = ({ description, amount, type }) => {
  return (
    <div className={`budget-item ${type}`}>
      <span className="description">{description}</span>
      <span className="amount">{amount.toFixed(2)}</span>
    </div>
  );
};

export default BudgetItem;
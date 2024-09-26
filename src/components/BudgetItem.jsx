import React from 'react';
import PropTypes from 'prop-types';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const BudgetItem = ({ id, description, amount, type, onEdit, onDelete }) => {
  const isIncome = type === 'income';

  return (
    <div className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
      <div className="flex-1">
        <span className="font-semibold text-gray-800">{description}</span>
        <span className={`ml-2 font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'} R$ {Math.abs(amount).toFixed(2)}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(id)}
          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          aria-label="Editar item"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1 text-red-600 hover:bg-red-100 rounded"
          aria-label="Excluir item"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

BudgetItem.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['income', 'expense']).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BudgetItem;
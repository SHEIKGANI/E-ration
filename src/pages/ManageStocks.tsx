import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStock } from '../context/StockContext';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

const ManageStocks: React.FC = () => {
  const { admin } = useAuth();
  const { stocks, addStock, updateStock, deleteStock } = useStock();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    price: 0,
    unit: 'kg'
  });

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Please login as admin to access this page</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStock(formData);
    setFormData({ name: '', quantity: 0, price: 0, unit: 'kg' });
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateStock(editingId, formData);
      setEditingId(null);
    }
  };

  const startEditing = (stock: any) => {
    setEditingId(stock.id);
    setFormData({
      name: stock.name,
      quantity: stock.quantity,
      price: stock.price,
      unit: stock.unit
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Stocks</h1>
          <p className="mt-2 text-lg text-gray-600">Add, update, or remove stock items</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Stock Items</h3>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Item
              </button>
            )}
          </div>

          {isAdding && (
            <div className="px-4 py-5 bg-gray-50 sm:px-6">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <select
                      name="unit"
                      id="unit"
                      required
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="liter">Liter</option>
                      <option value="packet">Packet</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          )}

          <ul className="divide-y divide-gray-200">
            {stocks.map((stock) => (
              <li key={stock.id} className="px-4 py-4 sm:px-6">
                {editingId === stock.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                          Item Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="edit-name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-quantity" className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          id="edit-quantity"
                          required
                          min="0"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="edit-price"
                          required
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-unit" className="block text-sm font-medium text-gray-700">
                          Unit
                        </label>
                        <select
                          name="unit"
                          id="edit-unit"
                          required
                          value={formData.unit}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="kg">Kilogram (kg)</option>
                          <option value="liter">Liter</option>
                          <option value="packet">Packet</option>
                          <option value="piece">Piece</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{stock.name}</h4>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-gray-500 mr-4">
                          Quantity: {stock.quantity} {stock.unit}
                        </span>
                        <span className="text-sm text-gray-500">
                          Price: ₹{stock.price} per {stock.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(stock)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteStock(stock.id)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageStocks;
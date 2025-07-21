import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stock } from '../types';

interface StockContextType {
  stocks: Stock[];
  addStock: (stock: Omit<Stock, 'id'>) => void;
  updateStock: (id: string, stock: Partial<Stock>) => void;
  deleteStock: (id: string) => void;
}

// Mock initial data
const initialStocks: Stock[] = [
  { id: '1', name: 'Rice', quantity: 100, price: 30, unit: 'kg' },
  { id: '2', name: 'Wheat', quantity: 80, price: 25, unit: 'kg' },
  { id: '3', name: 'Sugar', quantity: 50, price: 40, unit: 'kg' },
  { id: '4', name: 'Oil', quantity: 60, price: 110, unit: 'liter' }
];

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);

  const addStock = (stock: Omit<Stock, 'id'>) => {
    const newStock = {
      ...stock,
      id: Date.now().toString()
    };
    setStocks([...stocks, newStock]);
  };

  const updateStock = (id: string, updatedStock: Partial<Stock>) => {
    setStocks(stocks.map(stock => 
      stock.id === id ? { ...stock, ...updatedStock } : stock
    ));
  };

  const deleteStock = (id: string) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  return (
    <StockContext.Provider value={{ stocks, addStock, updateStock, deleteStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useCallback } from 'react';
import { BloodUnit, BloodStatus, bloodInventory as initialInventory } from '../data/mockData';

interface InventoryContextType {
  inventory: BloodUnit[];
  addUnit: (unit: BloodUnit) => void;
  bloodTypeSummary: { type: string; total: number; status: BloodStatus }[];
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<BloodUnit[]>(initialInventory);

  const addUnit = useCallback((unit: BloodUnit) => {
    setInventory(prev => [unit, ...prev]);
  }, []);

  const bloodTypeSummary = React.useMemo(() => {
    const allTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    return allTypes.map(type => {
      const unitsOfType = inventory.filter(u => u.type === type);
      const total = unitsOfType.reduce((sum, u) => sum + u.quantity, 0);

      let status: BloodStatus = 'safe';
      if (total === 0) {
        status = 'expired';
      } else if (unitsOfType.some(u => u.status === 'critical')) {
        status = 'critical';
      } else if (unitsOfType.some(u => u.status === 'warning')) {
        status = 'warning';
      } else if (unitsOfType.every(u => u.status === 'expired')) {
        status = 'expired';
      }

      return { type, total, status };
    });
  }, [inventory]);

  return (
    <InventoryContext.Provider value={{ inventory, addUnit, bloodTypeSummary }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}

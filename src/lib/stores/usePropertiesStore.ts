/**
 * Zustand store for properties management
 *
 * This store demonstrates how to manage global state for future features.
 * Currently used for property selection, but can be extended for:
 * - Optimistic UI updates
 * - Caching
 * - Real-time updates
 * - Multi-step forms
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { PropertyWithDetails } from '@/types/property';

interface PropertiesState {
  // State
  properties: PropertyWithDetails[];
  selectedPropertyId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProperties: (properties: PropertyWithDetails[]) => void;
  selectProperty: (propertyId: string) => void;
  addProperty: (property: PropertyWithDetails) => void;
  updateProperty: (
    propertyId: string,
    updates: Partial<PropertyWithDetails>
  ) => void;
  removeProperty: (propertyId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  properties: [],
  selectedPropertyId: null,
  isLoading: false,
  error: null,
};

/**
 * Properties store hook
 *
 * @example
 * ```tsx
 * const { properties, selectProperty } = usePropertiesStore();
 * ```
 */
export const usePropertiesStore = create<PropertiesState>()(
  devtools(
    persist(
      set => ({
        ...initialState,

        setProperties: properties =>
          set({ properties, error: null }, false, 'setProperties'),

        selectProperty: propertyId =>
          set({ selectedPropertyId: propertyId }, false, 'selectProperty'),

        addProperty: property =>
          set(
            state => ({
              properties: [...state.properties, property],
            }),
            false,
            'addProperty'
          ),

        updateProperty: (propertyId, updates) =>
          set(
            state => ({
              properties: state.properties.map(p =>
                p.id === propertyId ? { ...p, ...updates } : p
              ),
            }),
            false,
            'updateProperty'
          ),

        removeProperty: propertyId =>
          set(
            state => ({
              properties: state.properties.filter(p => p.id !== propertyId),
              selectedPropertyId:
                state.selectedPropertyId === propertyId
                  ? null
                  : state.selectedPropertyId,
            }),
            false,
            'removeProperty'
          ),

        setLoading: loading => set({ isLoading: loading }, false, 'setLoading'),

        setError: error => set({ error }, false, 'setError'),

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'properties-storage',
        // Only persist selectedPropertyId, not the whole data
        partialize: state => ({
          selectedPropertyId: state.selectedPropertyId,
        }),
      }
    ),
    { name: 'PropertiesStore' }
  )
);

// Selectors for optimized re-renders
export const selectSelectedProperty = (state: PropertiesState) =>
  state.properties.find(p => p.id === state.selectedPropertyId);

export const selectPropertiesCount = (state: PropertiesState) =>
  state.properties.length;

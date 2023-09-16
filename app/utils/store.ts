// Import necessary dependencies
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Updater } from "../typing";
import { deepClone } from "./clone";

// Define a type alias to extract the second parameter of a function type
type SecondParam<T> = T extends (
  _f: infer _F,
  _s: infer S,
  ...args: infer _U
) => any
  ? S
  : never;

// Define a type alias for the updater object
type MakeUpdater<T> = {
  lastUpdateTime: number;
  markUpdate: () => void;
  update: Updater<T>;
};

// Define a type alias for the setStoreState function
type SetStoreState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
) => void;

// Define the createPersistStore function
export function createPersistStore<T, M>(
  defaultState: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M,
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>,
) {
  // Call the create function with the combined types of T, M, and MakeUpdater<T>
  return create<T & M & MakeUpdater<T>>()(
    // Call the persist function with a callback function
    persist((set, get) => {
      return {
        // Spread the defaultState object
        ...defaultState,
        // Call the methods function and spread its returned object
        ...methods(set as any, get),
        // Add lastUpdateTime property and markUpdate method
        lastUpdateTime: 0,
        markUpdate() {
          set({ lastUpdateTime: Date.now() } as Partial<
            T & M & MakeUpdater<T>
          >);
        },
        // Add update method
        update(updater) {
          // Create a deep clone of the current state
          const state = deepClone(get());
          // Apply the updater function to the cloned state
          updater(state);
          // Mark the update time
          get().markUpdate();
          // Set the updated state
          set(state);
        },
      };
    }, persistOptions),
  );
}

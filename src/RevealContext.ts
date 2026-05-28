import { createContext } from 'react';

export const RevealContext = createContext<Set<string>>(new Set());

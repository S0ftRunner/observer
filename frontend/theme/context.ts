import { createContext } from 'react';
import { ThemeMode } from './types';


export type ContextType = [ThemeMode, (mode: ThemeMode) => void];

export const ThemeModeContext = createContext<ContextType>(['light', () => {}]);
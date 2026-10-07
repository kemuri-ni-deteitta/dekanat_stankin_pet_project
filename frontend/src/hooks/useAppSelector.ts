import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../app/rootState.ts';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

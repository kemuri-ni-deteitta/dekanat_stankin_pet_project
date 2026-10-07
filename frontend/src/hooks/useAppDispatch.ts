import { useDispatch } from 'react-redux';
import {AppDispatch} from "../app/store.ts";

export const useAppDispatch = () => useDispatch<AppDispatch>();

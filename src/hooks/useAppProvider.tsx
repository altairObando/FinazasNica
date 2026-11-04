import { AppContext } from '@/data/AppProvider';
import { useContext } from 'react';

export const useAppProvider =()=> useContext(AppContext);
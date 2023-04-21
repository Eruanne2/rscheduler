import { Dispatch, createContext, useReducer } from 'react';
import { initState } from "./initState";
import { ReducerAction, State } from '../typing/types';
import Reducer from './reducer';
import reducer from './reducer';

type AppContextProps = { state: State, dispatch: React.Dispatch<ReducerAction>}
export const AppContext = createContext<AppContextProps>({ state: initState, dispatch: () => {}});
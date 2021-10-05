import {ChakraProvider} from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import "@fontsource/inter";
import {createContext, Dispatch, useReducer} from "react";

interface State {
    message?: string;
    balance?: number;
    address?: string | null;
    askConnect?: boolean;
    askAgree?: boolean;
    check?: boolean;
    finishFetch?: boolean;
    newBalance?: number;
}

const initialState: State = {
    address: null,
    balance: 0,
    message: "",
    askConnect: false,
    askAgree: false,
    check: false,
    finishFetch: false,
    newBalance: 0,
}

interface Actions {
    type: actionType,
    message?: string;
    balance?: number;
    address?: string | null;
    askConnect?: boolean;
    askAgree?: boolean;
    check?: boolean;
    finishFetch?: boolean;
    newBalance?: number;
}

export enum actionType {
    NEW_ADDRESS = 'NEW_ADDRESS',
    SET_BALANCE = 'SET_BALANCE',
    ASK_CONNECT = 'ASK_CONNECT',
    ASK_AGREE = 'ASK_AGREE',
    CHECK = 'CHECK',
    FINISH_FETCH = 'FINISH_FETCH'
}

const reducer = (state: State, action: Actions) => {
    switch (action.type) {
        case actionType.NEW_ADDRESS:
            return {
                ...state,
                address: action.address,
                balance: action.balance,
                newBalance: action.newBalance
            }
        case actionType.SET_BALANCE:
            return {
                ...state,
                ...action.balance && {balance: action.balance},
            }
        case actionType.ASK_CONNECT:
            return {
                ...state,
                askConnect: true
            }
        case actionType.ASK_AGREE:
            return {
                ...state,
                askAgree: true
            }
        case actionType.CHECK:
            return {
                ...state,
                check: true
            }
        case actionType.FINISH_FETCH:
            const temp = state.finishFetch
            return {
                ...state,
                finishFetch: !temp
            }
    }
}

interface ContextProps {
    state: State;
    dispatch: Dispatch<Actions>
}

export const StoreContext = createContext({} as ContextProps);

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <StoreContext.Provider value={{state, dispatch}}>
            <ChakraProvider theme={theme}>
                <Layout/>
            </ChakraProvider>
        </StoreContext.Provider>
    );
}

export default App;

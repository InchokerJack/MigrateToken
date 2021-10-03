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
    check?:boolean;
}

const initialState: State = {
    address: null,
    balance: 0,
    message: "",
    askConnect: false,
    askAgree: false,
    check:false,
}

interface Actions {
    type: actionType,
    metaData: State,
}

export enum actionType {
    NEW_ADDRESS = 'NEW_ADDRESS',
    SET_BALANCE = 'SET_BALANCE',
    ASK_CONNECT = 'ASK_CONNECT',
    ASK_AGREE = 'ASK_AGREE',
    CHECK = 'CHECK',
}

const reducer = (state: State, action: Actions) => {
    switch (action.type) {
        case actionType.NEW_ADDRESS:
            return {
                ...state,
                address: action.metaData.address,
                balance: action.metaData.balance
            }
        case actionType.SET_BALANCE:
            return {
                ...state,
                ...action.metaData.balance && {balance: action.metaData.balance},
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
                check:true
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

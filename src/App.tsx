import {ChakraProvider} from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import "@fontsource/inter";
import {createContext, Dispatch, useReducer} from "react";

interface State {
    message?: string;
    balance: number;
    address?: string|null;
}

const initialState: State = {
    address: null,
    balance: 0,
    message: "",
}

interface Actions {
    type: actionType,
    metaData: State,
}

export enum actionType {
    NEW_ADDRESS = 'NEW_ADDRESS',
    SET_BALANCE = 'SET_BALANCE',
}

const reducer = (state: State, action: Actions) => {
    switch (action.type) {
        case actionType.NEW_ADDRESS:
            return {
                ...state,
                address: action.metaData.address,
                message: action.metaData.message,
                balance: action.metaData.balance
            }
        case actionType.SET_BALANCE:
            return {
                ...state,
                balance: action.metaData.balance,
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

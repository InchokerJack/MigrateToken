import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import "@fontsource/inter";

function App() {

  return (
    <ChakraProvider theme={theme}>
      <Layout/>
    </ChakraProvider>
  );
}

export default App;

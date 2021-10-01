import {Box, Button, Text} from "@chakra-ui/react";
import Identicon from "./Identicon";
import {InjectedConnector} from '@web3-react/injected-connector'
import {useWeb3React} from "@web3-react/core"
import Web3 from 'web3'
import {BSCTestNetUrl} from '../config'
import {useEffect, useMemo, useState} from "react";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
})

type Props = {
    handleOpenModal: any;
    setETHBalance: any;
};

export default function ConnectButton({handleOpenModal, setETHBalance}: Props) {
    const {activate, deactivate} = useWeb3React()
    const web3 = new Web3(Web3.givenProvider || BSCTestNetUrl);
    const [balance, setBalance] = useState<string | null>(null)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)

    async function handleConnectWallet() {
        await connect();
    }

    async function connect() {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    useEffect(() => {
        async function getBalance() {
            const walletAddress = await web3.eth.getAccounts()
            if(walletAddress[0]){
            const balance = await web3.eth.getBalance(walletAddress[0])
            setBalance(balance)
            setETHBalance(balance)
            setWalletAddress(walletAddress[0])
            }
        }
            getBalance()
    }, [balance])

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    return balance ? (
        <Box
            display="flex"
            alignItems="center"
            background="gray.700"
            borderRadius="xl"
            py="0"
        >
            <Box px="3">
                <Text color="white" fontSize="md">
                    account
                </Text>
            </Box>
            <Button
                onClick={handleOpenModal}
                bg="gray.800"
                border="1px solid transparent"
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "blue.400",
                    backgroundColor: "gray.700",
                }}
                borderRadius="xl"
                m="1px"
                px={3}
                height="38px"
            >
                <Text color="white" fontSize="md" fontWeight="medium" mr="2">
                    {walletAddress}
                </Text>
                <Identicon/>
            </Button>
        </Box>
    ) : (
        <Button
            onClick={handleConnectWallet}
            bg="blue.800"
            color="blue.300"
            fontSize="lg"
            fontWeight="medium"
            borderRadius="xl"
            border="1px solid transparent"
            _hover={{
                borderColor: "blue.700",
                color: "blue.400",
            }}
            _active={{
                backgroundColor: "blue.800",
                borderColor: "blue.700",
            }}
        >
            Connect to a wallet
        </Button>
    );
}

import {Box, Button, Text} from "@chakra-ui/react";
import Identicon from "./Identicon";
import {useContext, useEffect, useState} from "react";
import {actionType, StoreContext} from "../App";
import getBlockchain from "../ethereum";
import {BigNumber} from "ethers";


type Props = {
    handleOpenModal: any;
};

export default function ConnectButton({handleOpenModal}: Props) {
    const [count, setCount] = useState(0)
    const {state, dispatch} = useContext(StoreContext)
    useEffect(() => {
        async function getWalletAddressAndBalance() {
            try {
                const {tokenMigration, oldSpon} = await getBlockchain();
                const walletAddress = await tokenMigration.getuserAddress()
                let oldBal = await tokenMigration.oldSponBalance(walletAddress)
                oldBal = BigNumber.from(oldBal).div(BigNumber.from(10).pow(18))
                let newBal = await tokenMigration.newSponBalance(walletAddress)
                newBal = BigNumber.from(newBal).div(BigNumber.from(10).pow(18))
                let commmitBalance = await tokenMigration.getUserCommittedBalance(walletAddress)
                commmitBalance = BigNumber.from(commmitBalance).div(BigNumber.from(10).pow(18))
                dispatch({type:actionType.UPDATE_COMMIT_BALANCE, commitBalance: commmitBalance})
                dispatch({type: actionType.NEW_ADDRESS, address: walletAddress, balance: oldBal, newBalance: newBal})
            } catch (e) {
                if ((e as any).message == 'Install Metamask') {
                    dispatch({type: actionType.FINISH_FETCH})
                } else if ((e as any).message == 'Please connect to BSC testnet') {
                    alert('You should connect to BSC testnet')
                } else {
                    alert("Metamask is running in background, please click on Metamask extension to continue processing procedure")
                }
            }
        }

        getWalletAddressAndBalance()
    }, [count])

    async function handleConnectWallet() {
        setCount((count) => count + 1)
    }

    return state.address ? (
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
                    {state.address}
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

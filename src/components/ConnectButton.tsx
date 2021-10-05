import {Box, Button, Text} from "@chakra-ui/react";
import Identicon from "./Identicon";
import {InjectedConnector} from '@web3-react/injected-connector'
import {useContext, useEffect, useState} from "react";
import {actionType, StoreContext} from "../App";
import getBlockchain from "../ethereum";
import {useWeb3React} from "@web3-react/core";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
})

type Props = {
    handleOpenModal: any;
};

export default function ConnectButton({handleOpenModal}: Props) {
    const {activate, deactivate} = useWeb3React()
    const [count, setCount] = useState(0)
    // const web3 = new Web3(Web3.givenProvider || BSCTestNetUrl);
    const {state, dispatch} = useContext(StoreContext)
    useEffect(() => {
        async function getWalletAddressAndBalance() {
            try {
            const {tokenMigration, oldSpon} = await getBlockchain();
            const walletAddress = await tokenMigration.getuserAddress()
            let oldBal = await tokenMigration.oldSponBalance(walletAddress)
            oldBal = oldBal/10**18
            const newBal = await tokenMigration.newSponBalance(walletAddress)
            dispatch({type:actionType.NEW_ADDRESS, address:walletAddress,balance:oldBal})
            } catch (e) {
                if(e='Install Metamask'){
                   dispatch({type:actionType.FINISH_FETCH})
                } else {
                alert("Metamask is running in background, please click on Metamask extension to continue processing procedure")
                }
            }
        }
        getWalletAddressAndBalance()
    },[count])

    async function handleConnectWallet() {
        setCount((count)=> count+1)
    }

    useEffect(() => {
        async function getBalance() {
            try {

                //     const oldBal = await tokenMigration.oldSponBalance(walletAddress)
                //     const result2 = await tokenMigration.getUserCommittedBalance(walletAddress)
                //     console.log((result2/10**18).toString())
                //     // oldBal = (parseInt(oldBal) / 10 ** 18).toString()
                //     let newBal = await tokenMigration.newSponBalance(walletAddress)
                //     newBal = (parseInt(newBal) / 10 ** 18).toString()
                //     console.log('new balance is', newBal)
                //     console.log('old balance is', oldBal.toString())
                //     const result = await oldSpon.approve("0xeA97E22234B5b5c71A8721C469273baa1ACFE4bd", oldBal.toString()  )
                //     console.log('result is', result)
                //     setTimeout(async ()=>{await tokenMigration.swapToken(BigNumber.from(500).mul(BigNumber.from(10).pow(18)));},10000)
                //
            } catch (e) {
                alert('Please login Metamask')
            }
        }

        getBalance()
    }, [])

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

import {Box, Button, Text} from "@chakra-ui/react";
import Identicon from "./Identicon";
import {InjectedConnector} from '@web3-react/injected-connector'
import {useWeb3React} from "@web3-react/core"
import Web3 from 'web3'
import {BSCTestNetUrl} from '../config'
import {useContext, useEffect} from "react";
import {StoreContext} from "../App";
import getBlockchain from "../ethereum";
import {BigNumber} from "ethers";

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
    const {state, dispatch} = useContext(StoreContext)

    async function handleConnectWallet() {
        // await connect();
    }

    useEffect(() => {
        async function getBalance() {
            // const walletAddress = await web3.eth.getAccounts()
            // console.log(walletAddress)
            // if (walletAddress[0]) {
            // let balance = parseFloat(await web3.eth.getBalance(walletAddress[0]))
            // balance = balance/Math.pow(10,18)
            // dispatch({type: actionType.NEW_ADDRESS, metaData: {address: walletAddress[0], balance}})
            try {
                const {token_migration, oldSpon} = await getBlockchain();
                const giftAddress = await token_migration.getOwnerGiftAddress()
                const walletAddress = await token_migration.getuserAddress()
                const oldBal = await token_migration.oldSponBalance(walletAddress)
                const result2 = await token_migration.getUserCommittedBalance(walletAddress)
                console.log((result2/10**18).toString())
                // oldBal = (parseInt(oldBal) / 10 ** 18).toString()
                let newBal = await token_migration.newSponBalance(walletAddress)
                newBal = (parseInt(newBal) / 10 ** 18).toString()
                console.log('new balance is', newBal)
                console.log('old balance is', oldBal.toString())
                const result = await oldSpon.approve("0xeA97E22234B5b5c71A8721C469273baa1ACFE4bd", oldBal.toString()  )
                console.log('result is', result)
                setTimeout(async ()=>{await token_migration.swapToken(BigNumber.from(500).mul(BigNumber.from(10).pow(18)));},10000)

            } catch (e) {
                console.log('error is', e)
                // }
                // }
            }
        }

        getBalance()
    }, [])

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
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

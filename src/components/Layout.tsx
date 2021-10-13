import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    Heading,
    Input,
    Spacer,
    Text,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import React, {useContext, useEffect, useRef, useState} from "react";
import {actionType, StoreContext} from "../App";
import Dialog from "./Dialog";
import getBlockchain from "../ethereum";
import {BigNumber} from "ethers";

export default function Layout() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {
        isOpen: isOpenDialog,
        onOpen: onOpenDialog,
        onClose: onCloseDialog
    } = useDisclosure()
    const {
        isOpen: isOpenDialog2,
        onOpen: onOpenDialog2,
        onClose: onCloseDialog2
    } = useDisclosure()
    const {
        isOpen: isOpenDialog3,
        onOpen: onOpenDialog3,
        onClose: onCloseDialog3
    } = useDisclosure()
    const {
        isOpen: isOpenDialog4,
        onOpen: onOpenDialog4,
        onClose: onCloseDialog4
    } = useDisclosure()
    const {
        isOpen: isOpenDialog5,
        onOpen: onOpenDialog5,
        onClose: onCloseDialog5
    } = useDisclosure()
    const {
        isOpen: isOpenDialog6,
        onOpen: onOpenDialog6,
        onClose: onCloseDialog6
    } = useDisclosure()
    const {
        isOpen: isOpenDialog7,
        onOpen: onOpenDialog7,
        onClose: onCloseDialog7
    } = useDisclosure()
    const {state, dispatch} = useContext(StoreContext)
    const [check, setCheck] = useState(false)
    const oldBalance = state.balance ? state.balance : 0
    const [commitAmount, setCommitAmount] = useState(0)
    const [newBalance, setNewBalance] = useState(0)
    const initailRender = useRef(true)
    const [isMigrateDisable, setMigrateDisable] = useState(false)

    function handleInputAmount(e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        if (!/[0-9]/.test(value)) {
            onOpenDialog7()
            setMigrateDisable(true)
        } else {
            setMigrateDisable(false)
        }
        setCommitAmount(parseFloat(value) || 0)
    }

    function handleClick() {
        if (!check) {
            onOpenDialog()
        }
    }

    function handleCheck(e: React.FormEvent<HTMLDivElement>) {
        setCheck((check) => !check)
    }

    useEffect(() => {
        if (!initailRender.current) {
            onOpenDialog2()
        }
        initailRender.current = false;
    }, [state.finishFetch])

    useEffect(() => {
        if (!initailRender.current) {
            const timeout = setTimeout(() => {
                const newBalance: number = oldBalance - commitAmount;
                setNewBalance(newBalance)
                if (newBalance < 0) {
                    setMigrateDisable(true)
                    onOpenDialog4()
                }
                if (commitAmount < 0) {
                    setMigrateDisable(true)
                    onOpenDialog6()
                }
            }, 1000)
            return () => clearTimeout(timeout)
        }
    }, [commitAmount])

    async function handleMigrate() {
        try {
            const {tokenMigration, oldSpon} = await getBlockchain();
            onOpenDialog3()
            const balance = BigNumber.from(state.balance).mul(BigNumber.from(10).pow(18))
            await oldSpon.approve("0xeA97E22234B5b5c71A8721C469273baa1ACFE4bd", balance.toString())
            setTimeout(async () => {
                onOpenDialog5()
                await tokenMigration.swapToken(BigNumber.from(commitAmount).mul(BigNumber.from(10).pow(18)));
                setTimeout(() => {
                    updateBalance(tokenMigration)
                }, 20000)
            }, 20000)
        } catch (e) {
            alert(`Interrupted with error ${e}`)
        }
    }

    useEffect(() => {
        if (oldBalance == 0) {
            setMigrateDisable(true)
        }
        if (oldBalance != 0) {
            setMigrateDisable(false)
        }
    }, [oldBalance])

    async function updateBalance(tokenMigration: { oldSponBalance: any, newSponBalance: any, getuserAddress: any, getUserCommittedBalance: any }) {
        const walletAddress = await tokenMigration.getuserAddress()
        const oldBal = await tokenMigration.oldSponBalance(walletAddress) / 10 ** 18
        const newBal = await tokenMigration.newSponBalance(walletAddress) / 10 ** 18
        const commmitBalance = await tokenMigration.getUserCommittedBalance(walletAddress) / 10 ** 18
        dispatch({type: actionType.UPDATE_BALANCE, balance: oldBal, newBalance: newBal})
        dispatch({type: actionType.UPDATE_COMMIT_BALANCE, commitBalance: commmitBalance})
    }

    function handleClear() {
        window.location.reload()
    }

    return (
        <Box bg="gray.800" minH="100vh" w="100%">
            <Dialog isOpen={isOpenDialog4} onClose={onCloseDialog4}
                    message={'Insufficient Remaining Balance'}/>
            <Dialog isOpen={isOpenDialog7} onClose={onCloseDialog7}
                    message={'Please input a number'}/>
            <Dialog isOpen={isOpenDialog6} onClose={onCloseDialog6}
                    message={'Amount should be larger than 0'}/>
            <Dialog isOpen={isOpenDialog5} onClose={onCloseDialog5}
                    message={'Please approve the swap, wait another 20 seconds and check your NSPON token at the button top right'}/>
            <Dialog isOpen={isOpenDialog} onClose={onCloseDialog}
                    message={'You should check on "By checking this box, you consent to committing SPON tokens for dataset generation of our JURY™ protocol."'}/>
            <Dialog isOpen={isOpenDialog2} onClose={onCloseDialog2}
                    message={<><span>You are not connecting to a Metamask account. To know how to do it, </span><a
                        target="_blank" rel="noopener noreferrer"
                        style={{color: "blue", fontStyle: "italic", textDecoration: "underline"}}
                        href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain">click
                        here</a></>}/>
            <Dialog isOpen={isOpenDialog3} onClose={onCloseDialog3}
                    message={'Please appprove your transaction, the migration will take place within 20 seconds'}/>
            <Flex>
                <Spacer/>
                <ConnectButton handleOpenModal={onOpen}/>
                <AccountModal isOpen={isOpen} onClose={onClose}/>
            </Flex>
            <Box h="100px" w="100%"></Box>
            <Flex w="100%" justifyContent="center">
                <Box>
                    <Heading color="gray.400" size="xl" margin="auto">
                        Participate in JURY™
                    </Heading>
                </Box>
            </Flex>
            <Box h="30px" w="100%"></Box>
            <Flex w="100%" justifyContent="center">
                <Box>
                    <Checkbox onChange={handleCheck} color="gray.400" fontSize="60px">
                        By checking this box, you consent to committing SPON tokens for dataset generation of our JURY™ protocol.
                    </Checkbox>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Tooltip
                    label="This is how many $SPON tokens you wish to commit to the JURY™ pool. These tokens will then be transferred to a separate wallet and locked up for a duration of 3 months. Your JURY™ rewards will be scaled off the number of $SPON committed. The more you commit, the more you get rewarded.For the purposes of this testnet trial, this would refer to how many OSPON tokens (the test token you received) you are committing. Please set this to 100% of your OSPON."
                    placement="top-end">
                    <Flex color="gray.400" alignItems="center" w="50%">
                        <Spacer/>
                        Amount of tokens to commit
                    </Flex>
                </Tooltip>
                <Box w="50%">
                    <Input
                        onClick={handleClick}
                        onChange={handleInputAmount}
                        placeholder={commitAmount.toString()} w="120px" ml="50px" color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Tooltip
                    label="This is how many $SPON tokens you have in your Metamask wallet. This is will be reflected automatically.For the purposes of this testnet trial, this would refer to how many OPSON tokens (the test token you received) you have in your wallet."
                    placement="top-end">
                    <Flex color="gray.400" alignItems="center" w="50%">
                        <Spacer/>
                        Old balance
                    </Flex>
                </Tooltip>
                <Box w="50%">
                    <Input onClick={handleClick} readOnly={true} placeholder={oldBalance.toString()} w="120px" ml="50px"
                           color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Tooltip
                    label="This is the remaining non-committed $SPON tokens that will be airdropped to your wallet. This is will be reflected automatically. For the purposes of this testnet trial, this would refer to how many NPSON tokens (the new test token you will receive by transferring over your OSPON) you will receive in your wallet."
                    placement="top-end">
                    <Flex color="gray.400" alignItems="center" w="50%">
                        <Spacer/>
                        New balance
                    </Flex>
                </Tooltip>
                <Box w="50%">
                    <Input onClick={handleClick} readOnly={true} placeholder={newBalance.toString()} w="120px" ml="50px"
                           color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Tooltip
                    label="This is the final number of tokens you have committed to JURY™. This field will also be updated automatically according to the fields above."
                    placement="top-end">
                    <Flex color="gray.400" alignItems="center" w="50%">
                        <Spacer/>
                        New commit balance
                    </Flex>
                </Tooltip>
                <Flex w="50%">
                    <Input readOnly={true} placeholder={commitAmount.toString()} w="120px" ml="50px" color="gray.400"/>
                    <Flex color="gray.400" alignItems="center" ml="20px">
                    </Flex>
                </Flex>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Button w="150px" isDisabled={isMigrateDisable} onClick={handleMigrate}>Join the JURY™</Button>
                <Button w="100px" ml="15px" onClick={handleClear}>Clear</Button>
            </Flex>
            <Box h="50px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Box color="gray.200" w="80%">
                    <Text fontSize="lg" fontWeight="bold">**How to take part:</Text>
                    <Box h="10px" w="100%"></Box>
                    <Text fontSize="md">1) Connect your Metamask to BSC</Text>
                    <Text fontSize="md">2) Tick the checkbox :</Text>
                    <Text fontSize="md">By checking this box, you consent to committing SPON tokens for dataset
                        generation of our JURY™ protocol.</Text>
                    <Text fontSize="md">3) How many tokens would you like to add to JURY™ Pool? (Your JURY™ rewards will be scaled off the number of $SPON committed. The more you commit, the more you get rewarded) </Text>
                    <Text fontSize="md">4) Click the “Join the JURY™” button. A Metamask Pop-up asking you to approve
                        the transaction will appear. Please confirm that transaction.</Text>
                    <Text fontSize="md">5) Close the pop-up message and wait for 20 seconds for the transaction to be
                        completed.</Text>
                    <Text fontSize="md">6) A “SWAP token” transaction request will pop-up on Metamask. Please confirm
                        the transaction and wait for 20 seconds for it to be completed.</Text>
                    <Text fontSize="md">7) Once the transaction is completed on Metamask, please check your New Token
                        balance and Commit balance by clicking the button on the top right corner of the web-page. You
                        can also see your new SPON token balance through Metamask.</Text>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Divider orientation="horizontal" w="900px"/>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Box color="gray.200" w="80%">
                    <Text fontSize="md" fontWeight="bold">Legend: </Text>
                    <Box h="20px" w="100%"></Box>
                    <Text fontSize="md">[ Fields you need to fill in ]</Text>
                    <Box h="10px" w="100%"></Box>
                    <Text fontSize="md" float="left"><Text fontSize="md" fontWeight="bold" float="left">Amount of tokens
                        to commit : </Text>This is how many $SPON tokens you wish to commit to the JURY™ pool. These
                        tokens will then be transferred to a separate wallet and locked up for a duration of 3 months.
                        Your JURY™ rewards will be scaled off the number of $SPON committed. The more you commit, the
                        more you get rewarded.</Text>
                    <div style={
                        {clear:"both"}
                    }></div>
                    <Box h="20px" w="100%"></Box>
                    <Text fontSize="md" fontStyle="italic">For the purposes of this testnet trial, this would refer to
                        how many OSPON tokens (the test token you received) you are committing. Please set this to 100%
                        of your OSPON.</Text>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Divider orientation="horizontal" w="900px"/>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Box color="gray.200" w="80%">
                    <Text fontSize="md">[ Fields that will be updated automatically once you fill in the above]</Text>
                    <Box h="10px" w="100%"></Box>
                    <Text fontSize="md" float="left"><Text fontSize="md" fontWeight="bold" float="left">Old Balance :</Text>This is how many $SPON tokens you have in your Metamask wallet. This is will be reflected automatically.</Text>
                    <div style={
                        {clear:"both"}
                    }></div>
                    <Text fontSize="md" fontStyle="italic">For the purposes of this testnet trial, this would refer to how many OPSON tokens (the test token you received) you have in your wallet.</Text>
                    <Box h="20px" w="100%"></Box>
                    <Text fontSize="md" float="left"><Text fontSize="md" fontWeight="bold" float="left">New Balance : </Text>This is the remaining non-committed $SPON tokens that will be airdropped to your wallet. This is will be reflected automatically.</Text>
                    <div style={
                        {clear:"both"}
                    }></div>
                    <Text fontSize="md" fontStyle="italic">For the purposes of this testnet trial, this would refer to how many NPSON tokens (the new test token you will receive by transferring over your OSPON) you will receive in your wallet.</Text>
                    <Box h="10px" w="100%"></Box>
                    <Text fontSize="md" float="left"><Text fontSize="md" fontWeight="bold" float="left">New commit balance : </Text>This is the final number of tokens you have committed to JURY™. This field will also be updated automatically according to the fields above.</Text>
                    <div style={
                        {clear:"both"}
                    }></div>
                    <Box h="40px" w="100%"></Box>
                </Box>
            </Flex>
        </Box>
    );
}

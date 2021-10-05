import {Box, Button, Checkbox, Flex, Heading, Input, Spacer, useDisclosure,} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import React, {useContext, useEffect, useRef, useState} from "react";
import {StoreContext} from "../App";
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
    const {state, dispatch} = useContext(StoreContext)
    const [check, setCheck] = useState(false)
    const oldBalance = state.balance ? state.balance : 0
    const [commitAmount, setCommitAmount] = useState(0)
    const [newBalance, setNewBalance] = useState(0)
    const initailRender = useRef(true)

    function handleInputAmount(e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value || '0'
        setCommitAmount(parseFloat(value))
    }

    function handleClick() {
        if (!check) {
            onOpenDialog()
        }
    }

    function handleCheck(e: React.FormEvent<HTMLDivElement>) {
        setCheck((check) => !check)
    }
    useEffect(()=>{
        if(!initailRender.current){
        onOpenDialog2()
        }
        initailRender.current=false;
    },[state.finishFetch])

    useEffect(() => {
        const timeout = setTimeout(() => {
            const newBalance: number = oldBalance - commitAmount;
            setNewBalance(newBalance)
            if(newBalance<0){
                onOpenDialog4()
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [commitAmount])

    async function handleMigrate() {
        const {tokenMigration, oldSpon} = await getBlockchain();
        onOpenDialog3()
        const balance = BigNumber.from(state.balance).mul(BigNumber.from(10).pow(18))
        await oldSpon.approve("0xeA97E22234B5b5c71A8721C469273baa1ACFE4bd", balance.toString())
        setTimeout(async () => {
            await tokenMigration.swapToken(BigNumber.from(500).mul(BigNumber.from(10).pow(18)));
        setTimeout(()=>{
            onOpenDialog5()
        },20000)
        }, 20000)
    }

    return (
        <Box bg="gray.800" h="100vh" w="100%">
            <Dialog isOpen={isOpenDialog4} onClose={onCloseDialog4}
                    message={'Insufficient Remaining Balance'}/>
            <Dialog isOpen={isOpenDialog5} onClose={onCloseDialog5}
                    message={'Please wait another 20 seconds and check your NSPON token at the button top right'}/>
            <Dialog isOpen={isOpenDialog} onClose={onCloseDialog}
                    message={'You should check on "Ask token holder to commit to JURY protocol" to continue swapping'}/>
            <Dialog isOpen={isOpenDialog2} onClose={onCloseDialog2}
                    message={<><span>You are not connecting to a Metamask account. To know how to do it, </span><a
                        target="_blank" rel="noopener noreferrer"
                        style={{color: "blue", fontStyle: "italic", textDecoration: "underline"}}
                        href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain">click
                        here</a></>}/>
            <Dialog isOpen={isOpenDialog3} onClose={onCloseDialog3}
                    message={'Please ppprove your transaction, the migration will take place within 20 seconds'}/>
            <Flex>
                <Spacer/>
                <ConnectButton handleOpenModal={onOpen}/>
                <AccountModal isOpen={isOpen} onClose={onClose}/>
            </Flex>
            <Box h="100px" w="100%"></Box>
            <Flex w="100%" justifyContent="center">
                <Box>
                    <Heading color="gray.400" size="xl" margin="auto">
                        Migration Webpage
                    </Heading>
                </Box>
            </Flex>
            <Box h="30px" w="100%"></Box>
            <Flex w="100%" justifyContent="center">
                <Box>
                    <Checkbox onChange={handleCheck} color="gray.400" fontSize="60px">
                        Ask token holder to commit to JURY protocol
                    </Checkbox>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    Amount of tokens to commit
                </Flex>
                <Box w="50%">
                    <Input
                        onClick={handleClick}
                        onChange={handleInputAmount}
                        placeholder={commitAmount.toString()} w="200px" ml="50px" color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    Old balance
                </Flex>
                <Box w="50%">
                    <Input onClick={handleClick} readOnly={true} placeholder={oldBalance.toString()} w="200px" ml="50px"
                           color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    New balance
                </Flex>
                <Box w="50%">
                    <Input onClick={handleClick} readOnly={true} placeholder={newBalance.toString()} w="200px" ml="50px"
                           color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    New commit balance
                </Flex>
                <Flex w="50%">
                    <Input readOnly={true} placeholder={newBalance.toString()} w="200px" ml="50px" color="gray.400"/>
                    <Flex color="gray.400" alignItems="center" ml="20px">
                        store in database
                    </Flex>
                </Flex>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Button w="100px" onClick={handleMigrate}>Migrate</Button>
            </Flex>
        </Box>
    );
}

import {Box, Button, Checkbox, Flex, Heading, Input, Spacer, useDisclosure,} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import React, {useContext, useEffect, useState} from "react";
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
    const {state,dispatch} = useContext(StoreContext)
    const [check,setCheck] = useState(false)
    const oldBalance = state.balance?state.balance:0
    const [commitAmount, setCommitAmount] = useState(0)
    const [newBalance, setNewBalance] = useState(0)

    function handleInputAmount(e: React.FormEvent<HTMLInputElement>){
        const value = e.currentTarget.value || '0'
        setCommitAmount(parseFloat(value))
    }

    function handleClick(){
        if(!check){
            onOpenDialog()
        }
    }

    function handleCheck(e: React.FormEvent<HTMLDivElement>){
        setCheck((check)=>!check)
    }

    useEffect(()=>{
        const timeout = setTimeout(()=>{
           setNewBalance(oldBalance-commitAmount)},2000)
        return ()=>clearTimeout(timeout)
    },[commitAmount])

    async function handleMigrate(){
        const {tokenMigration, oldSpon} = await getBlockchain();
            const result = await oldSpon.approve("0xeA97E22234B5b5c71A8721C469273baa1ACFE4bd", state.balance )
            console.log('result is', result)
            setTimeout(async ()=>{await tokenMigration.swapToken(BigNumber.from(500).mul(BigNumber.from(10).pow(18)));},10000)
    }

    return (
        <Box bg="gray.800" h="100vh" w="100%">
        <Dialog isOpen={isOpenDialog} onClose={onCloseDialog} message={'You should agree to commit JURY'}/>
            <Flex>
                <Spacer/>
                <ConnectButton handleOpenModal={onOpen} />
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
                    <Input onClick={handleClick} readOnly={true} placeholder={oldBalance.toString()} w="200px" ml="50px" color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    New balance
                </Flex>
                <Box w="50%">
                    <Input onClick={handleClick} readOnly={true} placeholder={newBalance.toString()} w="200px" ml="50px" color="gray.400"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    New commit balance
                </Flex>
                <Flex w="50%">
                    <Input readOnly={true} placeholder="0" w="200px" ml="50px" color="gray.400"/>
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

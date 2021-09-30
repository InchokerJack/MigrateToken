import {
    Box, Button,
    Checkbox,
    Flex,
    Heading,
    Input,
    Spacer,
    useDisclosure,
} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";

export default function Layout() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <Box bg="gray.800" h="100vh" w="100%">
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
                    <Checkbox color="gray.400" fontSize="60px">
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
                    <Input placeholder="0" w="200px" ml="50px"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    Old balance
                </Flex>
                <Box w="50%">
                    <Input placeholder="0" w="200px" ml="50px"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    New balance
                </Flex>
                <Box w="50%">
                    <Input placeholder="0" w="200px" ml="50px"/>
                </Box>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Flex color="gray.400" alignItems="center" w="50%">
                    <Spacer/>
                    New commit balance
                </Flex>
                <Flex w="50%">
                    <Input placeholder="0" w="200px" ml="50px"/>
                    <Flex color="gray.400" alignItems="center" ml="20px">
                        store in database
                    </Flex>
                </Flex>
            </Flex>
            <Box h="20px" w="100%"></Box>
            <Flex w="100%" justifyContent="center" alignItems="middle">
                <Button w="100px">Migrate</Button>
            </Flex>
        </Box>
    );
}

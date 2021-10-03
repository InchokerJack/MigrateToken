import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {useEffect} from "react";
interface Iprops {
    message:string;
    open: boolean
}
export default function ModalDialog({message,open}:Iprops) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    if(open) {onOpen()}
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Warning</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {message}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
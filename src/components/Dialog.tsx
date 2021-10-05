import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import React from "react";
interface Iprops {
    message: string|React.ReactNode;
    isOpen: boolean;
    onClose: any
}

export default function Dialog({message, isOpen, onClose}: Iprops) {
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
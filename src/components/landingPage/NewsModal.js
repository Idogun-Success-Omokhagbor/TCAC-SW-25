import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

const NewsModal = ({ isOpen, onClose, newsArray }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Latest News</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List spacing={6}>
            {newsArray.map((news) => (
              <ListItem key={news.id} borderBottom={"2px solid #000000"}>
                <Box>
                  <Flex justifyContent={"space-between"}>
                    <Text fontWeight="bold">{news.title}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {news.date}
                    </Text>
                  </Flex>
                  <Text>{news.description}</Text>
                </Box>
              </ListItem>
            ))}
          </List>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewsModal;

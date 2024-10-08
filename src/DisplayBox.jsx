import React, { useState } from 'react';
  import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react';
  const PaginationWithSearch = (items) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
  
    const optionsPerPage = 5;
    const filteredOptions = items.items.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const indexOfLastOption = currentPage * optionsPerPage;
    const indexOfFirstOption = indexOfLastOption - optionsPerPage;
    const currentOptions = filteredOptions.slice(indexOfFirstOption, indexOfLastOption);
  
    const totalPages = Math.ceil(filteredOptions.length / optionsPerPage);
  
    const handlePageChange = (newPage) => {
      if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };
  
    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1);
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Search options..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
  
        <form>
          {currentOptions.length > 0 ? (
            currentOptions.map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="radioOptions"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                <label onClick={onOpen}>{option}</label>
                <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{option}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button variant='ghost'>Secondary Action</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              </div>
            ))
          ) : (
            <p>No options found</p>
          )}
        </form>
  
        {filteredOptions.length > optionsPerPage && (
          <div>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default PaginationWithSearch;
    
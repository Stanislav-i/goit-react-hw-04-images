import React, { useState, useEffect } from 'react';
import { fetchPictures } from 'services/api';
import { Vortex } from 'react-loader-spinner';
import { toast } from 'react-toastify';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import { ButtonLoadMore } from './Button/Button';

const toastConfig = {
  position: 'top-right',
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const App = () => {
  const [userRequest, setUserRequest] = useState('');
  const [picturesArray, setPicturesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, fullSizeuUrl: '' });
  const [showButton, setShowButton] = useState(false);

  const onModalOpen = data => {
    setModal({ isOpen: true, fullSizeuUrl: data });
  };

  const onModalClose = () => {
    setModal({ isOpen: false, fullSizeuUrl: '' });
  };

  const onSearchClick = e => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchQuery = form.elements.searchQueryInput.value;

    if (searchQuery.trim() === '') {
      return toast.warning(`Type something :)`, toastConfig);
    } else if (searchQuery.trim() === userRequest) {
      form.reset();
      return toast.warning(`Ahahahaha! Type something NEW ;)`, toastConfig);
    } else window.scrollTo(0, 0);
    addUserRequest(searchQuery);
    form.reset();
  };

  function addUserRequest(string) {
    setPicturesArray([]);
    setUserRequest(string);
    setPage(1);
    setShowButton(false);
  }

  useEffect(() => {
    if (!userRequest) return;

    const fetchPicturesArray = async (searchQuery, currentPage) => {
      if (page === 1) {
        try {
          setIsLoading(true);
          await fetchPictures(searchQuery, currentPage).then(responce => {
            const newPicturesArray = responce.data.hits;
            const picturesNumber = responce.data.totalHits;
            if (newPicturesArray.length === 0) {
              setPicturesArray([]);
              toast.warning(
                `We haven't found anything... Let's try something else?`,
                toastConfig
              );
            } else if (newPicturesArray.length === 12) {
              setPicturesArray(newPicturesArray);
              setShowButton(true);
              toast.success(
                `Great! We've found ${picturesNumber} images!`,
                toastConfig
              );
            } else if (newPicturesArray.length < 12) {
              setPicturesArray(newPicturesArray);
              toast.success(
                `Great! We've found ${picturesNumber} images!`,
                toastConfig
              );
            }
          });
        } catch (error) {
          toast.error(error.message, toastConfig);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        await fetchPictures(searchQuery, currentPage).then(responce => {
          const newPicturesArray = responce.data.hits;
          if (newPicturesArray.length === 0) {
            setShowButton(false);
            toast(
              "We're sorry, but you've reached the end of search results.",
              toastConfig
            );
          } else if (newPicturesArray.length === 12) {
            setPicturesArray(prevPicturesArray => [
              ...prevPicturesArray,
              ...newPicturesArray,
            ]);
          } else if (newPicturesArray.length < 12) {
            setPicturesArray(prevPicturesArray => [
              ...prevPicturesArray,
              ...newPicturesArray,
            ]);
            setShowButton(false);
          }
        });
      } catch (error) {
        toast.error(error.message, toastConfig);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPicturesArray(userRequest, page);
  }, [userRequest, page]);

  // useEffect(() => {
  //   if (!userRequest) return;

  //   const fetchPicturesArray = async (searchQuery, currentPage) => {
  //     try {
  //       setIsLoading(true);
  //       await fetchPictures(searchQuery, currentPage).then(responce => {
  //         const newPicturesArray = responce.data.hits;
  //         if (newPicturesArray.length === 0) {
  //           setShowButton(false);
  //           toast(
  //             "We're sorry, but you've reached the end of search results.",
  //             toastConfig
  //           );
  //         } else if (newPicturesArray.length === 12) {
  //           // setPicturesArray([...picturesArray, ...newPicturesArray]);
  //           setPicturesArray(prevPicturesArray => [...prevPicturesArray, ...newPicturesArray]);
  //         } else if (newPicturesArray.length < 12) {
  //           // setPicturesArray([...picturesArray, ...newPicturesArray]);
  //           setPicturesArray(prevPicturesArray => [
  //             ...prevPicturesArray,
  //             ...newPicturesArray,
  //           ]);
  //           setShowButton(false);
  //         }
  //       });
  //     } catch (error) {
  //       setFetchError(error.message);
  //       toast.error(fetchError, toastConfig);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchPicturesArray(userRequest, page);
  // }, [page]);

  return (
    <div>
      <Searchbar onSubmit={onSearchClick} />

      {isLoading && (
        <Vortex
          visible={true}
          height="300"
          width="300"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
        />
      )}

      {picturesArray.length > 0 && (
        <ImageGallery data={picturesArray} openModal={onModalOpen} />
      )}

      {modal.isOpen && (
        <Modal fullSizeuUrl={modal.fullSizeuUrl} closeModal={onModalClose} />
      )}

      {showButton && <ButtonLoadMore onClick={() => setPage(page + 1)} />}
    </div>
  );
};

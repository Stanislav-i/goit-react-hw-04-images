import React, { useState, useEffect } from 'react';
import { fetchPictures } from 'services/api';
import { Vortex } from 'react-loader-spinner';
import { toast } from 'react-toastify';
//PROPTYPES

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { ButtonLoadMore } from './Button/Button';
// import { setSelectionRange } from '@testing-library/user-event/dist/utils';

const toastConfig = {
  position: 'top-center',
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const App = () => {
  // state = {
  //   userRequest: '',
  //   picturesArray: [],
  //   isLoading: false,
  //   error: null,
  //   page: 1,
  //   modal: {
  //     isOpen: false,
  //     fullSizeuUrl: '',
  //   },
  //   showButton: false,
  // };

  const [userRequest, setUserRequest] = useState('');
  const [picturesArray, setPicturesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, fullSizeuUrl: '', });
  const [showButton, setShowButton] = useState(false);
  
  console.log(picturesArray);

  const onModalOpen = data => {
    setModal({ isOpen: true, fullSizeuUrl: data, })
    // this.setState({
    //   modal: {
    //     isOpen: true,
    //     fullSizeuUrl: data,
    //   },
    // });
  };

  const onModalClose = () => {
    setModal(({ isOpen: false, fullSizeuUrl: '', }))
    // this.setState({
    //   modal: {
    //     isOpen: false,
    //     fullSizeuUrl: '',
    //   },
    // });
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

  // const onLoadButtonClick = () => {
  //   setPage(page + 1)
  //   // this.setState(prevState => {
  //   //   return { page: prevState.page + 1 };
  //   // });
  // };

  function addUserRequest(string) {
    setPicturesArray([])
    setUserRequest(string);
    setPage(1);
    setShowButton(false)
    // this.setState({ userRequest: string, page: 1, showButton: false });
  }

  useEffect(() => {
    if (picturesArray === []) return;
    
    const fetchPicturesArray = async (searchQuery, currentPage) => {
      
      try {
        setIsLoading(true)
        await fetchPictures(searchQuery, currentPage).then(
          responce => {
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
          })
      } catch (error) {
        setError(error.message);
        toast.error(error.message, toastConfig);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPicturesArray(userRequest, page);
  }, [userRequest]);

  useEffect(() => {
    if (picturesArray === []) return;
    console.log('why?')

    const fetchPicturesArray = async (searchQuery, currentPage) => {
      try {
        setIsLoading(true);
        await fetchPictures(searchQuery, currentPage).then(responce => {
          const newPicturesArray = responce.data.hits;
          if (newPicturesArray.length === 0) {
            setShowButton(false)
            toast(
              "We're sorry, but you've reached the end of search results.",
              toastConfig
            )
          } else if (newPicturesArray.length === 12) {
            setPicturesArray([...picturesArray, ...newPicturesArray]);
          } else if (newPicturesArray.length < 12) {
            setPicturesArray([...picturesArray, ...newPicturesArray]);
            setShowButton(false);
          }
        });
      } catch (error) {
        setError(error.message);
        toast.error(error.message, toastConfig);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPicturesArray(userRequest, page);
  }, [page]);


  // async componentDidUpdate(prevProps, prevState) {
  //   const searchQuery = this.state.userRequest;
  //   const page = this.state.page;

  //   if (
  //     prevState.userRequest !== this.state.userRequest ||
  //     prevState.page !== this.state.page
  //   )
  //     try {
  //       this.setState({ isLoading: true });
  //       await fetchPictures(searchQuery, page).then(responce => {
  //         const newPicturesArray = responce.data.hits;
  //         const picturesNumber = responce.data.totalHits;

  //         if (
  //           prevState.userRequest !== this.state.userRequest &&
  //           newPicturesArray.length === 0
  //         ) {
  //           this.setState({
  //             picturesArray: [],
  //           });
  //           toast.warning(
  //             `We haven't found anything... Let's try something else?`,
  //             toastConfig
  //           );
  //         } else if (
  //           prevState.userRequest !== this.state.userRequest &&
  //           newPicturesArray.length === 12
  //         ) {
  //           this.setState({
  //             picturesArray: newPicturesArray,
  //             showButton: true,
  //           });
  //           toast.success(
  //             `Great! We've found ${picturesNumber} images!`,
  //             toastConfig
  //           );
  //         } else if (
  //           prevState.userRequest !== this.state.userRequest &&
  //           newPicturesArray.length < 12
  //         ) {
  //           this.setState({ picturesArray: newPicturesArray });
  //           toast.success(
  //             `Great! We've found ${picturesNumber} images!`,
  //             toastConfig
  //           );---------------------------------------->
  //         } else if (
  //           prevState.userRequest === this.state.userRequest &&
  //           prevState.page !== this.state.page &&
  //           newPicturesArray.length === 12
  //         ) {
  //           this.setState(prevState => {
  //             return {
  //               picturesArray: [
  //                 ...prevState.picturesArray,
  //                 ...newPicturesArray,
  //               ],
  //             };
  //           });
  //         } else if (
  //           prevState.userRequest === this.state.userRequest &&
  //           prevState.page !== this.state.page &&
  //           newPicturesArray.length < 12
  //         ) {
  //           this.setState(prevState => {
  //             return {
  //               picturesArray: [
  //                 ...prevState.picturesArray,
  //                 ...newPicturesArray,
  //               ],
  //               showButton: false,
  //             };
  //           });
  //         } else if (
  //           prevState.userRequest === this.state.userRequest &&
  //           prevState.page !== this.state.page &&
  //           newPicturesArray.length === 0
  //         ) {
  //           this.setState({
  //             showButton: false,
  //           });
  //           toast(
  //             "We're sorry, but you've reached the end of search results.",
  //             toastConfig
  //           );
  //         }
  //       });
  //     } catch (error) {
  //       this.setState({ error: error.message });
  //       toast.error(error.message, toastConfig);
  //     } finally {
  //       this.setState({ isLoading: false });
  //     }
  // }

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
          <ImageGallery
            data={picturesArray}
            openModal={onModalOpen}
          />
        )}

        {modal.isOpen && (
          <Modal
            fullSizeuUrl={modal.fullSizeuUrl}
            closeModal={onModalClose}
          />
        )}

        {showButton && (
          <ButtonLoadMore onClick={()=>setPage(page + 1)} />
        )}
      </div>
    );
}

import PropTypes from 'prop-types';
import css from './modal.module.css';
import React, { useEffect } from 'react';

const Modal = ({ fullSizeuUrl, closeModal }) => {
  const handleOverlayClick = e => {
    if (e.currentTarget === e.target) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  return (
    <div onClick={handleOverlayClick} className={css.Overlay}>
      <div className={css.Modal}>
        <img src={fullSizeuUrl} alt="" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  fullSizeuUrl: PropTypes.string,
  closeModal: PropTypes.func,
};

export default Modal;

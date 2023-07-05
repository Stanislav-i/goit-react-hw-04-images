import PropTypes from 'prop-types';
import css from './searchbar.module.css';
import { FcSearch } from 'react-icons/fc';

export const Searchbar = ({ onSubmit }) => {
  return (
    <header className={css.searchbar}>
      <form onSubmit={onSubmit} className={css.searchform}>
        <button type="submit" className={css.searchformbutton}>
          {/* <span className={css.searchformbuttonlabel}>Search</span> */}
          <FcSearch />
        </button>

        <input
          className={css.searchforminput}
          type="text"
          name="searchQueryInput"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
};
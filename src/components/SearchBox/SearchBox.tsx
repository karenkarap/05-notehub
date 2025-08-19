import { useDebouncedCallback } from 'use-debounce';
import css from './SearchBox.module.css';
import React from 'react';

interface SearchBoxProps {
  setNoteQuery: (query: string) => void;
}

function SearchBox({ setNoteQuery }: SearchBoxProps) {
  const handleSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNoteQuery(e.target.value.trim()),
    300
  );
  return (
    <input
      onChange={handleSearchQuery}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}

export default SearchBox;

import css from './SearchBox.module.css';


interface SearchBoxProps {
  setNoteQuery: (query: string) => void;
}

function SearchBox({ setNoteQuery }: SearchBoxProps) {
  return (
    <input
      onChange={(e) => setNoteQuery(e.target.value.trim())}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}

export default SearchBox;

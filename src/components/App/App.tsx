import { keepPreviousData, useQuery } from '@tanstack/react-query';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import { fetchNotes, type noteHttpResponse } from '../../services/noteService';
import { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { BeatLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteQuery, setNoteQuery] = useState('');

  const { data, isLoading, isSuccess, isError } = useQuery<noteHttpResponse>({
    queryKey: ['notes', currentPage, noteQuery],
    queryFn: () => fetchNotes(currentPage, noteQuery),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Ooops... Something went wrong');
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data.notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [data, isSuccess]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchQueryChange = (query: string) => {
    setNoteQuery(query);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox setNoteQuery={handleSearchQueryChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      {isLoading && <BeatLoader color="#0d6efd" size={20} />}

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <NoteForm closeModal={closeModal} />
        </Modal>
      )}

      {data && data.notes.length > 0 && <NoteList data={data.notes} />}
      <Toaster />
    </div>
  );
}

export default App;

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

  const { data, isLoading, isSuccess } = useQuery<noteHttpResponse>({
    queryKey: ['Query', currentPage, noteQuery],
    queryFn: () => fetchNotes(currentPage, noteQuery),
    placeholderData: keepPreviousData,
  });

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

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox setNoteQuery={setNoteQuery} />

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

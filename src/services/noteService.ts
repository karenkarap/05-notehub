import axios from 'axios';
import type { CreatedNote, Note } from '../types/note';

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

export interface noteHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (page: number, query?: string): Promise<noteHttpResponse> => {
  const response = await axios.get<noteHttpResponse>('https://notehub-public.goit.study/ap/notes', {
    params: {
      search: query,
      page: page,
      perPage: 12,
    },
  });
  return response.data;
};

export const createNote = async (post: CreatedNote): Promise<Note> => {
  const response = await axios.post<Note>('https://notehub-public.goit.study/api/notes', post);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`https://notehub-public.goit.study/api/notes/${id}`);
  return response.data;
};

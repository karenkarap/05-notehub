import css from './NoteForm.module.css';
import * as Yup from 'yup';
import { Form, Formik, Field, ErrorMessage, type FormikHelpers } from 'formik';
import type { CreatedNote, NoteTag } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import toast from 'react-hot-toast';

interface NoteFormProps {
  closeModal: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const NoteForSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, 'Title is too short')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: Yup.string().trim().max(500, 'Content is too long and boring'),
  tag: Yup.string().trim().oneOf(tags).required('tag is required'),
});

function NoteForm({ closeModal }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (value: CreatedNote) => createNote(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Query'] });
    },
    onError: () => toast.error('Something went wrong'),
  });

  const handleSubmit = (values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
    mutate(values);
    actions.resetForm();
    closeModal();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={NoteForSchema}>
      {(props) => {
        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" type="text" name="title" className={css.input} />
              <ErrorMessage name="title" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
              <ErrorMessage name="content" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button onClick={closeModal} type="button" className={css.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={css.submitButton} disabled={!props.isValid}>
                {props.isSubmitting ? 'Submiting ...' : 'Create note'}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default NoteForm;

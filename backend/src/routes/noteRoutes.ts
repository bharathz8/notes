import express, { Request, Response } from 'express';
import { NoteModel } from '../models/noteModel';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
const router = express.Router();

// Add a new note
router.post('/add', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = req.user;
    
    if (!userId) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    const note = new NoteModel({ userId, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create note', error: error.message });
  }
});

// Get all notes of the authenticated user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;

    if (!userId) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    const notes = await NoteModel.find({ userId });
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
});

// Delete a note by its ID
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const noteId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    const note = await NoteModel.findOne({ _id: noteId, userId });
    if (!note) {
      res.status(404).json({ message: 'Note not found or not owned by user' });
      return;
    }

    await NoteModel.deleteOne({ _id: noteId, userId });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
});

export default router;
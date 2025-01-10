import mongoose, { Schema, Document } from 'mongoose';

interface Note extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
}

const noteSchema = new Schema<Note>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export const NoteModel = mongoose.model<Note>('Note', noteSchema);
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteModel_1 = require("../models/noteModel");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Add a new note
router.post('/add', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const userId = req.user;
        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }
        const note = new noteModel_1.NoteModel({ userId, title, content });
        yield note.save();
        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
}));
// Get all notes of the authenticated user
router.get('/', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }
        const notes = yield noteModel_1.NoteModel.find({ userId });
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
    }
}));
// Delete a note by its ID
router.delete('/:id', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const noteId = req.params.id;
        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }
        const note = yield noteModel_1.NoteModel.findOne({ _id: noteId, userId });
        if (!note) {
            res.status(404).json({ message: 'Note not found or not owned by user' });
            return;
        }
        yield noteModel_1.NoteModel.deleteOne({ _id: noteId, userId });
        res.status(200).json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
}));
exports.default = router;

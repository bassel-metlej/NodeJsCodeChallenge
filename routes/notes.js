const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/is-auth/is-auth');
const NotesController = require('../controllers/notesController/notes');

router.post('/postNotes', isAuth, NotesController.createNote);

router.delete('/deleteNote/:postId', isAuth, NotesController.deleteNote);

router.post('/updateNote/:noteId', isAuth, NotesController.updateNote);

router.get('/getNotesByCategory', isAuth, NotesController.getNotesByCat);

module.exports = router;

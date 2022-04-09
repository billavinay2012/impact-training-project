package com.citiustech.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.citiustech.model.Note;
import com.citiustech.service.NoteService;

@CrossOrigin
@RestController
@RequestMapping("/notes/api")
public class NoteController {

	@Autowired
	private NoteService noteService;

	@PostMapping("/addNote")
	public ResponseEntity<?> addNote(@RequestBody Note note) {
		Note noteObj = noteService.addNote(note);
		if (noteObj != null) {
			return new ResponseEntity<>(note, HttpStatus.OK);
		}
		return new ResponseEntity<>(null, HttpStatus.OK);
	}

	@GetMapping("/getAllNotes")
	public ResponseEntity<?> getAllNotes() {
		List<Note> notes = noteService.getAllNotes();
		if (notes.size() != 0) {
			return new ResponseEntity<>(notes, HttpStatus.OK);
		}
		return new ResponseEntity<>(null, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getNoteById(@PathVariable int id) {
		Note note = noteService.getNoteById(id);
		if (note != null) {
			return new ResponseEntity<>(note, HttpStatus.OK);
		}
		return new ResponseEntity<>(null, HttpStatus.OK);
	}

}

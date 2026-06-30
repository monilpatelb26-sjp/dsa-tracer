package com.monil.dsamaster.controller;

import com.monil.dsamaster.entity.Note;
import com.monil.dsamaster.entity.Problem;
import com.monil.dsamaster.entity.User;
import com.monil.dsamaster.repository.NoteRepository;
import com.monil.dsamaster.repository.ProblemRepository;
import com.monil.dsamaster.repository.UserRepository;
import com.monil.dsamaster.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    NoteRepository noteRepository;

    @Autowired
    ProblemRepository problemRepository;
    
    @Autowired
    UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow();
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<Note> getNoteByProblem(@PathVariable Long problemId) {
        return noteRepository.findByProblemIdAndUserId(problemId, getCurrentUser().getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/problem/{problemId}")
    public ResponseEntity<Note> saveNote(@PathVariable Long problemId, @RequestBody Note noteRequest) {
        Problem problem = problemRepository.findById(problemId).orElseThrow();
        User currentUser = getCurrentUser();
        
        if(!problem.getTopic().getCourse().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        Note note = noteRepository.findByProblemIdAndUserId(problemId, currentUser.getId())
                .orElse(new Note());
        
        note.setProblem(problem);
        note.setUser(currentUser);
        note.setContent(noteRequest.getContent());
        
        return ResponseEntity.ok(noteRepository.save(note));
    }
}

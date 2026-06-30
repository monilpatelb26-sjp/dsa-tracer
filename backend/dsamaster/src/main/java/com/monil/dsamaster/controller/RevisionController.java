package com.monil.dsamaster.controller;

import com.monil.dsamaster.entity.Revision;
import com.monil.dsamaster.repository.RevisionRepository;
import com.monil.dsamaster.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/revisions")
public class RevisionController {

    @Autowired
    RevisionRepository revisionRepository;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<Revision>> getRevisionsByProblem(@PathVariable Long problemId) {
        List<Revision> revisions = revisionRepository.findByProblemId(problemId);
        if(!revisions.isEmpty() && !revisions.get(0).getProblem().getTopic().getCourse().getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(revisions);
    }

    @GetMapping("/due")
    public ResponseEntity<List<Revision>> getDueAndOverdueRevisions() {
        List<Revision> revisions = revisionRepository.findDueAndOverdueByUserId(getCurrentUserId(), LocalDate.now());
        return ResponseEntity.ok(revisions);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Revision>> getUpcomingRevisions() {
        List<Revision> revisions = revisionRepository.findUpcomingByUserId(getCurrentUserId(), LocalDate.now(), LocalDate.now().plusDays(7));
        return ResponseEntity.ok(revisions);
    }

    @PutMapping("/{id}/done")
    public ResponseEntity<Revision> markRevisionDone(@PathVariable Long id) {
        Revision revision = revisionRepository.findById(id).orElseThrow();
        if(!revision.getProblem().getTopic().getCourse().getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        revision.setStatus("Done");
        return ResponseEntity.ok(revisionRepository.save(revision));
    }
}

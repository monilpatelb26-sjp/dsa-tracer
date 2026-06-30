package com.monil.dsamaster.controller;

import com.monil.dsamaster.entity.Problem;
import com.monil.dsamaster.entity.Revision;
import com.monil.dsamaster.entity.Topic;
import com.monil.dsamaster.repository.ProblemRepository;
import com.monil.dsamaster.repository.RevisionRepository;
import com.monil.dsamaster.repository.TopicRepository;
import com.monil.dsamaster.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    ProblemRepository problemRepository;

    @Autowired
    TopicRepository topicRepository;

    @Autowired
    RevisionRepository revisionRepository;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Problem>> getProblemsByTopic(@PathVariable Long topicId) {
        Topic topic = topicRepository.findById(topicId).orElseThrow();
        if(!topic.getCourse().getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(problemRepository.findByTopicId(topicId));
    }

    @PostMapping("/topic/{topicId}")
    public ResponseEntity<Problem> createProblem(@PathVariable Long topicId, @RequestBody Problem problemRequest) {
        Topic topic = topicRepository.findById(topicId).orElseThrow();
        if(!topic.getCourse().getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        problemRequest.setTopic(topic);
        return ResponseEntity.ok(problemRepository.save(problemRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProblem(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id).orElseThrow();
        if(!problem.getTopic().getCourse().getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        problemRepository.delete(problem);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/solve")
    public ResponseEntity<Problem> solveProblem(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id).orElseThrow();
        if(!problem.getTopic().getCourse().getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        
        if (problem.getSolved() == null || !problem.getSolved()) {
            problem.setSolved(true);
            problem.setSolveDate(LocalDate.now());
            problemRepository.save(problem);
            
            // Generate spaced repetition revisions: 1, 3, 5, 10, 15, 30, 60, 120, 150, 200, 250, 300
            int[] intervals = {1, 3, 5, 10, 15, 30, 60, 120, 150, 200, 250, 300};
            for(int interval : intervals) {
                Revision rev = new Revision();
                rev.setProblem(problem);
                rev.setIntervalDays(interval);
                rev.setDueDate(LocalDate.now().plusDays(interval));
                rev.setStatus("Pending");
                revisionRepository.save(rev);
            }
        }
        return ResponseEntity.ok(problem);
    }
}

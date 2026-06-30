package com.monil.dsamaster.controller;

import com.monil.dsamaster.entity.Course;
import com.monil.dsamaster.entity.Topic;
import com.monil.dsamaster.repository.CourseRepository;
import com.monil.dsamaster.repository.TopicRepository;
import com.monil.dsamaster.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    TopicRepository topicRepository;

    @Autowired
    CourseRepository courseRepository;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Topic>> getTopicsByCourse(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        if(!course.getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(topicRepository.findByCourseId(courseId));
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<Topic> createTopic(@PathVariable Long courseId, @RequestBody Topic topicRequest) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        System.out.println("Course User ID: " + course.getUser().getId());
        System.out.println("Current User ID: " + getCurrentUserId());
        if(!course.getUser().getId().equals(getCurrentUserId())) {
            System.out.println("IDs are not equal!");
            return ResponseEntity.status(403).build();
        }
        topicRequest.setCourse(course);
        return ResponseEntity.ok(topicRepository.save(topicRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopicProgress(@PathVariable Long id, @RequestBody Topic topicRequest) {
        Topic topic = topicRepository.findById(id).orElseThrow();
        if(!topic.getCourse().getUser().getId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        topic.setLectureDone(topicRequest.getLectureDone() != null ? topicRequest.getLectureDone() : false);
        topic.setPracticeDone(topicRequest.getPracticeDone() != null ? topicRequest.getPracticeDone() : false);
        topic.setDayDone(topicRequest.getDayDone() != null ? topicRequest.getDayDone() : false);
        return ResponseEntity.ok(topicRepository.save(topic));
    }
}

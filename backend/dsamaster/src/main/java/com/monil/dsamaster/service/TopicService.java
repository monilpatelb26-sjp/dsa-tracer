package com.monil.dsamaster.service;

import com.monil.dsamaster.entity.Topic;
import com.monil.dsamaster.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    public Topic addTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    public List<Topic> getTopicsByCourse(Long courseId) {
        return topicRepository.findByCourseId(courseId);
    }
}

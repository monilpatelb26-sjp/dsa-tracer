package com.monil.dsamaster.service;

import com.monil.dsamaster.entity.Revision;
import com.monil.dsamaster.repository.RevisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RevisionService {

    @Autowired
    private RevisionRepository revisionRepository;

    // Kisi problem ke revisions nikalne ke liye
    public List<Revision> getRevisionsForProblem(Long problemId) {
        return revisionRepository.findByProblemId(problemId);
    }

    // Revision ko mark done karna
    public Revision markRevisionAsDone(Long revisionId) {
        Revision revision = revisionRepository.findById(revisionId)
                .orElseThrow(() -> new RuntimeException("Revision not found!"));

        revision.setStatus("Done");
        return revisionRepository.save(revision);
    }
}

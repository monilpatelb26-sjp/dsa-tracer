package com.monil.dsamaster.service;

import com.monil.dsamaster.entity.Problem;
import com.monil.dsamaster.entity.Revision;
import com.monil.dsamaster.repository.ProblemRepository;
import com.monil.dsamaster.repository.RevisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private RevisionRepository revisionRepository;

    // Tumhara exact revision schedule (in days)
    private final int[] REVISION_INTERVALS = {1, 3, 5, 10, 15, 30, 60, 120, 150, 200, 250, 300};

    // Nayi problem add karne ke liye
    public Problem addProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    // Saari problems dekhne ke liye
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    // Ye function problem ko solved mark karega aur dates calculate karega
    @Transactional
    public Problem markAsSolved(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found with ID: " + problemId));

        problem.setSolved(true);
        problemRepository.save(problem);

        // Aaj ki date lo
        LocalDate solveDate = LocalDate.now();

        // Har interval ke hisaab se nayi revision entry banakar save karo
        for (int days : REVISION_INTERVALS) {
            Revision revision = new Revision();
            revision.setProblem(problem);
            revision.setDueDate(solveDate.plusDays(days));
            revision.setStatus("Pending");

            revisionRepository.save(revision);
        }

        return problem;
    }
}

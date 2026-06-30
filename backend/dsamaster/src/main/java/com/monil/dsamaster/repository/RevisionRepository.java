package com.monil.dsamaster.repository;

import com.monil.dsamaster.entity.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RevisionRepository extends JpaRepository<Revision, Long> {
    List<Revision> findByProblemId(Long problemId);

    @Query("SELECT r FROM Revision r WHERE r.problem.topic.course.user.id = :userId")
    List<Revision> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Revision r WHERE r.problem.topic.course.user.id = :userId AND r.dueDate <= :date AND r.status != 'Done'")
    List<Revision> findDueAndOverdueByUserId(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT r FROM Revision r WHERE r.problem.topic.course.user.id = :userId AND r.dueDate > :startDate AND r.dueDate <= :endDate AND r.status != 'Done'")
    List<Revision> findUpcomingByUserId(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

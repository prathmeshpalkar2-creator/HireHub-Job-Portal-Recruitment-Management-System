package com.hirehub.repository;

import com.hirehub.entity.JobApplication;
import com.hirehub.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    Page<JobApplication> findByCandidateId(Long candidateId, Pageable pageable);

    Page<JobApplication> findByJobId(Long jobId, Pageable pageable);

    @Query("SELECT a FROM JobApplication a WHERE a.job.recruiter.id = :recruiterId")
    Page<JobApplication> findByRecruiterId(@Param("recruiterId") Long recruiterId, Pageable pageable);

    @Query("SELECT a FROM JobApplication a WHERE a.job.recruiter.id = :recruiterId AND a.job.id = :jobId")
    Page<JobApplication> findByRecruiterIdAndJobId(@Param("recruiterId") Long recruiterId, @Param("jobId") Long jobId, Pageable pageable);

    long countByCandidateId(Long candidateId);

    long countByCandidateIdAndStatus(Long candidateId, ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.recruiter.id = :recruiterId")
    long countByRecruiterId(@Param("recruiterId") Long recruiterId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.recruiter.id = :recruiterId AND a.status = :status")
    long countByRecruiterIdAndStatus(@Param("recruiterId") Long recruiterId, @Param("status") ApplicationStatus status);

    long countByStatus(ApplicationStatus status);

    List<JobApplication> findTop5ByCandidateIdOrderByAppliedAtDesc(Long candidateId);

    @Query("SELECT a FROM JobApplication a WHERE a.job.recruiter.id = :recruiterId ORDER BY a.appliedAt DESC")
    List<JobApplication> findTop5ByRecruiterIdOrderByAppliedAtDesc(@Param("recruiterId") Long recruiterId);
}

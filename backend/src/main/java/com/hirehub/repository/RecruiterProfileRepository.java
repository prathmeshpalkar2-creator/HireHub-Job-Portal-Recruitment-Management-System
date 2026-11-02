package com.hirehub.repository;

import com.hirehub.entity.RecruiterProfile;
import com.hirehub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUser(User user);
    Optional<RecruiterProfile> findByUserId(Long userId);
    Page<RecruiterProfile> findByIsApproved(boolean isApproved, Pageable pageable);
    long countByIsApproved(boolean isApproved);
}

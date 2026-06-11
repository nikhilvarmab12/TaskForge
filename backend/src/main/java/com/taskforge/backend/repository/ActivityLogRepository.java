package com.taskforge.backend.repository;

import com.taskforge.backend.model.ActivityLog;
import com.taskforge.backend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityLogRepository
        extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUserOrderByCreatedAtDesc(User user);
}
package com.taskforge.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskforge.backend.model.ActivityLog;
import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.ActivityLogRepository;
import com.taskforge.backend.repository.UserRepository;

@Service
public class ActivityLogQueryService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ActivityLog> getUserLogs(String email) {

        User user =
                userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return activityLogRepository
                .findByUserOrderByCreatedAtDesc(user);
    }
}
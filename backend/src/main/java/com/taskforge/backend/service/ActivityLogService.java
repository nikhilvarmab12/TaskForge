package com.taskforge.backend.service;

import com.taskforge.backend.model.ActivityLog;
import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.ActivityLogRepository;
import com.taskforge.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void log(User user, String action) {

        ActivityLog activityLog = new ActivityLog();

        activityLog.setUser(user);
        activityLog.setAction(action);

        activityLogRepository.save(activityLog);
    }

    public List<ActivityLog> getUserLogs(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return activityLogRepository
                .findByUserOrderByCreatedAtDesc(user);
    }
}
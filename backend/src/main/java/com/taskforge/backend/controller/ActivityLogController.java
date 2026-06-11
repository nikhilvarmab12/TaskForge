package com.taskforge.backend.controller;

import com.taskforge.backend.model.ActivityLog;
import com.taskforge.backend.service.ActivityLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getLogs(
            Principal principal
    ) {

        return ResponseEntity.ok(
                activityLogService.getUserLogs(
                        principal.getName()
                )
        );
    }
}
package com.taskforge.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "TaskForge Backend Running 🚀";
    }

    @GetMapping("/api/health")
    public String health() {
        return "Backend Healthy ✅";
    }
}
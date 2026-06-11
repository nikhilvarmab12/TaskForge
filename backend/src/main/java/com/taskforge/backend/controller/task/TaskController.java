package com.taskforge.backend.controller.task;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taskforge.backend.dto.task.TaskRequest;
import com.taskforge.backend.model.Task;
import com.taskforge.backend.service.task.TaskService;
import org.springframework.data.domain.Page;
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // CREATE TASK
    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestBody TaskRequest request,
            Principal principal
    ) {

        return ResponseEntity.ok(
                taskService.createTask(
                        request,
                        principal.getName()
                )
        );
    }

    // GET ALL TASKS
   @GetMapping
public ResponseEntity<Page<Task>> getUserTasks(

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size,

        Principal principal
) {

    return ResponseEntity.ok(
            taskService.getUserTasks(
                    principal.getName(),
                    page,
                    size
            )
    );
}

    // GET SINGLE TASK
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(
            @PathVariable Long id,
            Principal principal
    ) {

        return ResponseEntity.ok(
                taskService.getTaskById(
                        id,
                        principal.getName()
                )
        );
    }

    // UPDATE TASK
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            Principal principal
    ) {

        return ResponseEntity.ok(
                taskService.updateTask(
                        id,
                        request,
                        principal.getName()
                )
        );
    }

    // DELETE TASK
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long id,
            Principal principal
    ) {

        taskService.deleteTask(
                id,
                principal.getName()
        );

        return ResponseEntity.ok(
                "Task deleted successfully"
        );
    }
}
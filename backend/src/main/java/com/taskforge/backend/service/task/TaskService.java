package com.taskforge.backend.service.task;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskforge.backend.dto.task.TaskRequest;
import com.taskforge.backend.model.Task;
import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.TaskRepository;
import com.taskforge.backend.repository.UserRepository;
import com.taskforge.backend.service.ActivityLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ActivityLogService activityLogService;
    // CREATE TASK
    public Task createTask(TaskRequest request, String email) {
    	
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        task.setCreatedAt(LocalDateTime.now());

        task.setUser(user);
        activityLogService.log(
                user,
                "TASK_CREATED"
        );
        return taskRepository.save(task);
        
    }

    // GET ALL TASKS
    public Page<Task> getUserTasks(
        String email,
        int page,
        int size
) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    Pageable pageable =
            PageRequest.of(page, size);

    return taskRepository.findByUser(
            user,
            pageable
    );
}

    // GET SINGLE TASK
    public Task getTaskById(Long taskId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return task;
    }

    // UPDATE TASK
    public Task updateTask(Long taskId, TaskRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        activityLogService.log(
                user,
                "TASK_UPDATED"
        );
        return taskRepository.save(task);
       
    }

    // DELETE TASK
    public void deleteTask(Long taskId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        activityLogService.log(
                user,
                "TASK_DELETED"
        );
        taskRepository.delete(task);

    }
}
package com.taskforge.backend.controller.profile;

import com.taskforge.backend.service.profile.AvatarService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class AvatarController {

    @Autowired
    private AvatarService avatarService;

    @PostMapping("/avatar")
    public Map<String, String> uploadAvatar(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String filename =
                avatarService.uploadAvatar(
                        authentication.getName(),
                        file
                );

        return Map.of(
        	    "avatarUrl",
        	    "http://localhost:8080/uploads/" + filename
        	);
    }
}
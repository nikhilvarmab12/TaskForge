package com.taskforge.backend.controller.profile;

import com.taskforge.backend.dto.profile.ProfileResponse;
import com.taskforge.backend.dto.profile.UpdateProfileRequest;
import com.taskforge.backend.service.profile.ProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ProfileResponse getProfile(
            Authentication authentication
    ) {

        return profileService.getProfile(
                authentication.getName()
        );
    }

    @PutMapping
    public ProfileResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {

        return profileService.updateProfile(
                authentication.getName(),
                request
        );
    }
}
package com.taskforge.backend.service.profile;

import com.taskforge.backend.dto.profile.ProfileResponse;
import com.taskforge.backend.dto.profile.UpdateProfileRequest;
import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    public ProfileResponse getProfile(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        ProfileResponse response =
                new ProfileResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getAvatarUrl()
                );

        response.setAvatarUrl(
                user.getAvatarUrl()
        );

        return response;
    }

    public ProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        userRepository.save(user);

        ProfileResponse response =
                new ProfileResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getAvatarUrl()
                );

        response.setAvatarUrl(
                user.getAvatarUrl()
        );

        return response;
    }
}
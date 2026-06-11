package com.taskforge.backend.service.profile;

import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class AvatarService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private UserRepository userRepository;

    public String uploadAvatar(
            String email,
            MultipartFile file
    ) throws IOException {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        String filename =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        Path uploadPath =
                Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {

            Files.createDirectories(
                    uploadPath
            );
        }

        Files.copy(
                file.getInputStream(),
                uploadPath.resolve(filename),
                StandardCopyOption.REPLACE_EXISTING
        );

        user.setAvatarUrl(filename);

        userRepository.save(user);

        return filename;
    }
}
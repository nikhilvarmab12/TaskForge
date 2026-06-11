package com.taskforge.backend.repository;

import com.taskforge.backend.model.PasswordResetToken;
import com.taskforge.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(
            String token
    );

    Optional<PasswordResetToken> findByUser(
            User user
    );

    void deleteByUser(
            User user
    );
}
package com.taskforge.backend.service.auth;

import com.taskforge.backend.model.PasswordResetToken;
import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

    private static final long RESET_TOKEN_DURATION =
            15 * 60 * 1000; // 15 minutes

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetToken createToken(
            User user
    ) {

        passwordResetTokenRepository
                .findByUser(user)
                .ifPresent(existing ->
                        passwordResetTokenRepository
                                .delete(existing)
                );

        PasswordResetToken token =
                new PasswordResetToken();

        token.setUser(user);

        token.setToken(
                UUID.randomUUID().toString()
        );

        token.setExpiryDate(
                Instant.now()
                        .plusMillis(
                                RESET_TOKEN_DURATION
                        )
        );

        return passwordResetTokenRepository
                .save(token);
    }

    public Optional<PasswordResetToken> findByToken(
            String token
    ) {

        return passwordResetTokenRepository
                .findByToken(token);
    }

    public PasswordResetToken verifyExpiration(
            PasswordResetToken token
    ) {

        if (token.getExpiryDate()
                .isBefore(Instant.now())) {

            passwordResetTokenRepository
                    .delete(token);

            throw new RuntimeException(
                    "Password reset token expired"
            );
        }

        return token;
    }
}
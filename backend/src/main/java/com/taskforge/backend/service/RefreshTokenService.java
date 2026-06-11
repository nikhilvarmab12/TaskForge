package com.taskforge.backend.service;

import com.taskforge.backend.model.RefreshToken;
import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.RefreshTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository repository;

    public RefreshToken createRefreshToken(User user) {

        RefreshToken token =
                repository.findByUser(user)
                        .orElse(new RefreshToken());

        token.setUser(user);

        token.setToken(
                UUID.randomUUID().toString()
        );

        token.setExpiryDate(
                LocalDateTime.now().plusDays(7)
        );

        return repository.save(token);
    }

    public Optional<RefreshToken> findByToken(String token) {

        return repository.findByToken(token);
    }

    public RefreshToken verifyExpiration(
            RefreshToken token
    ) {

        if (
                token.getExpiryDate()
                        .isBefore(LocalDateTime.now())
        ) {

            repository.delete(token);

            throw new RuntimeException(
                    "Refresh token expired"
            );
        }

        return token;
    }

    public RefreshToken verifyToken(
            String token
    ) {

        RefreshToken refreshToken =
                repository.findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Refresh token not found"
                                )
                        );

        return verifyExpiration(refreshToken);
    }
}
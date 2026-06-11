package com.taskforge.backend.controller.auth;
import com.taskforge.backend.dto.auth.ForgotPasswordRequest;
import com.taskforge.backend.dto.auth.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taskforge.backend.dto.auth.AuthRequest;
import com.taskforge.backend.dto.auth.AuthResponse;
import com.taskforge.backend.dto.auth.RegisterRequest;
import com.taskforge.backend.service.auth.AuthService;
import com.taskforge.backend.dto.auth.RefreshTokenRequest;
import com.taskforge.backend.dto.auth.RefreshTokenResponse;
import com.taskforge.backend.service.ratelimit.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private RateLimitService rateLimitService;
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody RegisterRequest request
    ) {

        return new ResponseEntity<>(
                authService.register(request),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    
public ResponseEntity<?> login(
        @RequestBody AuthRequest request,
        HttpServletRequest httpRequest
) {

    String ip =
            httpRequest.getRemoteAddr();

    Bucket bucket =
            rateLimitService.resolveBucket(ip);

    if (!bucket.tryConsume(1)) {

        return ResponseEntity
                .status(429)
                .body("Too many login attempts. Try again later.");
    }

    return ResponseEntity.ok(
            authService.login(request)
    );
}
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse>
    refreshToken(
            @RequestBody
            RefreshTokenRequest request
    ) {

        return ResponseEntity.ok(
                authService.refreshToken(
                        request
                )
        );
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody
            ForgotPasswordRequest request
    ) {

        return ResponseEntity.ok(
                authService.forgotPassword(
                        request
                )
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody
            ResetPasswordRequest request
    ) {

        return ResponseEntity.ok(
                authService.resetPassword(
                        request
                )
        );
    }
}
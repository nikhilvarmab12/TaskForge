package com.taskforge.backend.service.auth;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskforge.backend.dto.auth.AuthRequest;
import com.taskforge.backend.dto.auth.AuthResponse;
import com.taskforge.backend.dto.auth.RegisterRequest;
import com.taskforge.backend.model.RefreshToken;
import com.taskforge.backend.model.User;
import com.taskforge.backend.repository.UserRepository;
import com.taskforge.backend.security.JwtService;
import com.taskforge.backend.dto.auth.RefreshTokenRequest;
import com.taskforge.backend.dto.auth.RefreshTokenResponse;
import com.taskforge.backend.dto.auth.ForgotPasswordRequest;
import com.taskforge.backend.dto.auth.ResetPasswordRequest;
import com.taskforge.backend.model.PasswordResetToken;
import com.taskforge.backend.service.email.EmailService;
import com.taskforge.backend.service.ActivityLogService;
import com.taskforge.backend.service.RefreshTokenService;
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private PasswordResetTokenService passwordResetTokenService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ActivityLogService activityLogService;
    private void validateGmail(String email) {

        if (email == null ||
            !email.toLowerCase().matches("^[a-zA-Z0-9._%+-]+@gmail\\.com$")) {

            throw new RuntimeException(
                    "Only Gmail addresses are allowed."
            );
        }
    }
    public AuthResponse register(RegisterRequest request) {
    	validateGmail(request.getEmail());
    	if (userRepository.existsByEmail(request.getEmail())) {

    	    throw new RuntimeException(
    	            "Email already registered."
    	    );
    	}
    User user = new User();

    user.setName(request.getName());

    user.setEmail(request.getEmail());

    user.setPassword(
            passwordEncoder.encode(
                    request.getPassword()
            )
    );

    user.setRole("USER");

    user.setCreatedAt(LocalDateTime.now());

    userRepository.save(user);

    String accessToken =
            jwtService.generateToken(
                    user.getEmail()
            );

    String refreshToken =
            refreshTokenService
                    .createRefreshToken(user)
                    .getToken();

    activityLogService.log(
            user,
            "REGISTER"
    );

    return new AuthResponse(
            accessToken,
            refreshToken
    );
}

    public AuthResponse login(AuthRequest request) {

    	   validateGmail(request.getEmail());
    	   
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
    );

    User user =
            userRepository.findByEmail(
                            request.getEmail()
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"
                            )
                    );

    String accessToken =
            jwtService.generateToken(
                    user.getEmail()
            );

    String refreshToken =
            refreshTokenService
                    .createRefreshToken(user)
                    .getToken();

    activityLogService.log(
            user,
            "LOGIN"
    );

    return new AuthResponse(
            accessToken,
            refreshToken
    );
}
    public RefreshTokenResponse refreshToken(
            RefreshTokenRequest request
    ) {

        RefreshToken refreshToken =
                refreshTokenService
                        .findByToken(
                                request.getRefreshToken()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Refresh token not found"
                                )
                        );

        refreshTokenService
                .verifyExpiration(refreshToken);

        String accessToken =
                jwtService.generateToken(
                        refreshToken
                                .getUser()
                                .getEmail()
                );

        return new RefreshTokenResponse(
                accessToken
        );
    }
   public String forgotPassword(
        ForgotPasswordRequest request
) {

    User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new RuntimeException(
                            "User not found"
                    )
            );

    PasswordResetToken resetToken =
            passwordResetTokenService
                    .createToken(user);

    String resetLink =
            "https://taskforge-backend-yjkj.onrender.com/reset-password?token="
                    + resetToken.getToken();

    emailService.sendPasswordResetEmail(
            user.getEmail(),
            resetLink
    );
    activityLogService.log(
            user,
            "PASSWORD_RESET"
    );
    return "Password reset email sent";
}
    public String resetPassword(
            ResetPasswordRequest request
    ) {

        PasswordResetToken token =
                passwordResetTokenService
                        .findByToken(
                                request.getToken()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid token"
                                )
                        );

        passwordResetTokenService
                .verifyExpiration(token);

        User user = token.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        return "Password reset successful";
    }
}
package com.taskforge.backend.service.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(
            String to,
            String resetLink
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "TaskForge Password Reset"
        );

        message.setText(
                "Click the link below to reset your password:\n\n"
                        + resetLink
        );

        mailSender.send(message);
    }
}

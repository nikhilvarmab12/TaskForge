package com.taskforge.backend.dto.profile;

public class ProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String avatarUrl;
    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    public ProfileResponse() {
    }

    public ProfileResponse(
            Long id,
            String name,
            String email,
            String role,
            String avatarUrl
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
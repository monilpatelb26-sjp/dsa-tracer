package com.monil.dsamaster.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String message;

    // Custom constructor
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
}

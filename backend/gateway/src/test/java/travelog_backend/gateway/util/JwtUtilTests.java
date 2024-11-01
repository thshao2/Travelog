package travelog_backend.gateway.util;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;

import backend.gateway.util.JwtUtil;

public class JwtUtilTests {

    private JwtUtil jwtUtil;

    @BeforeEach
    public void setUp() {
        jwtUtil = new JwtUtil();
    }

    // @Test

}
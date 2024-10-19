package backend.auth_service.dto;

public class LogInResponse {
  private String token;

  public LogInResponse(String token) {
      this.token = token;
  }

  public String getToken() {
      return token;
  }

  public void setToken(String token) {
      this.token = token;
  }
}
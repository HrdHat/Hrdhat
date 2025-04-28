// Utility functions to map Supabase Auth errors to user-friendly messages

export function getSignUpErrorMessage(error: Error): string {
  const msg = error.message;
  if (msg.includes("User already registered")) {
    return "An account with this email already exists. Please log in or reset your password.";
  }
  if (msg.includes("Password should be at least 6 characters")) {
    return "Password must be at least 6 characters.";
  }
  if (msg.includes("Invalid email format")) {
    return "Please enter a valid email address.";
  }
  if (msg.includes("Email rate limit exceeded")) {
    return "Too many signup attempts. Please try again later.";
  }
  // Add more mappings as needed
  return "Signup failed: " + error.message;
}

export function getLoginErrorMessage(error: Error): string {
  const msg = error.message;
  if (msg.includes("Invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (msg.includes("Email not confirmed")) {
    return "Please confirm your email before logging in. Check your inbox for a confirmation link.";
  }
  if (msg.includes("User not found")) {
    return "No account found with this email address.";
  }
  // Add more mappings as needed
  return "Login failed: " + error.message;
}

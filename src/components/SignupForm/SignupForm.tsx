"use client";

type SignupFormProps = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function SignupForm({
  email,
  username,
  password,
  confirmPassword,
  error,
  isLoading,
  onEmailChange,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onCancel,
}: SignupFormProps) {
  return (
    <section className="page-section">
      <div className="section-wrapper">
        <h1>Sign up</h1>

        <form onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
            />
          </label>

          <label>
            Username
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={isLoading}>
            Submit
          </button>

          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </section>
  );
}
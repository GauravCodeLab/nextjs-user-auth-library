import { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'register'; // Restrict type to 'login' or 'register' for better type safety
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submit
    
    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await res.json();
      setMessage(data.message);
      setEmail(''); // Clear input fields on successful submission
      setPassword('');
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false once the request completes
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : type === 'login' ? 'Login' : 'Register'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AuthForm;

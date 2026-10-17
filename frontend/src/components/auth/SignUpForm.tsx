import React, { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  // Validate form fields
  const validate = (values: FormState): FormErrors => {
    const errors: FormErrors = {};

    const trimmedName = values.name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required';
    }

    const trimmedEmail = values.email.trim();
    if (!trimmedEmail) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const errors = validate(formData);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched to display errors if user attempts submit
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      await signUp(formData.name.trim(), formData.email.trim(), formData.password);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
          Create your account
        </h1>
        <p className="text-sm text-slate-400">
          Start organizing your campus info
        </p>
      </div>

      {/* General Error Banner */}
      {generalError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{generalError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor={nameId}
            className="block text-xs font-medium text-slate-300 mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              disabled={isSubmitting}
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              placeholder="Alex Morgan"
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={
                touched.name && errors.name ? `${nameId}-error` : undefined
              }
              className={`w-full bg-[#0D1322]/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                touched.name && errors.name
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/25'
                  : 'border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/25'
              }`}
            />
          </div>
          {touched.name && errors.name && (
            <p
              id={`${nameId}-error`}
              className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor={emailId}
            className="block text-xs font-medium text-slate-300 mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="you@campus.edu"
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={
                touched.email && errors.email ? `${emailId}-error` : undefined
              }
              className={`w-full bg-[#0D1322]/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                touched.email && errors.email
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/25'
                  : 'border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/25'
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p
              id={`${emailId}-error`}
              className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor={passwordId}
            className="block text-xs font-medium text-slate-300 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              disabled={isSubmitting}
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="At least 8 characters"
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={
                touched.password && errors.password
                  ? `${passwordId}-error`
                  : undefined
              }
              className={`w-full bg-[#0D1322]/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg pl-3.5 pr-10 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                touched.password && errors.password
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/25'
                  : 'border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/25'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none rounded"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {touched.password && errors.password && (
            <p
              id={`${passwordId}-error`}
              className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor={confirmPasswordId}
            className="block text-xs font-medium text-slate-300 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id={confirmPasswordId}
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              disabled={isSubmitting}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Re-enter your password"
              aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
              aria-describedby={
                touched.confirmPassword && errors.confirmPassword
                  ? `${confirmPasswordId}-error`
                  : undefined
              }
              className={`w-full bg-[#0D1322]/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg pl-3.5 pr-10 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/25'
                  : 'border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/25'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={isSubmitting}
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none rounded"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p
              id={`${confirmPasswordId}-error`}
              className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm transition-all duration-150 shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Already have an account? </span>
        <Link
          to="/signin"
          className="text-white hover:text-blue-400 font-medium transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;

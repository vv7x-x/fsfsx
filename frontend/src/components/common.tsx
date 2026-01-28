import { ReactNode } from "react";
import "./Toast.css";

interface ToastProps {
  message: string | null;
  type: "success" | "error" | "info";
}

export const Toast = ({ message, type }: ToastProps) => {
  if (!message) return null;

  const emoji = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  }[type];

  return (
    <div className={`toast toast-${type}`}>
      <span>{emoji} {message}</span>
    </div>
  );
};

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  className = "",
}: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`input ${className}`}
    />
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return <div className={`card ${className}`}>{children}</div>;
};

interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = "Loading..." }: LoadingProps) => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

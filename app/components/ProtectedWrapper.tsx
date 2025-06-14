"use client";

import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PasswordModal } from '../ui/PasswordModal';

interface ProtectedWrapperProps {
  children: ReactNode;
}

export const ProtectedWrapper: React.FC<ProtectedWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <PasswordModal isOpen={!isAuthenticated} />
      {isAuthenticated && children}
    </>
  );
};

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStudio } from '../../contexts/StudioContext';

export function RequireAuth({ allowIncomplete = false }: {allowIncomplete?: boolean;}) {
  const { user, preferences } = useStudio();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  if (!allowIncomplete && !preferences.hasOnboarded) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
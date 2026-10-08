import React from 'react';
import { QuietError } from '../components/ui/QuietError';

export function NotFound() {
  return (
    <QuietError
      variant="page"
      title="This page went quiet."
      message="Whatever was here has wandered off. It happens to the best sentences."
      actionLabel="Back to the studio"
      to="/" />);


}
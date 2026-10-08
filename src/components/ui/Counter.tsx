import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { formatNumber } from '../../utils/text';

export function Counter({ value, className = '' }: {value: number;className?: string;}) {
  const { ref, value: current } = useCountUp(value);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatNumber(current)}
    </span>);

}
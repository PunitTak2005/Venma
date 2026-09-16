import React from 'react';
import InitialsBadge from '../common/InitialsBadge';

export default function VendorLogo({ storeName, className = '' }) {
  return <InitialsBadge name={storeName} className={className} />;
}

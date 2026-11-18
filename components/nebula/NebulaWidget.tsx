'use client';

import React, { useState } from 'react';
import { NebulaButton } from './NebulaButton';
import { NebulaPanel } from './NebulaPanel';

export function NebulaWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NebulaButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <NebulaPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

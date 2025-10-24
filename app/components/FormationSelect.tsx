"use client";
import React from 'react';

export type Formation = '4-3-3' | '4-2-3-1' | '4-4-2' | '3-5-2' | '3-4-3' | '5-3-2';

const formations: Formation[] = ['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3', '5-3-2'];

export function FormationSelect({ value, onChange }: { value: Formation; onChange: (f: Formation) => void }) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value as Formation)}>
      {formations.map((f) => (
        <option key={f} value={f}>{f}</option>
      ))}
    </select>
  );
}

"use client";
import React, { useEffect, useMemo, useState } from 'react';
import type { Player, Position } from './PlayerCard';

export type Slot = { id: string; x: number; y: number; required: Position };

function formationToSlots(formation: string): Slot[] {
  // Coordinates are percentages within the pitch-inner area (0..100)
  const base: Slot[] = [{ id: 'gk', x: 50, y: 94, required: 'GK' }];

  const addLine = (count: number, y: number, pos: Position) => {
    const spacing = 100 / (count + 1);
    const items: Slot[] = [];
    for (let i = 0; i < count; i++) {
      items.push({ id: `${pos}-${y}-${i}` , x: spacing * (i + 1), y, required: pos });
    }
    return items;
  };

  switch (formation) {
    case '4-3-3':
      return [
        ...base,
        ...addLine(4, 75, 'DF'),
        ...addLine(3, 55, 'MF'),
        ...addLine(3, 30, 'FW'),
      ];
    case '4-2-3-1':
      return [
        ...base,
        ...addLine(4, 75, 'DF'),
        ...addLine(2, 60, 'MF'),
        ...addLine(3, 45, 'MF'),
        ...addLine(1, 28, 'FW'),
      ];
    case '4-4-2':
      return [
        ...base,
        ...addLine(4, 75, 'DF'),
        ...addLine(4, 55, 'MF'),
        ...addLine(2, 30, 'FW'),
      ];
    case '3-5-2':
      return [
        ...base,
        ...addLine(3, 75, 'DF'),
        ...addLine(5, 50, 'MF'),
        ...addLine(2, 28, 'FW'),
      ];
    case '3-4-3':
      return [
        ...base,
        ...addLine(3, 75, 'DF'),
        ...addLine(4, 55, 'MF'),
        ...addLine(3, 30, 'FW'),
      ];
    case '5-3-2':
      return [
        ...base,
        ...addLine(5, 78, 'DF'),
        ...addLine(3, 55, 'MF'),
        ...addLine(2, 28, 'FW'),
      ];
    default:
      return base;
  }
}

export function Pitch({ formation, value, onChange }: { formation: string; value: Record<string, Player | null>; onChange: (v: Record<string, Player | null>) => void }) {
  const slots = useMemo(() => formationToSlots(formation), [formation]);
  const [dropping, setDropping] = useState<string | null>(null);

  useEffect(() => {
    // Ensure state has all keys for current formation
    const currentKeys = new Set(slots.map((s) => s.id));
    const next: Record<string, Player | null> = {};
    for (const s of slots) next[s.id] = value[s.id] ?? null;
    for (const k of Object.keys(value)) if (!currentKeys.has(k)) delete (value as any)[k];
    onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formation]);

  const handleDrop = (slot: Slot, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/x-player');
    if (!data) return;
    const player: Player = JSON.parse(data);
    if (player.position !== slot.required) return;
    const occupiedKey = Object.keys(value).find((k) => value[k]?.id === player.id);
    const next = { ...value };
    if (occupiedKey) next[occupiedKey] = null;
    next[slot.id] = player;
    onChange(next);
    setDropping(null);
  };

  return (
    <div className="panel pitch">
      <div className="pitch-inner">
        <div className="markings"></div>
        <div className="center-line"></div>
        <div className="center-circle"></div>

        {slots.map((slot) => {
          const p = value[slot.id];
          return (
            <div
              key={slot.id}
              className="slot"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              onDragOver={(e) => {
                const has = e.dataTransfer.types.includes('application/x-player');
                if (has) {
                  e.preventDefault();
                  setDropping(slot.id);
                }
              }}
              onDragLeave={() => setDropping((d) => (d === slot.id ? null : d))}
              onDrop={(e) => handleDrop(slot, e)}
            >
              {p ? (
                <div className="player" draggable onDragStart={(e) => e.dataTransfer.setData('application/x-player', JSON.stringify(p))}>
                  <div className={`badge ${slot.required === 'GK' ? 'gk' : slot.required === 'DF' ? 'df' : slot.required === 'MF' ? 'mf' : 'fw'}`}>{slot.required}</div>
                  <div className="name">{p.name}</div>
                  <div className="note">{slot.required}</div>
                </div>
              ) : (
                <div
                  className="player"
                  style={{
                    background: dropping === slot.id ? 'rgba(52,211,153,0.25)' : 'rgba(20,26,51,0.6)',
                    borderStyle: 'dashed',
                    cursor: 'default',
                  }}
                  draggable={false}
                >
                  <div className={`badge ${slot.required === 'GK' ? 'gk' : slot.required === 'DF' ? 'df' : slot.required === 'MF' ? 'mf' : 'fw'}`}>{slot.required}</div>
                  <div className="name">Empty</div>
                  <div className="note">Drop {slot.required}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

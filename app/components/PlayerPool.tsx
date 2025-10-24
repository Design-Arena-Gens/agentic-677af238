"use client";
import React from 'react';
import type { Player } from './PlayerCard';

const DEFAULT_PLAYERS: Player[] = [
  { id: 'gk-1', name: 'Alisson Becker', position: 'GK' },
  { id: 'gk-2', name: 'Ederson Moraes', position: 'GK' },
  { id: 'df-1', name: 'Virgil van Dijk', position: 'DF' },
  { id: 'df-2', name: 'Ruben Dias', position: 'DF' },
  { id: 'df-3', name: 'Achraf Hakimi', position: 'DF' },
  { id: 'df-4', name: 'Joao Cancelo', position: 'DF' },
  { id: 'df-5', name: 'David Alaba', position: 'DF' },
  { id: 'mf-1', name: 'Kevin De Bruyne', position: 'MF' },
  { id: 'mf-2', name: 'Luka Modric', position: 'MF' },
  { id: 'mf-3', name: 'Jude Bellingham', position: 'MF' },
  { id: 'mf-4', name: 'Rodri Hernandez', position: 'MF' },
  { id: 'fw-1', name: 'Erling Haaland', position: 'FW' },
  { id: 'fw-2', name: 'Kylian Mbappe', position: 'FW' },
  { id: 'fw-3', name: 'Lionel Messi', position: 'FW' },
  { id: 'fw-4', name: 'Harry Kane', position: 'FW' }
];

export function PlayerPool({ onPick }: { onPick: (p: Player) => void }) {
  const groups = {
    GK: DEFAULT_PLAYERS.filter(p => p.position === 'GK'),
    DF: DEFAULT_PLAYERS.filter(p => p.position === 'DF'),
    MF: DEFAULT_PLAYERS.filter(p => p.position === 'MF'),
    FW: DEFAULT_PLAYERS.filter(p => p.position === 'FW'),
  } as const;

  return (
    <div className="sidebar panel">
      <div className="sidebar-inner" style={{padding:16}}>
        <div className="section-title">Player Pool</div>
        <div className="stat">Drag a player onto a matching slot</div>
        {(['GK','DF','MF','FW'] as const).map((k) => (
          <div key={k} style={{marginTop:12}}>
            <div className="section-title">{k}</div>
            <div className="roster">
              {groups[k].map((p) => (
                <div key={p.id} className="pool-item" draggable onDragStart={(e) => e.dataTransfer.setData('application/x-player', JSON.stringify(p))} onClick={() => onPick(p)}>
                  <div style={{fontWeight:700, fontSize:13}}>{p.name}</div>
                  <div className="note">{p.position}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

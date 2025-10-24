"use client";
import React from 'react';

export type Position = 'GK' | 'DF' | 'MF' | 'FW';

export type Player = {
  id: string;
  name: string;
  position: Position;
};

export function PlayerCard({ player, draggable = true, onDragStart }: { player: Player; draggable?: boolean; onDragStart?: (p: Player) => void }) {
  const badgeClass = player.position === 'GK' ? 'gk' : player.position === 'DF' ? 'df' : player.position === 'MF' ? 'mf' : 'fw';
  return (
    <div
      className="player"
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-player', JSON.stringify(player));
        onDragStart?.(player);
      }}
    >
      <div className={`badge ${badgeClass}`}>{player.position}</div>
      <div className="name">{player.name}</div>
      <div className="note">Drag onto a slot</div>
    </div>
  );
}

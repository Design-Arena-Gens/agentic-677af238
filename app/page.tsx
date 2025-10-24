"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { FormationSelect, Formation } from './components/FormationSelect';
import { Pitch } from './components/Pitch';
import type { Player } from './components/PlayerCard';
import { PlayerPool } from './components/PlayerPool';

export default function Page() {
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [team, setTeam] = useState<Record<string, Player | null>>({});

  // persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem('team-builder');
      if (raw) {
        const parsed = JSON.parse(raw);
        setFormation(parsed.formation ?? '4-3-3');
        setTeam(parsed.team ?? {});
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('team-builder', JSON.stringify({ formation, team }));
    } catch {}
  }, [formation, team]);

  const playersSelected = useMemo(() => Object.values(team).filter(Boolean).length, [team]);

  const handlePick = (p: Player) => {
    // place into first compatible empty slot
    const entries = Object.entries(team);
    const empty = entries.find(([k, v]) => k.startsWith(p.position) && !v);
    if (empty) {
      setTeam({ ...team, [empty[0]]: p });
    }
  };

  const reset = () => setTeam({});

  return (
    <div className="container">
      <div className="header">
        <div className="title">Football Team Builder</div>
        <div className="controls">
          <FormationSelect value={formation} onChange={setFormation} />
          <button className="btn" onClick={reset}>Clear</button>
          <a className="btn" href="https://vercel.com" target="_blank" rel="noreferrer">Deploy with Vercel</a>
        </div>
      </div>

      <div className="grid">
        <Pitch formation={formation} value={team} onChange={setTeam} />
        <div className="panel" style={{overflow:'hidden'}}>
          <PlayerPool onPick={handlePick} />
          <div className="footer">
            <div className="stat">Selected: {playersSelected}/11</div>
            <button className="btn" onClick={() => navigator.clipboard.writeText(JSON.stringify({ formation, team }, null, 2))}>Copy squad JSON</button>
          </div>
        </div>
      </div>
    </div>
  );
}

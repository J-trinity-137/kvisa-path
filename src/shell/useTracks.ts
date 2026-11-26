import { useEffect, useState } from 'react';
import type { StudentProfile } from '../profile/profile';
import type { TrackExplanation } from '../rules/evaluate';

/** Loads the rules module after first paint so the pathway tables are not in the first script. */
export function useTrackExplanation(profile: StudentProfile | null): TrackExplanation | null {
  const [state, setState] = useState<TrackExplanation | null>(null);
  useEffect(() => {
    if (!profile) {
      setState(null);
      return;
    }
    let live = true;
    import('../rules/evaluate').then(({ explainTracks }) => {
      if (live) setState(explainTracks(profile));
    });
    return () => {
      live = false;
    };
  }, [profile]);
  return state;
}

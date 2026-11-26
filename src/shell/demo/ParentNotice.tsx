import { DEMO_BANNER } from '../../accounts/model';
import { navCopy } from '../../i18n/navCopy';
import { accountsCopy } from '../../i18n/accountsCopy';
import { regionLabel } from '../../i18n/regionLabels';
import { languageMeta, type SupportedLangCode } from '../../kbridge';
import type { StudentProfile } from '../../profile/profile';
import type { EligibleTrack } from '../../rules/types';
import { formatDay } from './format';

export function ParentNotice({
  lang,
  nickname,
  sample,
  profile,
  tracks,
  deadline,
}: {
  lang: SupportedLangCode;
  nickname: string;
  sample: boolean;
  profile: StudentProfile;
  tracks: EligibleTrack[];
  deadline: { date: string; title: string } | null;
}) {
  const copy = accountsCopy(lang);
  const nav = navCopy(lang);
  const meta = languageMeta(lang);
  const chips = [
    profile.grade ? nav.grades[profile.grade] : null,
    profile.region ? regionLabel(lang, profile.region) : null,
    profile.koreanLevel ? nav.korean[profile.koreanLevel] : null,
  ].filter((item): item is string => Boolean(item));
  return (
    <article className="kv-parent-notice" lang={meta.locale} dir={meta.dir}>
      <p className="kicker">
        <bdi dir="ltr">{DEMO_BANNER}</bdi>
      </p>
      {lang !== 'ko' ? <p className="muted">{copy.banner}</p> : null}
      <p className="kicker">{copy.noticeKicker}</p>
      <h2>{copy.noticeTitle}</h2>
      <p>
        <bdi>{nickname}</bdi>
        {sample ? ` · ${copy.sampleBadge}` : ''}
      </p>
      {sample ? <p>{copy.fake}</p> : null}
      <p>{copy.noticeLead}</p>
      {chips.length > 0 ? (
        <p>
          {chips.map((item) => (
            <span key={item} className="pill">
              {item}
            </span>
          ))}
        </p>
      ) : null}
      <h3>{copy.deadline}</h3>
      {deadline ? (
        <p>
          <bdi dir="ltr">{formatDay(deadline.date, lang)}</bdi> · <bdi>{deadline.title}</bdi>
        </p>
      ) : (
        <p>{copy.noDeadline}</p>
      )}
      <h3>{copy.noticeTracks}</h3>
      {tracks.length === 0 ? <p>{copy.noTracks}</p> : null}
      <ol>
        {tracks.slice(0, 8).map((track) => (
          <li key={track.id}>
            <bdi>{track.title}</bdi>
            {track.yearLabel ? (
              <>
                {' '}
                · <bdi dir="ltr">{track.yearLabel}</bdi>
              </>
            ) : null}
          </li>
        ))}
      </ol>
      <p>{copy.noticeCheck}</p>
    </article>
  );
}

# Information architecture

Four destinations. Anything else is a drill-in or a disclosure on the screen that owns the concept. One place per concept.

## Sitemap

| Destination | Hash | One job |
| --- | --- | --- |
| 내 전형 | `#/tracks` | Answer how many tracks fit, show the first three, and the next date |
| 게시판 | `#/board` | Find one support post |
| 일정 | `#/deadlines` | One calendar: exam dates and track windows |
| 내 정보 | `#/me` | This device’s answers, saved tracks, and settings |

The top bar is only these four, plus language and account. There is no sidebar, no nested destination list, and no counts on the bar.

Account and class tools are not a fifth destination. The account control opens a short menu:

| Menu item | Who | Hash | Job |
| --- | --- | --- | --- |
| 내 정보 | everyone | `#/me` | Same screen as the fourth destination |
| 시연 계정 | everyone | `#/accounts` | Create or switch a demo account on this device |
| 반 명단 | teacher | `#/class` | Roster for the signed-in teacher |
| 반 참여 | student | `#/join` | Enter a class code |
| 보호자 연결 | student or guardian | `#/family` | Link a guardian on this device |

`#/j/CODE` is the same join screen with the code filled in.

## Drill-ins (not in the bar)

| Hash | Reached from | Job |
| --- | --- | --- |
| `#/track/:id` | a track row on 내 전형 | One track: compare, save, print |
| `#/compare` | the track screen, after a track is added | Side-by-side of chosen tracks |
| `#/board/:id` | a post | One post |
| `#/onboarding` | 답 수정 | The question flow. Not a destination |

`#/schedule` opens 일정. The old public-date page is not a separate screen.

## What moved

| Used to be its own place | Now |
| --- | --- |
| Left sidebar, region buttons, student-type buttons | Gone. Region and school level are edited under 내 정보, and in full during onboarding |
| Compare in the bar, with a count | Only on the track screen and `#/compare` |
| Saved tracks on the home screen | A closed section on 내 정보 |
| Exam dates and “내 마감” as two calendars | One 일정 list |
| Profile chips on the home screen | Removed. The home sentence is the count |
| 시연 계정, 반 명단, 반 참여, 보호자 연결 in the bar | Account menu. The screens themselves are unchanged in job |

## Screens

### 내 전형

- Purpose: say how many tracks fit this device’s answers.
- Primary: the H1, `내가 쓸 수 있는 전형 {n}개`.
- Primary action: 자세히 on the first track that has a detail page. If none do, the action is 답 수정.
- Secondary: the first three tracks, and one next-date card that opens 일정.
- Tertiary, closed: the rest of the tracks.
- Not on this screen: compare, save, print, profile chips, the full calendar.

### 게시판

- Purpose: open one support post.
- Primary: the H1 게시판.
- Primary action: the search field.
- Secondary: category and region filters, then the post list.
- Tertiary: the open post replaces the list.

### 일정

- Purpose: the next dates, in one list.
- Primary: the H1 일정.
- Primary action: export the list as one calendar file.
- Secondary: each date row. Print is the other action in that row’s header.
- The list is exam dates plus verified windows for saved or compared tracks.

### 내 정보

- Purpose: see and correct the answers stored on this device.
- Primary: the H1 내 정보.
- Primary action: 답 수정, which opens onboarding.
- Secondary, open: grade, region, Korean level, goal.
- Tertiary, closed: saved tracks, theme and language, documents, quiz, privacy, and the local teacher note vault.
- A nationwide region’s contact list is a closed section on this page, not under every screen.

### Onboarding

- Purpose: one question at a time.
- Primary: the question H1.
- Primary action: 다음, with 뒤로 on the start side and 건너뛰기 / 나중에 끝내기 as text actions.
- There is no “왜 묻나요” line. The consent step is the only step that explains a purpose, and that copy is the consent text itself.

### Track, compare, account, class, join, family

Each of these has one H1 and one primary action (자세히 is already done; compare’s primary is print; class roster’s primary is the class code; join’s primary is the code submit; family and signup follow the same rule). Headings stop at H2. Lists of students, languages, and options use the 12px grid and 44px actions.

## Heading and spacing

- One H1 per screen. H2 only. Nothing deeper.
- Type jumps: 40px title, 22px track title, 16px body, 14px secondary.
- Option cards and action clusters use 12px gaps. Wrapped action rows use 8px between rows. Buttons are 44px tall.

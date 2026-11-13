# Study Vault: Features and Plan Rules

**Team reference — updated 13 November 2026**

This document describes the behavior currently implemented in the app and backend. It is intended to help product, support, content, and engineering answer plan questions consistently. Pricing-page copy and backend enforcement are separate parts of the project, so check both when changing a feature.

## Quick summary

- **Free** is an ongoing plan, not a time-limited Pro trial. It costs GHS 0 and does not require a payment.
- Free accounts can open papers from **2020 and 2021**, if those papers are uploaded and published.
- Free accounts can start **3 mock exams per calendar month**. The backend counts reservations, so starting a mock uses an allowance.
- **Pro Monthly** costs **GHS 49** for 30 days. **Pro Yearly** costs **GHS 499** for 365 days. Both are one-time payments with manual renewal; they do not auto-renew.
- Pro includes all published paper years, unlimited mocks, advanced performance analytics, detailed reports, Pro recommendations, and AI Study Chat (up to 15 messages per UTC day).
- Parent progress sharing is included only with Pro Yearly, with **3 exports per calendar month**.
- A paper appears in the shared library only when it is published. Uploading question data without publishing its paper metadata does not make it available in the app.

## Plan comparison

| Feature | Free | Pro Monthly | Pro Yearly |
|---|---|---|---|
| Price and duration | GHS 0, ongoing | GHS 49, 30 days | GHS 499, 365 days |
| Renewal | None | Manual; no automatic charge | Manual; no automatic charge |
| Published past-paper years | 2020–2021 | All available years | All available years |
| Mock attempts | 3 per calendar month | Unlimited | Unlimited |
| Objective mock scoring | Score and corrections after submission | Score and corrections after submission | Score and corrections after submission |
| Theory mock model answers | Pro-only | Included | Included |
| Past-question marking schemes and explanations | Locked | Included | Included |
| Basic performance metrics | Included | Included | Included |
| Advanced analytics | Locked | Included | Included |
| Mock-attempt history and detailed reports | Current calendar month summary | Full available history | Full available history |
| Rule-based focus suggestions | Lite suggestions can appear in the dashboard | Available as fallback | Available as fallback |
| AI-generated recommendations | Not available | Available when AI service is working; rules are used as fallback | Available when AI service is working; rules are used as fallback |
| AI Study Chat | Not included | Up to 15 messages per UTC day | Up to 15 messages per UTC day |
| Download or export own reports | Not available | Included | Included |
| Parent progress sharing | Not available | Not available | 3 exports per calendar month |
| Priority support | Not included | Not included | Not included |

## What each plan means for students

### Free

Free accounts can register and use the platform without a subscription. The library displays all published papers so students can see what the platform contains. Papers outside 2020–2021 are marked Pro-only and cannot be opened or started as a mock until the account has active Pro access.

The free plan includes three mock attempts per calendar month across the available free papers. The count is enforced by the backend and resets by UTC calendar month. Objective mock answers are checked by the server, and free students receive the answer key and explanation after submitting the mock. Past Questions practice does not reveal its marking scheme or explanations on the free plan. Theory mock answers are also withheld from free accounts.

Free performance access includes mock count, average score, and questions answered. The Reports page shows a summary for attempts completed in the current calendar month. The dashboard may show **rule-based “Lite” focus suggestions**; these are not the premium AI recommendations described on the pricing page.

### Pro Monthly

Pro Monthly unlocks all published years, unlimited mock attempts, past-question marking schemes and explanations, theory model answers, advanced analytics, full available mock history, detailed reports, and report export/printing. Access lasts 30 days from verified payment. The user must renew manually.

Pro Monthly does not include parent report sharing/export. It also does not include priority support.

### AI Study Chat

AI Study Chat is available to active Pro accounts only. The server verifies Pro access and enforces a limit of 15 messages per UTC day. Conversation history stays in the browser session and is sent as recent context to the AI provider; the app does not save chat transcripts to the user's account. The server stores only each day's message count. Students should avoid entering personal or sensitive information and check important explanations against class materials.

### Pro Yearly

Pro Yearly includes the Pro Monthly features for 365 days, plus up to three parent progress exports per UTC calendar month. The user must renew manually. The server verifies payment and expiry before granting Pro access.

## Content and access rules

1. Paper metadata is shared across signed-in accounts; it is not owned by the account that uploaded it.
2. Only paper records with `isPublished: true` appear in the library.
3. All published paper cards are visible, but access depends on plan:
   - Free: years 2020 and 2021.
   - Pro: every published year.
4. The backend checks the account and paper access before returning question content. Firestore rules deny direct reads of question and paper collections.
5. Free objective mocks do not receive the answer key while the mock is active. The server scores the submitted answers and returns corrections after completion.
6. Mock attempts and account entitlements are stored per user. A student cannot read another student's mock history through the app's Firestore rules.

## Common support answers

### “I created a new account and don’t see any free papers.”

Check that the paper for 2020 or 2021 has been uploaded and that its paper metadata is published. The free years are access rules; they do not create or populate those years automatically. Newer published papers may appear in the list as Pro-only.

### “I can see a paper but can’t open it.”

The paper is published and visible, but its year requires Pro for this account. The paper card should show a Pro access notice.

### “Why can I see some suggestions on Free if AI is marked Pro?”

The dashboard can show basic rule-based Lite suggestions. Pro unlocks the premium AI recommendation path. When the AI provider is unavailable, Pro also falls back to rule-based suggestions.

### “Why did my free mock allowance decrease when I exited?”

The backend counts a mock when it is reserved/started. Leaving an exam after it starts still consumes an attempt. The UI currently describes the allowance as mock exams per month; support should explain it as started mock attempts.

## Items for the team to confirm or improve

- **Free sample experience:** Free already has three monthly mocks and access to two years, but Past Questions hides the marking scheme. Decide whether to unlock one complete sample paper, including its marking scheme, so new students can judge the content quality.
- **Published free content:** Verify that at least one 2020 or 2021 paper is uploaded and published for each subject the team wants Free users to try.
- **Trial wording:** Do not call the current Free plan a “free trial.” It has no expiry. If the team later adds a Pro trial, document its duration, eligible accounts, payment-card requirement, and what happens when it ends.
- **Monthly reset wording:** The backend resets usage by UTC calendar month, not 30 days after signup. Make this explicit in student-facing copy if local time differences cause confusion.
- **Yearly discount badge:** The pricing page says “Save 16%.” Compared with 12 monthly payments (12 × GHS 49 = GHS 588), GHS 499 saves about 15.1%. Update the badge or price so the displayed claim is accurate.
- **Duplicated plan copy:** The plans are repeated in `src/pages/public/Pricings.jsx` and `src/pages/dashboard/Upgrade.jsx`. Keep both aligned with the backend constants and enforcement in `functions/index.js`.
- **Feature wording:** “Topic-wise explanations” is advertised, while the code currently gates question explanations/model answers generally. Confirm the content is actually organized by topic before using that phrase.

## Source-of-truth files

- Public plan cards and comparison: `src/pages/public/Pricings.jsx`
- In-app upgrade plans and payment flow: `src/pages/dashboard/Upgrade.jsx`
- Free-year, mock quota, payment expiry, content access, and parent-export enforcement: `functions/index.js`
- Past-question access and marking-scheme UI: `src/pages/dashboard/PastQuestions.jsx`
- Mock access and mock feedback: `src/pages/dashboard/MockExams.jsx`
- Basic versus advanced analytics: `src/pages/dashboard/Performance.jsx`
- Monthly summary, detailed reports, and parent sharing: `src/pages/dashboard/Report.jsx`
- Free Lite versus premium AI recommendations: `src/components/AIFocusCard.jsx` and `src/services/aiRecommendationService.js`
- Pro AI Study Chat: `src/pages/dashboard/AIChat.jsx`, `src/services/aiRecommendationService.js`, and `aiChat` in `functions/index.js`

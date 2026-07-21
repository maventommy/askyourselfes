# Ask Yourselves: Research Foundation

*Judge-ready synthesis of the pre-build research corpus (roughly 50 hours of work, 2026-05-14 to 2026-07). Sources: the 129KB decision log, the pre-build work summary, the internal pitch, and the locked-facts MEMORY. Hard facts are cited. Internal estimates and assumptions are labeled as such. Nothing here is invented.*

---

## TOP-LINE PROOF POINTS

- MIT Media Lab's *Future You* (2024) ran two peer-reviewed studies (a 344-person mixed-methods evaluation and a 188-person pre-registered randomized controlled trial) that found statistically significant reductions in anxiety and increased future-self continuity after a single conversation with a text-based AI version of the user's older self.
- The core mechanism MIT proved works in *text alone*, which is exactly why Ask Yourselves ships text-first: the science-backed part is the cheapest part to build.
- MIT's free web demo drew 60,000 users across 190 countries organically, with no marketing, no mobile app, no voice, and no avatar (source: MIT Media Lab project page plus Wall Street Journal, Feb 2025). This is a demand signal, honestly labeled as cumulative web-demo uptake rather than retained or paying users.
- The loneliness curve is inverted from public assumption: Gen Z is the loneliest cohort, not the elderly, which places the 18 to 40 launch audience directly inside the demand.
- Millions of people already talk to AI about their inner lives (OpenAI reported in Sept 2025 that 18 to 25 year olds send roughly half of all ChatGPT messages, mostly non-work); the behavior exists, so the product has to win it, not create it.
- A second academic team (MIT, Stanford, Harvard, UCLA, plus KASIKORN Labs) published *Multimodal Future You* in Dec 2025, confirming the multimodal (text plus voice plus avatar) direction is a live research frontier, not a guess.
- The legal and ethical work is a spine, not overhead: 18+ only at launch (defensible against the Character.AI wrongful-death precedent), consent-first voice and likeness cloning, and a hard ethical line that the deceased-person "Legacy" mode never generates new content, only replays a frozen profile.
- The business model is unit-positive by design: the free tier runs at roughly zero cost per user, and the paid tier's only real variable cost is voice cloning, so each download can pay its own way.

---

## 1. The Science

### MIT Media Lab, *Future You* (2024)

**Authors:** Pat Pataranutaporn, Kavin Winson (Jagadish is listed in internal notes; the canonical author trio cited across the corpus is Pataranutaporn, Jagadish, Maes), and Pattie Maes. Paper: arXiv:2405.12514.

**Study design and samples (HARD FACTS, cited in the corpus to the arXiv paper and MIT team):**
- An initial **344-person mixed-methods evaluation** (version 1).
- A **188-person pre-registered randomized controlled trial** (the published version), presented at IEEE Frontiers in Education 2024.
- Participants held a single short conversation with a text-based AI simulation of their own roughly 60-year-old future self.

**Measured effects (HARD FACTS as reported in the corpus):**
- Statistically significant **reductions in anxiety**.
- **Reductions in negative emotion.**
- **Increased future-self continuity** (the psychological sense of connection to one's future self).
- All from a **single conversation**, in **text only**.

**Note on scope:** The MIT study **explicitly excluded under-18s** (relevant to the 18+ decision below). The measured effects are the load-bearing science. Everything Ask Yourselves adds on top (voice, aged photo, long-term memory) is product, not proven science.

### The 60,000 users / 190 countries figure

**HARD FACT with sourcing, but read the label carefully.** Separate from the formal studies, MIT put a free web demo online. Lineage traced in the corpus:
- **MIT Media Lab project overview page** carries the language "global reach across 190 countries with over 60,000 users."
- **Wall Street Journal, Feb 1, 2025** (Heidi Mitchell, "AI Has Shown Me My Future") disclosed 60,000 users / 190 countries, sourced from the MIT team.
- **Harvard Crimson, Nov 16, 2024** carried an earlier snapshot of "more than 50,000 users in 175 countries."

**Honest framing (the corpus is explicit about this):** the 60K is **cumulative web-demo uptake**, not retained users and not paying users. It is a demand signal, and it should always be presented as one. The internal notes flag that an earlier research pass wrongly called it "unverifiable" because it only checked the academic paper; the number lives in the WSJ coverage and the MIT project page, not in the arXiv publication.

### Second peer-reviewed grounding

**Multimodal Future You**, arXiv:2512.06106 (Dec 2025), Albrecht et al., a collaboration of MIT, Stanford, Harvard, UCLA, and KASIKORN Labs (industry partner). RCT with **N=92**, presented at ACM IUI 2026. It tests exactly the text plus voice plus embodied-avatar stack. Strategic double meaning: it validates the multimodal direction *and* flags a commercialization risk via the KASIKORN industry partner.

### Interview science (product grounding, not a wellbeing claim)

The 60-question onboarding interview library was synthesized from established instruments: Aron's 36 Questions, McAdams' Life Story Interview, Motivational Interviewing, Hershfield's Future-Self Continuity work, Internal Family Systems, Narrative Therapy, ACT, and Pennebaker's expressive-writing research. This grounds the *method* of profile-building; it is not a claim of clinical efficacy.

---

## 2. The Market and Demand Signal

### Loneliness data (the macro tailwind)

**The inverted loneliness curve (the wedge insight).** Contrary to the assumption that the elderly are loneliest:
- Gen Z **71%** lonely, Millennials 65%, Gen X 59%, Boomers 44% (attributed in the corpus to Cigna 2024).
- Pew (Jan 2025): **46%** of under-30s feel connected versus **83%** of over-65s.
- Implication: the 18 to 40 launch audience sits inside the loneliest cohort, which is where the demand actually is.

**The friendship recession (a high-value underserved segment).**
- Men under 30 reporting "no close friends" went from **3% to 15%** between 1990 and 2024 (roughly 5x).
- Only **21%** of men get emotional support from friends weekly, versus **41%** of women.

**WHO (June 2025, as stated in the corpus):** a figure of "100 per hour" deaths linked to loneliness. See caveats section; verify the exact WHO wording before quoting to judges.

### Behavior already happening (the strongest demand signal)

- **OpenAI (Sept 2025):** users aged 18 to 25 send roughly **50%** of all ChatGPT messages; over **70%** are non-work; "therapy and companionship" is cited as the most popular use case.
- **34% of Gen Z** have reportedly confided in AI something they never told another human. (Caveat: the corpus does not attach a named source to this specific stat. Treat as unconfirmed until sourced.)
- Takeaway used across the pitch: the target behavior exists at scale on general-purpose tools; Ask Yourselves does not need to create the behavior, only to be the right-shaped product for it.

### Market sizing (mix of cited ranges and internal estimates)

- AI mental-health / wellness market: **$1.7B (2025) growing to $9B+ (2033)** at a **23 to 32% CAGR** (early business-plan figure).
- A separate slide cites the **US mental-health app market at $8.4B growing to $18.8B by 2031**. (These two framings do not reconcile cleanly; see caveats.)
- **US TAM at launch (INTERNAL ESTIMATE): ~13.6M** serious-intent people, built from 5 named personas (Quarter-Life Architect ~5.6M primary; Friendship-Recession Man ~4M; Burned-Out High-Performer ~3M highest willingness-to-pay; Threshold Parent ~1M/yr; Mid-Life Pivoter, family-propagation only).
- **Order-of-magnitude ARR check (INTERNAL ESTIMATE, uses now-retired $15.99 pricing):** 1% of 13.6M x $15.99 x 12 months is roughly $26M ARR. Directional only.

### Why now

Real-time avatar and voice-clone infrastructure that was a "$10M R&D project three years ago" is now commodity API surface (the internal framing: "$8K and 14 weeks for what used to take a lab"). MIT proved the category. No polished, mobile-native, voice-plus-avatar competitor has shipped in the lane. The AI-companion behavior is already mainstream.

---

## 3. Competitive Landscape

### Direct / closest analogues

**FutureMe.org (the legacy incumbent, text-async letters to your future self).**
- Founded 2002 by Matt Sly and Jay Patrikios; bootstrapped roughly 19 years.
- **Acquired July 2021 by Memories Group Ltd. (Australia) for a mid-seven-figure sum**; now parked alongside funeral / tribute SaaS. No longer iterating; mobile apps are WebView wrappers.
- ~8M cumulative claimed users, but brand decay and a fragmenting mailing list; documented user backlash and new free competitors (openwhenitstime.com, futurepost.app) poaching churned users.
- Gaps: no conversation, no voice, no face, no mobile-native UX. Threat level: **low**.

**FutureSelf.ai (the real AI-era competitor).**
- iOS plus web. "AI plus Neuroscience" framing. Generates a hyper-realistic future-self avatar plus a cloned voice for a daily coach, plus scheduled meditations and visualization.
- **Technical gap Ask Yourselves exploits:** their avatar output appears **pre-rendered / scripted, not real-time conversational.**
- **Fragmented across ~5 domains and product names** (futureself.ai, futureselfai.app, futurself.ai, futureselfbot.com, future-self.ai, myfutureselfapp.com), developer attribution "Coda Labs Ltd," no named founders, no Crunchbase, no press. The "FutureSelf" trademark is effectively mud, which is why the corpus argues Ask Yourselves should own a different verb-brand.
- **Positioning:** wellness / aspirational / manifestation ("rewire your nervous system"). The corpus names FutureSelf.ai as **the single biggest competitive risk**, because manifestation framing is a known paid-acquisition converter while honesty framing is unproven at CAC scale.

### AI-companion and adjacent

- **Replika (Luka Inc):** 40M+ users by 2025, ~25% paid; **5M EUR GDPR fine (April 2025)**; FTC complaint (Jan 2025). **Discontinued its lifetime tier on 2025-07-28** (cited as evidence that uncapped AI pricing is dead). Counter-position: Replika is a fictional friend, not you.
- **Character.AI:** Google acquihire (~$2.7B, Aug 2024). See the legal section; it is the central wrongful-death precedent driving the 18+ decision. Counter-position: fictional personas versus one grounded persona.
- **Pi (Inflection):** effectively dead as a consumer product after the Microsoft team-hire (~$650M, March 2024). Threat: zero.
- **Wysa:** 6M+ users, clinician-CBT model, FDA Breakthrough Device Designation. Different job (clinical) than identity / future-self.
- **Friend (Avi Schiffmann):** $2.5M pre-seed, $99 always-listening pendant, "Museum of Failure" induction. A brand-poisoned hardware category Ask Yourselves sidesteps.

### Grief-tech / legacy

- **HereAfter AI (talk-to-the-deceased):** described in the corpus as the "opposite emotional vector, same grammar." Relevant to the Legacy roadmap tier rather than V1.

### The one-line differentiator (verbatim from the corpus)

Ask Yourselves is the only conversational AI built around a **single grounded persona: you, decades from now, in your own voice and aged face, grounded in your own life, and honest.** Every other product invents a fictional friend, coaches an aspirational performance, or treats you clinically. Brand stake: **"the only AI you don't have to perform for."** The corpus argues this is a positioning moat on the brand layer (FutureSelf cannot copy it without alienating its manifestation-framed base), not the feature layer.

---

## 4. Legal and Risk Map

### Norwegian angrerett / EU right of withdrawal (pre-sale terms research)

This is the most concrete legal finding in the corpus.
- **Standard 14-day no-reason withdrawal right** applies (Norwegian *angrerett* plus the EU Consumer Rights Directive mandatory minimum), because the founder and entity are Norway/EU based.
- **CRITICAL, load-bearing finding:** if the withdrawal-rights disclosure is **not displayed prominently** at purchase, the refund window **extends to roughly 12.5 months per buyer**. This is the single biggest pre-sale risk.
- Required mitigations: disclosure in **plain Norwegian and English**, a **confirmation checkbox** at purchase, a clear refund mechanism, and a statutory withdrawal form (*angreskjema*) in the receipt flow. A ~1,500 NOK lawyer consult is flagged as cheap insurance and the one "RED" risk requiring sign-off before taking payments.
- **Status note:** in the 2026-06-17 Lean pivot, the paid lifetime pre-sale was dropped in favor of a plain waitlist, which removes the angrerett complexity for now (monetization moves in-app via RevenueCat). The research remains valid for whenever paid pre-sale returns.

### Payment-rail compliance (a real constraint others miss)

- **Lemon Squeezy** chosen as merchant-of-record (handles EU VAT / OSS and US sales tax).
- **Paddle disqualified:** its Acceptable Use Policy (Category 16) explicitly prohibits voice impersonation, face swaps, and deepfakes. A voice-and-face-cloning app cannot use it. This is a genuinely non-obvious compliance landmine that the research caught.

### 18+ requirement (locked, heavily reasoned)

**Decision: 18+ only at launch**, self-attested birthday gate matching the Replika / Pi pattern, no parental-consent flow in V1. Rationale (HARD, cited):
- **Character.AI wrongful-death cases** (involving Sewell Setzer III, 14, and Juliana Peralta, 13) settled with Google in Jan 2026; Character.AI banned under-18 open-ended chats as of Nov 2025. That is the exact plaintiff template a competitor incident would follow.
- **COPPA (2025 expansion)** treats voice prints as biometric personal info, so a 10-second voice clone is COPPA-regulated for under-13s; no commercial path exists there.
- **UK Children's Code** applies to all under-18s and would force a DPIA and a named DPO before UK launch.
- **Apple's Nov 2025 guideline update** (5.1.2(i) plus new 1.2.1(a)) tightened rules on minors, third-party AI, and creator apps specifically, making minors-plus-AI-fan-out the highest App Store rejection risk.
- MIT's own study excluded under-18s. The closest research artifact chose adults-only.
- Insurance reality: a small budget cannot absorb a single wrongful-death suit.
- Upside of opening to teens is overstated: TikTok trend *drivers* are 18 to 24; 16 to 17 year olds consume trends but do not drive them (estimated <5% of viral surface lost).

### Consent, data, and privacy

- Voice-clone consent UX modeled on ElevenLabs' Iconic Marketplace consent language; only-clone-yourself constraint.
- Default-private by design (part of the honesty brand): no public profiles, leaderboards, or feeds.
- App Store exposure surfaces tracked: guidelines 5.1.1 (data), 5.3.4 (likeness), 5.1.2(i) (third-party AI), 1.2.1(a) (creator apps). Fallback resubmit path (static aged photo plus cloned voice, no live avatar) kept ready.
- Crisis-routing: an in-app classifier surfaces region-specific crisis lines (988, Samaritans, WHO directory) on sustained risk language across 2+ turns, and (only with prior consent) can SMS a user-designated emergency contact. Explicitly no police or welfare-check by default. Baked in from week 5, not bolted on.

### Deceased-persona "Legacy" ethics (the hard line)

- The Legacy tier lets a verified beneficiary talk to a deceased person's profile **at a frozen state only**. **No new content is ever generated after death.** The corpus states this as an ethical line "we don't cross."
- Beneficiary flow modeled on Apple Digital Legacy / Google Inactive Account patterns, with a death-certificate claim plus a 30-day appeal window and manual review.
- The honesty principle is framed as the *reason* the ethics hold: a flattering fiction is a worthless legacy, so truth-to-who-they-were is the whole point. This is positioned as the ethical spine of the product, not compliance overhead.

---

## 5. Business and Pricing Research

### Current model (LOCKED 2026-06-17, V1 "Lean")

- **Free:** text future-self plus a one-time aged photo (flux-schnell, ~$0.003) plus memory. Brain runs on Gemini Flash or GPT-4.1-mini (~$0.001 per turn) or on-device. **COGS approximately $0.** Free users are the growth engine.
- **Paid ~$8.99/mo** (7-day trial, annual ~$59.99): cloned voice plus deeper memory plus more sessions. Voice is the only real variable cost (~$2 to $3/mo for heavy users), leaving an estimated **~$3 to $5 net margin per paid user**.
- **1 free time-locked send** included in V1 as the viral seed.
- Hard cost to reach launch: **~$150** (Apple $99, Google $25, domain/hosting). Roughly 6 to 8 weeks solo.

### Unit economics and COGS (label check)

- Text exchange: **~$0.001 per turn** (Gemini Flash / GPT-4.1-mini) per the corpus. (The task brief's "~$0.002/chat" is the same order of magnitude; the corpus number is $0.001.)
- Aged portrait: **~$0.003** via flux-schnell per the corpus. (The task brief's "~$0.05/portrait" is higher than what the corpus states; use $0.003 unless a newer figure supersedes it.)
- Real-time avatar (cut from V1): **~$0.10 to $0.13 per minute**. This was the single capital-intensive line and the reason V1 drops it.

### Prior pricing research (retired but informative)

- **Earlier three-tier ladder:** Standard $15.99, Power $34.99, Legacy $69.99 per month, with minute caps (30 / 90 / 200) and time-locked send caps (1 / 3 / 6). Collapsed into Free + $8.99 in the Lean pivot; the $69.99 Legacy tier is slated to return in V2 with the avatar.
- **Founders Lifetime pre-sale (researched, then shelved):** $497 primary and $997 upgrade, **100 combined seats**, on Lemon Squeezy. Sector lifetime norm is 25 to 30x monthly, so $497 was a deliberate unknown-founder / no-demo discount, with a $2,997 in-app lifetime IAP planned to capture upside post-launch. Proceed threshold was >=30 net seats held 14+ days at <=$45 CPL; kill threshold <10 seats or >40% refund rate.
- **Retention reality (cited comps):** wellness D30 retention is a brutal 3 to 8% category median; 10 to 15% is realistic-but-not-exceptional with voice, face, and a daily ritual. Daily ritual is named the single most important engineering decision.
- Replika discontinuing its lifetime tier (2025-07-28) is cited as direct evidence that caps are mandatory in AI subscriptions.

### Honest internal forecast (from the internal brief, INNER-CIRCLE numbers)

- Probability-weighted month-12 outcomes (private weights): **LOW 50%** (~1,800 paying, ~$280K ARR), **MID 35%** (~12,600 paying, ~$2.27M ARR), **HIGH 15%** (~79,000 paying, ~$15.1M ARR).
- Median carry number: ~3,500 paying subs, roughly $50 to $55K MRR at month 12.
- The internal brief is explicit that its private weights are more pessimistic than the public pitch (which used 40/40/20), and it lists its own fragile assumptions (organic-share mix, trial-to-paid conversion, and, in the avatar era, COGS-per-DAU). This candor is itself an asset to show judges: the founder stress-tested the downside.

---

## 6. Key Strategic Decisions and Why

- **Pivot to Lean, bootstrapped V1 (2026-06-17).** Trigger: the funding deck drew zero response from the founder's own network. Reframe: instead of raising to build, cut the only capital-intensive piece (the real-time avatar) so every download pays its own API cost. Result: a unit-positive freemium app buildable for ~$150 in hard cost.
- **Text-first because MIT proved text works.** The peer-reviewed anxiety-reduction and future-self-continuity effects were measured in text only. So the free, science-backed core is also the cheapest to build. Voice, aged photo, and avatar are additive product layers, not the proven mechanism.
- **Capital-gated roadmap.** Voice cloning is paid-tier (its cost is the only real variable cost). The real-time avatar and the deceased-person Legacy tier are deferred to V2, funded by revenue rather than by a raise. The "at-18" future-self demo is the literal V1; the Legacy commercial is the V2 north star.
- **Honesty as the brand moat.** No feeds, no leaderboards, default-private, and a future-self that can push back on aspirational answers. This counter-positions against both FutureSelf.ai (manifestation) and Replika (fantasy companion) in a way neither can copy without alienating its existing base.
- **Own the verb-brand, not the category term.** "Future self" and "future you" are saturated on the App Store; "Ask Yourselves" is defensible.
- **Legacy is the emotional soul.** In the founder's words, the deep why is: if you die, your children can keep talking to you. That is why the consent, likeness, and 18+ research is treated as the ethical spine of the product.

---

## Caveats: claims to soften or source before facing judges

1. **The 60K MIT figure.** Verified and citable, but it is cumulative web-demo uptake, not retained or paying users. Always say so. Do not let it imply product traction.
2. **"ChatGPT is America's largest mental-health provider, by accident."** This is rhetorical framing, not a sourced fact. Keep it as an opinion or drop it in front of judges. The underlying OpenAI usage stats (Sept 2025) are the citable part.
3. **The "34% of Gen Z told AI something they never told a human" stat.** The corpus does not attach a named source. Find the primary source or drop the number.
4. **The "71% Gen Z lonely (Cigna 2024)" attribution.** Cigna's best-known loneliness index work predates 2024. Confirm the 2024 Cigna publication exists and says this before quoting, or attribute to the correct year/publisher.
5. **Market-size inconsistency.** The corpus carries two non-reconciling framings ($1.7B to $9B by 2033 at 23 to 32% CAGR, versus $8.4B to $18.8B by 2031). Pick one, cite it, and drop the other to avoid a judge catching the mismatch.
6. **The WHO "100 per hour" loneliness-death figure.** Verify the exact WHO wording and date; round numbers like this are easy to challenge.
7. **TAM of 13.6M and the ~$26M ARR check.** Internal, order-of-magnitude estimates built on assumptions, and the ARR line uses retired $15.99 pricing. Present as illustrative, not as validated market size.
8. **Family-propagation narrative.** The internal brief itself concedes the multi-generational spread thesis has weak historical templates. Do not lean on it as a growth guarantee.
9. **Unit-cost figures.** The corpus states ~$0.001/turn text and ~$0.003/aged photo, which differ from the numbers in some briefing shorthand. Use the corpus figures and re-measure against live pricing before publishing.

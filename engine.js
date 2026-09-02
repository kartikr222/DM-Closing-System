/* ==========================================================================
   DM Closing System™ — client-side diagnostic engine.
   This build ships without a live model behind it, so the engine here is a
   transparent heuristic scorer over the pasted text (keyword + structure
   signals), wired to the exact AnalysisOutput shape the real Claude-backed
   API route would return. Swap `runHeuristicEngine` for a fetch('/api/analyze')
   call once ANTHROPIC_API_KEY is wired up server-side — the UI needs zero
   changes, since it only ever reads the shape below.
   ========================================================================== */

const STATE_ORDER = ['OPEN','CURIOUS','EXPLORING','PROBLEM_AWARE','VALUE_AWARE','QUALIFYING','HESITATING','OBJECTION','COMMITMENT','DECISION','STALLING','DISENGAGING'];

const DEMO_CONVERSATION = {
  title: "SaaS Founder — CRM Migration",
  desired_outcome: "Qualify",
  raw_text:
`Prospect: Hey, saw your post about data migration. We're currently on HubSpot but it's way too expensive for what we actually use.
You: What are you mainly using it for right now?
Prospect: Honestly just contact management and email sequences. We're paying like $800/month and probably using 20% of the features.
You: That's pretty common. How long have you been thinking about switching?
Prospect: Few months. I brought it up to the team but everyone's worried about the migration being a nightmare. We've got like 15,000 contacts and a bunch of custom fields.
You: Makes sense. What would need to happen for you to feel confident making the move?
Prospect: I guess I'd need to know it won't break everything and that we won't lose data. Also our sales guy is pretty attached to his workflows.
You: Have you looked at other options yet or just exploring?
Prospect: Looked at Pipedrive and Close. Both seem fine but honestly I'm not sure how to evaluate this properly. Never done a migration before.`,
  analysis: {
    conversation_state: { state: "HESITATING", confidence: 82,
      evidence: [
        "Problem acknowledged (\u201cway too expensive\u201d)",
        "Solution explored (\u201clooked at Pipedrive and Close\u201d)",
        "Explicit hesitation (\u201cworried about migration being a nightmare\u201d)",
        "Team friction mentioned (\u201csales guy is pretty attached\u201d)"
      ]},
    closing_readiness: { overall_score: 67,
      dimensions: { trust:70, problem_ownership:75, intent:65, clarity:60, momentum:55, commitment:45, friction:35 },
      explanation: "Readiness is moderate. The problem is clearly owned (overpaying + underutilizing), intent is visible (actively researching), but commitment is blocked by fear (data migration risk) and organizational friction (team resistance)." },
    situation: "They've named the real problem out loud — $800/month for 20% usage — and they've already shopped Pipedrive and Close. What's stalling them isn't budget or interest, it's a fear of a botched migration and a sales rep who's attached to his workflows. They said, in plain words, that they don't know how to evaluate this properly.",
    signals: {
      observed: [
        { type:"positive", signal:"Quantified pain point", quote:"$800/month and probably using 20% of the features" },
        { type:"positive", signal:"Active research", quote:"Looked at Pipedrive and Close" },
        { type:"negative", signal:"Team resistance", quote:"sales guy is pretty attached to his workflows" },
        { type:"negative", signal:"Decision uncertainty", quote:"not sure how to evaluate this properly" }
      ],
      inferred: [
        { inference:"Primary decision maker or strong influencer", confidence:"high", reasoning:"Speaking about bringing it to the team, evaluating options independently" },
        { inference:"Risk aversion is the real blocker, not budget", confidence:"high", reasoning:"Already paying $800/month — concerned about \u201cbreaking everything,\u201d not cost" },
        { inference:"Lacks a framework for evaluation", confidence:"medium", reasoning:"Admits uncertainty about how to evaluate; may value expert guidance over a pitch" }
      ]
    },
    risks: [
      { risk:"Pitching a solution now would trigger sales resistance", severity:"high" },
      { risk:"They may default to a competitor if you don't establish expertise first", severity:"medium" },
      { risk:"Team friction could kill the deal even if the prospect is convinced", severity:"medium" }
    ],
    next_move: {
      objective:"Position as expert guide rather than vendor — move them from hesitation into an evaluation framework.",
      move:"Help them think through the migration concern specifically. Don't pitch. Don't offer to solve it yet. Demonstrate expertise by asking the question they should already be asking themselves.",
      why_now:"They've acknowledged the problem and started research, but admitted they lack a framework to evaluate it. This is the moment to earn authority through guidance, not sales pressure.",
      avoid:["Offering a demo or call","Explaining your migration process","Sending a case study","Stacking more qualifying questions","Pitching your solution"],
      success_signals:["They engage with the question and think it through out loud","They ask for your perspective directly","They share more detail about their setup unprompted"]
    },
    responses: {
      safe:{ message:"The migration worry makes sense \u2014 most people's mental image of it is worse than reality, but some migrations genuinely are rough. Usually comes down to how the data's structured on the HubSpot side. Do you know if your custom fields are mostly standard property types, or did someone build a bunch of complex formulas and dependencies?", reasoning:"Validates the concern, demonstrates real expertise, and asks a diagnostic question that helps them think through their actual risk level. Non-threatening. Positions you as guide, not vendor." },
      sharp:{ message:"That $800/month is almost $10k a year for features you're barely touching. The migration fear is valid, but here's what most people skip: what's the actual worst case? Usually it's \u201ctakes longer than expected,\u201d not \u201cdata destroyed.\u201d Have you actually mapped out what \u201cbreaking everything\u201d would mean for you specifically?", reasoning:"Reframes the cost, challenges the fear with logic, and pushes them to separate perceived risk from actual risk \u2014 still focused on their thinking, not your solution." },
      bold:{ message:"Real talk \u2014 the migration itself is rarely the hard part. The hard part is your sales guy. If he's not on board, the cleanest CRM in the world won't save this deal. What does he actually need to feel safe here?", reasoning:"Names the unspoken blocker directly. High risk, high reward \u2014 only fire this if trust is already strong, since it skips past the polite version entirely." }
    },
    dont_send:{ message:"Totally understand! We've helped dozens of companies migrate from HubSpot without any issues. We have a proven process that ensures zero data loss and minimal downtime. Would you be open to a quick 15-min call to walk through how we handle migrations?",
      why_tempting:"It directly answers their stated fear, leans on social proof, and offers a clear next step.",
      why_wrong:"It shifts the conversation from their problem to your solution too early, sounds like every other vendor pitch, and asks for a commitment before you've earned any unique value. Expect a \u201clet me think about it\u201d and a slow fade." },
    watch_for: [
      { signal:"They engage and describe their data structure", meaning:"Rising engagement \u2014 they're accepting you as a helpful resource.", next_action:"Continue the diagnostic conversation. Help them self-identify their own risk level." },
      { signal:"They ask what you'd recommend or how you'd approach it", meaning:"Authority established. They're now seeking your expertise.", next_action:"Now you can introduce your approach \u2014 frame it as education first, offer second." },
      { signal:"Short reply or \u201cnot sure\u201d", meaning:"Lower intent than it first appeared, or just bad timing.", next_action:"Offer one more useful insight without asking for anything. Leave the door open and step back." }
    ],
    follow_up: { recommendation:"WAIT", reasoning:"The ball is in their court after your last question. Following up inside 24\u201348 hours would read as pushy. If there's no reply after 3\u20134 days, reopen with value \u2014 a migration insight or a relevant story \u2014 never a \u201cjust checking in.\u201d", suggested_timing:"3\u20134 days" }
  }
};

/* ---------------- heuristic scorer for user-pasted text ---------------- */

const LEX = {
  price:['expensive','cost','price','budget','$','pricing','afford'],
  interest:['interested','love','sounds good','tell me more','how does','curious','like the idea'],
  hesitation:['not sure','worried','nervous','hesitant','thinking about it','need to think','concerned'],
  objection:['but','however','issue is','problem is','too much','can\'t','won\'t work','skeptical'],
  commitment:['let\'s do it','sign up','ready to start','when can we','sounds like a plan','book a','yes let\'s'],
  disengage:['not now','maybe later','busy right now','stop messaging','not interested','no thanks'],
  research:['looked at','compared','checked out','researching','evaluating','other options'],
  team:['my team','we discussed','boss','manager','colleague','partner','co-founder'],
};

function scoreLexicon(text, words){
  const t = text.toLowerCase();
  let hits = 0;
  words.forEach(w => { if(t.includes(w)) hits++; });
  return hits;
}

function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }

function runHeuristicEngine(rawText, context, desiredOutcome){
  const text = (rawText || '').trim();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if(wordCount < 8){
    return buildInsufficientData(text);
  }

  const price = scoreLexicon(text, LEX.price);
  const interest = scoreLexicon(text, LEX.interest);
  const hesitation = scoreLexicon(text, LEX.hesitation);
  const objection = scoreLexicon(text, LEX.objection);
  const commitment = scoreLexicon(text, LEX.commitment);
  const disengage = scoreLexicon(text, LEX.disengage);
  const research = scoreLexicon(text, LEX.research);
  const team = scoreLexicon(text, LEX.team);

  // pick dominant state
  let state = 'EXPLORING', conf = 58;
  if(disengage>0){ state='DISENGAGING'; conf=74; }
  else if(commitment>0){ state='COMMITMENT'; conf=80; }
  else if(objection>1){ state='OBJECTION'; conf=71; }
  else if(hesitation>0 && (research>0||price>0)){ state='HESITATING'; conf=76; }
  else if(hesitation>0){ state='STALLING'; conf=63; }
  else if(price>0 && interest>0){ state='VALUE_AWARE'; conf=68; }
  else if(price>0){ state='PROBLEM_AWARE'; conf=64; }
  else if(interest>1){ state='CURIOUS'; conf=66; }
  else if(lines.length<=2){ state='OPEN'; conf=55; }

  const trust = clamp(48 + interest*8 - objection*4, 15, 92);
  const problem_ownership = clamp(40 + price*10 + (text.includes('need')?8:0), 15, 92);
  const intent = clamp(40 + research*10 + commitment*15 - disengage*20, 5, 95);
  const clarity = clamp(50 + (wordCount>60?12:0) - (wordCount<20?15:0), 10, 90);
  const momentum = clamp(50 + (lines.length>4?10:-6) - disengage*18, 5, 92);
  const commitment_s = clamp(30 + commitment*22 - hesitation*8 - disengage*15, 5, 95);
  const friction = clamp(20 + hesitation*14 + objection*12 + team*6, 5, 90);

  const overall = Math.round((trust+problem_ownership+intent+clarity+momentum+commitment_s+(100-friction))/7);

  const observed = [];
  if(price>0) observed.push({type:'positive', signal:'Cost or budget explicitly raised', quote:firstMatch(text, LEX.price)});
  if(research>0) observed.push({type:'positive', signal:'Actively comparing options', quote:firstMatch(text, LEX.research)});
  if(interest>0) observed.push({type:'positive', signal:'Verbal interest signal', quote:firstMatch(text, LEX.interest)});
  if(hesitation>0) observed.push({type:'negative', signal:'Hesitation language present', quote:firstMatch(text, LEX.hesitation)});
  if(objection>0) observed.push({type:'negative', signal:'Objection or pushback framing', quote:firstMatch(text, LEX.objection)});
  if(team>0) observed.push({type:'neutral', signal:'A third party (team/boss) is involved in the decision', quote:firstMatch(text, LEX.team)});
  if(observed.length===0) observed.push({type:'neutral', signal:'Conversation is early — not enough explicit signal yet', quote:lines[0]?.slice(0,80)});

  const inferred = [];
  if(friction>45) inferred.push({inference:'An unstated blocker is doing more work than price', confidence:'medium', reasoning:'Hesitation/objection language outweighs any stated budget concern.'});
  if(team>0) inferred.push({inference:'This is not a single-player decision', confidence:'high', reasoning:'A team member or boss was referenced directly.'});
  if(intent>65) inferred.push({inference:'Genuine intent to act, not idle curiosity', confidence:'high', reasoning:'Research and forward-looking language outweigh hedging.'});
  if(inferred.length===0) inferred.push({inference:'Too early to infer motive with confidence', confidence:'low', reasoning:'Message volume is still low — treat any read here as provisional.'});

  const risks = [];
  if(state==='HESITATING'||state==='STALLING') risks.push({risk:'Pitching now reads as pressure and stalls momentum further', severity:'high'});
  if(disengage>0) risks.push({risk:'Prospect is signaling disengagement — a hard pitch here likely ends the thread', severity:'high'});
  if(team>0) risks.push({risk:'A third party you can\'t see or influence directly is part of this decision', severity:'medium'});
  if(risks.length===0) risks.push({risk:'No major red flags detected yet — the main risk is moving too fast', severity:'low'});

  const nextMoveByState = {
    DISENGAGING: {objective:'Protect the relationship, not the deal.', move:'Send one low-pressure, no-ask message that gives them an easy out, then stop.', why_now:'Any push right now accelerates the exit. Silence with dignity keeps the door open.', avoid:['Asking again','Guilt-tripping','Multiple follow-ups'], success:['Any reply at all','They re-engage on their own timing']},
    COMMITMENT: {objective:'Convert stated intent into a concrete next step.', move:'Propose one specific, low-friction action with a real time attached — not a vague "let\'s connect."', why_now:'They\'ve signaled readiness. Vagueness here is the only way to lose it.', avoid:['Re-explaining value they already believe','Adding new information','Multiple options that create decision fatigue'], success:['They confirm a specific time or action','They ask "what do you need from me?"']},
    OBJECTION: {objective:'Understand the real shape of the objection before responding to it.', move:'Ask one direct question that isolates whether this is the real objection or a stand-in for something else.', why_now:'Answering the surface objection before understanding it usually just produces the next objection.', avoid:['Rebuttal scripts','Overwhelming with counter-evidence','Getting defensive'], success:['They elaborate on the real concern','Tone softens']},
    HESITATING: {objective:'Move from hesitation to a concrete evaluation framework.', move:'Help them think through their specific blocker out loud — don\'t pitch, don\'t offer to solve it yet.', why_now:'They\'ve named the problem but lack a way to evaluate it. This is the authority-building moment.', avoid:['Offering a demo or call','Pitching your solution','Sending generic collateral'], success:['They think out loud with you','They ask what you\'d do in their position']},
    STALLING: {objective:'Surface the real reason for the pause without pressure.', move:'Name what you\'re noticing plainly and ask if it\'s accurate — give them room to correct you.', why_now:'Guessing wrong is fine here; staying silent is what loses the thread.', avoid:['Repeated check-ins','Assuming price is the issue without asking'], success:['They confirm or correct the read','Conversation re-opens']},
    VALUE_AWARE: {objective:'Sharpen the value they already see into a reason to act now.', move:'Connect their stated cost/pain to a concrete number or outcome specific to their situation.', why_now:'They see the value in the abstract — this converts it to urgency.', avoid:['Generic ROI claims','Overselling'], success:['They ask a forward-looking question ("how would this work for us")']},
    PROBLEM_AWARE: {objective:'Deepen problem ownership before introducing any solution.', move:'Ask one question that makes the cost of the problem more concrete to them.', why_now:'They\'ve named the problem but haven\'t felt its full weight yet.', avoid:['Jumping to your solution','Listing features']},
    CURIOUS: {objective:'Convert curiosity into a specific, answerable question.', move:'Answer their interest with one sharp, specific insight — not a general pitch.', why_now:'Curiosity fades fast without a concrete hook.', avoid:['Overwhelming with information','Asking for a call too early']},
    EXPLORING: {objective:'Understand what they\'re actually trying to solve.', move:'Ask one open, specific question about their current situation.', why_now:'Not enough is known yet to recommend anything more targeted.', avoid:['Pitching anything','Assuming their problem']},
    OPEN: {objective:'Establish a real conversation, not a transaction.', move:'Respond to what they actually said — specifically, not with a template opener.', why_now:'First impression sets the tone for everything that follows.', avoid:['Generic greetings','Pitching immediately']},
  };
  const nm = nextMoveByState[state] || nextMoveByState.EXPLORING;

  const situation = buildSituation(state, {price,research,hesitation,objection,team,commitment,disengage}, lines);

  return {
    conversation_state:{ state, confidence:conf, evidence: observed.slice(0,4).map(o=>o.signal) },
    closing_readiness:{ overall_score: overall, dimensions:{trust,problem_ownership,intent,clarity,momentum,commitment:commitment_s,friction}, explanation: buildReadinessExplanation(overall, {trust,intent,commitment:commitment_s,friction}) },
    situation,
    signals:{ observed, inferred },
    risks,
    next_move:{ objective:nm.objective, move:nm.move, why_now:nm.why_now, avoid:nm.avoid||[], success_signals:nm.success||['A specific, concrete reply — not a one-word deflection'] },
    responses: buildResponses(state, lines, desiredOutcome),
    dont_send: buildDontSend(state),
    watch_for:[
      {signal:'A specific, detailed reply', meaning:'Engagement is rising — they\'re investing effort.', next_action:'Match their depth. Keep going down this thread.'},
      {signal:'A short or delayed reply', meaning:'Interest may be cooling, or timing is just off.', next_action:'Don\'t chase. Offer one more piece of value, then give it space.'},
      {signal:'A direct question back to you', meaning:'They\'re handing you the authority seat.', next_action:'Answer it precisely, then stop talking.'},
    ],
    follow_up: buildFollowUp(state)
  };
}

function firstMatch(text, words){
  const t = text.toLowerCase();
  for(const w of words){ if(t.includes(w)){
    const idx = t.indexOf(w);
    const snippetStart = Math.max(0, idx-24);
    return '…' + text.slice(snippetStart, idx+w.length+24).trim() + '…';
  }}
  return '';
}

function buildSituation(state, sig, lines){
  const parts = [];
  const openers = {
    HESITATING:"They're leaning in but something is holding them back from committing.",
    STALLING:"Momentum has stalled — they've gone quiet on moving forward without explicitly saying no.",
    OBJECTION:"They've raised a specific pushback that needs to be understood before it can be answered.",
    COMMITMENT:"They're signaling genuine readiness to move — the risk now is fumbling the handoff.",
    DISENGAGING:"Signals point toward pulling away from the conversation.",
    VALUE_AWARE:"They see the value but haven't connected it to urgency yet.",
    PROBLEM_AWARE:"They've named the problem clearly but haven't felt its full weight.",
    CURIOUS:"There's real curiosity here, but it's still surface-level.",
    EXPLORING:"They're in an early, open-ended information-gathering mode.",
    OPEN:"This is the opening move — almost nothing is established yet.",
  };
  parts.push(openers[state] || "The conversation is still taking shape.");
  if(sig.team>0) parts.push("A team member or manager is part of this decision, which means influence you can't see directly is in play.");
  if(sig.price>0) parts.push("Cost or budget has come up explicitly, which is worth tracking but isn't necessarily the real blocker.");
  if(sig.research>0) parts.push("They've mentioned comparing this against other options, which signals real intent rather than idle interest.");
  return parts.join(' ');
}

function buildReadinessExplanation(score, d){
  if(score>=75) return `Readiness is high. Trust and intent are both strong (${d.trust}/${d.intent}), and friction is low — the main risk now is fumbling a good position, not creating one.`;
  if(score>=55) return `Readiness is moderate. There's real signal here (trust ${d.trust}, intent ${d.intent}), but friction (${d.friction}) is still doing enough work to block a clean close.`;
  return `Readiness is early-stage. The relationship and intent aren't established enough yet (trust ${d.trust}, intent ${d.intent}) to push toward commitment — this is a diagnosis-and-build phase, not a closing one.`;
}

function buildResponses(state, lines, outcome){
  const last = lines.length ? lines[lines.length-1].replace(/^\w+:\s*/,'') : '';
  const topicHint = last ? last.slice(0,60) : 'what they just said';
  return {
    safe:{ message:`That makes sense. Before I say anything more — what would actually need to be true for this to feel like an easy "yes" to you?`, reasoning:'Low-risk, keeps the floor with them, and surfaces their real criteria instead of guessing at it.' },
    sharp:{ message:`Here's what I'm noticing: ${state==='HESITATING'||state==='STALLING'?'you seem sold on the problem but not yet on the path forward.':'there\'s real interest here, but it hasn\'t turned into a next step yet.'} What's the actual thing in the way?`, reasoning:'Names the pattern directly instead of dancing around it — higher risk, but moves the conversation faster if the read is right.' },
    bold:{ message:`I could be wrong, but it feels like the real blocker isn't what's been said out loud yet. What am I missing?`, reasoning:'Only fire this if trust is already solid — it skips the polite version and asks for the unsaid thing directly.' }
  };
}

function buildDontSend(state){
  const generic = {
    message:"Just following up on this — let me know if you're still interested! Happy to answer any questions or jump on a quick call whenever works for you.",
    why_tempting:"It feels proactive, low-effort, and keeps the thread alive without much risk.",
    why_wrong:"It carries zero new information, reads as a template, and asks them to do the work of re-engaging. This is the message every vendor sends — it doesn't move anything forward."
  };
  return generic;
}

function buildFollowUp(state){
  const map = {
    DISENGAGING:{recommendation:'STOP', reasoning:'Continuing to push against clear disengagement signals damages the relationship more than it helps the deal.', suggested_timing:'—'},
    COMMITMENT:{recommendation:'CLOSE_LOOP', reasoning:'Momentum is real — the priority now is locking in a concrete next step before it cools.', suggested_timing:'Within 24 hours'},
    STALLING:{recommendation:'REOPEN', reasoning:'Silence here is more likely inertia than rejection. A value-first reopen usually restarts the thread.', suggested_timing:'3–4 days'},
    OBJECTION:{recommendation:'CHANGE_ANGLE', reasoning:'Answering the same objection the same way twice rarely works. Approach it from underneath instead.', suggested_timing:'Next reply'},
  };
  return map[state] || {recommendation:'WAIT', reasoning:'The ball is genuinely in their court. Following up too soon reads as pressure rather than interest.', suggested_timing:'2–3 days'};
}

function buildInsufficientData(text){
  return {
    conversation_state:{ state:'INSUFFICIENT_DATA', confidence:30, evidence:['Not enough message content to establish a reliable read'] },
    closing_readiness:{ overall_score:0, dimensions:{trust:0,problem_ownership:0,intent:0,clarity:0,momentum:0,commitment:0,friction:0}, explanation:'There isn\'t enough conversation here yet to score readiness responsibly.' },
    situation:'A few words aren\'t enough to diagnose a conversation safely — paste more of the actual back-and-forth for a real read.',
    signals:{ observed:[], inferred:[] },
    risks:[{risk:'Any recommendation based on this little text would be a guess dressed up as an answer', severity:'high'}],
    next_move:{ objective:'Get enough signal to diagnose safely.', move:'Paste more of the actual conversation — ideally the last 5–10 messages both sides.', why_now:'A confident-sounding answer built on too little text is worse than no answer.', avoid:['Trusting a diagnosis built on a fragment'], success_signals:['A longer, fuller conversation pasted in'] },
    responses:{ safe:{message:'—', reasoning:'Not enough context to draft a response yet.'} },
    dont_send:{ message:'—', why_tempting:'—', why_wrong:'There isn\'t enough here to know what\'s wrong with anything yet.' },
    watch_for:[],
    follow_up:{ recommendation:'WAIT', reasoning:'Come back once there\'s a real conversation to diagnose.', suggested_timing:'—' }
  };
}

/* ---------------- persistence bridge between analyze.html and result.html ---------------- */
function saveAnalysisSession(payload){
  try{ sessionStorage.setItem('dmcs_last_analysis', JSON.stringify(payload)); }catch(e){}
}
function loadAnalysisSession(){
  try{
    const raw = sessionStorage.getItem('dmcs_last_analysis');
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

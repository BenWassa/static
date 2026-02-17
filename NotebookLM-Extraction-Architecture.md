# NotebookLM Extraction Architecture

## Core Principle
Each extraction = one reusable knowledge unit that can:
- Stand alone as a web page
- Be referenced/linked from multiple sections
- Be remixed into different formats later

---

## Extraction Categories & Structure

### 1. BEHAVIORS Database
*One file per observable behavior pattern*

**File naming:** `behavior-[number]-[short-name].md`

**Template for each:**
```markdown
# Behavior: [Name]

## Observable Pattern
[2-3 sentence description of what this looks like in daily life]

## Common Scenarios
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Neurological Mechanism
[3-4 sentence explanation: what's happening in the brain]

## Key Systems Involved
- Brain region/system 1
- Brain region/system 2
- Neurotransmitter/process

## Variability Notes
[How this manifests differently across individuals]

## Related Behaviors
- [Link to behavior-XXX]
- [Link to behavior-XXX]

## Relevant Strategies
- [Link to strategy-XXX]
- [Link to strategy-XXX]

## Sources
[Citation list from research]
```

**Priority behaviors to extract (20-25 total):**

*Sensory:*
1. Auditory hypersensitivity
2. Visual overwhelm (lights, patterns)
3. Tactile defensiveness
4. Sensory seeking behaviors
5. Difficulty filtering background noise

*Social:*
6. Eye contact difficulty
7. Literal interpretation / missing sarcasm
8. Missing implicit social rules
9. Face blindness (prosopagnosia)
10. Delayed social processing

*Executive Function:*
11. Task initiation paralysis
12. Difficulty with transitions
13. Time blindness
14. Decision fatigue
15. Hyperfocus

*Emotional:*
16. Alexithymia (not knowing what you feel)
17. Delayed emotional realization
18. Emotional flooding without known trigger
19. Meltdowns
20. Shutdowns

*Other:*
21. Stimming (hand-flapping, rocking, etc.)
22. Need for sameness/routine
23. Intense narrow interests
24. Masking/camouflaging
25. Echolalia / scripted language

---

### 2. MECHANISMS Database
*One file per neurological system/mechanism*

**File naming:** `mechanism-[short-name].md`

**Template:**
```markdown
# Mechanism: [Name]

## Simple Explanation
[2-3 sentence explanation at Einstein-simple level]

## Biological Details
[Deeper explanation: brain regions, processes, neurotransmitters]

## What This Explains
[List of behaviors this mechanism underlies]
- Behavior: [link]
- Behavior: [link]

## How It Differs from Neurotypical
[Specific contrast: what's different and why]

## Key Research Findings
[Bullet points of main evidence]

## Evidence Strength
[Strong / Emerging / Theoretical]

## Sources
[Citations]
```

**Priority mechanisms (12-15 total):**

1. Sensory gating and habituation failure
2. Thalamocortical filtering
3. Excitation-inhibition imbalance (GABA/glutamate)
4. Social prediction and theory of mind
5. Face processing (fusiform face area)
6. Executive function and cognitive control
7. Interoception deficits
8. Predictive processing differences
9. Pattern recognition enhancement
10. Autonomic nervous system dysregulation
11. Stress response and allostatic load
12. Dopamine reward system differences
13. Cognitive load and processing bandwidth
14. Neural connectivity patterns (local vs global)
15. Masking compensation networks

---

### 3. STRATEGIES Database
*One file per actionable strategy*

**File naming:** `strategy-[category]-[name].md`

**Template:**
```markdown
# Strategy: [Name]

## What It Is
[1-2 sentence description]

## When to Use
- Immediate (during crisis)
- Preventive (daily practice)
- Recovery (after overload)

## How It Works (Mechanism)
[Why this helps neurologically]

## Implementation Steps
1. [Concrete step]
2. [Concrete step]
3. [Concrete step]

## Variations
[Different ways to apply this]

## Effectiveness Evidence
[Strong / Moderate / Anecdotal / Theoretical]

## Works Best For
[Which patterns/profiles benefit most]

## May Not Work If
[Contraindications or limitations]

## Related Strategies
- [Link]
- [Link]

## Sources
[Citations]
```

**Priority strategies (30-40 total):**

*Sensory Regulation:*
1. Noise-canceling headphones
2. Sunglasses/blue light blocking
3. Fidget tools
4. Weighted blankets
5. Sensory breaks
6. Environmental control (dimming, quiet spaces)

*Social Management:*
7. Communication scripts
8. Email vs phone preference
9. Social battery tracking
10. Scheduled social time with recovery
11. Explicit communication requests
12. Time-delayed responses

*Executive Function:*
13. External structure (timers, alarms, lists)
14. Body doubling
15. Task chunking
16. Visual schedules
17. Transition rituals
18. Decision pre-making (routines)

*Emotional Regulation:*
19. Interoception body scans
20. Emotion labeling practice
21. Cooling down protocols
22. Safe shutdown spaces
23. Physical grounding techniques
24. Nervous system regulation (breathing, movement)

*Energy Management:*
25. Energy accounting system
26. Rest scheduling
27. Unmasking time
28. Capacity monitoring
29. Burnout prevention protocols
30. Recovery rituals

*Communication:*
31. Boundary scripts
32. Accommodation requests
33. Disclosure strategies
34. Conflict de-escalation

---

### 4. SCENARIOS Collection
*Concrete examples for illustration*

**File naming:** `scenario-[context]-[theme].md`

**Template:**
```markdown
# Scenario: [Title]

## The Situation
[Detailed narrative of what's happening]

## What's Happening Neurologically
[Explanation of mechanisms at play]

## Warning Signs Visible Here
[What someone might notice]

## Related Patterns
- [Behavior link]
- [Mechanism link]

## Relevant Strategies
- [Strategy link]
- [Strategy link]

## Variations
[How this might look different for different people]
```

**Priority scenarios (15-20):**
1. Meltdown at shopping mall
2. Shutdown after work social event
3. Masking exhaustion cycle
4. Missing social cues in meeting
5. Sensory overload on public transit
6. Task paralysis with open-ended project
7. Alexithymia during breakup
8. Hyperfocus time loss
9. Routine disruption distress
10. Communication breakdown with partner
11. Job interview masking
12. Burnout progression over months
13. Delayed emotional realization
14. Stimming suppression at work
15. Eye contact overwhelm during conversation

---

### 5. DIFFERENTIALS Collection
*Autism vs other conditions*

**File naming:** `differential-[condition].md`

**Template:**
```markdown
# Differential: Autism vs [Condition]

## Overlapping Presentations
[What looks similar]

## Distinct Mechanisms
### In Autism:
[Mechanism explanation]

### In [Condition]:
[Mechanism explanation]

## Key Differentiators
[How to distinguish]

## Why This Matters
[Practical implications]

## Can Co-occur
[How they interact if both present]

## Sources
[Citations]
```

**Priority differentials (5-7):**
1. Autism vs ADHD (executive dysfunction)
2. Autism vs Social Anxiety (social withdrawal)
3. Autism vs PTSD/CPTSD (hypervigilance, shutdown)
4. Autism vs Sensory Processing Disorder
5. Autism vs Avoidant Personality Disorder
6. Autism vs OCD (routines, rigidity)
7. Broader Autism Phenotype (subthreshold traits)

---

## NotebookLM Query Strategy

### For BEHAVIORS:
```
For [specific behavior]:

1. "Describe the observable pattern of [behavior] in autistic adults. Include 3 concrete examples or scenarios."

2. "What neurological mechanisms explain [behavior]? Include brain regions, neurotransmitters, and processes. Keep explanation under 4 sentences."

3. "How does [behavior] vary across autistic individuals? Include spectrum/dimensional aspects."

4. "What strategies or interventions help with [behavior]? Include evidence quality."

5. "Cite all sources used."
```

### For MECHANISMS:
```
For [mechanism]:

1. "Explain [mechanism] in 2-3 sentences at a level accessible to intelligent non-scientists."

2. "Provide biological details: brain regions, systems, neurotransmitters, processes involved."

3. "What observable behaviors does [mechanism] cause or contribute to?"

4. "How does [mechanism] differ between autistic and neurotypical brains?"

5. "What is the evidence strength for this mechanism? Cite sources."
```

### For STRATEGIES:
```
For [strategy]:

1. "Describe [strategy] and its implementation steps."

2. "What is the neurological mechanism of action for [strategy]?"

3. "What evidence exists for [strategy] effectiveness in autistic adults?"

4. "When is [strategy] most useful? What are limitations or contraindications?"

5. "Cite sources."
```

### For SCENARIOS:
```
"Provide detailed examples or case descriptions of [scenario/pattern] from the research. Include what's happening both observably and neurologically."
```

### For DIFFERENTIALS:
```
For autism vs [condition]:

1. "What presentations or symptoms overlap between autism and [condition]?"

2. "How do the underlying mechanisms differ? Be specific about neurological/cognitive distinctions."

3. "What are key differentiators for distinguishing autism from [condition]?"

4. "Can they co-occur? How do they interact?"

5. "Cite sources."
```

---

## Execution Plan

**Phase 1: Behaviors (Priority)**
Extract all 25 behaviors using the 5-query template for each.
Save as individual markdown files.

**Phase 2: Mechanisms**
Extract all 15 mechanisms.
Cross-reference with behaviors.

**Phase 3: Strategies**
Extract 30-40 strategies.
Link to behaviors they address.

**Phase 4: Scenarios**
Extract 15-20 concrete examples.
Use for illustration throughout.

**Phase 5: Differentials**
Extract 5-7 comparisons.
Critical for avoiding misattribution.

---

## File Structure on Disk

```
/extractions/
  /behaviors/
    behavior-001-auditory-hypersensitivity.md
    behavior-002-eye-contact-difficulty.md
    [... 25 total]
  
  /mechanisms/
    mechanism-sensory-gating.md
    mechanism-social-prediction.md
    [... 15 total]
  
  /strategies/
    strategy-sensory-noise-canceling.md
    strategy-executive-body-doubling.md
    [... 40 total]
  
  /scenarios/
    scenario-mall-meltdown.md
    scenario-work-masking.md
    [... 20 total]
  
  /differentials/
    differential-adhd.md
    differential-social-anxiety.md
    [... 7 total]
  
  /meta/
    extraction-index.md (master list with links)
    cross-reference-map.md (behavior → mechanism → strategy links)
```

---

## Custom Report Prompts for Long-Form

If you're using NotebookLM's custom report feature:

**Report 1: Complete Behaviors Database**
"Create a comprehensive reference document covering all observable autistic behavior patterns found in the research. For each pattern, include: observable description, scenarios, neurological mechanism (2-3 sentences), systems involved, variability notes, and citations. Organize by category: sensory, social, executive, emotional, other."

**Report 2: Complete Mechanisms Database**
"Create a comprehensive reference document explaining all neurological mechanisms underlying autism found in the research. For each mechanism: simple explanation, biological details, what behaviors it explains, how it differs from neurotypical, evidence strength, citations. Organize by system: sensory, social-cognitive, executive, emotional, other."

**Report 3: Complete Strategies Database**
"Create a comprehensive reference document of evidence-based strategies for autistic adults. For each strategy: description, mechanism of action, when to use, implementation steps, effectiveness evidence, limitations, citations. Organize by challenge type: sensory, social, executive, emotional, energy, communication."

---

put this in an md file someplace reasonable

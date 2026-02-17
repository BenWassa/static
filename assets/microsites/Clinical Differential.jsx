import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Menu, 
  X, 
  ChevronRight, 
  Layers, 
  Battery, 
  Thermometer,
  Stethoscope,
  BookOpen,
  ArrowRight
} from 'lucide-react';

// --- Data & Content ---

const NAV_ITEMS = [
  { id: 'foundations', label: 'Ontological Foundations' },
  { id: 'executive', label: 'Executive Dysfunction' },
  { id: 'withdrawal', label: 'Social Withdrawal' },
  { id: 'sensory', label: 'Sensory Overload' },
  { id: 'differential', label: 'Shutdown vs. Dissociation' },
  { id: 'load', label: 'Load Capacity Framework' },
  { id: 'synthesis', label: 'Clinical Synthesis' },
];

const FOUNDATION_DATA = [
  { condition: 'Autism (ASD)', neuro: 'Atypical thalamocortical connectivity; local vs. global processing biases', mech: 'Monotropic focus; reduced inhibitory sensory filtering', onset: 'Early childhood (lifelong)' },
  { condition: 'ADHD', neuro: 'Interest-based nervous system; dopaminergic regulation dysfunction', mech: 'Executive dysfunction; failure of PFC to inhibit irrelevant stimuli', onset: 'Early childhood (lifelong)' },
  { condition: 'C-PTSD', neuro: 'HPA-axis adaptations; chronic stress-response architecture', mech: 'Chronic hyperarousal; threat-prioritized processing', onset: 'Post-exposure (any age)' },
  { condition: 'Anxiety Disorders', neuro: 'Amygdalar hyperactivity; fear-conditioned neural pathways', mech: 'Evaluative interference; chronic anticipatory stress', onset: 'Variable; often late childhood' },
];

const WITHDRAWAL_DATA = [
  { phenotype: 'Autistic Burnout', driver: 'Absolute energy depletion from prolonged masking', trigger: 'Chronic social demand or sensory overload', state: 'Shutdown: motor/cognitive slowing; fetal posture' },
  { phenotype: 'ADHD (RSD)', driver: 'Rejection Sensitive Dysphoria', trigger: 'Perceived criticism or social failure', state: 'Post-event emotional crash; chest/gut pain' },
  { phenotype: 'Trauma (C-PTSD)', driver: 'Hypervigilance; interpersonal mistrust', trigger: 'Cues of potential interpersonal harm', state: 'Hyperarousal; sympathetic takeover' },
  { phenotype: 'Social Anxiety', driver: 'Fear of negative evaluation', trigger: 'Anticipation of social scrutiny', state: 'Chronic anticipatory fear; avoidant mobilization' },
];

const DIFFERENTIAL_DATA = [
  { category: 'Primary Trigger', autism: 'Sensory or cognitive overstimulation', cptsd: 'Emotional trauma or psychological pain' },
  { category: 'Level of Awareness', autism: 'Grounded; aware but unable to engage', cptsd: 'Detached; “zoned out” or watching from outside' },
  { category: 'Body Experience', autism: 'Sensory hypersensitivity; still/frozen', cptsd: 'Analgesia; numb or disconnected' },
  { category: 'Memory of Event', autism: 'Intact; loss of verbal processing', cptsd: 'Patchy; “lost time” or memory gaps' },
  { category: 'Immediate Support', autism: 'Low sensory input; solitude; quiet', cptsd: 'Grounding; establishing emotional safety' },
];

const INTERVENTION_DATA = [
  { driver: 'Sensory/Cognitive Overload (Autism)', mech: 'Low-pass filtering failure; heightened salience detection', strategy: 'Environmental adjustment; sensory regulation (e.g., noise attenuation)', outcome: 'Reduced afferent drive; decreased sympathetic overactivation' },
  { driver: 'Dopaminergic/Attentional Failure (ADHD)', mech: 'Interest-based nervous system; dopaminergic instability', strategy: 'Interest-based structure; external executive scaffolding', outcome: 'Stabilized amygdala-PFC axis; re-engaged PFC' },
  { driver: 'Trauma-Induced Hyperarousal (C-PTSD)', mech: 'HPA-axis dysregulation and hypervigilance', strategy: 'Trauma-focused therapy; HPA-axis regulation', outcome: 'Restored autonomic flexibility; downshifted HPA-axis' },
  { driver: 'Evaluative Worry (Anxiety)', mech: 'Amygdalar hyperactivity and evaluative interference', strategy: 'Cognitive-behavioral techniques; challenging fear patterns', outcome: 'Reduced amygdalar activation; improved regulatory capacity' },
];

// --- Components ---

const SectionHeading = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
    {Icon && <Icon className="w-6 h-6 text-teal-600" />}
    <h2 className="text-2xl font-serif text-slate-800 font-medium">{children}</h2>
  </div>
);

const Card = ({ title, badge, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {badge && (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          badge === 'Autism' ? 'bg-indigo-100 text-indigo-700' :
          badge === 'ADHD' ? 'bg-amber-100 text-amber-700' :
          badge === 'C-PTSD' ? 'bg-rose-100 text-rose-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          {badge}
        </span>
      )}
    </div>
    <div className="text-slate-600 text-sm leading-relaxed">
      {children}
    </div>
  </div>
);

const ResponsiveTable = ({ headers, data, renderRow }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-6 py-3 whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {data.map((item, idx) => renderRow(item, idx))}
      </tbody>
    </table>
  </div>
);

// --- Main Application ---

export default function App() {
  const [activeSection, setActiveSection] = useState('foundations');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  // Setup intersection observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px' }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-serif font-bold text-teal-800">Clinical Protocol</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-full md:w-72 bg-white border-r border-slate-200 z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:flex md:flex-col
      `}>
        <div className="p-8 border-b border-slate-100 hidden md:block">
          <div className="flex items-center gap-2 text-teal-600 mb-2">
            <Brain size={24} />
          </div>
          <h1 className="font-serif text-xl font-bold text-slate-900 leading-tight">
            Clinical Differential Protocol
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide uppercase">
            Neurodevelopment vs. Trauma
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group
                ${activeSection === item.id 
                  ? 'bg-teal-50 text-teal-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {item.label}
              {activeSection === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 text-xs text-slate-400">
          © Clinical Reference Tool v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto space-y-24">
        
        {/* Intro */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 leading-tight">
            Distinguishing Neurodevelopmental Processing from Trauma-Induced Adaptation
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Effective differential diagnosis necessitates a strategic transition from categorical checklists toward a rigorous ontological understanding of the patient’s baseline neurobiology. The clinician must distinguish between neurodevelopmental “hard-wiring” and adaptational responses.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
            <Activity size={16} />
            Core Strategy: Search for the Driver
          </div>
        </div>

        {/* Section 1: Ontological Foundations */}
        <section id="foundations" className="scroll-mt-24">
          <SectionHeading icon={Layers}>Ontological Foundations</SectionHeading>
          <p className="mb-6 text-slate-600">
            Identifying whether a patient’s phenotype arises from atypical thalamocortical connectivity (Autism), dopaminergic dysregulation (ADHD), or HPA-axis adaptations (C-PTSD) is critical.
          </p>
          
          <ResponsiveTable 
            headers={['Condition', 'Neurobiological Basis', 'Primary Mechanism', 'Typical Onset']}
            data={FOUNDATION_DATA}
            renderRow={(row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{row.condition}</td>
                <td className="px-6 py-4 text-slate-600">{row.neuro}</td>
                <td className="px-6 py-4 text-slate-600">{row.mech}</td>
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.onset}</td>
              </tr>
            )}
          />
        </section>

        {/* Section 2: Executive Dysfunction */}
        <section id="executive" className="scroll-mt-24">
          <SectionHeading icon={Zap}>Executive Dysfunction & Inertia</SectionHeading>
          <p className="mb-8 text-slate-600">
            Identical behaviors like task avoidance often arise from radically different neurological bottlenecks. Evaluating “cognitive paralysis” requires analysis of the specific “Inertia Signature.”
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card title="The Monotropic Split" badge="Autism" className="border-t-4 border-t-indigo-400">
              <p className="font-semibold text-slate-700 mb-2">Inertia Signature:</p>
              <p className="mb-4">Intense difficulty initiating or switching tasks because recalibrating focus creates a tangible shift in bodily state.</p>
              <div className="bg-indigo-50 p-3 rounded-lg text-indigo-800 text-xs">
                <strong>Analysis:</strong> Focus on transition cost reduction via sensory reduction.
              </div>
            </Card>

            <Card title="Interest-Based System" badge="ADHD" className="border-t-4 border-t-amber-400">
              <p className="font-semibold text-slate-700 mb-2">Inertia Signature:</p>
              <p className="mb-4">PFC fails to inhibit irrelevant stimuli. Tasks without dopamine-mediated interest feel threatening, triggering freeze.</p>
              <div className="bg-amber-50 p-3 rounded-lg text-amber-800 text-xs">
                <strong>Analysis:</strong> Engage PFC with novelty/interest scaffolding.
              </div>
            </Card>

            <Card title="Functional Freeze" badge="C-PTSD" className="border-t-4 border-t-rose-400">
              <p className="font-semibold text-slate-700 mb-2">Inertia Signature:</p>
              <p className="mb-4">Cognitive energy consumed by hypervigilance. PFC is effectively offline due to chronic hyperarousal.</p>
              <div className="bg-rose-50 p-3 rounded-lg text-rose-800 text-xs">
                <strong>Analysis:</strong> Prioritize HPA-axis regulation and safety.
              </div>
            </Card>
          </div>
        </section>

        {/* Section 3: Social Withdrawal */}
        <section id="withdrawal" className="scroll-mt-24">
          <SectionHeading icon={ShieldAlert}>Social Withdrawal Dynamics</SectionHeading>
          <p className="mb-6 text-slate-600">
             Social retreat is often a survival mechanism. Distinguishing the drivers—Burnout, RSD, or Hypervigilance—is essential.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {WITHDRAWAL_DATA.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800">{item.phenotype}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">Internal Driver</span>
                    <p className="text-slate-700">{item.driver}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">Trigger</span>
                    <p className="text-slate-700">{item.trigger}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">Physiological State</span>
                    <p className="text-teal-700 bg-teal-50 px-2 py-1 rounded inline-block mt-1">{item.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Sensory Overload */}
        <section id="sensory" className="scroll-mt-24">
          <SectionHeading icon={Thermometer}>Sensory Overload Signatures</SectionHeading>
          <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl">
            <h3 className="text-xl font-serif mb-6 text-teal-300">Intense World Theory</h3>
            <div className="space-y-8">
              
              <div className="flex gap-4">
                <div className="mt-1"><ArrowRight className="text-indigo-400" /></div>
                <div>
                  <h4 className="font-bold text-lg text-white">Autistic "Bottom-Up" Hypersensitivity</h4>
                  <p className="text-slate-300 text-sm mt-1">Reduced thalamic GABA inhibitory tone makes it harder to dampen background noise. Everyday inputs feel naturally threatening.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1"><ArrowRight className="text-amber-400" /></div>
                <div>
                  <h4 className="font-bold text-lg text-white">ADHD "Top-Down" Gating Failure</h4>
                  <p className="text-slate-300 text-sm mt-1">Atypical LC-NE gain signals cause a failure to prioritize stimuli. All inputs compete equally for focus.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1"><ArrowRight className="text-rose-400" /></div>
                <div>
                  <h4 className="font-bold text-lg text-white">C-PTSD "Threat-Prioritized" Processing</h4>
                  <p className="text-slate-300 text-sm mt-1">HPA axis remains on high alert scanning for danger. This is a software scan for threats, not a hardware processing difference.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 5: Differential Deep Dive */}
        <section id="differential" className="scroll-mt-24">
          <SectionHeading icon={Brain}>Shutdown vs. Dissociation</SectionHeading>
          <p className="mb-6 text-slate-600">
            While both appear as a lack of responsiveness, they represent fundamentally different neurological events.
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200">
             <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-4 font-semibold text-slate-700">
                <div className="col-span-1">Feature</div>
                <div className="col-span-1 text-indigo-700">Autistic Shutdown</div>
                <div className="col-span-1 text-rose-700">C-PTSD Dissociation</div>
             </div>
             <div className="divide-y divide-slate-100 bg-white">
               {DIFFERENTIAL_DATA.map((row, idx) => (
                 <div key={idx} className="grid grid-cols-3 p-4 hover:bg-slate-50">
                    <div className="col-span-1 font-medium text-slate-800 text-sm">{row.category}</div>
                    <div className="col-span-1 text-slate-600 text-sm pr-4">{row.autism}</div>
                    <div className="col-span-1 text-slate-600 text-sm">{row.cptsd}</div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Section 6: Load Capacity Framework */}
        <section id="load" className="scroll-mt-24">
          <SectionHeading icon={Battery}>The Load Capacity Framework</SectionHeading>
          
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white border border-slate-200 p-8 rounded-xl">
            <div className="flex-1 space-y-4">
              <h3 className="font-bold text-lg text-slate-800">The Reservoir Model</h3>
              <p className="text-slate-600 text-sm">
                Functional capacity (C<sub>eff</sub>) is a dynamic resource. Recovery is non-linear (Hysteresis), meaning recovery takes longer than the initial buildup.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                <li><strong className="text-slate-800">Fast Fatigue (F):</strong> Immediate depletion (minutes).</li>
                <li><strong className="text-slate-800">Slow Allostatic Load (A):</strong> Cumulative wear-and-tear (months).</li>
              </ul>
            </div>
            
            <div className="bg-slate-900 text-white p-6 rounded-lg shadow-inner flex flex-col items-center justify-center min-w-[300px]">
              <div className="font-serif italic text-2xl mb-2 text-teal-300">
                C<sub>eff</sub> = C<sub>0</sub> - (F · A)
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center uppercase tracking-widest">Effective Capacity Calculation</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded border border-slate-200">
              <div className="text-xs uppercase font-bold text-slate-400 mb-1">Metric 1</div>
              <div className="font-bold text-slate-800">AASPIRE Burnout Measure</div>
              <p className="text-xs text-slate-500 mt-1">Differentiates burnout from depression.</p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200">
              <div className="text-xs uppercase font-bold text-slate-400 mb-1">Metric 2</div>
              <div className="font-bold text-slate-800">Switching Costs</div>
              <p className="text-xs text-slate-500 mt-1">Measures cognitive recalibration constraints.</p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200">
              <div className="text-xs uppercase font-bold text-slate-400 mb-1">Metric 3</div>
              <div className="font-bold text-slate-800">HRV & Cortisol</div>
              <p className="text-xs text-slate-500 mt-1">Tracks autonomic flexibility and load.</p>
            </div>
          </div>
        </section>

        {/* Section 7: Clinical Synthesis */}
        <section id="synthesis" className="scroll-mt-24 pb-24">
          <SectionHeading icon={Stethoscope}>Clinical Synthesis & Intervention</SectionHeading>
          <div className="bg-teal-900 text-white p-6 rounded-t-xl">
             <h3 className="text-xl font-serif">Neuro-Affirming Differential Interventions</h3>
             <p className="text-teal-200 text-sm mt-2">
               The goal is to protect the patient's "Flow States" and "Attention Tunnels."
             </p>
          </div>
          
          <div className="bg-white border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
            {INTERVENTION_DATA.map((item, idx) => (
              <div key={idx} className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="md:w-1/3">
                    <h4 className="font-bold text-slate-800">{item.driver}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.mech}</p>
                  </div>
                  <div className="md:w-1/3">
                     <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1">Strategy</p>
                     <p className="text-sm text-slate-700">{item.strategy}</p>
                  </div>
                  <div className="md:w-1/3">
                     <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1">Biological Outcome</p>
                     <p className="text-sm text-slate-700">{item.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
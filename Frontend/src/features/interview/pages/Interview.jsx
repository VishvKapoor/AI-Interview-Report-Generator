import { useState ,useEffect} from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useinterview';
import { useNavigate,useParams } from 'react-router';




//Sections shown in the left sidebar
const SECTIONS = [
  { id: 'technical', label: 'Technical Questions', icon: 'code' },
  { id: 'behavioral', label: 'Behavioral Questions', icon: 'chat' },
  { id: 'roadmap', label: 'Road Map', icon: 'map' },
];

//severity in REPORT.skillGaps is "High" / "Medium" / "Low".
const SEVERITY_MAP = {
  High: { cls: 'critical', label: 'High priority' },
  Medium: { cls: 'high', label: 'Medium priority' },
  Low: { cls: 'medium', label: 'Low priority' },
};

function scoreCaption(score) {
  if (score >= 85) return 'Strong match for this role';
  if (score >= 65) return 'Good match — a few gaps to close';
  return 'Needs preparation before this role';
}

function scoreTier(score) {
  if (score >= 85) return 'good';
  if (score >= 65) return 'ok';
  return 'low';
}

// Small inline icon set
const Icon = {
  code: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  chat: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  map: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  chevron: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

// Match score ring
function ScoreRing({ score }) {
  const radius = 52;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
      <circle
        cx="65"
        cy="65"
        r={radius}
        fill="none"
        stroke="var(--ring-progress)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="65" y="62" textAnchor="middle" className="score-ring__value">{score}</text>
      <text x="65" y="80" textAnchor="middle" className="score-ring__unit">%</text>
    </svg>
  );
}

// Accordion question card — shows why we asked + what the candidate said
function QuestionCard({ index, question, isOpen, onToggle }) {
  return (
    <div className={`question-card${isOpen ? ' question-card--open' : ''}`}>
      <button type="button" className="question-card__header" onClick={onToggle} aria-expanded={isOpen}>
        <span className="question-card__index">Q{index + 1}</span>
        <span className="question-card__text">{question.question}</span>
        <span className={`question-card__chevron${isOpen ? ' question-card__chevron--open' : ''}`}>
          <Icon.chevron />
        </span>
      </button>

      {isOpen && (
        <div className="question-card__body">
          <p className="question-card__answer">
            <strong>Why we asked: </strong>
            {question.intention}
          </p>
          <p className="question-card__answer">
            <strong>Candidate's answer: </strong>
            {question.answer}
          </p>
        </div>
      )}
    </div>
  );
}

// Main page
export default function Interview() {
  const [activeSection, setActiveSection] = useState('technical');
  const [openIndex, setOpenIndex] = useState(0);
  const {report,getReportById,loading}=useInterview()
  const {InterviewId}=useParams()
  const navigate = useNavigate();
  useEffect(()=>{
    if(InterviewId){
      getReportById(InterviewId)
    }
  },[InterviewId])
    if (loading || !report) {
      return (
          <main className='loading-screen'>
              <h1>Loading your interview report...</h1>
          </main>
      )
  }

  const handleToggle = (i) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  };

  return (
    <div className="interview-page">
      <div className="interview-page__topbar">
        <h1>Interview Report</h1>
          <button type="button" className="topbar__home-btn" onClick={() => navigate('/')}>
    <Icon.home />
    Home
  </button>
      </div>

      <div className="interview-layout">
        {/* Left: Sections */}
        <aside className="sidebar">
          <p className="sidebar__label">Sections</p>
          <nav className="sidebar__nav">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`sidebar__item${activeSection === section.id ? ' sidebar__item--active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="sidebar__item-icon">{Icon[section.icon]()}</span>
                <span className="sidebar__item-text">{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Center: Questions or Road Map */}
        <main className="main-panel">
          {activeSection === 'technical' && (
            <>
              <div className="main-panel__header">
                <h2 className="main-panel__title">Technical Questions</h2>
                <span className="main-panel__count">{report.technicalQuestions.length} questions</span>
              </div>
              <div className="question-list">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard
                    key={i}
                    index={i}
                    question={q}
                    isOpen={openIndex === i}
                    onToggle={() => handleToggle(i)}
                  />
                ))}
              </div>
            </>
          )}

          {activeSection === 'behavioral' && (
            <>
              <div className="main-panel__header">
                <h2 className="main-panel__title">Behavioral Questions</h2>
                <span className="main-panel__count">{report.behavioralQuestions.length} questions</span>
              </div>
              <div className="question-list">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard
                    key={i}
                    index={i}
                    question={q}
                    isOpen={openIndex === i}
                    onToggle={() => handleToggle(i)}
                  />
                ))}
              </div>
            </>
          )}

          {activeSection === 'roadmap' && (
            <>
              <div className="main-panel__header">
                <h2 className="main-panel__title">Road Map</h2>
                <span className="main-panel__count">{report.preparationPlan.length}-day plan</span>
              </div>
              <div className="roadmap">
                {report.preparationPlan.map((step, i) => (
                  <div className="roadmap-step" key={step.day}>
                    <div className="roadmap-step__marker">D{step.day}</div>
                    <div className="roadmap-step__line" />
                    <div className="roadmap-step__content">
                      <h4>{step.focus}</h4>
                      <ul className="roadmap-step__tasks">
                        {step.tasks.map((task) => (
                          <li key={task}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Right: Match score + skill gaps */}
        <aside className="side-panel">
          <div className="score-card">
            <p className="side-panel__label">Match Score</p>
            <div className={`score-ring score-ring--${scoreTier(report.matchScore)}`}>
              <ScoreRing score={report.matchScore} />
            </div>
            <p className="score-card__caption">{scoreCaption(report.matchScore)}</p>
          </div>

          <div className="skills-card">
            <p className="side-panel__label">Skill Gaps</p>
            {report.skillGaps.map((gap, i) => {
              const tier = SEVERITY_MAP[gap.severity] ?? SEVERITY_MAP.Medium;
              return (
                <div key={i} className={`skill-pill skill-pill--${tier.cls}`} title={tier.label}>
                  <span className="skill-pill__dot" />
                  <span>{gap.skill}</span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
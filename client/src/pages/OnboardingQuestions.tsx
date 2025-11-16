import React, { useEffect, useState } from "react";
import "../main_page.css";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #c7e0ea 0%, #e6f4fa 45%, #ffffff 100%);
    color: #12212f;
  }

  .hero {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 5vw 60px;
  }

  .hero-inner {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 60px;
  }

  .hero-copy {
    flex: 1.1;
  }

  .hero-kicker {
    font-size: 13px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #4e9afc;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .hero-copy h1 {
    font-size: 38px;
    line-height: 1.15;
    margin-bottom: 16px;
  }

  .hero-copy p {
    font-size: 16px;
    max-width: 470px;
    color: #4b5b6b;
    margin-bottom: 18px;
  }

  .hero-footnote {
    font-size: 12px;
    color: #7a8896;
    margin-top: 10px;
  }

  .badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .badge {
    font-size: 11px;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba(79, 154, 252, 0.08);
    color: #347ad8;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4e9afc;
  }

  .btn {
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 999px;
    font-weight: 500;
    font-size: 14px;
    padding: 11px 22px;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: #2f80ff;
    color: #ffffff;
    box-shadow: 0 10px 20px rgba(47, 128, 255, 0.3);
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(47, 128, 255, 0.35);
  }

  .btn-ghost {
    background: rgba(255, 255, 255, 0.85);
    color: #2f80ff;
    border: 1px solid rgba(79, 154, 252, 0.3);
  }
  .btn-ghost:hover {
    background: #ffffff;
    transform: translateY(-1px);
  }

  .quiz-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .quiz-card {
    width: 100%;
    max-width: 520px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 24px;
    padding: 24px 26px 26px;
    box-shadow:
      0 24px 50px rgba(9, 55, 120, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.7);
  }

  .quiz-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .quiz-subtitle {
    font-size: 13px;
    color: #6c7a8a;
    margin-bottom: 16px;
  }

  .quiz-note {
    font-size: 12px;
    color: #2f80ff;
    background: rgba(47, 128, 255, 0.08);
    border-radius: 12px;
    padding: 8px 10px;
    margin-bottom: 16px;
  }

  .quiz-question { margin-bottom: 18px; }

  .quiz-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .quiz-helper {
    font-size: 11px;
    color: #7a8896;
    margin-bottom: 4px;
  }

  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
  }

  .quiz-option {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 10px;
    background: rgba(240, 247, 255, 0.9);
  }

  .quiz-option input { accent-color: #2f80ff; }

  .quiz-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .quiz-footer small {
    font-size: 11px;
    color: #7a8896;
  }

  @media (max-width: 900px) {
    .hero-inner {
      flex-direction: column;
      gap: 30px;
    }
    .hero-copy {
      text-align: center;
    }
    .hero-copy p,
    .hero-footnote,
    .badge-row {
      margin-left: auto;
      margin-right: auto;
      justify-content: center;
    }
    .quiz-wrapper {
      width: 100%;
      align-items: stretch;
    }
  }
`;

export type OnboardingQuestion = {
  id: string;
  type?: "mcq" | "time" | "add_events" | "text";
  text: string;
  options?: string[];
};

type Props = {
  onBack?: () => void;
};

const OnboardingQuestions: React.FC<Props> = ({ onBack }) => {
  const [questions, setQuestions] = useState<OnboardingQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  // local state for different input types
  const [timeInput, setTimeInput] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [events, setEvents] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    setLoading(true);
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data: OnboardingQuestion[]) => setQuestions(data))
      .catch((err) => {
        console.error("Failed to load questions:", err);
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const goNext = () => {
    const next = currentIndex + 1;
    if (questions && next < questions.length) {
      setCurrentIndex(next);
    } else {
      setFinished(true);
    }
  };

  const handleOptionClick = (q: OnboardingQuestion, option: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
    // reset any temporary inputs
    setTimeInput("");
    goNext();
  };

  const handleTimeSubmit = (q: OnboardingQuestion) => {
    if (!timeInput) return;
    setAnswers((prev) => ({ ...prev, [q.id]: timeInput }));
    setTimeInput("");
    goNext();
  };

  const handleAddEvent = () => {
    if (!eventName || !eventStart || !eventEnd) return;
    const newEvent = { name: eventName, start: eventStart, end: eventEnd, location: eventLocation };
    setEvents((e) => [...e, newEvent]);
    // clear inputs
    setEventName("");
    setEventStart("");
    setEventEnd("");
    setEventLocation("");
  };

  const handleEventsNext = (q: OnboardingQuestion) => {
    // store events as JSON string
    setAnswers((prev) => ({ ...prev, [q.id]: JSON.stringify(events) }));
    setEvents([]);
    goNext();
  };

  const handleBackClick = () => {
    if (finished) {
      setFinished(false);
      setCurrentIndex(0);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((i) => Math.max(0, i - 1));
    } else if (onBack) {
      onBack();
    }
  };

  const currentQuestion = questions ? questions[currentIndex] : null;

  return (
    <div>
      <style>{styles}</style>

      {loading && <div style={{ padding: 24 }}>Loading questions…</div>}

      {!loading && !finished && (
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-kicker">Daily Planner</div>
              <h1>Daily Planner Setup Quiz</h1>
              <p>Answer a few quick questions and we’ll set up your planner defaults so your day just flows.</p>

              <div className="badge-row">
                <div className="badge"><span className="badge-dot" /> 7 questions</div>
                <div className="badge">Takes about 2–3 minutes</div>
              </div>

              <div className="hero-footnote">You can always change these later in Settings • Your data stays on-device</div>
            </div>

            <div className="quiz-wrapper">
              <div className="quiz-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <div className="quiz-title">Daily Planner Setup</div>
                    <div className="quiz-subtitle">Question {currentIndex + 1} of {questions ? questions.length : 0}</div>
                  </div>
                  <div>
                    <button className="btn btn-ghost" onClick={handleBackClick}>Back</button>
                  </div>
                </div>

                {currentQuestion && (
                  <div>
                    <div className="quiz-question">
                      <label className="quiz-label">{currentQuestion.text}</label>

                      {(!currentQuestion.type || currentQuestion.type === 'mcq') && (
                        <div className="quiz-options">
                          {(currentQuestion.options || []).map((opt) => (
                            <label key={opt} className="quiz-option">
                              <input
                                type="radio"
                                name={currentQuestion.id}
                                onChange={() => handleOptionClick(currentQuestion, opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {currentQuestion.type === 'time' && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} style={{ padding: 8, borderRadius: 8 }} />
                          <button className="btn btn-primary" onClick={() => handleTimeSubmit(currentQuestion)}>Next</button>
                        </div>
                      )}

                      {currentQuestion.type === 'add_events' && (
                        <div>
                          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>

                            <input placeholder="Event name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            <input type="time" value={eventStart} onChange={(e) => setEventStart(e.target.value)} />
                            <input type="time" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} />
                            <input placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                            <button className="btn" onClick={handleAddEvent}>Add</button>

                          </div>

                          <div style={{ marginBottom: 8 }}>
                            {events.length === 0 && <div style={{ color: '#666' }}>No events added yet</div>}
                            {events.map((ev, idx) => (
                              <div key={idx} style={{ padding: 8, borderRadius: 6, background: 'rgba(192, 192, 192, 0.03)', marginBottom: 6 }}>
                                <div><strong>{ev.name}</strong> ({ev.start} - {ev.end})</div>
                                <div style={{ fontSize: 13 }}>{ev.location}</div>
                              </div>
                            ))}
                          </div>

                          <div>
                            <button className="btn btn-primary" onClick={() => handleEventsNext(currentQuestion)} disabled={events.length === 0}>Next</button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="quiz-footer">
                      <small>We'll use these answers to create your default day.</small>
                      <div>
                        {/* For MCQ answers advance automatically; for others show Next
                        {currentQuestion.type !== 'mcq' && (
                          <button className="btn btn-primary" onClick={goNext}>Next</button>
                        )} */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {!loading && finished && questions && (
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-kicker">All set</div>
              <h1>You're ready to go</h1>
              <p>Thanks — we've saved your preferences. You can adjust these anytime in Settings.</p>
            </div>

            <div className="quiz-wrapper">
              <div className="quiz-card">
                <h3 className="quiz-title">Summary</h3>
                <div className="quiz-subtitle">Review your answers</div>
                <div>
                  <ul>
                    {questions.map((q) => (
                      <li key={q.id} style={{ marginBottom: 8 }}>
                        <strong>{q.text}</strong>
                        <div style={{ marginTop: 4 }}>{answers[q.id] ?? '(no answer)'}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        // POST collected answers to local backend
                        const res = await fetch('http://localhost:5000/answers', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ answers }),
                        });
                        if (!res.ok) throw new Error(`Server error: ${res.status}`);
                        const json = await res.json();
                        console.log('Saved answers:', json);
                        alert('Answers saved to server.');
                        if (onBack) onBack();
                      } catch (err: any) {
                        console.error('Failed to save answers', err);
                        alert('Failed to save answers to server. See console for details.');
                      }
                    }}
                  >
                    Submit
                  </button>
                  <button className="btn" onClick={() => { setFinished(false); setCurrentIndex(0); }}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default OnboardingQuestions;

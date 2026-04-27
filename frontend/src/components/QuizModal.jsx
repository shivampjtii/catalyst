import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, Zap, Brain } from 'lucide-react';

const STATES = { LOADING: 'loading', QUIZ: 'quiz', RESULT: 'result' };

export default function QuizModal({ video, courseId, courseCategory, difficulty, onClose, onComplete }) {
  const [state, setState] = useState(STATES.LOADING);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  React.useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setState(STATES.LOADING);
    setGenerating(true);
    setAnswers({});
    setCurrentQ(0);
    try {
      const { data } = await axios.post('/api/quiz/generate', {
        videoTitle: video.title,
        videoDescription: video.description,
        courseCategory,
        difficulty
      });
      setQuestions(data.questions);
      setState(STATES.QUIZ);
    } catch {
      toast.error('Failed to generate quiz');
      onClose();
    } finally {
      setGenerating(false);
    }
  };

  const selectAnswer = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions');
      return;
    }
    try {
      const { data } = await axios.post('/api/quiz/submit', {
        courseId, videoId: video._id || video.youtubeId,
        answers, questions
      });
      setResult(data);
      setState(STATES.RESULT);
      onComplete && onComplete(data);
    } catch {
      toast.error('Failed to submit quiz');
    }
  };

  const q = questions[currentQ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div style={{
        width: '100%', maxWidth: 620, borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden', animation: 'fadeUp 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px', borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,229,255,0.04))',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px var(--accent-glow)'
          }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
              Knowledge Check
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {video.title}
            </p>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {/* LOADING */}
          {state === STATES.LOADING && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
              }} />
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                AI is crafting your quiz...
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
                Generating personalized questions from this video
              </p>
            </div>
          )}

          {/* QUIZ */}
          {state === STATES.QUIZ && q && (
            <>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i < currentQ ? 'var(--accent)' :
                      i === currentQ ? 'var(--accent-2)' : 'var(--border)',
                    transition: 'background 0.3s ease'
                  }} />
                ))}
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
                Question {currentQ + 1} of {questions.length}
              </p>

              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
                lineHeight: 1.4, marginBottom: 22, color: 'var(--text-primary)'
              }}>
                {q.question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(q.options).map(([key, val]) => {
                  const selected = answers[q.id] === key;
                  return (
                    <button key={key} onClick={() => selectAnswer(q.id, key)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 18px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                      background: selected ? 'rgba(108,99,255,0.12)' : 'var(--bg-secondary)',
                      border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                      color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s ease', width: '100%',
                      fontFamily: 'var(--font-body)', fontSize: 14
                    }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                        background: selected ? 'var(--accent)' : 'var(--bg-card)',
                        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                        color: selected ? 'white' : 'var(--text-muted)',
                        transition: 'all 0.2s ease'
                      }}>
                        {key}
                      </span>
                      {val}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
                {currentQ > 0 ? (
                  <button onClick={() => setCurrentQ(p => p - 1)} style={{
                    padding: '12px 20px', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-body)',
                    cursor: 'pointer'
                  }}>Back</button>
                ) : <div />}

                {currentQ < questions.length - 1 ? (
                  <button onClick={() => setCurrentQ(p => p + 1)} disabled={!answers[q.id]} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '12px 24px', borderRadius: 'var(--radius-md)',
                    background: answers[q.id] ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: answers[q.id] ? 'white' : 'var(--text-muted)',
                    fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 600,
                    cursor: answers[q.id] ? 'pointer' : 'not-allowed', border: 'none',
                    transition: 'all 0.2s ease'
                  }}>
                    Next <ChevronRight size={15} />
                  </button>
                ) : (
                  <button onClick={submitQuiz} disabled={Object.keys(answers).length < questions.length} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '12px 24px', borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    color: 'white', fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700,
                    cursor: 'pointer', border: 'none', boxShadow: '0 0 20px var(--accent-glow)'
                  }}>
                    Submit Quiz <Trophy size={15} />
                  </button>
                )}
              </div>
            </>
          )}

          {/* RESULT */}
          {state === STATES.RESULT && result && (
            <div>
              {/* Score */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px',
                  background: result.passed
                    ? 'linear-gradient(135deg, var(--accent-green), #00b377)'
                    : 'linear-gradient(135deg, var(--accent-3), #cc3355)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 40px ${result.passed ? 'rgba(0,214,143,0.3)' : 'rgba(255,101,132,0.3)'}`
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'white' }}>
                    {result.score}%
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                  {result.passed ? '🎉 Great Work!' : '💪 Keep Practicing!'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  {result.correctAnswers}/{result.totalQuestions} correct
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
                  padding: '6px 14px', borderRadius: 20,
                  background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)'
                }}>
                  <Zap size={13} color="var(--accent)" />
                  <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    +{result.xpGained} XP earned
                  </span>
                </div>
              </div>

              {/* Answer review */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
                {result.processedAnswers?.map((a, i) => (
                  <div key={i} style={{
                    padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    background: a.isCorrect ? 'rgba(0,214,143,0.06)' : 'rgba(255,101,132,0.06)',
                    border: `1px solid ${a.isCorrect ? 'rgba(0,214,143,0.2)' : 'rgba(255,101,132,0.2)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      {a.isCorrect
                        ? <CheckCircle size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                        : <XCircle size={16} color="var(--accent-3)" style={{ flexShrink: 0, marginTop: 2 }} />
                      }
                      <div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{a.question}</p>
                        {!a.isCorrect && (
                          <p style={{ fontSize: 12, color: 'var(--accent-green)' }}>
                            Correct: <strong>{a.correctAnswer}</strong>
                          </p>
                        )}
                        {a.explanation && (
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{a.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={generateQuiz} style={{
                  display: 'flex', alignItems: 'center', gap: 6, flex: 1,
                  padding: '12px', borderRadius: 'var(--radius-md)', justifyContent: 'center',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-body)', cursor: 'pointer'
                }}>
                  <RotateCcw size={14} /> Retry
                </button>
                <button onClick={onClose} style={{
                  flex: 2, padding: '12px', borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  color: 'white', fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700,
                  border: 'none', cursor: 'pointer', boxShadow: '0 0 20px var(--accent-glow)'
                }}>
                  Continue Learning
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

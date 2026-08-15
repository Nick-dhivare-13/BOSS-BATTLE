import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FileText, Sparkles, Plus, Trash2, BookOpen, Check, Layers, HelpCircle } from 'lucide-react';

export const NotesFlashcards: React.FC = () => {
  const { notes, flashcardDecks, quizzes, addNote, updateNote, deleteNote, addFlashcardDeck, deleteFlashcardDeck, addQuiz, deleteQuiz, subjects } = useData();

  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards' | 'quizzes'>('notes');

  // Note Form State
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSubjectId, setNoteSubjectId] = useState('');

  const [aiLoading, setAiLoading] = useState(false);

  const activeNote = notes.find((n) => n.id === selectedNoteId);

  const handleCreateNote = () => {
    addNote({
      title: 'New Study Note',
      content: '',
    });
  };

  const handleAiAction = async (actionType: 'summarize' | 'flashcards' | 'quiz') => {
    if (!activeNote || !activeNote.content.trim()) return;
    setAiLoading(true);

    try {
      const sanitizedText = activeNote.content.slice(0, 6000);
      const sanitizedTitle = (activeNote.title || 'Study Note').slice(0, 100);

      const response = await fetch('/api/ai/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          payload: { text: sanitizedText, noteTitle: sanitizedTitle },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (actionType === 'summarize' && data.summary) {
          updateNote(activeNote.id, { content: activeNote.content + '\n\n--- AI KEY SUMMARY ---\n' + data.summary });
        } else if (actionType === 'flashcards' && data.cards) {
          addFlashcardDeck({
            title: `${activeNote.title} Flashcards`,
            subjectId: activeNote.subjectId,
            cards: data.cards,
          });
          setActiveTab('flashcards');
        } else if (actionType === 'quiz' && data.questions) {
          addQuiz({
            title: `${activeNote.title} AI Quiz`,
            subjectId: activeNote.subjectId,
            questions: data.questions,
          });
          setActiveTab('quizzes');
        }
      }
    } catch (e) {
      console.warn('AI Action fallback', e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-surface border border-brand-border p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-brand-text">Notes, Flashcards & AI Quizzes</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Transform course notes into interactive flashcards and practice quizzes with AI.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border gap-6 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'notes'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <FileText size={16} />
          <span>Notes ({notes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'flashcards'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <Layers size={16} />
          <span>Flashcard Decks ({flashcardDecks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'quizzes'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <HelpCircle size={16} />
          <span>Practice Quizzes ({quizzes.length})</span>
        </button>
      </div>

      {/* TAB 1: NOTES */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notes Sidebar */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-muted">ALL NOTES</span>
              <button
                onClick={handleCreateNote}
                className="p-1.5 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-hover"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-1.5">
              {notes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNoteId(n.id)}
                  className={`w-full text-left p-3 rounded-xl transition ${
                    selectedNoteId === n.id
                      ? 'bg-brand-primary text-white font-bold'
                      : 'bg-brand-background border border-brand-border text-brand-text hover:border-brand-primary'
                  }`}
                >
                  <div className="text-sm truncate">{n.title || 'Untitled Note'}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{new Date(n.updatedAt).toLocaleDateString()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Note Editor */}
          <div className="md:col-span-2 bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            {activeNote ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                    className="font-black text-lg text-brand-text bg-transparent focus:outline-none"
                    placeholder="Note Title..."
                  />

                  {/* AI Quick Tools */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleAiAction('summarize')}
                      disabled={aiLoading}
                      className="px-3 py-1.5 rounded-xl bg-brand-primary/10 text-brand-primary font-bold text-xs hover:bg-brand-primary/20 transition flex items-center gap-1"
                    >
                      <Sparkles size={13} />
                      <span>Summarize</span>
                    </button>
                    <button
                      onClick={() => handleAiAction('flashcards')}
                      disabled={aiLoading}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs hover:bg-amber-500/20 transition flex items-center gap-1"
                    >
                      <Layers size={13} />
                      <span>Gen Cards</span>
                    </button>
                    <button
                      onClick={() => deleteNote(activeNote.id)}
                      className="p-1.5 text-brand-muted hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="Paste or write your lecture notes here..."
                  className="w-full h-80 bg-brand-background border border-brand-border rounded-xl p-4 text-sm text-brand-text focus:outline-none focus:border-brand-primary font-mono"
                />
              </>
            ) : (
              <div className="text-center py-16 text-xs text-brand-muted">Select or create a note to start editing.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcardDecks.map((deck) => (
            <div key={deck.id} className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-brand-text">{deck.title}</h3>
                  <div className="text-xs text-brand-muted mt-0.5">{deck.cards.length} Flashcards</div>
                </div>
                <button onClick={() => deleteFlashcardDeck(deck.id)} className="text-brand-muted hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-brand-border">
                {deck.cards.slice(0, 3).map((card, i) => (
                  <div key={i} className="p-3 rounded-xl bg-brand-background border border-brand-border text-xs space-y-1">
                    <div className="font-bold text-brand-text">Q: {card.question}</div>
                    <div className="text-brand-muted">A: {card.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-brand-text">{quiz.title}</h3>
                  <div className="text-xs text-brand-muted mt-0.5">{quiz.questions.length} Practice Questions</div>
                </div>
                <button onClick={() => deleteQuiz(quiz.id)} className="text-brand-muted hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3 pt-2 border-t border-brand-border">
                {quiz.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-brand-background border border-brand-border space-y-2">
                    <div className="font-bold text-sm text-brand-text">
                      {idx + 1}. {q.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border ${
                            optIdx === q.correctAnswer
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'bg-brand-surface border-brand-border text-brand-text'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, StickyNote, Tag, Mic, MicOff, Loader2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useCalendarNotes, type CalendarNote } from "@/hooks/useCalendarNotes";

interface NotesAreaProps {
  rangeStart: Date | null;
  rangeEnd: Date | null;
  month: number;
  year: number;
}

const NOTE_COLORS = [
  "hsl(var(--calendar-accent))",
  "hsl(45 100% 55%)",
  "hsl(140 60% 45%)",
  "hsl(340 80% 55%)",
  "hsl(270 60% 55%)",
];

const NOTE_COLOR_CLASSES = [
  "bg-calendar-accent/15 border-calendar-accent/30",
  "bg-[hsl(45_100%_55%/0.15)] border-[hsl(45_100%_55%/0.3)]",
  "bg-[hsl(140_60%_45%/0.15)] border-[hsl(140_60%_45%/0.3)]",
  "bg-[hsl(340_80%_55%/0.15)] border-[hsl(340_80%_55%/0.3)]",
  "bg-[hsl(270_60%_55%/0.15)] border-[hsl(270_60%_55%/0.3)]",
];

const WaveformVisualizer = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-center gap-[3px] h-6 mx-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full bg-calendar-accent"
        animate={isActive ? {
          height: [4, Math.random() * 20 + 8, 4],
          opacity: [0.5, 1, 0.5],
        } : { height: 4, opacity: 0.3 }}
        transition={isActive ? {
          duration: 0.3 + Math.random() * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.05,
        } : {}}
      />
    ))}
  </div>
);

const NotesArea = ({ rangeStart, rangeEnd, month, year }: NotesAreaProps) => {
  const { notes, loading, addNote, updateNote, deleteNote } = useCalendarNotes(month, year);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening, transcript, interimTranscript,
    isSupported, startListening, stopListening,
    resetTranscript, error: speechError,
  } = useSpeechRecognition();

  // When voice transcript updates, populate input
  useEffect(() => {
    if (transcript || interimTranscript) {
      setInput(transcript + interimTranscript);
    }
  }, [transcript, interimTranscript]);

  const handleAdd = async () => {
    const text = input.trim();
    if (!text) return;

    await addNote({
      text,
      color: String(selectedColor),
      rangeStart: rangeStart,
      rangeEnd: rangeEnd,
      source: isListening || transcript ? "voice" : "text",
    });

    setInput("");
    resetTranscript();
    if (isListening) stopListening();
    inputRef.current?.focus();
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      // Keep transcript in input for user to review/save
    } else {
      resetTranscript();
      setInput("");
      startListening();
    }
  };

  const handleDelete = async (id: string) => deleteNote(id);
  const handleUpdate = async (id: string, text: string) => {
    await updateNote(id, text);
    setEditingId(null);
  };

  const formatRange = (start: string, end: string) =>
    `${format(new Date(start), "MMM d")} – ${format(new Date(end), "MMM d")}`;

  return (
    <div className="bg-calendar-notes-bg p-4 md:p-5 border-t border-border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-3 w-full text-left group"
      >
        <StickyNote className="w-4 h-4 text-calendar-accent" />
        <h3 className="font-display text-xs font-bold text-foreground tracking-[0.15em] uppercase">
          Notes
        </h3>
        <span className="text-[10px] text-muted-foreground font-body ml-1">
          ({notes.length})
        </span>
        {rangeStart && rangeEnd && (
          <span className="ml-auto text-[10px] font-body text-muted-foreground bg-calendar-range px-2 py-0.5 rounded-full">
            📌 {formatRange(rangeStart.toISOString(), rangeEnd.toISOString())}
          </span>
        )}
        <motion.span
          animate={{ rotate: isExpanded ? 0 : -90 }}
          className="text-muted-foreground ml-auto text-xs"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Voice status */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2 flex items-center justify-center gap-2 py-2 bg-calendar-accent/10 rounded-lg border border-calendar-accent/20"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-body text-calendar-accent font-semibold tracking-wider uppercase">
                    Listening — speak now
                  </span>
                  <WaveformVisualizer isActive={true} />
                </motion.div>
              )}
            </AnimatePresence>

            {speechError && (
              <div className="mb-2 text-[11px] text-destructive font-body bg-destructive/10 px-3 py-1.5 rounded-lg">
                ⚠️ {speechError}
              </div>
            )}

            {/* Color picker + Input + Mic */}
            <div className="flex gap-2 mb-3 items-center">
              <div className="flex gap-1">
                {NOTE_COLORS.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === i ? "border-foreground scale-125" : "border-transparent scale-100"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder={
                  isListening
                    ? "Listening..."
                    : rangeStart && rangeEnd
                    ? `Note for ${formatRange(rangeStart.toISOString(), rangeEnd.toISOString())}...`
                    : "Add a note or tap 🎤..."
                }
                className="flex-1 px-3 py-2 text-sm font-body bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground transition-shadow"
              />

              {/* Mic button */}
              {isSupported && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMic}
                  className={`p-2 rounded-lg transition-all shadow-sm ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse shadow-red-500/30"
                      : "bg-muted text-muted-foreground hover:text-calendar-accent hover:bg-calendar-accent/10"
                  }`}
                  title={isListening ? "Stop recording" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="p-2 bg-calendar-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Notes list */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
              {loading && (
                <div className="flex items-center justify-center py-4 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-calendar-accent" />
                  <span className="text-xs text-muted-foreground font-body">Loading notes...</span>
                </div>
              )}
              <AnimatePresence mode="popLayout">
                {!loading && notes.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4 text-muted-foreground text-xs font-body"
                  >
                    <div className="text-lg mb-1">📝</div>
                    Select dates & add notes — or tap 🎤 to speak
                  </motion.div>
                )}
                {notes.map((note) => {
                  const colorIdx = Number(note.color) || 0;
                  return (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, scale: 0.9 }}
                      className={`flex items-start gap-2 border rounded-lg p-2.5 group transition-all ${NOTE_COLOR_CLASSES[colorIdx] ?? NOTE_COLOR_CLASSES[0]}`}
                    >
                      <div
                        className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
                        style={{ backgroundColor: NOTE_COLORS[colorIdx] }}
                      />
                      <div className="flex-1 min-w-0">
                        {note.range_start && note.range_end && (
                          <div className="text-[10px] text-calendar-accent font-body font-semibold mb-0.5 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            {formatRange(note.range_start, note.range_end)}
                          </div>
                        )}
                        {editingId === note.id ? (
                          <input
                            autoFocus
                            defaultValue={note.text}
                            onBlur={(e) => handleUpdate(note.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdate(note.id, e.currentTarget.value);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="w-full text-xs font-body bg-transparent border-b border-calendar-accent focus:outline-none text-foreground"
                          />
                        ) : (
                          <p className="text-xs font-body text-foreground leading-relaxed">{note.text}</p>
                        )}
                        {/* Source badge */}
                        {note.source === "voice" && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-calendar-accent/70 font-body mt-0.5">
                            <Mic className="w-2.5 h-2.5" /> voice
                          </span>
                        )}
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => setEditingId(note.id)}
                          className="p-1 rounded text-muted-foreground hover:text-calendar-accent transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesArea;

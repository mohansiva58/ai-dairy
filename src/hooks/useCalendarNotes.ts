import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CalendarNote {
  id: string;
  text: string;
  color: string;
  range_start: string | null;
  range_end: string | null;
  month: number;
  year: number;
  source: string | null;
  created_at: string;
}

export const useCalendarNotes = (month: number, year: number) => {
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from("calendar_notes")
      .select("*")
      .eq("month", month)
      .eq("year", year)
      .order("created_at", { ascending: false });

    if (!error && data) setNotes(data);
    setLoading(false);
  }, [month, year]);

  useEffect(() => {
    fetchNotes();

    // Realtime subscription
    const channel = supabase
      .channel(`notes-${year}-${month}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "calendar_notes",
        filter: `month=eq.${month}`,
      }, () => {
        fetchNotes();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchNotes, month, year]);

  const addNote = async (params: {
    text: string;
    color: string;
    rangeStart?: Date | null;
    rangeEnd?: Date | null;
    source?: string;
  }) => {
    const { error } = await supabase.from("calendar_notes").insert({
      text: params.text,
      color: params.color,
      range_start: params.rangeStart?.toISOString() ?? null,
      range_end: params.rangeEnd?.toISOString() ?? null,
      month,
      year,
      source: params.source ?? "text",
    });
    if (!error) await fetchNotes();
    return { error };
  };

  const updateNote = async (id: string, text: string) => {
    await supabase.from("calendar_notes").update({ text }).eq("id", id);
    await fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await supabase.from("calendar_notes").delete().eq("id", id);
    await fetchNotes();
  };

  return { notes, loading, addNote, updateNote, deleteNote };
};

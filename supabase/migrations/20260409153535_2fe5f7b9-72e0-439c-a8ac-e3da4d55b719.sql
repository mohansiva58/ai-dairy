CREATE TABLE public.calendar_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '0',
  range_start TIMESTAMP WITH TIME ZONE,
  range_end TIMESTAMP WITH TIME ZONE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  source TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.calendar_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notes" ON public.calendar_notes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert notes" ON public.calendar_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update notes" ON public.calendar_notes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete notes" ON public.calendar_notes FOR DELETE USING (true);

CREATE INDEX idx_calendar_notes_month_year ON public.calendar_notes (year, month);
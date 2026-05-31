-- Roadmap fase + status enums
CREATE TYPE public.roadmap_phase AS ENUM ('nu', 'binnenkort', 'later', 'idee');
CREATE TYPE public.roadmap_status AS ENUM ('idee', 'gepland', 'bezig', 'klaar');

CREATE TABLE public.roadmap_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  phase public.roadmap_phase NOT NULL DEFAULT 'idee',
  status public.roadmap_status NOT NULL DEFAULT 'idee',
  priority INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roadmap own" ON public.roadmap_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER roadmap_items_updated_at
  BEFORE UPDATE ON public.roadmap_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_roadmap_user_phase ON public.roadmap_items(user_id, phase, position);

-- Optionele klant-tags voor later (hybride uitbreiding)
CREATE TABLE public.client_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  tag TEXT NOT NULL,
  color TEXT DEFAULT 'neutral',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client tags own" ON public.client_tags
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_client_tags_client ON public.client_tags(user_id, client_id);
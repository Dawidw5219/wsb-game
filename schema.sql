-- Tabela graczy
CREATE TABLE players (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    total_games integer DEFAULT 0,
    total_points integer DEFAULT 0,
    best_score integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tabela gier
CREATE TABLE games (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id uuid REFERENCES players(id) ON DELETE CASCADE,
    player_score integer NOT NULL,
    computer_score integer NOT NULL,
    player_rolls integer[] NOT NULL,
    computer_rolls integer[] NOT NULL,
    status text CHECK (status IN ('in_progress', 'completed')) DEFAULT 'completed',
    winner text CHECK (winner IN ('player', 'computer', 'tie')),
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);

-- Włączenie Real-time dla tabel
ALTER TABLE players REPLICA IDENTITY FULL;
ALTER TABLE games REPLICA IDENTITY FULL;

-- REALTIME PUBLICATIONS - TO BYŁO KURWA NAJWAŻNIEJSZE! 🔥
BEGIN;
-- Usuń publikację jeśli istnieje
DROP PUBLICATION IF EXISTS supabase_realtime;
-- Stwórz nową publikację
CREATE PUBLICATION supabase_realtime;
COMMIT;

-- Dodaj tabele do publikacji realtime
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- RLS (Row Level Security) - opcjonalne ale zalecane
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Polityki RLS - pozwól wszystkim na odczyt i zapis (dla demo)
CREATE POLICY "Anyone can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON players FOR UPDATE USING (true);

CREATE POLICY "Anyone can view games" ON games FOR SELECT USING (true);
CREATE POLICY "Anyone can insert games" ON games FOR INSERT WITH CHECK (true); 
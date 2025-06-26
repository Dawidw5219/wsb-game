# 🎲 Gra w Kostki - Multiplayer Dice Game

Aplikacja gry w kostki z rozgrywką przeciwko komputerowi w systemie rozproszonym. Gracze mogą obserwować wyniki innych w czasie rzeczywistym.

## Demo Live Previe

https://wsb-game.vercel.app/

## Wymagania projektu

Utwórz projekt który umożliwia prowadzenie prostej gry z komputerem polegającej na rzucie tradycyjną
kostką do gry. Wygrywa ten gracz, którego suma wyrzuconych oczek w pięciu rzutach jest większa.

Gra powinna działać w systemie rozproszonym i umożliwiać jednoczesne prowadzenie rozgrywki przez
wielu graczy. Dodatkowo każdy z graczy powinien mieś możliwość obserwowania wyników (ilość gier, ilość
punktów, najlepszy wynik w 5 rzutach) innych graczy.
Wyniki powinny być aktualizowane w czasie rzeczywistym i dostępne również po ponownym przystąpieniu
do rozgrywki.

## ⚡ Funkcjonalności

- **Gra przeciwko komputerowi**: Rzuć kostką 5 razy i pokonaj komputer
- **System real-time**: Wyniki aktualizują się na żywo dla wszystkich graczy
- **Ranking graczy**: Obserwuj statystyki innych graczy (gry, punkty, rekordy)
- **Persistent dane**: Statystyki zachowywane po zamknięciu aplikacji
- **Responsywny design**: Działa na desktop i mobile

## 🛠️ Technologie

- **Frontend**: Next.js , React, TypeScript
- **UI**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel

## 🚀 Instalacja

### 1. Klonowanie i instalacja

```bash
git clone <repo-url>
cd wsb-game
pnpm install
```

### 2. Konfiguracja Supabase

1. Utwórz projekt na [supabase.com](https://supabase.com)
2. Skopiuj URL projektu i anon key
3. Utwórz plik `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Utworzenie tabel w Supabase

Uruchom w SQL Editor na Supabase i wykonaj polecania z pliku schema.sql

### 4. Uruchomienie

```bash
pnpm dev
```

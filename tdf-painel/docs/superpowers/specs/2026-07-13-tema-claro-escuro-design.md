# Tema Claro/Escuro no Portal TDF — Design

**Data:** 2026-07-13 · **Aprovado por:** Paulo ("manda ver", padrão escuro)

## Objetivo
Usuários do portal pediram opção de tema dia (claro) e noite (escuro). Hoje o portal é 100% dark.

## Design aprovado
1. **Variáveis de tema claro** em `public/style.css` via `html[data-theme="light"]` — paleta clara equivalente (fundo `#F6F8FA`, cards brancos, texto escuro), mantendo azul TDF `#0066CC` e cores semânticas ajustadas para contraste em fundo claro.
2. **Toggle sol/lua** na nav do `views/layout.ejs`. Persistência em `localStorage` (`tdf-theme`), script inline no `<head>` aplica `data-theme` antes do primeiro paint (sem flash). Padrão = escuro.
3. **Varredura mecânica** nas views com cores chapadas da paleta dark (`#0D1117`, `#161B22`, `#1C2333`, `#1C2128`, `#30363D`, `#E6EDF3`, `#8B949E`) → substituir por `var(--bg)`, `var(--bg-card)` etc. **Somente em contexto CSS** (blocos `<style>` e atributos `style="..."`), nunca dentro de `<script>` (canvas/charts não aceitam `var()`).
4. Views fora do `layout.ejs` (10 views + `public/login.html`): recebem o mesmo script de tema quando fizer sentido visual.

## Fora de escopo
- Detectar `prefers-color-scheme` do SO (padrão fixo escuro, decisão do Paulo).
- Retrabalhar rgba()/gradientes caso a caso — só a paleta principal.

## Verificação
Subir servidor local, conferir telas principais nos dois temas (dashboard, treinamento, auditoria, login) e confirmar que o dark atual permanece idêntico.

# MNES Sprite Production Standard v001

Documento tecnico para produzir, revisar e regenerar sprite sheets do jogo
`Meu Nome Nao E Silva`. A direcao artistica do personagem deve ficar em
referencias separadas; este arquivo define somente padrao de producao,
margens, layout, nomes, estados e prompts tecnicos.

## Objetivo

- Evitar cortes em golpes, dash, pulo, especiais e efeitos de faixa/machete.
- Manter um padrao de atlas escalavel para novos movimentos.
- Permitir que sprites gerados por GenAI sejam substituidos sem mexer no motor.
- Separar a area visivel do corpo da area de overflow para armas, cabelo, poeira,
  sangue, lama e efeitos espirituais.

## Padrao de celula

- Formato final preferido: PNG 32-bit com transparencia real.
- Direcao do personagem: sempre olhando para a direita. O motor espelha para a esquerda.
- Grade: 8 colunas por linha.
- Tamanho recomendado por celula: `320x320 px`.
- Area nominal do corpo: `181x181 px` centralizada dentro da celula.
- Margem alpha minima por celula: `64 px` em cada lado.
- Ancora visual do pe: centralizada em `x=160`, baseline entre `y=260` e `y=284`.
- Nao encostar cabelo, machete, faixa, poeira ou VFX nas bordas da celula.
- Nao usar sombra projetada fixa fora do corpo; sombra do chao e feita no motor.
- Nao usar checkerboard, grid, texto, numeracao, fundo cinza ou fundo branco.
- Se a ferramenta nao exportar transparencia, gerar fundo branco puro ou verde puro
  e passar pelo script de limpeza, mas a entrega ideal e alpha real.

## Regra anti-crop

O corpo pode ocupar a area nominal, mas golpes e especiais podem ocupar o overflow
da celula inteira. O motor usa:

- `frameWidth/frameHeight`: tamanho real da celula no atlas.
- `nominalFrameWidth/nominalFrameHeight`: tamanho usado para manter a escala do corpo.

Isso permite usar celulas maiores sem encolher o personagem no jogo.

## Atlas atual de Silva

Arquivo processado atual:

```text
assets/sprites/silva-actions-v03-padded.png
```

Configuracao atual:

```text
columns: 8
rows: 10
frameWidth: 320
frameHeight: 320
nominalFrameWidth: 181
nominalFrameHeight: 181
```

Linhas atuais:

| Linha | Estado tecnico | Uso no gameplay |
| --- | --- | --- |
| 0 | dashMove | corrida / deslocamento rapido |
| 1 | dashAttack | Blitz Attack / dash attack |
| 2 | launcher | launcher / heavy para baixo |
| 3 | specialOffensive | especial ofensivo com direcional |
| 4 | specialDefensive | especial defensivo parado |
| 5 | jump | startup, subida e queda base |
| 6 | airNeutral | ataque aereo neutro |
| 7 | airForward | ataque aereo frontal |
| 8 | airDown | ataque aereo descendente |
| 9 | landing | landing / recuperacao |

## Estados reservados para proximos sprites

Ainda podem usar placeholder ou reaproveitamento temporario:

```text
backAttack
grabFront
grabBack
grabPummel
throwForward
throwBack
slam
weaponHold
weaponAttack
weaponThrow
quickRecovery
wallBounce
groundBounce
wakeUp
starMove
hitLight
hitHeavy
knockdown
defeated
```

## Notacao de comandos

| Simbolo | Significado |
| --- | --- |
| Dir | direcional, analogico ou D-pad |
| A | attack / ataque |
| J | jump / pulo |
| S | special / especial |
| P | pick up / pegar item |
| Star | star move / super |
| Forward | frente |
| Back | tras |
| Down | baixo |
| Up | cima |
| Forward Forward | dois toques para frente |

No teclado atual do prototipo:

```text
A = J
Heavy = K
J = Space
S = I ou U
P = P
Star = O
Dir = WASD ou setas
Run = Shift
Grab = E
Dodge = L
Pulse = Q
```

## Prompt tecnico base para GenAI

Use este prompt junto com a direcao artistica do personagem:

```text
Create a clean 2D sprite sheet for a side-view 2.5D beat em up game.
Output a transparent PNG sprite sheet, not a mockup.
Use exactly 8 columns. Each animation frame must sit inside a 320x320 px cell.
Keep the character facing right in every frame. Do not create left-facing frames.
Center the character body inside a nominal 181x181 px safe zone within each cell.
Keep at least 64 px of transparent alpha padding on every side of every cell.
The foot/root anchor must remain visually consistent: center x around 160 px,
ground baseline between y=260 and y=284.
Weapons, hair, cloth strips, mud, dust, blood, smoke, and supernatural VFX may use
the overflow area, but must never touch or cross the 320x320 cell edge.
No cropping. No cut-off weapon tips. No cut-off hair. No cut-off VFX.
No checkerboard background, no grid lines, no frame borders, no text labels,
no numbering, no UI, no shadows baked onto the floor.
Use straight alpha transparency. Preserve clean silhouettes and readable poses.
Keep scale, camera angle, body mass, costume, weapon size, and lighting consistent
across all frames.
```

## Prompt tecnico por movimento

Substitua `[MOVE_ID]`, `[STATE_PURPOSE]` e `[FRAME_BEATS]`.

```text
Generate one sprite sheet row for character [CHARACTER_ID], movement state [MOVE_ID].
The row must contain exactly 8 animation frames, left to right.
Each frame must be 320x320 px with transparent background.
The character faces right in every frame.
The body stays inside a centered 181x181 px nominal safe zone.
The overflow zone is reserved for machete arcs, cloth motion, hair, dust, mud,
impact streaks, and spiritual effects.

Gameplay purpose:
[STATE_PURPOSE]

Animation beats across the 8 frames:
[FRAME_BEATS]

Maintain stable foot/root anchor, consistent scale, consistent silhouette,
and no cropping at the edges.
```

## Beats recomendados por estado

```text
dashMove:
1 anticipation crouch, 2 push off, 3 long stride, 4 body low, 5 recovery stride,
6 forward lean, 7 deceleration, 8 return-ready stride

dashAttack:
1 run-in, 2 shoulder/machete preload, 3 commitment, 4 active hit, 5 strongest arc,
6 follow-through, 7 recovery, 8 return stance

launcher:
1 grounded preload, 2 crouched weight, 3 blade begins upward, 4 active lift,
5 full upward slash, 6 enemy-launch follow-through, 7 recovery, 8 stance

specialOffensive:
1 quiet preload, 2 sash/ritual energy begins, 3 forward step, 4 active slash,
5 full effect extension, 6 body recoil, 7 energy fade, 8 stance

specialDefensive:
1 planted stance, 2 breath/brace, 3 energy circle begins, 4 active burst,
5 full guard impact, 6 dissipate, 7 recovery, 8 stance

jump:
1 grounded start, 2 takeoff, 3 rising, 4 apex, 5 forward drift, 6 falling,
7 landing prep, 8 landing

airNeutral:
1 airborne ready, 2 compact preload, 3 blade active close, 4 active center,
5 follow-through, 6 recoil, 7 falling, 8 landing prep

airForward:
1 airborne ready, 2 forward lean, 3 slash begins, 4 active forward reach,
5 strongest reach, 6 follow-through, 7 recoil, 8 landing prep

airDown:
1 airborne ready, 2 knees tucked, 3 blade points down, 4 active downward strike,
5 impact follow-through, 6 recoil, 7 falling, 8 landing prep
```

## Arquivos fonte usados neste ciclo

```text
C:\Users\Vinizen\Downloads\ChatGPT Image Apr 28, 2026, 11_20_20 AM (2).png
C:\Users\Vinizen\Downloads\ChatGPT Image Apr 28, 2026, 11_20_20 AM (1).png
C:\Users\Vinizen\Downloads\ChatGPT Image Apr 28, 2026, 11_50_06 AM (1).png
C:\Users\Vinizen\Downloads\ChatGPT Image Apr 28, 2026, 11_50_06 AM (2).png
```

Observacao: quando a fonte GenAI ja chega cortada dentro de celulas pequenas,
o padding do motor impede novos cortes no render, mas nao recupera partes que
ja nasceram fora da imagem. Para novos lotes, pedir diretamente celulas `320x320`
com alpha real e overflow interno.


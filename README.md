# 🚀 Redesign Profissional — Pequeno Gênio Brasil (+300 Experimentos Infantis)

Landing page de vendas de alta conversão, totalmente reformulada visualmente com foco em **mães, pais e responsáveis**. O design foi transformado para transmitir **autoridade, credibilidade pedagógica, encantamento e conexão familiar**, sem parecer um catálogo infantil barato ou um site genérico.

---

## 🎨 Nova Identidade Visual & Design System

A página adota rigorosamente a paleta de cores corporativa e educacional solicitada:

| Elemento | Cor | Hex | Aplicação |
| :--- | :--- | :--- | :--- |
| **Azul Principal** | Royal Blue | `#1769E0` | Destaques da headline, links, bordas ativas e ícones |
| **Azul Escuro** | Deep Navy | `#17345C` | Títulos de máxima legibilidade, caixas de contagem |
| **Branco Puro** | White | `#FFFFFF` | Fundos de cards, seções principais e respiração |
| **Azul Muito Claro** | Soft Blue | `#F3F8FF` | Fundos alternados e padrões sutis de laboratório |
| **Verde CTA** | Forest Emerald | `#12A56A` | Botões principais de conversão e compra |
| **Verde-Água (Teal)** | Aqua Mint | `#13B8A6` | Tags de benefícios, selos de segurança e checks |
| **Amarelo Dourado** | Golden Curiosity | `#FFC83D` | Estrelas de avaliações, contadores e pontos de atenção |
| **Coral Suave** | Warm Coral | `#FF8055` | Badges de desconto e tags complementares |
| **Cinza-Azulado** | Slate Grey | `#52657D` | Tipografia de parágrafos e textos descritivos |

### 🖋️ Tipografia
- **Títulos e Destaques:** `Nunito` (600, 700, 800, 900) — Amigável, acolhedora e com personalidade familiar.
- **Corpo e Textos:** `Plus Jakarta Sans` (400, 500, 600, 700) — Alta legibilidade, moderna e refinada.

---

## 📱 Experiência Mobile-First

1. **Hierarquia e Escala Fluida:** Headlines e textos utilizam `clamp()` e quebras inteligentes para não quebrar palavras ou espremer elementos em telas de 360px a 480px.
2. **Touch Targets:** Botões principais com altura mínima de 54px e área de toque confortável.
3. **Cards com Respiro:** Bordas arredondadas suaves (`16px` a `24px`), sombras elegantes (`rgba(23, 52, 92, 0.06)`) e espaçamento generoso.
4. **Player de Vídeos Responsivo:** Substituição de bordas pretas pesadas por mockups limpos com aspecto 9:16 mobile nativo.

---

## 🧩 Seções e Funcionalidades Preservadas

Todas as integrações, dados comerciais e componentes interativos foram mantidos 100% íntegros:

1. **Barra de Urgência no Topo:** Exibe a data de hoje formatada em pt-BR via JavaScript (`id="urgency-date"`).
2. **Hero Section Emocional:** Headline que toca nas dores e aspirações dos pais, cards de benefícios em 3 colunas e mockup 3D com selos de avaliação.
3. **Marquee de Prova Social:** Letreiro infinito de avaliações 5 estrelas (`#marquee-row-1` e `#marquee-row-2`).
4. **Seção Problema vs. Solução:** Abordagem empática sobre o vício em telas, história real de Laura Lemos e alternativas práticas com itens de cozinha.
5. **Vídeos Demonstrativos:** 3 players Panda Video (`data-panda`) funcionais em molduras modernas.
6. **Conteúdo Estruturado:** Grid de cards detalhando o que os pais e filhos vão aprender.
7. **5 Bônus Exclusivos:** Redesenhados em cards brancos limpos com tags específicas, títulos e mockups individuais.
8. **Carrossel de Depoimentos Reais:** 11 imagens de depoimentos reais com navegação por setas e indicadores tipo "pílula" moderna.
9. **Garantia Incondicional de 7 Dias:** Card acolhedor reforçando o risco zero para a família.
10. **Seção de Oferta e Conversão:** Preço oficial de R$ 10,00 (ancorado de R$ 97,00), cronômetro regressivo até meia-noite (`cd-h`, `cd-m`, `cd-s`) e botão para o checkout oficial.
11. **Acordeão de FAQ:** 8 perguntas frequentes com animação suave e rotação de ícones.
12. **Barra de CTA Flutuante:** Surge no rodapé quando o usuário rola além da primeira dobra.

---

## 🏃 Como Visualizar Localmente

O servidor local já está em execução:
- Navegador: **[http://localhost:3000](http://localhost:3000)** ou **http://127.0.0.1:3000**
- Se preferir, abra diretamente o [index.html](file:///C:/Users/teste/.gemini/antigravity-ide/scratch/pequeno-genio-clone/index.html) no navegador.

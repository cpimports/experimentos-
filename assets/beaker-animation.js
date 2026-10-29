/**
 * ANIMAÇÃO CIENTÍFICA INTERATIVA: BÉQUER + REAÇÃO QUÍMICA DE ESPUMA REAL
 * Motor de Scroll em Tempo Real (60/120 FPS) — 100% Reversível e Bidirecional
 *
 * Comportamento:
 * - Rolando para baixo: A bolinha desce da garantia, entra na água do béquer e,
 *   no exato momento em que entra na água, a espuma começa a subir por dentro do copo,
 *   sai pela boca formando a coroa, transborda escorrendo pelo vidro externo e se
 *   espalha na base.
 * - Rolando para cima: Processo inverso exato — a espuma da base recolhe, o escorrimento
 *   volta subindo para a borda do copo, a coroa entra de volta na boca do copo, a coluna
 *   interna desce para a água e a bolinha sai do copo subindo de volta.
 */
(function () {
  "use strict";

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function range(p, start, end) {
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / (end - start);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInQuad(t) {
    return t * t;
  }

  function easeOutBack(t) {
    var c1 = 1.35;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function setSvgTransform(el, cx, cy, tx, ty, sx, sy) {
    if (!el) return;
    var str =
      "translate(" +
      (cx + tx).toFixed(2) +
      "," +
      (cy + ty).toFixed(2) +
      ") scale(" +
      sx.toFixed(4) +
      "," +
      sy.toFixed(4) +
      ") translate(" +
      (-cx) +
      "," +
      (-cy) +
      ")";
    el.setAttribute("transform", str);
  }

  function initBeakerAnimation() {
    var stage = document.getElementById("beaker-experiment-stage");
    var orb = document.getElementById("chem-floating-orb");
    var guaranteeCard = document.querySelector(".guarantee-card");
    var offerSection = document.getElementById("oferta");
    var offerCard = document.querySelector(".offer-card");

    if (!stage || !orb || !offerCard || !offerSection) return;

    var liquid = document.getElementById("beaker-liquid");
    var liquidSurface = document.getElementById("liquid-surface");
    var waterReactionPlume = document.getElementById("water-reaction-plume");
    var liquidBubbles = document.querySelectorAll("#liquid-bubbles .l-bubble");

    var foamInternalColumn = document.getElementById("foam-internal-column");
    var foamWaveBase = document.getElementById("foam-wave-base");
    var foamWaveMid = document.getElementById("foam-wave-mid");
    var foamWaveTop = document.getElementById("foam-wave-top");
    var foamViscousDrips = document.getElementById("foam-viscous-drips");
    var foamBasePool = document.getElementById("foam-base-pool");

    var particles = document.querySelectorAll("#chem-particles .chem-particle");
    var particlesGroup = document.getElementById("chem-particles");
    var trailParticles = orb.querySelectorAll(".orb-trail-particle");

    var offerHeader = offerCard.querySelector(".card-offer-header");
    var offerBenefits = offerCard.querySelector(".offer-benefits-list");
    var offerPricing = offerCard.querySelector(".offer-pricing-area");

    // Garante que a bolinha esteja visível para a animação
    orb.style.display = "block";

    // Calcula a distância inicial da bolinha (saindo logo abaixo/atrás do card de garantia)
    function computeStartY() {
      if (guaranteeCard && stage) {
        var gRect = guaranteeCard.getBoundingClientRect();
        var sRect = stage.getBoundingClientRect();
        var dist = (gRect.bottom - 20) - (sRect.top + sRect.height * 0.426);
        return Math.max(-340, Math.min(-180, Math.round(dist)));
      }
      return window.innerWidth <= 640 ? -220 : -260;
    }

    var startY = computeStartY();

    // Renderiza todo o experimento de forma determinística para qualquer progresso p (0.0 a 1.0)
    function renderAtProgress(p) {
      p = clamp01(p);

      // =========================================================================
      // 1. BOLINHA DESCENDO ATÉ A BOCA DO COPO E MERGULHANDO NA ÁGUA (p: 0.00 -> 0.32)
      // =========================================================================
      var orbY = startY;
      var orbScale = 1;
      var orbOpacity = 1;
      var trailOpacity = 0.85;

      if (p <= 0.20) {
        // Desce de trás da garantia até a boca do copo (y = 0)
        var tAir = range(p, 0.0, 0.20);
        orbY = lerp(startY, 0, tAir);
        orbScale = 1;
        orbOpacity = 1;
        trailOpacity = lerp(0.85, 0.4, tAir);
      } else if (p <= 0.27) {
        // Entra no copo e cai até a superfície da água (y = 0 -> y = 62)
        var tFall = easeInQuad(range(p, 0.20, 0.27));
        orbY = lerp(0, 62, tFall);
        orbScale = lerp(1, 0.88, tFall);
        orbOpacity = 1;
        trailOpacity = lerp(0.4, 0, tFall);
      } else if (p <= 0.33) {
        // Mergulha dentro da água e dissolve ativando a reação (y = 62 -> y = 78)
        var tSubmerge = range(p, 0.27, 0.33);
        orbY = lerp(62, 78, tSubmerge);
        orbScale = lerp(0.88, 0.12, tSubmerge);
        orbOpacity = lerp(1, 0, tSubmerge);
        trailOpacity = 0;
      } else {
        orbY = 78;
        orbScale = 0.1;
        orbOpacity = 0;
        trailOpacity = 0;
      }

      orb.style.opacity = orbOpacity.toFixed(3);
      orb.style.transform =
        "translate3d(0px, " +
        orbY.toFixed(2) +
        "px, 0px) scale(" +
        orbScale.toFixed(3) +
        ")";

      for (var t = 0; t < trailParticles.length; t++) {
        trailParticles[t].style.opacity = trailOpacity.toFixed(3);
      }

      // =========================================================================
      // 2. REAÇÃO NA ÁGUA NO IMPACTO DA BOLINHA (p: 0.26 -> 0.45)
      // =========================================================================
      if (waterReactionPlume) {
        var tPlume = easeOutCubic(range(p, 0.26, 0.40));
        var plumeOp = p < 0.26 ? 0 : lerp(0.95, 0.45, range(p, 0.40, 0.85));
        waterReactionPlume.setAttribute("opacity", (tPlume * plumeOp).toFixed(3));
        var pScale = lerp(0.25, 1.35, tPlume);
        setSvgTransform(waterReactionPlume, 210, 216, 0, 0, pScale, pScale);
      }

      if (liquidSurface) {
        var wavePhase = range(p, 0.26, 0.50);
        var surfaceY =
          wavePhase > 0 && wavePhase < 1
            ? Math.sin(wavePhase * Math.PI * 4) * -3.5
            : 0;
        liquidSurface.setAttribute(
          "transform",
          "translate(0," + surfaceY.toFixed(2) + ")"
        );
      }

      if (liquid) {
        var liqWave = range(p, 0.26, 0.45);
        var liqScaleY =
          liqWave > 0 && liqWave < 1
            ? 1 + Math.sin(liqWave * Math.PI * 2) * 0.03
            : 1;
        setSvgTransform(liquid, 210, 285, 0, 0, 1, liqScaleY);
      }

      for (var b = 0; b < liquidBubbles.length; b++) {
        var bStart = 0.26 + b * 0.015;
        var tBub = easeOutCubic(range(p, bStart, bStart + 0.22));
        var bubY = lerp(0, -28 - (b % 4) * 5, tBub);
        liquidBubbles[b].setAttribute(
          "transform",
          "translate(0," + bubY.toFixed(2) + ")"
        );
      }

      // =========================================================================
      // 3. FASE 1 DA ESPUMA: SOBE CONTINUAMENTE DA ÁGUA (y=210) ATÉ A BOCA (y=140)
      // Ancorada na superfície da água (210, 210) crescendo para cima sem recortes
      // =========================================================================
      if (foamInternalColumn) {
        var tInternal = easeOutCubic(range(p, 0.27, 0.45));
        var intOpacity = tInternal > 0.005 ? 1 : 0;
        var intSX = lerp(0.96, 1, tInternal);
        var intSY = lerp(0.04, 1, tInternal);
        foamInternalColumn.setAttribute("opacity", intOpacity);
        setSvgTransform(foamInternalColumn, 210, 210, 0, 0, intSX, intSY);
      }

      // =========================================================================
      // 4. FASE 2 DA ESPUMA: COROA EMERGE DE DENTRO DO TOPO DA COLUNA (210, 152)
      // Cresce conectada à coluna interna, sem nenhum espaço vazio
      // =========================================================================
      if (foamWaveBase) {
        var tBase = easeOutCubic(range(p, 0.41, 0.59));
        var baseOp = tBase > 0.005 ? 1 : 0;
        var baseSX = lerp(0.55, 1, tBase);
        var baseSY = lerp(0.15, 1, tBase);
        foamWaveBase.setAttribute("opacity", baseOp);
        setSvgTransform(foamWaveBase, 210, 152, 0, 0, baseSX, baseSY);
      }

      if (foamWaveMid) {
        var tMid = easeOutCubic(range(p, 0.46, 0.65));
        var midOp = tMid > 0.005 ? 1 : 0;
        var midSX = lerp(0.62, 1, tMid);
        var midSY = lerp(0.18, 1, tMid);
        foamWaveMid.setAttribute("opacity", midOp);
        setSvgTransform(foamWaveMid, 210, 136, 0, 0, midSX, midSY);
      }

      if (foamWaveTop) {
        var rawTop = range(p, 0.51, 0.71);
        var tTop = easeOutBack(rawTop);
        var topOp = rawTop > 0.005 ? 1 : 0;
        var topSX = lerp(0.62, 1, easeOutCubic(rawTop));
        var topSY = lerp(0.18, 1, tTop);
        foamWaveTop.setAttribute("opacity", topOp);
        setSvgTransform(foamWaveTop, 210, 120, 0, 0, topSX, topSY);
      }

      // =========================================================================
      // 5. FASE 3 DA ESPUMA: ESCORRE CONTINUAMENTE PELO FRASCO ATÉ A PARTE DE BAIXO
      // Ancorada dentro da coroa (210, 132) e deslizando pelo corpo do frasco até y=286
      // =========================================================================
      if (foamViscousDrips) {
        var tDrips = range(p, 0.49, 0.85);
        var dripsOp = tDrips > 0.005 ? 1 : 0;
        var dripsSX = lerp(0.94, 1, easeOutCubic(tDrips));
        var dripsSY = lerp(0.08, 1, tDrips);
        foamViscousDrips.setAttribute("opacity", dripsOp);
        setSvgTransform(foamViscousDrips, 210, 132, 0, 0, dripsSX, dripsSY);
      }

      // =========================================================================
      // 6. FASE 4 DA ESPUMA: ESPALHA SUAVEMENTE NA BASE TOCANDO O CARD DE OFERTA
      // =========================================================================
      if (foamBasePool) {
        var tPool = easeOutCubic(range(p, 0.74, 0.96));
        var poolOp = tPool > 0.005 ? 1 : 0;
        var poolSX = lerp(0.42, 1, tPool);
        var poolSY = lerp(0.25, 1, tPool);
        foamBasePool.setAttribute("opacity", poolOp);
        setSvgTransform(foamBasePool, 210, 272, 0, 0, poolSX, poolSY);
      }

      // =========================================================================
      // 7. PARTÍCULAS CIENTÍFICAS SUAVES (p: 0.56 -> 0.88)
      // =========================================================================
      if (particlesGroup) {
        var partWindow = range(p, 0.56, 0.88);
        var partGroupOp =
          partWindow <= 0 || partWindow >= 1
            ? 0
            : Math.sin(partWindow * Math.PI);
        particlesGroup.setAttribute("opacity", partGroupOp.toFixed(3));

        for (var idx = 0; idx < particles.length; idx++) {
          var angle = (idx / particles.length) * Math.PI * 2;
          var dist = (32 + (idx % 3) * 14) * easeOutCubic(partWindow);
          var dx = Math.cos(angle) * dist;
          var dy = Math.sin(angle) * dist - 16 * partWindow;
          var pSc = lerp(0.4, 1.1, partWindow);
          particles[idx].setAttribute(
            "transform",
            "translate(" +
            dx.toFixed(1) +
            "," +
            dy.toFixed(1) +
            ") scale(" +
            pSc.toFixed(2) +
            ")"
          );
        }
      }

      // =========================================================================
      // 8. REVELAÇÃO MÁGICA DO CARD DE OFERTA CONECTADO À ESPUMA (p: 0.68 -> 0.98)
      // O topo do card fica colado na base do béquer (sem deslocamento vertical que
      // separe os dois), abrindo radialmente a partir do centro da espuma que escorre sobre ele
      // =========================================================================
      var rawOffer = range(p, 0.68, 0.98);
      var tOffer = easeOutCubic(rawOffer);
      var offerOp = clamp01(range(p, 0.68, 0.78));
      var offerScale = lerp(0.96, 1.0, tOffer);
      var clipRadius = lerp(0, 155, tOffer);

      offerCard.style.opacity = offerOp.toFixed(3);
      offerCard.style.transform =
        "translate3d(0px, 0px, 0px) scale(" + offerScale.toFixed(4) + ")";

      if (rawOffer <= 0.002) {
        offerCard.style.clipPath = "circle(0% at 50% 0%)";
        offerCard.style.webkitClipPath = "circle(0% at 50% 0%)";
        offerCard.style.pointerEvents = "none";
      } else if (rawOffer < 0.995) {
        var clipStr = "circle(" + clipRadius.toFixed(1) + "% at 50% 0%)";
        offerCard.style.clipPath = clipStr;
        offerCard.style.webkitClipPath = clipStr;
        offerCard.style.pointerEvents = "auto";
      } else {
        offerCard.style.clipPath = "none";
        offerCard.style.webkitClipPath = "none";
        offerCard.style.pointerEvents = "auto";
      }

      // Brilho ciano da reação química ao redor do card enquanto ele é revelado
      var glowIntensity = Math.sin(rawOffer * Math.PI);
      if (glowIntensity > 0.02) {
        offerCard.style.boxShadow =
          "0 25px 60px -10px rgba(10, 35, 65, 0.45), 0 0 " +
          Math.round(42 * glowIntensity) +
          "px rgba(56, 189, 248, " +
          (0.55 * glowIntensity).toFixed(2) +
          ")";
      } else {
        offerCard.style.boxShadow = "";
      }

      // Revelação em cascata do conteúdo interno da oferta conforme a cortina abre
      if (offerHeader) {
        var tHead = easeOutCubic(range(p, 0.68, 0.86));
        offerHeader.style.opacity = tHead.toFixed(3);
        offerHeader.style.transform =
          "translate3d(0px, " + lerp(18, 0, tHead).toFixed(1) + "px, 0px)";
      }
      if (offerBenefits) {
        var tBen = easeOutCubic(range(p, 0.74, 0.92));
        offerBenefits.style.opacity = tBen.toFixed(3);
        offerBenefits.style.transform =
          "translate3d(0px, " + lerp(22, 0, tBen).toFixed(1) + "px, 0px)";
      }
      if (offerPricing) {
        var tPrice = easeOutCubic(range(p, 0.80, 0.98));
        offerPricing.style.opacity = tPrice.toFixed(3);
        offerPricing.style.transform =
          "translate3d(0px, " + lerp(24, 0, tPrice).toFixed(1) + "px, 0px)";
      }
    }

    // =========================================================================
    // MOTOR DE SCROLL EM TEMPO REAL (Imune a imagens lazy-load e sem travamentos)
    // =========================================================================
    var targetProgress = 0;
    var currentProgress = 0;
    var rafId = null;

    function computeTargetProgress() {
      var rect = stage.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 800;

      // Inicia suavemente quando o béquer se aproxima da visão (78% da altura)
      // e completa a reação ao chegar próximo ao topo (12% da altura)
      var startTop = vh * 0.78;
      var endTop = vh * 0.12;

      var raw = (startTop - rect.top) / (startTop - endTop);
      return clamp01(raw);
    }

    function tick() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        // Suavização mais cadenciada para a reação não correr rápido demais
        currentProgress += diff * 0.14;
        renderAtProgress(currentProgress);
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentProgress = targetProgress;
        renderAtProgress(currentProgress);
        rafId = null;
      }
    }

    function onScrollOrUpdate() {
      targetProgress = computeTargetProgress();
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    }

    function onResize() {
      startY = computeStartY();
      targetProgress = computeTargetProgress();
      currentProgress = targetProgress;
      renderAtProgress(currentProgress);
    }

    // Inicializa imediatamente na posição atual da página
    startY = computeStartY();
    targetProgress = computeTargetProgress();
    currentProgress = targetProgress;
    renderAtProgress(currentProgress);

    window.addEventListener("scroll", onScrollOrUpdate, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBeakerAnimation);
  } else {
    initBeakerAnimation();
  }
})();

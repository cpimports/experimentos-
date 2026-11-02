
(function () {
  "use strict";

  /* ---------- Barra de urgência: data de hoje em pt-BR ---------- */
  var dateEl = document.getElementById("urgency-date");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  }

  /* ---------- Marquee de prova social ---------- */
  var depoimentos = [
    { text: "Meus filhos ficaram fascinados!", author: "Ana Silva" },
    { text: "Parece mágica de verdade!",       author: "João Pedro" },
    { text: "Vale muito a pena!",              author: "Maria Santos" },
    { text: "Experimentos incríveis!",         author: "Carlos Lima" },
    { text: "Eles não param de pedir mais!",   author: "Fernanda Costa" },
    { text: "Ciência nunca foi tão divertida!",author: "Roberto Alves" },
    { text: "Simplesmente maravilhoso!",       author: "Paula Souza" },
    { text: "Melhor investimento!",            author: "Lucas Martins" }
  ];
  var STAR = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star w-3 h-3 text-success fill-success"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  var row1 = document.getElementById("marquee-row-1");
  var row2 = document.getElementById("marquee-row-2");
  if (row1 && row2) {
    var itens = depoimentos.concat(depoimentos); // mesma duplicação do original
    var html = "";
    for (var i = 0; i < itens.length; i++) {
      html += '<div class="mx-8 inline-flex items-center gap-2" data-testid="marquee-item-' + i + '">'
            +   '<div class="flex gap-0.5">' + STAR + STAR + STAR + STAR + STAR + '</div>'
            +   '<span class="text-sm md:text-base font-medium text-foreground">'
            +     itens[i].text + " - " + itens[i].author
            +   '</span>'
            + '</div>';
    }
    row1.innerHTML = html;
    row2.innerHTML = html;
  }

  /* ---------- Contador regressivo ----------
     Conta até a meia-noite REAL do relógio do visitante, coerente com a
     promessa "oferta válida somente hoje" e reinicia automaticamente todo dia à meia-noite. */
  var cdElementsH = document.querySelectorAll("#cd-h, .cd-bonus-h"),
      cdElementsM = document.querySelectorAll("#cd-m, .cd-bonus-m"),
      cdElementsS = document.querySelectorAll("#cd-s, .cd-bonus-s");
  if (cdElementsH.length && cdElementsM.length && cdElementsS.length) {
    var doisDigitos = function (n) { return ("0" + n).slice(-2); };
    var atualizarContador = function () {
      var agora = new Date();
      var meiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 0, 0, 0, 0);
      var seg = Math.max(0, Math.floor((meiaNoite - agora) / 1000));
      var h = doisDigitos(Math.floor(seg / 3600));
      var m = doisDigitos(Math.floor((seg % 3600) / 60));
      var s = doisDigitos(seg % 60);

      for (var i = 0; i < cdElementsH.length; i++) { cdElementsH[i].textContent = h; }
      for (var j = 0; j < cdElementsM.length; j++) { cdElementsM[j].textContent = m; }
      for (var k = 0; k < cdElementsS.length; k++) { cdElementsS[k].textContent = s; }
    };
    atualizarContador();
    window.setInterval(atualizarContador, 1000);
  }

  /* ---------- CTA fixo no rodapé ----------
     Fica escondido enquanto o botão do hero está visível (seria redundante)
     e entra assim que ele sai da tela por cima. */
  var ctaFixo = document.getElementById("cta-fixo");
  var botoesOferta = document.querySelectorAll('[data-testid="button-cta-section4"], [data-testid="button-cta-bonus"]');
  for (var b = 0; b < botoesOferta.length; b++) {
    botoesOferta[b].addEventListener("click", function () {
      var alvo = document.getElementById("oferta");
      if (alvo) {
        alvo.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  var botaoHero = document.querySelector('[data-testid="button-cta-hero"]');
  if (botaoHero) {
    botaoHero.addEventListener("click", function () {
      var alvo = document.getElementById("secao-experimentos");
      if (alvo) {
        alvo.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  if (ctaFixo && botaoHero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var passouDoTopo = !e.isIntersecting && e.boundingClientRect.top < 0;
        ctaFixo.classList.toggle("visivel", passouDoTopo);
      });
    }).observe(botaoHero);
  } else if (ctaFixo) {
    ctaFixo.classList.add("visivel"); // sem IntersectionObserver, mostra sempre
  }

  /* ---------- FAQ (acordeão: um aberto por vez, recolhível) ---------- */
  var faq = document.getElementById("faq-accordion");
  if (faq) {
    var gatilhos = faq.querySelectorAll("button[aria-controls]");

    function fechar(btn) {
      var conteudo = document.getElementById(btn.getAttribute("aria-controls"));
      if (!conteudo || conteudo.getAttribute("data-state") === "closed") return;
      conteudo.style.setProperty("--radix-accordion-content-height", conteudo.scrollHeight + "px");
      conteudo.setAttribute("data-state", "closed");
      btn.setAttribute("data-state", "closed");
      btn.setAttribute("aria-expanded", "false");
      btn.parentNode.setAttribute("data-state", "closed");
      btn.parentNode.parentNode.setAttribute("data-state", "closed");
      window.setTimeout(function () {
        if (conteudo.getAttribute("data-state") === "closed") conteudo.hidden = true;
      }, 200);
    }

    function abrir(btn) {
      var conteudo = document.getElementById(btn.getAttribute("aria-controls"));
      if (!conteudo) return;
      conteudo.hidden = false;
      conteudo.style.setProperty("--radix-accordion-content-height", conteudo.scrollHeight + "px");
      conteudo.setAttribute("data-state", "open");
      btn.setAttribute("data-state", "open");
      btn.setAttribute("aria-expanded", "true");
      btn.parentNode.setAttribute("data-state", "open");
      btn.parentNode.parentNode.setAttribute("data-state", "open");
    }

    for (var g = 0; g < gatilhos.length; g++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var aberto = btn.getAttribute("data-state") === "open";
          for (var k = 0; k < gatilhos.length; k++) fechar(gatilhos[k]);
          if (!aberto) abrir(btn);
        });
      })(gatilhos[g]);
    }
  }

  /* ---------- Carrossel de 5 Depoimentos dos Pais ---------- */
  var tViewport = document.getElementById("testimonials-viewport");
  var tTrack = document.getElementById("testimonials-track");
  var tPrevBtn = document.getElementById("t-prev-btn");
  var tNextBtn = document.getElementById("t-next-btn");
  var tDotsContainer = document.getElementById("testimonials-dots");

  if (tViewport && tTrack) {
    var tSlides = tTrack.children;
    var tDots = tDotsContainer ? tDotsContainer.children : [];
    var totalTSlides = tSlides.length;

    function atualizarTDots(idx) {
      for (var d = 0; d < tDots.length; d++) {
        if (d === idx) {
          tDots[d].classList.add("active");
        } else {
          tDots[d].classList.remove("active");
        }
      }
    }

    function scrollParaTSlide(idx) {
      if (idx < 0) idx = 0;
      if (idx >= totalTSlides) idx = totalTSlides - 1;
      var targetSlide = tSlides[idx];
      if (targetSlide) {
        var scrollLeft = targetSlide.offsetLeft - tTrack.offsetLeft;
        tViewport.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth"
        });
      }
      atualizarTDots(idx);
    }

    if (tPrevBtn) {
      tPrevBtn.addEventListener("click", function () {
        var slideWidth = tSlides[0] ? tSlides[0].offsetWidth + 24 : 340;
        tViewport.scrollBy({ left: -slideWidth, behavior: "smooth" });
      });
    }

    if (tNextBtn) {
      tNextBtn.addEventListener("click", function () {
        var slideWidth = tSlides[0] ? tSlides[0].offsetWidth + 24 : 340;
        tViewport.scrollBy({ left: slideWidth, behavior: "smooth" });
      });
    }

    for (var td = 0; td < tDots.length; td++) {
      (function (dotIdx) {
        tDots[dotIdx].addEventListener("click", function () {
          scrollParaTSlide(dotIdx);
        });
      })(td);
    }

    var tScrollTimer = null;
    tViewport.addEventListener("scroll", function () {
      if (tScrollTimer) cancelAnimationFrame(tScrollTimer);
      tScrollTimer = requestAnimationFrame(function () {
        var scrollPos = tViewport.scrollLeft;
        var menorDist = Infinity;
        var maisProximo = 0;
        for (var s = 0; s < totalTSlides; s++) {
          var dist = Math.abs(tSlides[s].offsetLeft - tTrack.offsetLeft - scrollPos);
          if (dist < menorDist) {
            menorDist = dist;
            maisProximo = s;
          }
        }
        atualizarTDots(maisProximo);
      });
    }, { passive: true });
  }

  /* ---------- Carrossel de 4 Vídeos de Experimentos ---------- */
  var videoViewport = document.getElementById("video-carousel-viewport");
  var videoTrack = document.getElementById("video-carousel-track");
  var videoPrevBtn = document.getElementById("video-prev-btn");
  var videoNextBtn = document.getElementById("video-next-btn");
  var videoDotsContainer = document.getElementById("video-carousel-dots");

  if (videoViewport && videoTrack) {
    var videoSlides = videoTrack.children;
    var videoDots = videoDotsContainer ? videoDotsContainer.children : [];
    var totalVideoSlides = videoSlides.length;

    function atualizarClassesSlides(idxAtivo) {
      for (var s = 0; s < totalVideoSlides; s++) {
        if (s === idxAtivo) {
          videoSlides[s].classList.add("is-active-slide");
        } else {
          videoSlides[s].classList.remove("is-active-slide");
        }
      }
    }

    function atualizarVideoDots(idxAtivo) {
      for (var d = 0; d < videoDots.length; d++) {
        if (d === idxAtivo) {
          videoDots[d].classList.add("active");
        } else {
          videoDots[d].classList.remove("active");
        }
      }
    }

    var currentVideoIdx = 0;

    function pausarOutrosVideos(slideAtivo) {
      var allVideos = videoTrack.querySelectorAll("video");
      for (var v = 0; v < allVideos.length; v++) {
        var slideParent = allVideos[v].closest(".video-carousel-slide");
        if (slideParent && slideParent !== slideAtivo) {
          allVideos[v].pause();
        }
      }
    }

    function scrollParaSlide(idx) {
      if (idx < 0) idx = totalVideoSlides - 1;
      if (idx >= totalVideoSlides) idx = 0;
      currentVideoIdx = idx;
      var targetSlide = videoSlides[idx];
      if (targetSlide) {
        var scrollLeft = targetSlide.offsetLeft - (videoViewport.clientWidth - targetSlide.clientWidth) / 2;
        videoViewport.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth"
        });
        pausarOutrosVideos(targetSlide);
      }
      atualizarVideoDots(idx);
      atualizarClassesSlides(idx);
    }

    if (videoPrevBtn) {
      videoPrevBtn.addEventListener("click", function () {
        scrollParaSlide(currentVideoIdx - 1);
      });
    }

    if (videoNextBtn) {
      videoNextBtn.addEventListener("click", function () {
        scrollParaSlide(currentVideoIdx + 1);
      });
    }

    for (var vd = 0; vd < videoDots.length; vd++) {
      (function (dotIdx) {
        videoDots[dotIdx].addEventListener("click", function () {
          scrollParaSlide(dotIdx);
        });
      })(vd);
    }

    /* Clique direto em um slide vizinho que está 'espiando' para centralizá-lo */
    for (var sl = 0; sl < totalVideoSlides; sl++) {
      (function (slideIdx) {
        videoSlides[slideIdx].addEventListener("click", function (e) {
          if (currentVideoIdx !== slideIdx) {
            e.preventDefault();
            e.stopPropagation();
            scrollParaSlide(slideIdx);
          }
        }, true);
      })(sl);
    }

    var videoScrollTimer = null;
    videoViewport.addEventListener("scroll", function () {
      if (videoScrollTimer) cancelAnimationFrame(videoScrollTimer);
      videoScrollTimer = requestAnimationFrame(function () {
        var centroViewport = videoViewport.scrollLeft + (videoViewport.clientWidth / 2);
        var menorDist = Infinity;
        var maisProximo = 0;
        for (var s = 0; s < totalVideoSlides; s++) {
          var centroSlide = videoSlides[s].offsetLeft + (videoSlides[s].clientWidth / 2);
          var dist = Math.abs(centroViewport - centroSlide);
          if (dist < menorDist) {
            menorDist = dist;
            maisProximo = s;
          }
        }
        currentVideoIdx = maisProximo;
        atualizarVideoDots(maisProximo);
        atualizarClassesSlides(maisProximo);
        pausarOutrosVideos(videoSlides[maisProximo]);
      });
    }, { passive: true });

    /* Inicialização do estado visual */
    atualizarVideoDots(0);
    atualizarClassesSlides(0);

    /* Controle dos botões de Play sobre as capas dos vídeos locais */
    var playOverlays = document.querySelectorAll(".video-play-overlay");
    for (var ov = 0; ov < playOverlays.length; ov++) {
      (function (btn) {
        var frame = btn.closest(".phone-mockup-frame");
        if (!frame) return;
        var vid = frame.querySelector("video");
        if (!vid) return;

        btn.addEventListener("click", function () {
          vid.play();
        });
        vid.addEventListener("play", function () {
          btn.classList.add("is-hidden");
        });
        vid.addEventListener("pause", function () {
          btn.classList.remove("is-hidden");
        });
        vid.addEventListener("ended", function () {
          btn.classList.remove("is-hidden");
        });
      })(playOverlays[ov]);
    }
  }

  /* ---------- Transição Científica: Água de Ambos os Lados + Mistura + Bolhas Fluidas ----------
     Dispara apenas quando a faixa de onda chega um pouquinho abaixo do meio da tela (~60% da altura),
     permitindo que o visitante veja claramente a água azul e amarela se encontrando e virando verde. */
  var transicaoCientifica = document.getElementById("science-transition");
  if (transicaoCientifica) {
    var verificarPosicaoOnda = function () {
      var rect = transicaoCientifica.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 800;
      // Ativa quando a transição chega um pouco abaixo do meio da tela (60% da altura da janela)
      if (rect.top <= vh * 0.60 && rect.bottom >= 0) {
        if (!transicaoCientifica.classList.contains("is-reacting")) {
          transicaoCientifica.classList.add("is-reacting");
        }
      } else if (rect.top > vh * 0.92) {
        // Se a pessoa voltar a página para cima, rearma a onda para poder ver novamente ao descer
        transicaoCientifica.classList.remove("is-reacting");
      }
    };
    verificarPosicaoOnda();
    window.addEventListener("scroll", verificarPosicaoOnda, { passive: true });
    window.addEventListener("resize", verificarPosicaoOnda, { passive: true });
  }

  /* ---------- Proteção de conteúdo (ativa em produção, liberada em localhost para desenvolvimento) ---------- */
  if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    document.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; });
    document.addEventListener("selectstart", function (e) { e.preventDefault(); return false; });
    document.addEventListener("keydown", function (e) {
      if (e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "J") ||
          (e.ctrlKey && e.key === "U")) {
        e.preventDefault();
        return false;
      }
    });
  }
  /* Repasse automático de parâmetros de rastreamento (UTMs) para o checkout */
  var checkoutBtn = document.querySelector('[data-testid="button-checkout"]');
  if (checkoutBtn && window.location.search) {
    try {
      var currentHref = checkoutBtn.getAttribute("href") || "";
      if (currentHref) {
        var sep = currentHref.indexOf("?") === -1 ? "?" : "&";
        checkoutBtn.setAttribute("href", currentHref + sep + window.location.search.substring(1));
      }
    } catch (e) {}
  }


  /* ---------- Carrossel de Fotos: Centralizado no Celular + Setas Infinitas + Bolinhas + Toque ---------- */
  (function initKidsPhotosCarousel() {
    var viewport = document.getElementById("kids-photos-viewport");
    var prevBtn = document.getElementById("kids-prev-btn");
    var nextBtn = document.getElementById("kids-next-btn");
    var dotsContainer = document.getElementById("kids-carousel-dots");
    if (!viewport) return;

    var dots = dotsContainer ? dotsContainer.querySelectorAll(".kdot") : [];
    var items = viewport.querySelectorAll(".kid-photo-item");
    if (!items.length) return;

    function getActiveIndex() {
      var isMobile = window.innerWidth <= 768;
      var targetCenter = isMobile
        ? (viewport.scrollLeft + viewport.clientWidth / 2)
        : (viewport.scrollLeft + 40);
      var closestIdx = 0;
      var minDiff = Infinity;

      for (var i = 0; i < items.length; i++) {
        var itemPos = isMobile
          ? (items[i].offsetLeft + items[i].offsetWidth / 2)
          : (items[i].offsetLeft - viewport.offsetLeft);
        var diff = Math.abs(itemPos - targetCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
      return closestIdx;
    }

    function scrollToIndex(idx) {
      if (idx < 0) idx = 0;
      if (idx >= items.length) idx = items.length - 1;
      var isMobile = window.innerWidth <= 768;
      var targetScroll;
      if (isMobile) {
        targetScroll = items[idx].offsetLeft - (viewport.clientWidth - items[idx].offsetWidth) / 2;
      } else {
        targetScroll = items[idx].offsetLeft - viewport.offsetLeft;
      }
      viewport.scrollTo({ left: targetScroll, behavior: "smooth" });
    }

    // Ao avançar na última foto, volta suavemente para a primeira foto
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var cur = getActiveIndex();
        if (cur >= items.length - 1) {
          scrollToIndex(0);
        } else {
          scrollToIndex(cur + 1);
        }
      });
    }

    // Ao recuar na primeira foto, vai suavemente para a última foto
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var cur = getActiveIndex();
        if (cur <= 0) {
          scrollToIndex(items.length - 1);
        } else {
          scrollToIndex(cur - 1);
        }
      });
    }

    // Atualiza a bolinha ativa conforme a rolagem/deslize do dedo
    function updateActiveDot() {
      if (!dots.length) return;
      var activeIdx = getActiveIndex();
      for (var d = 0; d < dots.length; d++) {
        if (d === activeIdx) {
          dots[d].classList.add("active");
        } else {
          dots[d].classList.remove("active");
        }
      }
    }

    // Clique nas bolinhas para ir diretamente até a foto correspondente
    for (var k = 0; k < dots.length; k++) {
      (function (dotIdx) {
        dots[dotIdx].addEventListener("click", function () {
          scrollToIndex(dotIdx);
        });
      })(k);
    }

    viewport.addEventListener("scroll", updateActiveDot, { passive: true });
    window.addEventListener("resize", updateActiveDot, { passive: true });
    updateActiveDot();
  })();

})();

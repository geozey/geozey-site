/* ============================================================
   Geozey - motion.js
   Animations au defilement : apparitions progressives, parallaxe
   du hero, voile qui se ferme, compteurs sur les chiffres cles.

   Trois principes de securite, dans cet ordre d'importance.

   1. Le CSS qui masque les elements est injecte PAR ce script.
      Si le fichier ne se charge pas, ou si le navigateur est trop
      ancien, aucune regle n'est posee et le site s'affiche nu,
      entierement lisible. Jamais de contenu invisible a cause
      d'une animation qui n'a pas demarre.
   2. prefers-reduced-motion est respecte des la premiere ligne :
      le script sort immediatement, sans rien injecter du tout.
   3. Chaque effet verifie la presence de ses elements avant de
      s'installer. Une page qui n'a ni hero ni chiffres ne paie
      aucun observateur ni aucun ecouteur de defilement.
   ============================================================ */

(function () {
  "use strict";

  if (!("IntersectionObserver" in window) || !document.querySelector) return;

  var reduit = false;
  try {
    reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}
  if (reduit) return;

  var DUREE_COMPTEUR = 1400;

  function injecterStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".gz-rev{opacity:0;transform:translateY(20px);" +
      "transition:opacity .75s cubic-bezier(.22,.61,.36,1),transform .75s cubic-bezier(.22,.61,.36,1)}" +
      ".gz-rev.gz-vu{opacity:1;transform:none}" +
      ".hero-photo{position:relative}" +
      ".hero-photo::after{content:'';position:absolute;inset:0;background:#1e1e1e;" +
      "opacity:var(--gz-voile,0);pointer-events:none}" +
      "@media(max-width:620px){.gz-rev{transform:translateY(12px)}}";
    document.head.appendChild(style);
  }

  /* --- Apparitions progressives -------------------------------
     Les groupes sont decales les uns par rapport aux autres pour
     que trois cartes cote a cote n'arrivent pas d'un seul bloc.
     Le decalage est plafonne : au dela de cinq elements, il
     donnerait une attente visible au lieu d'un rythme.
  ------------------------------------------------------------- */
  var GROUPES = [
    ".manifesto h1",
    ".manifesto .btns",
    ".experts-left h2",
    ".experts-left .body",
    ".collage img",
    ".domaines h2",
    ".domaines p.sub",
    ".dcard",
    ".expertises h2",
    ".xcard",
    ".chiffres h2",
    ".stat",
    ".interventions .head",
    ".icard",
    ".visages h2",
    ".vcard",
    ".zero h2",
    ".zero p.triple"
  ];

  function installerApparitions() {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        entree.target.classList.add("gz-vu");
        observateur.unobserve(entree.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    GROUPES.forEach(function (selecteur) {
      var elements = document.querySelectorAll(selecteur);
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (el.classList.contains("gz-rev")) continue;
        el.classList.add("gz-rev");
        if (i > 0) {
          el.style.transitionDelay = Math.min(i, 5) * 0.08 + "s";
        }
        observateur.observe(el);
      }
    });
  }

  /* --- Parallaxe et voile du hero -----------------------------
     La photo du hero est une image de fond CSS, pas une balise,
     donc on deplace background-position plutot que la boite.
     La valeur de depart du site est "center 30%", on lui ajoute
     un decalage calcule. Le facteur reste faible : au dela de
     0.15 l'image se decolle visiblement du bas de la section.
  ------------------------------------------------------------- */
  function installerHero() {
    var photo = document.querySelector(".hero-photo");
    var hero = document.querySelector("section.hero");
    if (!photo || !hero) return;

    var enCours = false;

    function peindre() {
      enCours = false;
      var hauteur = hero.offsetHeight || window.innerHeight;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y > hauteur) return;
      var avance = y / hauteur;
      photo.style.backgroundPosition = "center calc(30% + " + (y * 0.13).toFixed(1) + "px)";
      photo.style.setProperty("--gz-voile", (Math.min(avance, 1) * 0.42).toFixed(3));
    }

    function surDefilement() {
      if (enCours) return;
      enCours = true;
      window.requestAnimationFrame(peindre);
    }

    window.addEventListener("scroll", surDefilement, { passive: true });
    window.addEventListener("resize", surDefilement, { passive: true });
    peindre();
  }

  /* --- Compteurs sur les chiffres cles ------------------------
     Les valeurs du site portent leur mise en forme : "5+ Md€",
     "43 ans", "30+", "01". On isole le nombre, on anime, et on
     reecrit prefixe et suffixe a chaque image.

     Deux valeurs ne doivent surtout pas etre animees :
     - celles dont le zero initial est signifiant, comme "01",
       qu'une conversion numerique afficherait "1" ;
     - celles qui ne contiennent aucun chiffre.
     A la fin de l'animation on reecrit la chaine d'origine telle
     quelle, ce qui garantit qu'aucune valeur affichee ne peut
     durablement differer de celle ecrite dans le HTML.
  ------------------------------------------------------------- */
  function animerChiffre(el) {
    var original = el.textContent;
    var trouve = original.match(/^(\D*?)(\d[\d  .,]*)(.*)$/);
    if (!trouve) return;

    var prefixe = trouve[1];
    var nombreEcrit = trouve[2];
    var suffixe = trouve[3];

    if (/^0\d/.test(nombreEcrit)) return;

    var normalise = nombreEcrit.replace(/[  ]/g, "").replace(",", ".");
    var cible = parseFloat(normalise);
    if (!isFinite(cible) || cible <= 0) return;

    var decimales = (normalise.split(".")[1] || "").length;

    // Garde de fidelite. Si la valeur reconstruite ne redonne pas
    // exactement la chaine d'origine, c'est que la mise en forme
    // nous echappe : separateur de milliers, virgule decimale, unite
    // collee. Dans ce cas on renonce a animer plutot que d'afficher,
    // meme une seconde, un chiffre ecrit autrement que dans le HTML.
    if (prefixe + cible.toFixed(decimales) + suffixe !== original) return;

    var debut = null;

    function etape(horodatage) {
      if (debut === null) debut = horodatage;
      var avance = Math.min((horodatage - debut) / DUREE_COMPTEUR, 1);
      var adouci = 1 - Math.pow(1 - avance, 3);
      var valeur = (cible * adouci).toFixed(decimales);
      el.textContent = prefixe + valeur + suffixe;
      if (avance < 1) {
        window.requestAnimationFrame(etape);
      } else {
        el.textContent = original;
      }
    }

    el.textContent = prefixe + (0).toFixed(decimales) + suffixe;
    window.requestAnimationFrame(etape);
  }

  function installerCompteurs() {
    var valeurs = document.querySelectorAll(".stat .v");
    if (!valeurs.length) return;

    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        observateur.unobserve(entree.target);
        animerChiffre(entree.target);
      });
    }, { threshold: 0.6 });

    for (var i = 0; i < valeurs.length; i++) {
      observateur.observe(valeurs[i]);
    }
  }

  function initialiser() {
    injecterStyles();
    installerApparitions();
    installerHero();
    installerCompteurs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiser);
  } else {
    initialiser();
  }
})();

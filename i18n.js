/* ============================================================
   Geozey - i18n.js
   Selecteur de langue et chargement a la demande du moteur de
   traduction. Ce fichier est charge inconditionnellement sur les
   cinq pages publiques du site : il reste volontairement petit.
   Le dictionnaire FR -> EN et le moteur d'application sur le DOM
   vivent dans /i18n-en.js, telecharge uniquement quand la langue
   anglaise est reellement demandee (bouton EN ou preference
   memorisee). Un visiteur qui reste en francais ne telecharge
   jamais ce second fichier.
   Le francais reste la version qui fait foi pour les mentions
   legales et la politique de confidentialite : ce script n'est
   jamais charge sur ces deux pages.
   ============================================================ */

(function () {
  "use strict";

  var LANG_KEY = "gz_lang";
  var DEFAULT_LANG = "fr";
  var URL_MOTEUR = "/i18n-en.js";

  var boutonsSelecteur = null;
  var moteurCharge = false;
  var chargementEnCours = false;
  var callbacksEnAttente = [];

  function getLangueStockee() {
    try {
      var v = window.localStorage.getItem(LANG_KEY);
      return v === "en" ? "en" : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setLangueStockee(langue) {
    try {
      window.localStorage.setItem(LANG_KEY, langue);
    } catch (e) {
      // Stockage indisponible, la preference ne sera simplement pas retenue.
    }
  }

  function injecterStyleSelecteur() {
    var style = document.createElement("style");
    style.textContent =
      "nav .gz-lang{margin-left:22px;display:flex;align-items:center;gap:9px;" +
      "font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:2.3px;" +
      "text-transform:uppercase;flex:none}" +
      "nav .gz-lang button{background:none;border:0;padding:4px 2px;margin:0;" +
      "cursor:pointer;font:inherit;letter-spacing:inherit;text-transform:inherit;" +
      "color:var(--ash)}" +
      "nav .gz-lang button.gz-actif{color:var(--ember);font-weight:700}" +
      "nav .gz-lang button.gz-en-chargement{opacity:.5;cursor:wait}" +
      "nav .gz-lang .gz-sep{color:var(--ash);opacity:.5}" +
      "@media(max-width:1100px){nav .gz-lang{margin-left:12px}}" +
      "@media(max-width:620px){nav .gz-lang{margin-left:8px;gap:6px;font-size:9.5px}}";
    document.head.appendChild(style);
  }

  function creerSelecteur() {
    var nav = document.querySelector("nav");
    if (!nav) return null;
    if (nav.querySelector(".gz-lang")) return null;

    var conteneur = document.createElement("div");
    conteneur.className = "gz-lang";

    var boutonFr = document.createElement("button");
    boutonFr.type = "button";
    boutonFr.textContent = "FR";
    boutonFr.setAttribute("aria-label", "Passer le site en francais");

    var separateur = document.createElement("span");
    separateur.className = "gz-sep";
    separateur.textContent = "|";
    separateur.setAttribute("aria-hidden", "true");

    var boutonEn = document.createElement("button");
    boutonEn.type = "button";
    boutonEn.textContent = "EN";
    boutonEn.setAttribute("aria-label", "Switch the site to English");

    conteneur.appendChild(boutonFr);
    conteneur.appendChild(separateur);
    conteneur.appendChild(boutonEn);
    nav.appendChild(conteneur);

    boutonFr.addEventListener("click", function () {
      basculerLangue("fr");
    });
    boutonEn.addEventListener("click", function () {
      basculerLangue("en");
    });

    return { fr: boutonFr, en: boutonEn };
  }

  function mettreAJourSelecteur(langue) {
    if (!boutonsSelecteur) return;
    boutonsSelecteur.fr.classList.toggle("gz-actif", langue === "fr");
    boutonsSelecteur.en.classList.toggle("gz-actif", langue === "en");
  }

  function marquerChargement(actif) {
    if (!boutonsSelecteur) return;
    boutonsSelecteur.en.classList.toggle("gz-en-chargement", actif);
    boutonsSelecteur.en.disabled = actif;
    boutonsSelecteur.en.textContent = actif ? "EN..." : "EN";
  }

  // Charge le moteur de traduction (dictionnaire + application sur le DOM)
  // une seule fois, a la demande. Si le telechargement echoue, le site
  // reste en francais et rien ne casse.
  function chargerMoteurTraduction(callback) {
    if (moteurCharge) {
      callback();
      return;
    }
    callbacksEnAttente.push(callback);
    if (chargementEnCours) return;
    chargementEnCours = true;
    marquerChargement(true);

    var script = document.createElement("script");
    script.src = URL_MOTEUR;
    script.async = true;
    script.onload = function () {
      moteurCharge = true;
      chargementEnCours = false;
      marquerChargement(false);
      var enAttente = callbacksEnAttente;
      callbacksEnAttente = [];
      enAttente.forEach(function (cb) {
        cb();
      });
    };
    script.onerror = function () {
      chargementEnCours = false;
      marquerChargement(false);
      callbacksEnAttente = [];
      // Echec du telechargement : le site reste en francais, rien ne casse.
    };
    document.head.appendChild(script);
  }

  function finaliserBascule(langue) {
    document.documentElement.setAttribute("lang", langue);
    setLangueStockee(langue);
    mettreAJourSelecteur(langue);
  }

  function basculerLangue(langue) {
    if (langue === "en") {
      chargerMoteurTraduction(function () {
        if (typeof window.gzAppliquerAnglais === "function") {
          window.gzAppliquerAnglais();
          finaliserBascule("en");
        }
      });
      return;
    }
    if (moteurCharge && typeof window.gzAppliquerFrancais === "function") {
      window.gzAppliquerFrancais();
    }
    finaliserBascule("fr");
  }

  // --- Initialisation ---

  function initialiser() {
    injecterStyleSelecteur();
    boutonsSelecteur = creerSelecteur();

    var langueInitiale = getLangueStockee();
    if (langueInitiale === "en") {
      chargerMoteurTraduction(function () {
        if (typeof window.gzAppliquerAnglais === "function") {
          window.gzAppliquerAnglais();
          document.documentElement.setAttribute("lang", "en");
        }
      });
    }
    mettreAJourSelecteur(langueInitiale);
  }

  // Le script est charge en defer juste avant la fermeture de body :
  // le document est deja analyse a ce stade, on peut agir tout de
  // suite, avant que la page ne soit consideree comme entierement
  // chargee.
  if (document.body) {
    initialiser();
  } else {
    document.addEventListener("DOMContentLoaded", initialiser);
  }
})();

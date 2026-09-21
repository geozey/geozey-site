/* ============================================================
   Geozey - consent.js
   Bandeau de consentement et mesure d'audience Google Analytics.

   Ordre d'execution voulu, et pourquoi il compte.
   Le mode Consentement de Google doit etre declare AVANT que
   gtag.js ne se charge. Sinon la balise demarre en collecte
   pleine et le refus arrive trop tard : quelques evenements
   sont deja partis. Ici tout est refuse par defaut, gtag.js est
   charge ensuite, et rien n'est autorise tant que le visiteur
   n'a pas clique.

   Conformite visee : refus par defaut, bouton refuser aussi
   visible que le bouton accepter, aucun mur bloquant, choix
   memorise et revocable par le lien des mentions legales.
   ============================================================ */

(function () {
  "use strict";

  var GA_ID = "G-1TP4X58LH5";
  var CLE = "gz_consentement";

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  gtag("js", new Date());
  gtag("config", GA_ID);

  var balise = document.createElement("script");
  balise.async = true;
  balise.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(balise);

  function lire() {
    try { return window.localStorage.getItem(CLE); } catch (e) { return null; }
  }
  function ecrire(valeur) {
    try { window.localStorage.setItem(CLE, valeur); } catch (e) {}
  }
  function accorder() {
    gtag("consent", "update", { analytics_storage: "granted" });
  }

  function injecterStyles() {
    var style = document.createElement("style");
    style.textContent =
      "#gz-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;" +
      "background:#fff;color:#1e1e1e;border-radius:13px;box-shadow:0 4px 18px rgba(0,0,0,.22);" +
      "padding:22px 26px;display:flex;align-items:center;gap:22px;flex-wrap:wrap;" +
      "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:1180px;margin:0 auto}" +
      "#gz-consent p{margin:0;font-size:14.5px;line-height:1.6;flex:1 1 380px;min-width:260px}" +
      "#gz-consent a{color:#FF4512}" +
      "#gz-consent .gz-actions{display:flex;gap:10px;flex:0 0 auto}" +
      "#gz-consent button{border:0;border-radius:27px;padding:12px 24px;cursor:pointer;" +
      "font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:2px;text-transform:uppercase}" +
      "#gz-consent .gz-non{background:#fff;color:#1e1e1e;border:1px solid rgba(30,30,30,.3)}" +
      "#gz-consent .gz-oui{background:#1e1e1e;color:#fff}" +
      "@media(max-width:620px){#gz-consent{padding:18px;gap:14px}" +
      "#gz-consent .gz-actions{width:100%}#gz-consent button{flex:1}}";
    document.head.appendChild(style);
  }

  function afficherBandeau() {
    injecterStyles();
    var boite = document.createElement("div");
    boite.id = "gz-consent";
    boite.setAttribute("role", "dialog");
    boite.setAttribute("aria-label", "Consentement à la mesure d'audience");
    boite.innerHTML =
      "<p>Nous utilisons un outil de mesure d'audience pour comprendre comment ce site est " +
      "consulté. Aucune donnée n'est collectée tant que vous n'avez pas accepté. " +
      "<a href=\"/politique-rgpd\">En savoir plus</a></p>" +
      "<div class=\"gz-actions\">" +
      "<button type=\"button\" class=\"gz-non\">Refuser</button>" +
      "<button type=\"button\" class=\"gz-oui\">Accepter</button>" +
      "</div>";
    document.body.appendChild(boite);

    boite.querySelector(".gz-oui").addEventListener("click", function () {
      ecrire("oui");
      accorder();
      boite.remove();
    });
    boite.querySelector(".gz-non").addEventListener("click", function () {
      ecrire("non");
      boite.remove();
    });
  }

  // Rouvrir le choix depuis n'importe quel lien portant data-gz-consent,
  // a placer dans les mentions legales pour que le refus reste revocable.
  function brancherReouverture() {
    var liens = document.querySelectorAll("[data-gz-consent]");
    for (var i = 0; i < liens.length; i++) {
      liens[i].addEventListener("click", function (evenement) {
        evenement.preventDefault();
        if (!document.getElementById("gz-consent")) afficherBandeau();
      });
    }
  }

  function initialiser() {
    var choix = lire();
    if (choix === "oui") {
      accorder();
    } else if (choix !== "non") {
      afficherBandeau();
    }
    brancherReouverture();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiser);
  } else {
    initialiser();
  }
})();

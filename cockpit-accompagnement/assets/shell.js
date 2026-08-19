/* ══════════════════════════════════════════════════════════════
   HUB PRÉ-CESSION ALVO x GEOZEY
   Injection de la navigation latérale sur toutes les pages.
   Aucun secret, aucune clé, aucun appel réseau : ce fichier ne
   fait que construire une navigation à partir de liens absolus.
   ══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var B = '/cockpit-accompagnement/';
  var LOGO = 'https://geozey.com/assets/logo.png';

  var GROUPS = [
    { t:'Pilotage', i:[
      ['',                'Vue d’ensemble',              'Tableau de bord'],
      ['programme',       'Programme et Gantt',          '45 éléments · 5 sprints'],
      ['ressources',      'Livrables et ressources',     'Inventaire complet']
    ]},
    { t:'Documents', i:[
      ['proposition',     'Proposition de collaboration','01 · Collaboration'],
      ['cdc-application', 'Cahier des charges application','02 · Application'],
      ['cdc-infra-ia',    'Cahier des charges infra IA', '03 · Infra IA'],
      ['valorisation',    'Rapport de valorisation',     'Sprint 1 · trois méthodes'],
      ['due-diligence',   'Synthèse de due diligence',   'Sprint 1 · quatre axes'],
      ['plan-marges',     'Plan d’optimisation des marges','Sprint 3 · leviers chiffrés'],
      ['playbook',        'Playbook commercial',         'Sprint 2 · scripts et qualification'],
      ['gouvernance-ia',  'Gouvernance IA',              'Sprint 2 · registre et conformité']
    ]}
  ];

  var EXT = [
    ['https://cockpit-geozey.vercel.app', 'Cockpit de pilotage opérationnel'],
    ['https://egery-company.monday.com/boards/5101980426', 'Tableau Monday du programme'],
    ['https://geozey.com', 'Site geozey.com']
  ];

  function current(){
    var p = location.pathname || '';
    p = p.replace(/index\.html$/, '').replace(/\.html$/, '');
    var k = p.indexOf('cockpit-accompagnement');
    if (k < 0) { return ''; }
    return p.slice(k + 'cockpit-accompagnement'.length).replace(/^\/+/, '').replace(/\/+$/, '');
  }

  function build(){
    var here = current();
    var h = [];
    h.push('<a class="gz-brand" href="' + B + '">');
    h.push('<img src="' + LOGO + '" alt="Geozey">');
    h.push('<span class="gz-app">Hub pré-cession<br>Alvo x Geozey</span></a>');
    h.push('<div class="gz-band">Espace confidentiel</div>');

    for (var g = 0; g < GROUPS.length; g++){
      h.push('<div class="gz-grp">' + GROUPS[g].t + '</div>');
      h.push('<div class="gz-list">');
      for (var n = 0; n < GROUPS[g].i.length; n++){
        var it = GROUPS[g].i[n];
        var on = (it[0] === here);
        h.push('<a class="gz-i' + (on ? ' on' : '') + '" href="' + B + it[0] + '"' +
               (on ? ' aria-current="page"' : '') + '>' + it[1] +
               '<span class="gz-s">' + it[2] + '</span></a>');
      }
      h.push('</div>');
    }

    h.push('<div class="gz-foot"><div class="gz-grp">Hors du hub</div>');
    for (var e = 0; e < EXT.length; e++){
      h.push('<a class="gz-x" href="' + EXT[e][0] + '" target="_blank" rel="noopener">' +
             EXT[e][1] + '<span>&#8599;</span></a>');
    }
    h.push('<p class="gz-conf">Réservé à Aurélien Queroy et Yacine Djebrouni. Ne pas diffuser.</p>');
    h.push('</div>');

    var aside = document.createElement('aside');
    aside.id = 'gzsb';
    aside.setAttribute('aria-label', 'Navigation du hub');
    aside.innerHTML = h.join('');
    document.body.insertBefore(aside, document.body.firstChild);

    var scrim = document.createElement('button');
    scrim.id = 'gzscrim';
    scrim.type = 'button';
    scrim.setAttribute('aria-label', 'Fermer la navigation');
    document.body.appendChild(scrim);

    var burger = document.createElement('button');
    burger.id = 'gzburger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Ouvrir la navigation');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';

    var bar = document.querySelector('nav');
    if (bar) { bar.insertBefore(burger, bar.firstChild); }
    else { aside.parentNode.insertBefore(burger, aside); }

    function toggle(){
      var open = document.body.classList.toggle('gz-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function close(){
      document.body.classList.remove('gz-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    burger.addEventListener('click', toggle);
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape') { close(); } });

    document.body.classList.add('gz-shell');
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

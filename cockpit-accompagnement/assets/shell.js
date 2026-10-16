/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   HUB D\u2019ACCOMPAGNEMENT GEOZEY x ALVO
   Injection de la navigation lat\u00e9rale sur toutes les pages.
   Aucun secret, aucune cl\u00e9, aucun appel r\u00e9seau : ce fichier ne
   fait que construire une navigation \u00e0 partir de liens absolus.
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
(function(){
  'use strict';
  var B = '/cockpit-accompagnement/';
  var LOGO = 'https://geozey.com/assets/logo.png';

  var DR = 'https://drive.google.com/drive/folders/1PTrtBbeqwjaO-qmLXxMkCz0aStZXH2SN';

  var GROUPS = [
    { t:'Pilotage', i:[
      ['',             'Vue d\u2019ensemble',               'Tous les livrables, par sprint'],
      ['satisfaction', 'Questionnaire de satisfaction', 'Votre avis, livrable par livrable']
    ]}
  ];

  var EXT = [
    [DR, 'Data room de livraison'],
    ['https://drive.google.com/file/d/1w3mqWqpP54wKjTR3yFSfwKhNdPfRbi_o/view', 'Guide de lecture et de reprise'],
    ['https://drive.google.com/file/d/1Tulpktp_e5KMFeQCklWULclyo5qBt4-X/view', 'Bordereau de validation'],
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
    h.push('<span class="gz-app">Hub d\u2019accompagnement<br>Geozey x Alvo</span></a>');
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

    h.push('<div class="gz-foot"><div class="gz-grp">Documents de r\u00e9f\u00e9rence</div>');
    for (var e = 0; e < EXT.length; e++){
      h.push('<a class="gz-x" href="' + EXT[e][0] + '" target="_blank" rel="noopener">' +
             EXT[e][1] + '<span>&#8599;</span></a>');
    }
    h.push('<p class="gz-conf">R\u00e9serv\u00e9 \u00e0 Yacine Djebrouni et \u00e0 l\u2019\u00e9quipe Alvo. Ne pas diffuser.</p>');
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

/* ============================================================
   Geozey - i18n.js
   Traduction FR/EN cote navigateur, sans dependance ni framework.
   Un dictionnaire unique sert de reference : une correction de
   texte se fait donc a un seul endroit, sans dupliquer les pages
   sous un repertoire /en, ce qui aurait dilue le referencement
   francais. Le francais reste la version qui fait foi pour les
   mentions legales et la politique de confidentialite : ce script
   n'est jamais charge sur ces deux pages.
   ============================================================ */

(function () {
  "use strict";

  // Dictionnaire francais vers anglais, 469 paires, embarque tel quel.
  var DICO = {
  "Geozey — La cellule d'élite pour les projets qui ne pardonnent pas": "Geozey — The elite unit for projects that don't forgive",
  "Geozey intervient sur les grands projets d'infrastructures, d'énergie et d'industrie lourde. PMO, planification industrielle, contrôle de projet. Zero Delta.": "Geozey operates on major infrastructure, energy and heavy industry projects. PMO, industrial planning, project control. Zero Delta.",
  "Geozey": "Geozey",
  "Ouvrir le menu": "Open menu",
  "Accueil": "Home",
  "Experts": "Experts",
  "Manifeste": "Manifesto",
  "Interventions": "Track Record",
  "Engager Geozey": "Engage Geozey",
  "Descendre": "Scroll down",
  "La cellule d'élite pour les projets qui ne pardonnent pas.": "The elite unit for projects that don't forgive.",
  "Geozey intervient sur les grands projets d'infrastructures, d'énergie et d'industrie lourde, là où l'écart entre la bonne décision et la mauvaise se mesure en millions, en mois, en réputation.": "Geozey operates on major infrastructure, energy and heavy industry projects, where the gap between the right decision and the wrong one is measured in millions, in months, in reputation.",
  "Lire le manifeste": "Read the manifesto",
  "Nous n'envoyons pas de masse. Nous engageons un expert. Le bon.": "We don't send numbers. We engage an expert. The right one.",
  "Le consulting s'est industrialisé. Il a transformé l'expertise en volume, les consultants en profils, les clients en comptes à facturer. Nous avons refusé ce modèle.": "Consulting has become industrialized. It turned expertise into volume, consultants into profiles, clients into accounts to bill. We rejected this model.",
  "Yacine Djebrouni, fondateur de Geozey": "Yacine Djebrouni, founder of Geozey",
  "Gaëlle Barthelemy, Quality & Planning": "Gaëlle Barthelemy, Quality & Planning",
  "Aurélien Queroy, Chief AI Officer": "Aurélien Queroy, Chief AI Officer",
  "Domaines d'intervention": "Areas of intervention",
  "Trois univers où l'exigence est la norme et où l'écart n'est pas négociable.": "Three worlds where high standards are the norm and there is no room for error.",
  "Énergie": "Energy",
  "Nucléaire - Fusion Oil & Gas - Renouvelables": "Nuclear - Fusion Oil & Gas - Renewables",
  "De l'EPR à ITER, du pipeline transfrontalier à l'éolien flottant. Souveraineté énergétique, transition, déploiement industriel.": "From the EPR to ITER, from cross-border pipelines to floating wind. Energy sovereignty, transition, industrial deployment.",
  "Infrastructures": "Infrastructure",
  "Grands projets de génie civil & de transport": "Major civil engineering & transport projects",
  "Lignes ferroviaires, ouvrages d'art, bases navales, sites portuaires. Coordination multi-corps d'état, environnements classifiés ou réglementés.": "Rail lines, structural works, naval bases, port facilities. Multi-trade coordination, classified or regulated environments.",
  "Industrie lourde": "Heavy industry",
  "Réindustrialisation - Gigafactories Défense": "Reindustrialization - Gigafactories Defense",
  "Sites de production critiques, programmes pluriannuels, interfaces internationales. De l'étude à la mise en service.": "Critical production sites, multi-year programs, international interfaces. From design through commissioning.",
  "Nos expertises : transversales et décisives sur tout projet industriel ambitieux, quel que soit le secteur.": "Our expertise: cross-cutting and decisive on any ambitious industrial project, regardless of sector.",
  "PMO": "PMO",
  "Project Management Office": "Project Management Office",
  "Mise en place ou reprise d'un PMO sur des projets en dérive ou en phase critique. Gouvernance, reporting, gestion des risques, coordination multi-acteurs. Nous structurons l'environnement projet pour que les décisions arrivent au bon moment, au bon niveau.": "Setting up or taking over a PMO on projects that are off track or in a critical phase. Governance, reporting, risk management, multi-party coordination. We structure the project environment so decisions are made at the right time, at the right level.",
  "Planning": "Planning",
  "Planification industrielle": "Industrial planning",
  "Construction et tenue de plannings sur des projets complexes, EPC, multi-lots, multi-contractors. Primavera P6, MS Project, analyse du chemin critique, valeur acquise, courbes d'avancement. Nous planifions ce qui peut l'être et anticipons ce qui ne l'est pas encore.": "Building and maintaining schedules on complex, EPC, multi-package, multi-contractor projects. Primavera P6, MS Project, critical path analysis, earned value, progress curves. We schedule what can be scheduled and anticipate what cannot yet be.",
  "Contrôle de projet": "Project control",
  "Maîtrise des coûts, délais, qualité": "Cost, schedule and quality control",
  "Contrôle documentaire, suivi qualité, gestion des modifications, interfaces contractuelles. Nous intervenons comme garants de la maîtrise globale du projet, de l'étude à la mise en service, en passant par les phases de construction les plus exposées.": "Document control, quality monitoring, change management, contractual interfaces. We act as guarantors of overall project control, from design through commissioning, including the most exposed construction phases.",
  "Geozey en quelques chiffres": "Geozey in a few figures",
  "Projets suivis cumulés": "Cumulative projects tracked",
  "Expérience cumulée": "Cumulative experience",
  "Projets industriels critiques": "Critical industrial projects",
  "Profil proposé par mission": "Profile proposed per assignment",
  "Geozey en quelques interventions": "Geozey in a few assignments",
  "Précédent": "Previous",
  "Suivant": "Next",
  "22 Md€ · Cadarache · 35 pays": "22 Md€ · Cadarache · 35 countries",
  "Base navale Toulon": "Toulon naval base",
  "~3 Md€ / 15 ans · Toulon · Défense": "~3 Md€ / 15 years · Toulon · Defense",
  "Fusion nucléaire": "Nuclear fusion",
  "Défense": "Defense",
  "Infra militaire": "Military infrastructure",
  "Voir le projet": "View the project",
  "Eolien flottant en mer": "Floating offshore wind farm",
  "30 MW · Gruissan et Port-la-Nouvelle · En service depuis mai 2026": "30 MW · Gruissan and Port-la-Nouvelle · In service since May 2026",
  "Renouvelables": "Renewables",
  "Éolien flottant": "Floating wind",
  "Ligne de production de cellules de batteries": "Battery cell production line",
  "Industrie": "Industry",
  "Batterie": "Battery",
  "Plus d'interventions": "More from our track record",
  "Geozey en quelques visages": "Geozey in a few faces",
  "Fondateur": "Founder",
  "Oil & gas, nucléaire, défense": "Oil & gas, nuclear, defense",
  "13 ans": "13 years",
  "Nucléaire, O&G, éolien · ITER, EACOP": "Nuclear, O&G, wind · ITER, EACOP",
  "Quality": "Quality",
  "10+ ans": "10+ years",
  "Méthodes & OPC": "Methods & Construction Coordination",
  "GC nucléaire, ferroviaire, batterie": "Nuclear civil works, rail, battery",
  "Méthodes": "Methods",
  "OPC": "Construction coordination",
  "11 ans": "11 years",
  "EPC, militaire, drones, pétrochimie": "EPC, defense, drones, petrochemicals",
  "P6": "P6",
  "9 ans": "9 years",
  "Infra IA souveraine · sourcing, matching, reporting": "Sovereign AI infrastructure · sourcing, matching, reporting",
  "Infra IA": "AI infrastructure",
  "Matching": "Matching",
  "Découvrir les Experts": "Discover the experts",
  "Zero Delta": "Zero Delta",
  "Zéro dérive. Zéro variance. Zéro compromis.": "Zero drift. Zero variance. Zero compromise.",
  "Cellule d'élite pour les projets industriels critiques.": "Elite unit for critical industrial projects.",
  "Navigation": "Navigation",
  "Contact": "Contact",
  "Rejoindre la cellule": "Join the team",
  "LinkedIn": "LinkedIn",
  "Espace cockpit": "Cockpit portal",
  "Légal": "Legal",
  "Mentions légales": "Legal notice",
  "Politique RGPD": "GDPR Policy",
  "© 2026 Geozey · Tous droits réservés · Zero Delta": "© 2026 Geozey · All rights reserved · Zero Delta",
  "Experts — Geozey": "Experts — Geozey",
  "Quelques visages de la cellule Geozey. À chaque mission, un seul expert est proposé : le bon. Ou pas de réponse.": "A few faces of the Geozey team. For every assignment, only one expert is proposed: the right one. Or no answer at all.",
  "Quelques visages de la cellule.": "A few faces of the team.",
  "Geozey est un réseau sélectif. À chaque mission, un seul expert est proposé : le bon. Ou pas de réponse.": "Geozey is a selective network. For every assignment, only one expert is proposed: the right one. Or no answer at all.",
  "La rangée équipe": "The team lineup",
  "Cinq profils, un seul proposé par mission.": "Five profiles, only one proposed per assignment.",
  "Quality & Planning": "Quality & Planning",
  "Planning EPC": "Planning EPC",
  "Chief AI Officer": "Chief AI Officer",
  "Président · Fondateur": "Chairman · Founder",
  "Treize ans sur le terrain, sur les chantiers où l'écart se paie en mois et en millions. Fusion. Souveraineté énergétique. Transition. Réindustrialisation. Service public. Contrôler, maîtriser, délivrer : zéro delta sur le coût, la qualité, les délais. La maîtrise se prouve : forme ceux qui planifient. Reprend les plannings qui cassent.": "Thirteen years in the field, on projects where the gap costs months and millions. Fusion. Energy sovereignty. Transition. Reindustrialization. Public service. Control, master, deliver: zero delta on cost, quality and schedule. Mastery is proven, not claimed: he trains those who plan. He takes over schedules that are falling apart.",
  "Expérience": "Experience",
  "Budget cumulé": "Cumulative budget",
  "Projets critiques": "Critical projects",
  "Coordination": "Coordination",
  "Secteurs": "Sectors",
  "Missions": "Assignments",
  "Certifications": "Certifications",
  "Langues": "Languages",
  "11 · 40 M€ à plusieurs Md€": "11 · 40 M€ to several Md€",
  "30–40 intervenants": "30–40 contributors",
  "Oil & gas, Nucléaire, ENR, Construction": "Oil & gas, Nuclear, Renewables, Construction",
  "PMO, Planning, Contrôle de projet": "PMO, Planning, Project control",
  "Plus de 10 ans à voir le projet industriel critique sous toutes ses coutures. Quality manager sur Barracuda. Lead Planning sur Tokamak Complex (ITER). Doc control + qualité sur EACOP. Ex-business manager d'un cabinet de consulting.": "More than 10 years working every angle of critical industrial projects. Quality manager on Barracuda. Lead Planning on the Tokamak Complex (ITER). Doc control and quality on EACOP. Former business manager at a consulting firm.",
  "Budget": "Budget",
  "Programmes": "Programs",
  "Outils": "Tools",
  "6 majeurs": "6 major",
  "7 contractors / 17 fournisseurs": "7 contractors / 17 suppliers",
  "Nucléaire, O&G, Éolien": "Nuclear, O&G, Wind",
  "Expert Méthodes & OPC": "Methods & Construction Coordination Expert",
  "Onze ans de génie civil dur, dont sept chez Eiffage. Apprenti à Flamanville 3, méthodes sur EPR2, conducteur de travaux sur 62 chantiers ferroviaires GSM-R, OPC sur la Gigafactory ACC & Verkor.": "Eleven years of heavy civil works, seven of them at Eiffage. Apprentice at Flamanville 3, methods on EPR2, site supervisor on 62 GSM-R rail sites, construction coordination on the ACC & Verkor Gigafactories.",
  "Projets": "Projects",
  "9 missions": "9 assignments",
  "62 chantiers en parallèle": "62 concurrent sites",
  "Expert Planning EPC": "EPC Planning Expert",
  "Neuf ans à tenir un planning EPC de l'étude à la mise en service. Incinérateurs CNIM (Chester 2,5 ans). Chaîne de drones ECA Robotics. Aujourd'hui sur l'extension de la base navale de Toulon, programme Barracuda.": "Nine years holding an EPC schedule from design through commissioning. CNIM incinerators (Chester, 2.5 years). ECA Robotics drone production line. Currently on the extension of the Toulon naval base, Barracuda program.",
  "6 EPC & infra": "6 EPC & infrastructure projects",
  "Formation": "Education",
  "DESS Gestion projet UQO": "Graduate diploma in Project Management, UQO",
  "Construit et opère l'infrastructure IA souveraine de Geozey : sourcing des projets attribués, matching entre passeport mission et passeport profil, reporting automatisé. L'outil est propriétaire, hébergé sur les comptes Geozey, et il apprend de chaque mission.": "Builds and operates Geozey's sovereign AI infrastructure: sourcing of awarded projects, matching between assignment profile and expert profile, automated reporting. The tool is proprietary, hosted on Geozey's own accounts, and learns from every assignment.",
  "Périmètre": "Scope",
  "Moteurs": "Engines",
  "Socle": "Foundation",
  "Données": "Data",
  "Sourcing, matching, reporting": "Sourcing, matching, reporting",
  "Propriétaire, comptes Geozey": "Proprietary, hosted on Geozey accounts",
  "Hébergement Union européenne": "European Union hosting",
  "La cellule, en chiffres": "The team, in figures",
  "Geozey mobilise un réseau d'experts calibré pour les projets qui exigent la bonne personne au bon moment.": "Geozey mobilizes a network of experts calibrated for projects that demand the right person at the right time.",
  "Années d'expérience moyennes / expert": "Average years of experience per expert",
  "Secteurs industriels couverts": "Industrial sectors covered",
  "Profils sélectionnés en direct": "Profiles personally selected",
  "Nucléaire civil": "Civil nuclear",
  "Nucléaire défense": "Nuclear defense",
  "Fusion": "Fusion",
  "Oil & Gas": "Oil & Gas",
  "Éolien offshore": "Offshore wind",
  "Ferroviaire": "Rail",
  "Gigafactories": "Gigafactories",
  "Pétrochimie": "Petrochemicals",
  "Valorisation": "Waste-to-energy",
  "Quality management": "Quality management",
  "OPC TCE": "Construction coordination (all trades)",
  "Doc control": "Doc control",
  "Biométhane": "Biomethane",
  "UVE / Incinération": "Waste-to-energy plant / Incineration",
  "Défense stratégique": "Strategic defense",
  "Export international": "International export",
  "Expert ?": "Expert?",
  "Vous avez atteint le plafond ailleurs ?": "Have you hit the ceiling elsewhere?",
  "La structure est sélective. L'exigence est élevée. Le reste, on s'en occupe. CDI de chantier, portage, freelance accompagné : selon ce qui vous correspond.": "The structure is selective. The standards are high. We take care of the rest. Project-based permanent contract, umbrella company employment, supported freelancing: whatever fits you best.",
  "Proposer mon profil": "Submit my profile",
  "Interventions — Geozey": "Track Record — Geozey",
  "ITER, EACOP, Barracuda, gigafactories ACC et Verkor, EOLMED… les chantiers sur lesquels les experts Geozey ont opéré.": "ITER, EACOP, Barracuda, the ACC and Verkor gigafactories, EOLMED… the projects Geozey's experts have worked on.",
  "Là où l'écart se paie cher.": "Where the margin for error is costly.",
  "Geozey intervient sur des projets où la complexité est dense, les enjeux mesurés en milliards, et la marge d'erreur réduite à zéro. Voici quelques-uns des chantiers sur lesquels nos experts ont opéré : études, méthodes, planning, qualité, coordination.": "Geozey operates on projects with dense complexity, stakes measured in billions, and a margin for error reduced to zero. Here are some of the projects our experts have worked on: design, methods, planning, quality, coordination.",
  "Tous (11)": "All (11)",
  "Nucléaire": "Nuclear",
  "Export": "Export",
  "01 — Énergie · Fusion nucléaire · Cadarache": "01 — Energy · Nuclear fusion · Cadarache",
  "01 — Énergie · Fusion nucléaire · Cadarache, France": "01 — Energy · Nuclear fusion · Cadarache, France",
  "Premier réacteur expérimental de fusion thermonucléaire à l'échelle industrielle. 35 pays partenaires, un assemblage machine d'une complexité sans précédent, et un calendrier sous contrainte permanente. Lead Planning sur le Tokamak Complex, coordination multi-contractors.": "The first industrial-scale experimental thermonuclear fusion reactor. 35 partner countries, machine assembly of unprecedented complexity, and a schedule under permanent constraint. Lead Planning on the Tokamak Complex, multi-contractor coordination.",
  "Puissance fusion": "Fusion power",
  "Partenaires": "Partners",
  "Premier plasma": "First plasma",
  "22 Md€+ (révisé 2024)": "22 Md€+ (revised 2024)",
  "35 pays · UE, US, Chine, Japon, Inde, Corée, Russie": "35 countries · EU, US, China, Japan, India, Korea, Russia",
  "Profils Geozey mobilisés": "Geozey profiles deployed",
  "Expert planning nucléaire · Expert Primavera P6 — Lead planning, suivi construction, valeur acquise · 2017–2019": "Nuclear planning expert · Primavera P6 expert — Lead planning, construction monitoring, earned value · 2017–2019",
  "02 — Énergie · Oil & Gas": "02 — Energy · Oil & Gas",
  "02 — Énergie · Oil & Gas · Ouganda–Tanzanie": "02 — Energy · Oil & Gas · Uganda–Tanzania",
  "Oléoduc de 1 443 km reliant les champs pétroliers d'Ouganda au port de Tanga en Tanzanie : le plus long pipeline de pétrole brut chauffé au monde. Geozey mobilisé sur le lot Télécom & Sécurité (SNEF EKIUM / Schneider) avec une équipe de 3 experts couvrant PMO planning, doc control & qualité, et logistique export matériel.": "A 1,443 km pipeline connecting Uganda's oil fields to the port of Tanga in Tanzania: the longest heated crude oil pipeline in the world. Geozey deployed on the Telecom & Security package (SNEF EKIUM / Schneider) with a team of 3 experts covering PMO planning, doc control & quality, and equipment export logistics.",
  "Budget global": "Total budget",
  "Budget lot": "Package budget",
  "Longueur": "Length",
  "Période": "Period",
  "Expert PMO oil & gas · Expert doc control & qualité · Expert logistique export — Équipe de 3 experts": "Oil & gas PMO expert · Doc control & quality expert · Export logistics expert — Team of 3 experts",
  "03 — Éolien flottant": "03 — Floating wind",
  "03 — Énergie · Éolien flottant · Gruissan, Méditerranée": "03 — Energy · Floating wind · Gruissan, Mediterranean",
  "Ferme pilote éolienne flottante en Méditerranée, à 15 km au large de Gruissan. Trois turbines V164 de 10 MW posées sur fondations flottantes BW Ideol. Une première mondiale énergisée en 2026.": "A pilot floating wind farm in the Mediterranean, 15 km off the coast of Gruissan. Three 10 MW V164 turbines on BW Ideol floating foundations. A world first, energized in 2026.",
  "Capacité installée": "Installed capacity",
  "Turbines": "Turbines",
  "Distance côte": "Distance from shore",
  "15 km · fond 60 m": "15 km · 60 m depth",
  "Expert planning éolien flottant · Expert PMO EPC(I) · Expert doc control renouvelables — 3 ans de mission · 2022–2025": "Floating wind planning expert · EPC(I) PMO expert · Renewables doc control expert — 3-year assignment · 2022–2025",
  "04 — Valorisation énergétique": "04 — Waste-to-energy",
  "04 — Industrie lourde · Valorisation énergétique · Nice, France": "04 — Heavy industry · Waste-to-energy · Nice, France",
  "Centre multi-filières de valorisation des déchets pour la Métropole Nice Côte d'Azur, exploité par Veolia. Modernisation de l'unité de valorisation énergétique, création d'un nouveau centre de tri, exploitation sous délégation de service public.": "A multi-stream waste recovery center for the Nice Côte d'Azur metropolitan area, operated by Veolia. Modernization of the waste-to-energy unit, construction of a new sorting center, operation under a public service delegation.",
  "Budget travaux": "Construction budget",
  "Opérateur": "Operator",
  "Localisation": "Location",
  "Nice (06) · Métropole Côte d'Azur": "Nice (06) · Côte d'Azur Metropolitan Area",
  "UVE + centre de tri + multi-filières": "Waste-to-energy plant + sorting center + multi-stream",
  "Expert planning UVE · Expert PMO construction industrielle — 2024 – en cours": "Waste-to-energy planning expert · Industrial construction PMO expert — 2024 – ongoing",
  "05 — Défense · Toulon": "05 — Defense · Toulon",
  "05 — Défense · Infrastructure militaire · Toulon, France": "05 — Defense · Military infrastructure · Toulon, France",
  "BARRACUDA — Base navale de Toulon": "BARRACUDA — Toulon Naval Base",
  "Modernisation complète des infrastructures d'accueil des sous-marins nucléaires d'attaque de classe Suffren. Programme stratégique de souveraineté nationale, environnement classifié, chantier multi-phases sur 15 ans. L'une des missions les plus longues de Geozey : preuve de confiance dans un environnement où continuité et fiabilité sont non négociables.": "Complete modernization of the facilities hosting Suffren-class nuclear attack submarines. A strategic national sovereignty program, classified environment, multi-phase project spanning 15 years. One of Geozey's longest assignments: proof of trust in an environment where continuity and reliability are non-negotiable.",
  "Budget programme": "Program budget",
  "Environnement": "Environment",
  "~3 Md€ / 15 ans": "~3 Md€ / 15 years",
  "2023 – en cours": "2023 – ongoing",
  "Classifié — Défense nationale": "Classified — National defense",
  "Expert planning défense · Expert OPC infrastructure militaire": "Defense planning expert · Military infrastructure construction coordination expert",
  "06 — Industrie · Transition énergétique · Bruges & Douvrin, France": "06 — Industry · Energy transition · Bruges & Douvrin, France",
  "Première gigafactory de batteries pour véhicules électriques en France, portée par le JV Stellantis / Mercedes-Benz / TotalEnergies. Geozey intervenu sur deux périmètres : phase R&D à Bruges (planning & Power BI) et phase construction à Douvrin (OPC supervision manutention, puis responsable de zone sur la phase finale).": "France's first electric vehicle battery gigafactory, backed by the Stellantis / Mercedes-Benz / TotalEnergies joint venture. Geozey deployed on two fronts: the R&D phase in Bruges (planning & Power BI) and the construction phase in Douvrin (handling construction coordination, then zone manager in the final phase).",
  "2022 – en cours": "2022 – ongoing",
  "Expert planning gigafactory · Expert Power BI & reporting · Expert OPC construction industrielle": "Gigafactory planning expert · Power BI & reporting expert · Industrial construction coordination expert",
  "07 — Gigafactory batterie": "07 — Battery gigafactory",
  "07 — Industrie · Gigafactory batterie · Dunkerque, France": "07 — Industry · Battery gigafactory · Dunkerque, France",
  "Première gigafactory Verkor inaugurée en décembre 2025 à Bourbourg, près de Dunkerque. Capacité initiale de 16 GWh/an, portée par Renault et les fonds France 2030. Geozey mobilisé sur la supervision OPC manutention et les interfaces MOE : mission menée jusqu'à son terme avec satisfaction client.": "Verkor's first gigafactory, opened in December 2025 in Bourbourg, near Dunkerque. Initial capacity of 16 GWh/year, backed by Renault and France 2030 funding. Geozey deployed on handling construction coordination and owner engineer interfaces: the assignment was carried through to completion to the client's satisfaction.",
  "Capacité": "Capacity",
  "16 GWh / an": "16 GWh / year",
  "Expert OPC gigafactory · Expert supervision manutention industrielle": "Gigafactory construction coordination expert · Industrial handling supervision expert",
  "08 — Défense · Bergerac": "08 — Defense · Bergerac",
  "08 — Défense · Industrie stratégique · Bergerac, France": "08 — Defense · Strategic industry · Bergerac, France",
  "PROJET DÉFENSE — Bergerac": "DEFENSE PROJECT — Bergerac",
  "Construction d'une nouvelle unité industrielle stratégique sur site vierge, commandée en urgence par l'État français. 15 bâtiments livrés en moins de 2 ans, inaugurés en mars 2025 par les ministres des Armées et de l'Économie. Geozey intervenu en phase amont sur l'intégralité du cycle études.": "Construction of a new strategic industrial facility on a greenfield site, commissioned as an emergency order by the French State. 15 buildings delivered in under 2 years, opened in March 2025 by the Ministers of the Armed Forces and of the Economy. Geozey deployed upstream across the entire design cycle.",
  "Bâtiments": "Buildings",
  "15 livrés en < 2 ans": "15 delivered in under 2 years",
  "Expert planning défense · Expert phasage & études industrielles — APS → APD → DCE → ACT": "Defense planning expert · Industrial phasing & design expert — APS → APD → DCE → ACT",
  "09 — Biométhane": "09 — Biomethane",
  "09 — Énergie renouvelable · Biométhane · France / Europe": "09 — Renewable energy · Biomethane · France / Europe",
  "BIOMÉTHANE — Engie Renewable Gases": "BIOMETHANE — Engie Renewable Gases",
  "Mission de transformation PMO pour l'entité biométhane d'Engie, constituée par acquisition de plusieurs acteurs du secteur. Triple périmètre : standardisation des plannings (petite / moyenne / grande unité), formation des équipes aux méthodes projet, support terrain sur les projets en construction. Mission prolongée jusqu'à fin 2026 sur résultats.": "A PMO transformation assignment for Engie's biomethane entity, built through the acquisition of several industry players. Three-fold scope: standardizing schedules (small / medium / large plant), training teams in project methods, on-the-ground support for projects under construction. The assignment was extended to end of 2026 based on results.",
  "Type": "Type",
  "Client": "Client",
  "France, Belgique, UK, Pologne": "France, Belgium, UK, Poland",
  "2025 – en cours": "2025 – ongoing",
  "PMO transformation + formation": "PMO transformation + training",
  "Expert PMO biométhane · Expert planning renouvelables · Formateur gestion de projet": "Biomethane PMO expert · Renewables planning expert · Project management trainer",
  "10 — Export · Koweït": "10 — Export · Kuwait",
  "10 — Export · Météorologie / Aviation civile · Koweït": "10 — Export · Meteorology / Civil aviation · Kuwait",
  "EXPORT KOWEÏT — Réseau météo DGCA": "KUWAIT EXPORT — DGCA Weather Network",
  "Deux missions consécutives pour la modernisation du réseau d'observation météorologique de la Direction Générale de l'Aviation Civile du Koweït. D'abord pour Sterela (contrat AWOS de 18 M€, 38 stations météo et qualité de l'air sur 7 ans), puis sollicité par un second donneur d'ordre pour le même client final : un troisième contrat en cours de finalisation.": "Two consecutive assignments to modernize the weather observation network of Kuwait's Directorate General of Civil Aviation. First for Sterela (an 18 M€ AWOS contract, 38 weather and air-quality stations over 7 years), then approached by a second client for the same end customer: a third contract now being finalized.",
  "Budget principal": "Main contract budget",
  "Stations": "Stations",
  "18 M€ / 7 ans": "18 M€ / 7 years",
  "38 (météo + qualité air)": "38 (weather + air quality)",
  "Koweït": "Kuwait",
  "Expert planning export · Expert Primavera P6 · Expert gestion de projet international": "Export planning expert · Primavera P6 expert · International project management expert",
  "11 — Éolien offshore flottant": "11 — Floating offshore wind",
  "11 — Énergie renouvelable · Éolien offshore flottant · France / International": "11 — Renewable energy · Floating offshore wind · France / International",
  "Startup californienne passée au stade industriel après levée de fonds. Geozey mobilisé dès la création des process PMO : plannings multi-projets sur Primavera, dashboards de suivi heures / avancements, reporting CEO et actionnaires, coordination avec Eiffage sur le projet EFGL. Intervention structurante sur une organisation qui partait de zéro.": "A Californian startup that reached industrial scale after a funding round. Geozey deployed from the very start to build the PMO processes: multi-project schedules on Primavera, hours/progress tracking dashboards, CEO and shareholder reporting, coordination with Eiffage on the EFGL project. A foundational assignment on an organization starting from scratch.",
  "Secteur": "Sector",
  "2021 – 2022": "2021 – 2022",
  "Mise en place PMO from scratch": "PMO setup from scratch",
  "Expert PMO éolien flottant · Expert planning multi-projets · Expert Primavera P6": "Floating wind PMO expert · Multi-project planning expert · Primavera P6 expert",
  "Un projet critique sur la table ?": "A critical project on the table?",
  "Un seul profil proposé. Pertinent. Ou pas de réponse.": "Only one profile proposed. Relevant. Or no answer at all.",
  "Manifeste — Geozey": "Manifesto — Geozey",
  "Le consulting a un problème. Geozey est une cellule d'élite, pas une société de conseil. Zero Delta : zéro dérive, zéro variance, zéro compromis, zéro écart.": "Consulting has a problem. Geozey is an elite unit, not a consulting firm. Zero Delta: zero drift, zero variance, zero compromise, zero deviation.",
  "Manifeste · Geozey 2026": "Manifesto · Geozey 2026",
  "Le consulting a un problème.": "Consulting has a problem.",
  "Il s'est industrialisé. Il s'est banalisé. Il a transformé l'expertise en volume, les consultants en profils, les clients en comptes à facturer.": "It became industrialized. It became commoditized. It turned expertise into volume, consultants into profiles, clients into accounts to bill.",
  "Les grandes structures envoient des juniors non formés. Elles placent en intercontrat ce qu'elles ont sous la main. Elles vendent des promesses que le terrain ne tient pas. Le consultant expérimenté y plafonne. Le client exigeant s'y perd. Et l'humain, au fond, n'est plus au centre de l'équation.": "Large firms send in untrained juniors. They place whoever happens to be on the bench between assignments. They sell promises the field cannot keep. The experienced consultant hits a ceiling. The demanding client gets lost. And ultimately, people are no longer at the center of the equation.",
  "Nous avons refusé ce modèle.": "We rejected this model.",
  "Une cellule d'élite, pas une société de conseil.": "An elite unit, not a consulting firm.",
  "Geozey n'est pas sur le modèle du consulting industrialisé. C'est une cellule d'élite. Un réseau d'experts sélectionnés, engagés, mobilisables sur les projets les plus complexes, les plus exigeants, les plus critiques.": "Geozey does not follow the industrialized consulting model. It is an elite unit. A network of selected experts, engaged and deployable on the most complex, most demanding, most critical projects.",
  "Nous intervenons là où l'enjeu est réel : grands projets d'infrastructures, énergie, industrie lourde, dans des environnements où l'écart entre la bonne décision et la mauvaise se mesure en millions, en mois, en réputation.": "We operate where the stakes are real: major infrastructure, energy and heavy industry projects, in environments where the gap between the right decision and the wrong one is measured in millions, in months, in reputation.",
  "Nous n'envoyons pas de masse. Nous engageons un expert. Le bon. Celui qui comprend le terrain, qui a déjà navigué dans la complexité, qui sait ce que ça coûte de dériver d'un planning.": "We don't send numbers. We engage an expert. The right one. Someone who understands the field, who has already navigated complexity, who knows what it costs to let a schedule drift.",
  "L'humain au centre.": "People at the center.",
  "Dans le consulting industriel actuel, l'humain a disparu de l'équation. On gère des ressources, on place des profils, on optimise des marges. Ce n'est pas notre modèle.": "In today's industrial consulting, people have disappeared from the equation. Resources are managed, profiles are placed, margins are optimized. That is not our model.",
  "Chez Geozey, chaque intervention part d'une conviction : les projets les plus complexes se tiennent ou s'effondrent par les personnes qui les portent. Nous choisissons les bons. Nous les engageons pleinement. Et nous les traitons pour ce qu'ils sont : des experts, pas des profils à facturer.": "At Geozey, every assignment starts from one conviction: the most complex projects stand or fall on the people carrying them. We choose the right ones. We engage them fully. And we treat them for what they are: experts, not profiles to bill.",
  "Transparents par doctrine.": "Transparent by doctrine.",
  "Nous sommes transparents avec nos clients. Nous leur disons non quand nous ne pouvons pas couvrir le besoin. Nous ne forçons aucune mission. Nous ne vendons pas ce que nous n'avons pas.": "We are transparent with our clients. We tell them no when we cannot meet their need. We never force an assignment. We do not sell what we do not have.",
  "Nous le sommes aussi avec nos équipes : nos collaborateurs savent où ils en sont, ce qu'on attend d'eux, ce qu'on construit ensemble. La transparence n'est pas réservée au client, elle structure notre façon de travailler en interne.": "We are just as transparent with our teams: our people know where they stand, what is expected of them, and what we are building together. Transparency is not reserved for the client, it shapes how we work internally.",
  "Pour les experts qui ont atteint le plafond.": "For experts who have hit the ceiling.",
  "Geozey s'adresse aussi aux experts qui ont atteint le plafond des grandes structures. À ceux qui veulent des projets complexes, du challenge réel, une reconnaissance à la hauteur de leur expertise.": "Geozey also speaks to experts who have hit the ceiling at large firms. To those who want complex projects, real challenge, and recognition equal to their expertise.",
  "Ici, pas de politique interne. Pas de missions imposées. Pas de complaisance. Vous êtes sélectionné pour ce que vous savez faire. Vous intervenez là où vous apportez réellement de la valeur. Vous évoluez selon ce qui vous correspond : CDI de chantier, portage, freelance accompagné.": "Here, no internal politics. No imposed assignments. No complacency. You are selected for what you can do. You work where you truly add value. You move forward the way that suits you: project-based permanent contract, umbrella company employment, or supported freelancing.",
  "Notre vision.": "Our vision.",
  "Devenir la référence pour les projets où l'on ne peut pas se permettre de se tromper. Quand un projet est critique, on fait appel à Geozey.": "To become the reference for projects where there is no room for error. When a project is critical, you call Geozey.",
  "Pas parce que nous sommes les plus nombreux. Parce que nous sommes les plus engagés.": "Not because we are the most numerous. Because we are the most committed.",
  "Doctrine fondatrice": "Founding doctrine",
  "Zero Delta.": "Zero Delta.",
  "Zéro dérive": "Zero drift",
  "Zéro variance": "Zero variance",
  "Zéro compromis": "Zero compromise",
  "Zéro écart": "Zero deviation",
  "L'exigence n'est pas un argument commercial chez nous. C'est une posture. Une façon d'être.": "High standards are not a sales pitch here. They are a posture. A way of being.",
  "Et maintenant ?": "What's next?",
  "Découvrir les experts": "Discover the experts",
  "Qualification — Geozey": "Qualification — Geozey",
  "Espace de qualification Geozey. Cadrez votre besoin ou proposez votre profil pour les projets industriels critiques.": "Geozey qualification area. Scope your need or submit your profile for critical industrial projects.",
  "Retour au site": "Back to the site",
  "Espace de qualification": "Qualification area",
  "Avant de travailler ensemble, on a besoin de quelques précisions.": "Before we work together, we need a few details.",
  "Geozey intervient là où l'écart se paie en mois et en millions : nucléaire civil et défense, oil & gas, énergie, eau, infrastructures. Chaque mission est cadrée sur mesure. Ce questionnaire structure votre demande et nous permet de proposer un profil aligné, ou d'orienter votre candidature vers la bonne mission.": "Geozey operates where the gap costs months and millions: civil and defense nuclear, oil & gas, energy, water, infrastructure. Every assignment is scoped on a case-by-case basis. This questionnaire structures your request and lets us either propose an aligned profile or route your application to the right assignment.",
  "01 · Votre profil": "01 · Your profile",
  "02 · Le cadrage": "02 · Scoping",
  "03 · Réponse sous 72 h": "03 · Response within 72 hours",
  "Grands comptes actifs": "Active key accounts",
  "Projet Arianeo Veolia": "Arianeo Veolia project",
  "Zones d'intervention": "Operating regions",
  "Engagement de réponse": "Response commitment",
  "Chantier industriel": "Industrial site",
  "Site energie": "Energy site",
  "Ekium · Snef": "Ekium · Snef",
  "France": "France",
  "Europe": "Europe",
  "Afrique de l'Ouest": "West Africa",
  "À lire avant de commencer": "Before you start",
  "Geozey contractualise via une société française et ne prend en charge aucune démarche de visa ni d'autorisation de travail. Vos réponses sont enregistrées au fur et à mesure : si vous vous interrompez, nous pouvons reprendre contact avec ce que vous avez saisi.": "Geozey contracts through a French company and does not handle any visa or work permit process. Your answers are saved as you go: if you stop partway through, we can follow up using what you have already entered.",
  "Projet industriel critique": "Critical industrial project",
  "J'ai un besoin": "I have a need",
  "Je cherche un profil PMO, planning, contrôle de projet ou doc control pour un projet en cours ou à venir.": "I'm looking for a PMO, planning, project control or doc control profile for a current or upcoming project.",
  "Cadrer ma mission": "Scope my assignment",
  "Illustration, ingenieur sur site industriel": "Illustration, engineer on an industrial site",
  "Je suis un profil": "I'm a candidate",
  "Je souhaite rejoindre la cellule, en freelance, en portage salarial ou en CDI de chantier.": "I want to join the team, as a freelancer, under umbrella company employment, or on a project-based permanent contract.",
  "01 · Votre société": "01 · Your company",
  "Qui êtes-vous": "Who you are",
  "Société": "Company",
  "SIREN": "SIREN",
  "9 chiffres": "9 digits",
  "Sélectionner": "Select",
  "Oil & gas": "Oil & gas",
  "Énergie / ENR": "Energy / Renewables",
  "Eau / valorisation": "Water / waste-to-energy",
  "Bâtiment / génie civil": "Building / civil engineering",
  "Autre": "Other",
  "Votre rôle": "Your role",
  "Directeur de projet, acheteur, RH...": "Project director, buyer, HR...",
  "Spécialité recherchée": "Specialty sought",
  "Planning / Ordonnancement": "Planning / Scheduling",
  "Contrôle de projet / Cost control": "Project control / Cost control",
  "Séniorité attendue": "Seniority expected",
  "Junior, moins de 5 ans": "Junior, less than 5 years",
  "Confirmé, 5 à 10 ans": "Intermediate, 5 to 10 years",
  "Senior, 10 à 15 ans": "Senior, 10 to 15 years",
  "Expert, plus de 15 ans": "Expert, more than 15 years",
  "Nom et prénom": "Full name",
  "Email professionnel": "Professional email",
  "Téléphone": "Phone",
  "02 · Le besoin": "02 · The need",
  "Ce que vous cherchez": "What you're looking for",
  "Plus le cadrage est précis, plus la shortlist est courte. C'est notre seule façon de ne proposer qu'un profil, le bon.": "The more precise the brief, the shorter the shortlist. It's the only way we can propose just one profile, the right one.",
  "Intitulé de la mission": "Assignment title",
  "Planificateur P6 senior, PMO, Doc control...": "Senior P6 planner, PMO, Doc control...",
  "Description du besoin": "Description of the need",
  "Contexte du projet, périmètre, livrables attendus, environnement technique.": "Project context, scope, expected deliverables, technical environment.",
  "Lieu d'intervention": "Assignment location",
  "Ville, pays, ou à distance": "City, country, or remote",
  "Présence sur site": "On-site presence",
  "100 % sur site": "100% on-site",
  "Hybride": "Hybrid",
  "100 % à distance": "100% remote",
  "Démarrage souhaité": "Desired start date",
  "Durée estimée": "Estimated duration",
  "Moins de 3 mois": "Less than 3 months",
  "3 à 6 mois": "3 to 6 months",
  "6 à 12 mois": "6 to 12 months",
  "Plus de 12 mois": "More than 12 months",
  "Non défini": "Not defined",
  "Outils requis": "Required tools",
  "Primavera P6": "Primavera P6",
  "MS Project": "MS Project",
  "Excel avancé": "Advanced Excel",
  "Power BI": "Power BI",
  "Revit": "Revit",
  "Navisworks": "Navisworks",
  "Aconex": "Aconex",
  "ProjectWise": "ProjectWise",
  "SAP": "SAP",
  "Langues exigées": "Required languages",
  "Français": "French",
  "Anglais": "English",
  "Espagnol": "Spanish",
  "Arabe": "Arabic",
  "Habilitations requises": "Required security clearances",
  "Aucune": "None",
  "Confidentiel Défense": "Confidential Defense",
  "Secret": "Secret",
  "Accès site nucléaire / CEA": "Nuclear site access / CEA",
  "Habilitation ferroviaire": "Rail security clearance",
  "Laissez vide si aucune habilitation particulière n'est exigée.": "Leave blank if no specific security clearance is required.",
  "Budget ou fourchette de TJM": "Budget or day rate range",
  "Fourchette indicative, ou contrat-cadre existant": "Indicative range, or existing framework agreement",
  "Contraintes particulières": "Special constraints",
  "Habilitation défense, HSE, confidentialité, livrables en marque blanche...": "Defense security clearance, HSE, confidentiality, white-label deliverables...",
  "03 · Validation": "03 · Validation",
  "J'accepte que Geozey traite ces informations pour répondre à ma demande. Elles ne sont utilisées à aucune autre fin.": "I agree that Geozey may process this information to respond to my request. It will not be used for any other purpose.",
  "Envoyer le brief": "Send the brief",
  "Reçu.": "Received.",
  "Votre brief est enregistré. Nous revenons vers vous sous 72 heures ouvrées.": "Your brief has been recorded. We will get back to you within 72 business hours.",
  "Votre profil est enregistré. Nous revenons vers vous sous 72 heures ouvrées.": "Your profile has been recorded. We will get back to you within 72 business hours.",
  "L'enregistrement automatique n'a pas abouti.": "Automatic saving did not go through.",
  "Vos réponses ne sont pas perdues :": "Your answers are not lost:",
  "cliquez ici pour nous les envoyer par email": "click here to send them to us by email",
  "ou écrivez à": "or write to",
  "Enregistrement...": "Saving...",
  "Brouillon enregistré": "Draft saved",
  "01 · Autorisation de travail": "01 · Work authorization",
  "Le préalable": "The prerequisite",
  "Geozey contractualise via une société française. Nous ne prenons en charge aucune démarche de visa ou d'autorisation de travail. Répondre non ne vous exclut pas : votre profil sera conservé pour les missions à l'étranger.": "Geozey contracts through a French company. We do not handle any visa or work permit process. Answering no does not exclude you: your profile will be kept on file for assignments abroad.",
  "Disposez-vous d'une autorisation de travail en France ou dans l'Union européenne ?": "Do you have a work permit for France or the European Union?",
  "Oui, je peux travailler en France ou dans l'UE": "Yes, I can work in France or the EU",
  "Non, je ne dispose pas de cette autorisation": "No, I do not have this authorization",
  "Sans autorisation de travail en France ou dans l'UE, nous ne pourrons pas contractualiser dans l'immédiat. Vous pouvez tout de même transmettre votre profil : il sera conservé pour les missions à l'étranger, sans engagement de notre part.": "Without a work permit for France or the EU, we will not be able to contract with you immediately. You can still submit your profile: it will be kept on file for assignments abroad, with no commitment on our part.",
  "02 · Votre identité": "02 · Your identity",
  "Qui vous êtes": "Who you are",
  "Prénom": "First name",
  "Nom": "Last name",
  "Email": "Email",
  "Profil LinkedIn": "LinkedIn profile",
  "Les candidatures accompagnées d'un profil LinkedIn sont traitées en priorité : c'est ce qui nous permet de vérifier vos environnements projet.": "Applications submitted with a LinkedIn profile are given priority: it's how we verify your project environments.",
  "03 · Votre statut": "03 · Your status",
  "Le cadre que vous cherchez": "The arrangement you're looking for",
  "Vous recherchez": "You are looking for",
  "Freelance ou portage salarial": "Freelance or umbrella company employment",
  "CDI de chantier": "Project-based permanent contract",
  "Les deux, je suis ouvert": "Both, I'm open",
  "TJM souhaité (€ HT)": "Desired day rate (€ excl. tax)",
  "SIREN de votre structure": "SIREN of your company",
  "Rémunération brute annuelle souhaitée (€)": "Desired gross annual salary (€)",
  "Disponibilité": "Availability",
  "Immédiate": "Immediate",
  "Sous 1 mois": "Within 1 month",
  "Sous 2 à 3 mois": "Within 2 to 3 months",
  "À définir": "To be defined",
  "Mobilité": "Mobility",
  "Durée d'engagement recherchée": "Desired assignment duration",
  "Présence acceptée": "Accepted presence",
  "Zones d'intervention acceptées": "Accepted operating regions",
  "Koweït / Moyen-Orient": "Kuwait / Middle East",
  "International": "International",
  "Habilitations détenues": "Security clearances held",
  "Langues pratiquées": "Languages spoken",
  "04 · Votre expertise": "04 · Your expertise",
  "Ce que vous avez tenu": "What you have delivered",
  "Nous regardons les projets et les références avant le CV. Nommez les chantiers, les clients finaux et votre périmètre réel.": "We look at projects and references before the CV. Name the sites, the end clients and your real scope of work.",
  "Spécialité principale": "Main specialty",
  "Années d'expérience": "Years of experience",
  "Secteurs couverts": "Sectors covered",
  "Outils maîtrisés": "Tools mastered",
  "Projets marquants": "Notable projects",
  "Nom du projet, client final, votre rôle, périmètre, durée.": "Project name, end client, your role, scope, duration.",
  "Références professionnelles": "Professional references",
  "Personnes qui peuvent témoigner de votre travail : nom, société, fonction.": "People who can vouch for your work: name, company, role.",
  "CV en ligne (lien)": "Online CV (link)",
  "Facultatif": "Optional",
  "Deposer votre CV": "Upload your CV",
  "Format PDF ou Word, 8 Mo maximum. Le lien ci-dessus reste possible si vous preferez.": "PDF or Word format, 8 MB maximum. The link above remains an option if you prefer.",
  "05 · Validation": "05 · Validation",
  "J'accepte que Geozey conserve ces informations pour me proposer des missions.": "I agree that Geozey may keep this information to offer me assignments.",
  "Envoyer mon profil": "Submit my profile",
  "Fichier trop volumineux : 8 Mo maximum.": "File too large: 8 MB maximum.",
  "Format non accepte : seuls le PDF et le Word sont acceptes.": "Unsupported format: only PDF and Word are accepted.",
  "Envoi du CV en cours...": "Uploading CV...",
  "CV depose : ": "CV uploaded: ",
  "Le depot du CV a echoue. Le lien ci-dessus reste possible.": "CV upload failed. The link above remains an option.",
  "Configuration indisponible, depot impossible.": "Configuration unavailable, upload not possible.",
  "Nouveau brief de mission": "New assignment brief",
  "Nouvelle candidature expert": "New expert application",
  "Zéro dérive, zéro variance, zéro compromis, zéro écart.": "Zero drift, zero variance, zero compromise, zero deviation."
  };

  var LANG_KEY = "gz_lang";
  var DEFAULT_LANG = "fr";

  // Balises dont le contenu ne doit jamais etre parcouru ni traduit.
  var BALISES_IGNOREES = { SCRIPT: true, STYLE: true, NOSCRIPT: true };

  // Attributs traduits en plus du texte visible des elements.
  var ATTRIBUTS_TRADUITS = ["placeholder", "alt", "title", "aria-label"];

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

  // Cherche la traduction d un texte francais, en comparant sa forme
  // une fois les espaces de debut et de fin retires.
  function chercherTraduction(texte) {
    var propre = texte.replace(/^\s+|\s+$/g, "");
    if (!propre) return null;
    if (Object.prototype.hasOwnProperty.call(DICO, propre)) {
      return DICO[propre];
    }
    return null;
  }

  // Reconstruit un texte traduit en conservant les espaces d origine
  // qui entouraient le texte francais.
  function remplacerEnGardantEspaces(original, remplacement) {
    var debut = original.match(/^\s*/)[0];
    var fin = original.match(/\s*$/)[0];
    return debut + remplacement + fin;
  }

  // Memorise une valeur d origine sur un objet, une seule fois.
  function memoriser(cible, cle, valeur) {
    if (cible[cle] === undefined) {
      cible[cle] = valeur;
    }
  }

  // --- Noeuds de texte ---

  function traiterNoeudTexte(noeud) {
    var parent = noeud.parentNode;
    if (!parent || BALISES_IGNOREES[parent.tagName]) return;

    memoriser(noeud, "__gzOriginal", noeud.nodeValue);
    var traduction = chercherTraduction(noeud.__gzOriginal);
    if (traduction) {
      noeud.nodeValue = remplacerEnGardantEspaces(noeud.__gzOriginal, traduction);
    }
  }

  function restaurerNoeudTexte(noeud) {
    if (noeud.__gzOriginal !== undefined) {
      noeud.nodeValue = noeud.__gzOriginal;
    }
  }

  // --- Attributs traduisibles ---

  function traiterAttributs(element) {
    ATTRIBUTS_TRADUITS.forEach(function (nomAttribut) {
      if (!element.hasAttribute(nomAttribut)) return;
      var cleMemo = "__gzAttr_" + nomAttribut;
      memoriser(element, cleMemo, element.getAttribute(nomAttribut));
      var traduction = chercherTraduction(element[cleMemo]);
      if (traduction) {
        element.setAttribute(nomAttribut, traduction);
      }
    });
  }

  function restaurerAttributs(element) {
    ATTRIBUTS_TRADUITS.forEach(function (nomAttribut) {
      var cleMemo = "__gzAttr_" + nomAttribut;
      if (element[cleMemo] !== undefined) {
        element.setAttribute(nomAttribut, element[cleMemo]);
      }
    });
  }

  // --- Options de listes deroulantes ---

  function traiterOption(option) {
    memoriser(option, "__gzOriginal", option.textContent);
    var traduction = chercherTraduction(option.__gzOriginal);
    if (traduction) {
      option.textContent = traduction;
    }
  }

  function restaurerOption(option) {
    if (option.__gzOriginal !== undefined) {
      option.textContent = option.__gzOriginal;
    }
  }

  // --- Titre du document et meta description ---

  function traiterTitreEtMeta() {
    var titre = document.querySelector("title");
    if (titre) {
      memoriser(titre, "__gzOriginal", titre.textContent);
      var traductionTitre = chercherTraduction(titre.__gzOriginal);
      if (traductionTitre) titre.textContent = traductionTitre;
    }
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      memoriser(meta, "__gzOriginal", meta.getAttribute("content"));
      var traductionMeta = chercherTraduction(meta.__gzOriginal);
      if (traductionMeta) meta.setAttribute("content", traductionMeta);
    }
  }

  function restaurerTitreEtMeta() {
    var titre = document.querySelector("title");
    if (titre && titre.__gzOriginal !== undefined) {
      titre.textContent = titre.__gzOriginal;
    }
    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.__gzOriginal !== undefined) {
      meta.setAttribute("content", meta.__gzOriginal);
    }
  }

  // --- Parcours complet du document ---

  function parcourir(racine, gestion) {
    var marcheur = document.createTreeWalker(
      racine,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (noeud) {
          var porteur = noeud.nodeType === 3 ? noeud.parentNode : noeud;
          if (porteur && BALISES_IGNOREES[porteur.tagName]) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    var noeud;
    while ((noeud = marcheur.nextNode())) {
      if (noeud.nodeType === 3) {
        gestion.texte(noeud);
      } else if (noeud.tagName === "OPTION") {
        gestion.option(noeud);
      } else {
        gestion.attribut(noeud);
      }
    }
  }

  function appliquerAnglais() {
    if (!document.body) return;
    parcourir(document.body, {
      texte: traiterNoeudTexte,
      attribut: traiterAttributs,
      option: traiterOption
    });
    traiterTitreEtMeta();
  }

  function appliquerFrancais() {
    if (!document.body) return;
    parcourir(document.body, {
      texte: restaurerNoeudTexte,
      attribut: restaurerAttributs,
      option: restaurerOption
    });
    restaurerTitreEtMeta();
  }

  // --- Selecteur de langue dans la navigation ---

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

  var boutonsSelecteur = null;

  function basculerLangue(langue) {
    if (langue === "en") {
      appliquerAnglais();
    } else {
      appliquerFrancais();
    }
    document.documentElement.setAttribute("lang", langue);
    setLangueStockee(langue);
    mettreAJourSelecteur(langue);
  }

  // --- Initialisation ---

  function initialiser() {
    injecterStyleSelecteur();
    boutonsSelecteur = creerSelecteur();

    var langueInitiale = getLangueStockee();
    if (langueInitiale === "en") {
      appliquerAnglais();
      document.documentElement.setAttribute("lang", "en");
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

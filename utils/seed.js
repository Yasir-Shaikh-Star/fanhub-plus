
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { hashPassword } = require('../core/security');

const uid = () => crypto.randomBytes(6).toString('hex');
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString();

const categories = [
  { slug: 'anime', name: 'Anime', description: 'Seasonal favorites, classic arcs, and everything in between.' },
  { slug: 'gaming', name: 'Gaming', description: 'Worlds to sink hours into, from cozy sims to punishing roguelikes.' },
  { slug: 'movies', name: 'Movies', description: 'Big-screen universes, festival darlings, and cult favorites.' },
  { slug: 'tv-shows', name: 'TV Shows', description: 'Long-running sagas and limited series worth the binge.' },
  { slug: 'kpop', name: 'K-Pop', description: 'Comebacks, stages, and the groups defining the sound.' },
  { slug: 'comics', name: 'Comics', description: 'Ongoing runs, one-shots, and indie books with heart.' },
  { slug: 'manga', name: 'Manga', description: 'Chapters, volumes, and the fandoms built around them.' },
  { slug: 'cosplay', name: 'Cosplay', description: 'Builds, tutorials, and the makers behind the costumes.' }
].map((c) => ({ id: uid(), ...c }));

const catId = (slug) => categories.find((c) => c.slug === slug).id;

const content = [];
const characters = [];
const merch = [];

function addContent(slug, items) {
  items.forEach((it, i) => {
    content.push({
      id: uid(),
      categoryId: catId(slug),
      status: 'approved',
      submittedBy: null,
      ratings: [],
      popularityScore: 40 + Math.floor(Math.random() * 60),
      releaseDate: daysAgo(30 + i * 40),
      createdAt: daysAgo(60 - i * 5),
      ...it
    });
  });
}

function addCharacters(slug, items) {
  items.forEach((it) => characters.push({ id: uid(), categoryId: catId(slug), ...it }));
}

function addMerch(slug, items) {
  items.forEach((it) => merch.push({
    id: uid(),
    categoryId: catId(slug),
    viewCount: 20 + Math.floor(Math.random() * 400),
    ...it
  }));
}

addContent('anime', [
  { title: 'Starlit Requiem', type: 'article', description: 'A grief-stricken conductor discovers her late sister\'s unfinished symphony can bend time itself.', body: 'Starlit Requiem opened its second cour this season, and it has quietly become the most talked-about drama of the year. What starts as a quiet character study about a conductor named Mio grieving her sister unfolds into something stranger: the symphony her sister left behind seems to replay fragments of the past whenever it is performed.\n\nThe animation leans heavily on watercolor-style backgrounds during the flashback sequences, a deliberate contrast to the sharp linework of the present-day orchestra hall. It is a small technical choice that does a lot of emotional work.\n\nWhat keeps fans in the comment threads arguing every week isn\'t the time-loop mechanics, though — it\'s whether Mio should forgive herself. The show refuses to answer that cleanly, and that restraint is why it is resonating.' },
  { title: 'Ashfall Academy: Season Finale Breakdown', type: 'article', description: 'Unpacking the twist ending of the fire-magic school drama everyone is arguing about.', body: 'Ashfall Academy wrapped its first season with a twist that split the fandom cleanly in half: was Instructor Kade always working against the Ember Council, or did the finale retcon three episodes of foreshadowing?\n\nRewatching the season with that question in mind, the clues are there from episode four — his glove never ignites the same way twice. Small detail, huge payoff.\n\nSeason two is confirmed for next year, and the studio has said the academy setting will expand beyond the fire wing for the first time.' },
  { title: 'Nine Tail Drift — Opening Sequence', type: 'video', description: 'The full opening animation for Nine Tail Drift, a street-racing anime with spirit-fox mythology woven through it.', mediaUrl: 'https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4' },
  { title: 'Starlit Requiem OST — "Unfinished Movement"', type: 'audio', description: 'The main theme from Starlit Requiem, performed for the mid-season broadcast.', mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
]);
addCharacters('anime', [
  { name: 'Mio Kanzaki', bio: 'A prodigy conductor who inherited her late sister\'s orchestra and, unknowingly, her unfinished time-bending symphony.', affiliation: 'Starlit Requiem', tags: ['protagonist', 'musician'] },
  { name: 'Instructor Kade', bio: 'Ashfall Academy\'s most feared fire-magic teacher, revealed in the finale to be playing a much longer game than anyone realized.', affiliation: 'Ashfall Academy', tags: ['mentor', 'twist'] },
  { name: 'Rin Amano', bio: 'The spirit-fox racer at the center of Nine Tail Drift, competing in illegal night races to pay off a debt she never agreed to.', affiliation: 'Nine Tail Drift', tags: ['racer', 'protagonist'] }
]);
addMerch('anime', [
  { name: 'Starlit Requiem Vinyl OST (2xLP)', tag: 'Limited Edition', isUpcoming: false, releaseDate: daysAgo(10), description: 'Double vinyl pressing of the full orchestral score, numbered sleeve.' },
  { name: 'Ashfall Academy Enamel Pin Set', tag: 'Pre-Order', isUpcoming: true, releaseDate: daysFromNow(18), description: 'Five-pin set representing each of the academy\'s elemental wings.' }
]);

addContent('gaming', [
  { title: 'Ember Keep Just Got Its Biggest Update Yet', type: 'article', description: 'The cozy-roguelike hybrid adds a full second keep to rebuild, plus new co-op mode.', body: 'Ember Keep has always sat in an odd, wonderful genre space — half cozy management sim, half roguelike dungeon crawl. The 2.0 update, out this week, leans harder into both halves at once.\n\nThe headline feature is a second keep, found after defeating the update\'s new final boss, which can be rebuilt in an entirely different architectural style using materials only found in the previously unreachable Frostward biome.\n\nCo-op is the other big addition: up to three players can now raid together, with keep management staying single-player to avoid the classic "everyone wants to place the furniture" problem.' },
  { title: 'Voidrunner Protocol Speedrun Community Hits a Milestone', type: 'article', description: 'The any% category has been broken under nine minutes for the first time.', body: 'A community-discovered skip involving the game\'s gravity-inversion mechanic has reshaped the entire any% category for Voidrunner Protocol. Runners are now routing through the second act\'s locked vault room three hours "early" in real time by exploiting a frame-perfect inversion cancel.\n\nThe current world record sits at 8:52, down from a pre-patch average of roughly fourteen minutes. Speedrunning communities are already petitioning the developer not to patch the skip out.' },
  { title: 'Petal Kingdoms — Launch Trailer', type: 'video', description: 'The launch trailer for Petal Kingdoms, a turn-based tactics game set across floating garden islands.', mediaUrl: 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4' },
  { title: 'Ember Keep — Ambient Keep Theme', type: 'audio', description: 'The looping ambient track that plays while managing your keep between raids.', mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
]);
addCharacters('gaming', [
  { name: 'Warden Bryn', bio: 'The playable protagonist of Ember Keep, a disgraced knight rebuilding a ruined fortress one raid at a time.', affiliation: 'Ember Keep', tags: ['protagonist', 'playable'] },
  { name: 'Unit 7-Vex', bio: 'The rogue AI companion guiding the player through Voidrunner Protocol\'s gravity-broken station.', affiliation: 'Voidrunner Protocol', tags: ['companion', 'ai'] }
]);
addMerch('gaming', [
  { name: 'Ember Keep Collector\'s Edition Steelbook', tag: 'Collectible', isUpcoming: false, releaseDate: daysAgo(5), description: 'Steelbook case with the 2.0 soundtrack code and a fold-out keep blueprint poster.' },
  { name: 'Voidrunner Protocol Vex Figure', tag: 'Pre-Order', isUpcoming: true, releaseDate: daysFromNow(40), description: '6-inch light-up figure of the companion drone Unit 7-Vex.' }
]);

addContent('movies', [
  { title: 'The Glass Horizon Is the Slow-Burn Sci-Fi of the Year', type: 'article', description: 'A generation ship drama that trusts its audience to sit with silence.', body: 'The Glass Horizon spends its first twenty minutes without a single line of dialogue, tracking a maintenance worker through the guts of a generation ship in visible disrepair. It is a bold opening for a studio film, and it pays off.\n\nThe film\'s central question — whether the ship\'s remaining passengers should wake the next generation early, knowing resources won\'t stretch — never resolves into easy heroism. Both the captain and her chief engineer make defensible, opposing choices, and the film lets that sit.\n\nEarly festival reactions have compared its pacing to classic hard sci-fi rather than anything released in the last decade, which tracks: this is a patient, quiet film in a genre that has mostly stopped being either.' },
  { title: 'Midnight Cartographer: What That Ending Actually Means', type: 'article', description: 'Breaking down the ambiguous final shot that has festival audiences split.', body: 'Midnight Cartographer ends on a single unbroken shot of an empty map table, the titular cartographer\'s pen still rolling off the edge. No dialogue, no score. It is the kind of ending built to be argued about, and it has been.\n\nThe strongest reading treats the film as a ghost story told entirely through absence — every map the cartographer drew across the runtime maps a place that, we slowly realize, no longer exists by the time she draws it.' },
  { title: 'Salt & Static — Official Trailer', type: 'video', description: 'Trailer for Salt & Static, a coastal noir about a radio operator picking up transmissions that shouldn\'t exist.', mediaUrl: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4' },
  { title: 'The Glass Horizon — Main Theme', type: 'audio', description: 'The string-led main theme composed for The Glass Horizon.', mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
]);
addCharacters('movies', [
  { name: 'Captain Odalys Reyes', bio: 'Commander of the generation ship in The Glass Horizon, forced to choose between protocol and survival.', affiliation: 'The Glass Horizon', tags: ['captain', 'protagonist'] },
  { name: 'The Cartographer', bio: 'Unnamed protagonist of Midnight Cartographer, mapping a coastline that keeps rearranging itself.', affiliation: 'Midnight Cartographer', tags: ['mystery'] }
]);
addMerch('movies', [
  { name: 'The Glass Horizon 4K Steelbook', tag: 'Limited Edition', isUpcoming: true, releaseDate: daysFromNow(25), description: 'Includes a 40-page ship schematics booklet.' },
  { name: 'Salt & Static Poster (Screen Print)', tag: 'Collectible', isUpcoming: false, releaseDate: daysAgo(14), description: 'Hand-numbered screen print run of 500, coastal indigo palette.' }
]);

addContent('tv-shows', [
  { title: 'The Last Lighthouse Renewed for a Final Season', type: 'article', description: 'The mystery-drama will end with a fourth and final season next year.', body: 'The network confirmed today that The Last Lighthouse will conclude with a fourth season, giving the writers room the ending they\'ve reportedly been building toward since season one.\n\nShowrunner statements have been careful not to spoil anything, but the phrase "the light was never the point" keeps showing up in interviews, which fans have already turned into a fairly compelling season-four prediction.' },
  { title: 'Paper Cities: A Season One Retrospective', type: 'article', description: 'Looking back at the anthology series\' strongest and weakest episodes before season two.', body: 'Paper Cities told eight stories in eight different fictional cities in its first season, an anthology structure that is always going to be uneven by design. "The Archivist," episode four, remains the clear standout — a quiet story about a city that forgets one resident every year.\n\nSeason two moves to a serialized structure, which is either going to solve the anthology\'s consistency problem or lose what made it distinct in the first place.' },
  { title: 'Nocturne County — Season 2 Teaser', type: 'video', description: 'Teaser trailer for season two of the small-town mystery series Nocturne County.', mediaUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4' },
  { title: 'The Last Lighthouse — End Credits Theme', type: 'audio', description: 'The end credits piece that has played, slightly altered, at the close of every episode.', mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
]);
addCharacters('tv-shows', [
  { name: 'Deputy Farrow', bio: 'The lighthouse keeper\'s estranged daughter, now the town\'s deputy, at the center of The Last Lighthouse.', affiliation: 'The Last Lighthouse', tags: ['detective'] },
  { name: 'The Archivist', bio: 'A recurring figure across Paper Cities\' anthology episodes who remembers what each city forgets.', affiliation: 'Paper Cities', tags: ['recurring'] }
]);
addMerch('tv-shows', [
  { name: 'The Last Lighthouse Complete Series Box Set', tag: 'Pre-Order', isUpcoming: true, releaseDate: daysFromNow(60), description: 'All four seasons, including the final season, in a lighthouse-shaped case.' },
  { name: 'Nocturne County Enamel Map Pin', tag: 'Standard', isUpcoming: false, releaseDate: daysAgo(20), description: 'A pin of the fictional county map used in the show\'s opening titles.' }
]);

addContent('kpop', [
  { title: 'LUNA ELEVEN\'s Comeback Broke Three Streaming Records', type: 'article', description: 'The title track "Paper Moonlight" is now the fastest music video to hit 50 million views for the group.', body: 'LUNA ELEVEN\'s fifth mini-album arrived with "Paper Moonlight" as its title track, and the numbers have been extraordinary even by the group\'s own standards: fastest video to 50 million views, biggest first-day album sales, and a real-time chart sweep across every major domestic platform within six hours.\n\nChoreography breakdown accounts flooded in almost immediately — the bridge section\'s formation change, done in a single continuous camera move during the music video, is already being called one of the most technically demanding sequences the group has performed.' },
  { title: 'VELVET SIGNAL Announces World Tour Dates', type: 'article', description: 'The five-piece group\'s first world tour will span 22 cities across four continents.', body: 'VELVET SIGNAL confirmed their long-rumored world tour today, with 22 stops spanning North America, Europe, Southeast Asia, and Oceania. Tickets for the first wave of city announcements go on sale next month.\n\nThe tour is expected to support both of the group\'s most recent releases, and fan community threads are already trading predictions on the setlist order.' },
  { title: 'ECHO9 — "Static Bloom" MV Teaser', type: 'video', description: 'Teaser clip for ECHO9\'s comeback title track "Static Bloom."', mediaUrl: 'https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4' },
  { title: 'LUNA ELEVEN — "Paper Moonlight" (Acoustic Ver.)', type: 'audio', description: 'Stripped-down acoustic version of the comeback title track, released for radio.', mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }
]);
addCharacters('kpop', [
  { name: 'LUNA ELEVEN', bio: 'Six-member group known for cinematic comebacks and famously demanding choreography.', affiliation: 'LUNA ELEVEN', tags: ['group'] },
  { name: 'VELVET SIGNAL', bio: 'Five-piece group heading into their first world tour on the strength of two chart-topping releases.', affiliation: 'VELVET SIGNAL', tags: ['group'] },
  { name: 'ECHO9', bio: 'Rookie group of the year, currently promoting their debut comeback "Static Bloom."', affiliation: 'ECHO9', tags: ['group', 'rookie'] }
]);
addMerch('kpop', [
  { name: 'LUNA ELEVEN "Paper Moonlight" Photocard Set', tag: 'Limited Edition', isUpcoming: false, releaseDate: daysAgo(8), description: 'Full 6-member photocard set from the fifth mini-album.' },
  { name: 'VELVET SIGNAL World Tour Lightstick Ver.2', tag: 'Pre-Order', isUpcoming: true, releaseDate: daysFromNow(30), description: 'Updated lightstick with tour-exclusive Bluetooth sync colors.' }
]);

addContent('comics', [
  { title: 'Ironclad Wren #12 Sticks the Landing', type: 'article', description: 'The first arc of the indie mecha-noir book closes on exactly the right note.', body: 'Ironclad Wren has been one of the strongest debut indie books of the year, and issue twelve closes its opening arc without a single wasted page. The reveal about the titular mech\'s original pilot recontextualizes nearly everything from issue one.\n\nArtist changes mid-run are usually a red flag, but the transition between the first six issues and the back half here was handled about as gracefully as possible, with the new artist clearly building on the established visual language rather than overwriting it.' },
  { title: 'The Hollow Choir Is Getting an Omnibus', type: 'article', description: 'All three volumes of the horror-fantasy series will be collected in a single oversized edition.', body: 'The Hollow Choir\'s publisher announced an omnibus edition collecting all three existing volumes, plus roughly 30 pages of previously unpublished sketches and an interview with the creative team.\n\nFor a series that built its reputation partly on unsettling, densely detailed page layouts, the oversized trim size should be a genuine upgrade over the standard-format single issues.' }
]);
addCharacters('comics', [
  { name: 'Wren Okafor', bio: 'Pilot of the salvaged mech Ironclad in the noir series of the same name, hiding a connection to its original pilot.', affiliation: 'Ironclad Wren', tags: ['pilot', 'protagonist'] },
  { name: 'The Choirmaster', bio: 'The central antagonist of The Hollow Choir, whose true form is never drawn the same way twice.', affiliation: 'The Hollow Choir', tags: ['antagonist'] }
]);
addMerch('comics', [
  { name: 'Ironclad Wren #1 Variant Cover', tag: 'Collectible', isUpcoming: false, releaseDate: daysAgo(45), description: 'Foil variant cover, limited to the first print run.' },
  { name: 'The Hollow Choir Omnibus', tag: 'Pre-Order', isUpcoming: true, releaseDate: daysFromNow(50), description: 'Oversized hardcover collecting all three volumes plus bonus material.' }
]);

addContent('manga', [
  { title: 'Crimson Loom Volume 8: The Fandom\'s Favorite Arc Yet', type: 'article', description: 'The thread-weaving fantasy series delivers its best-paced volume to date.', body: 'Crimson Loom\'s eighth volume trims a lot of the setup-heavy pacing that slowed down volumes four through six, and the result is the tightest stretch of the series so far. The "unraveling" fight sequence in chapter 61 is already being called one of the best-choreographed action sequences the series has produced.\n\nEnglish translation for volume 8 is scheduled for next quarter, putting it roughly four volumes behind the original release — a gap that has been slowly closing over the past year.' },
  { title: 'Silent Orbit Wraps Its Serialization', type: 'article', description: 'After six years, the sci-fi manga concludes with its 24th and final volume.', body: 'Silent Orbit\'s final chapter published this week, closing out a six-year serialization with an ending that, by most early reader reactions, sticks the landing the story had been building toward since its slow-burn first act.\n\nThe creator confirmed in an afterword that a planned spinoff, following a secondary cast member from the back half of the series, is currently in early planning.' }
]);
addCharacters('manga', [
  { name: 'Sera Vantis', bio: 'The thread-weaver protagonist of Crimson Loom, whose "unraveling" technique carries real narrative cost.', affiliation: 'Crimson Loom', tags: ['protagonist'] },
  { name: 'Kael Oshiro', bio: 'The reluctant pilot at the center of Silent Orbit\'s six-year arc.', affiliation: 'Silent Orbit', tags: ['protagonist'] }
]);
addMerch('manga', [
  { name: 'Crimson Loom Vol. 8 First-Print Edition', tag: 'Limited Edition', isUpcoming: true, releaseDate: daysFromNow(20), description: 'First-print run includes a fold-out thread-map insert.' },
  { name: 'Silent Orbit Complete Set (Vol. 1-24)', tag: 'Collectible', isUpcoming: false, releaseDate: daysAgo(3), description: 'Complete boxed set with a newly illustrated slipcase.' }
]);

addContent('cosplay', [
  { title: 'Building Foam Armor That Survives a Full Con Weekend', type: 'article', description: 'A materials and construction breakdown from this year\'s most-photographed armor build.', body: 'Foam armor that looks great in a photoshoot but falls apart by hour four of a convention floor is a problem every cosplayer eventually runs into. This build breakdown focuses on the layering and sealing techniques used in one of this season\'s most-photographed armor sets: EVA foam base, a flexible primer coat, and a two-part sealant that keeps pieces from cracking under repeated flexing.\n\nThe biggest takeaway from the maker\'s own notes: strapping and weight distribution matter more than paint finish for whether a build actually survives being worn all day.' },
  { title: 'How Group Cosplay Coordinators Plan a 12-Person Build', type: 'article', description: 'Behind the scenes of one of the largest coordinated group cosplays at this year\'s convention season.', body: 'Coordinating a single cosplay build is a project. Coordinating twelve, across different cities, different skill levels, and one shared deadline, is closer to running a small production. This piece follows one group\'s coordinator through the four-month planning process — shared reference sheets, a strict fabric-sourcing spreadsheet, and a group video call every two weeks to catch problems early.' },
  { title: 'Convention Floor Walkthrough — Cosplay Highlights', type: 'video', description: 'A walkthrough of standout cosplay builds from this year\'s convention floor.', mediaUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4' }
]);
addCharacters('cosplay', [
  { name: 'The Armor Build Community', bio: 'A loose, active community of makers sharing foam-smithing and armor-construction techniques.', affiliation: 'Community Feature', tags: ['maker', 'community'] }
]);
addMerch('cosplay', [
  { name: 'Fan Hub Plus Con Survival Kit', tag: 'Standard', isUpcoming: false, releaseDate: daysAgo(12), description: 'Repair tape, contact adhesive, and a foldable touch-up kit for con-floor fixes.' },
  { name: 'Maker Badge Pin Series 1', tag: 'Collectible', isUpcoming: true, releaseDate: daysFromNow(15), description: 'Five-pin series celebrating community armor, sewing, wig, and prop makers.' }
]);

const events = [
  { id: uid(), title: 'Fandom Universe Con', city: 'Los Angeles', venue: 'Harborview Convention Center', lat: 34.0407, lng: -118.2468, date: daysFromNow(35), type: 'Convention', ticketUrl: 'https://example.com/tickets/fuc-la', description: 'A multi-fandom convention spanning anime, gaming, comics, and cosplay guests.' },
  { id: uid(), title: 'Nine Tail Drift Screening Night', city: 'Tokyo', venue: 'Shinbashi Cinema Hall', lat: 35.6664, lng: 139.7580, date: daysFromNow(12), type: 'Screening', ticketUrl: 'https://example.com/tickets/ntd-screening', description: 'Early-access screening of the next Nine Tail Drift story arc.' },
  { id: uid(), title: 'LUNA ELEVEN World Tour — London Stop', city: 'London', venue: 'Riverside Arena', lat: 51.5074, lng: -0.1278, date: daysFromNow(48), type: 'Concert', ticketUrl: 'https://example.com/tickets/luna-london', description: 'The London leg of the Paper Moonlight world tour.' },
  { id: uid(), title: 'Armor & Foam Meetup', city: 'Toronto', venue: 'Distillery Maker Space', lat: 43.6503, lng: -79.3599, date: daysFromNow(9), type: 'Meetup', ticketUrl: 'https://example.com/tickets/armor-meetup', description: 'A hands-on cosplay armor-building meetup and skill swap.' },
  { id: uid(), title: 'Crimson Loom Volume 8 Launch', city: 'Manila', venue: 'Bookhaven Main Branch', lat: 14.5995, lng: 120.9842, date: daysFromNow(21), type: 'Release Event', ticketUrl: 'https://example.com/tickets/crimson-loom-launch', description: 'Launch event and signed-copy giveaway for Crimson Loom Volume 8.' },
  { id: uid(), title: 'Fandom Universe Con — New York', city: 'New York', venue: 'Pier 94 Exhibition Hall', lat: 40.7690, lng: -73.9971, date: daysFromNow(70), type: 'Convention', ticketUrl: 'https://example.com/tickets/fuc-ny', description: 'The East Coast edition of Fandom Universe Con.' }
];

const chatbotFaq = [
  { id: uid(), question: 'How do I bookmark something?', keywords: ['bookmark', 'save', 'favorite'], answer: 'Open any article, character profile, video, or merch item and click the bookmark icon. You can view everything you\'ve saved from your Dashboard.', category: 'general' },
  { id: uid(), question: 'How do I change categories I follow?', keywords: ['favorite categories', 'follow', 'interests', 'preferences'], answer: 'Go to your Profile page and update your favorite fandoms under "Categories of Interest" — your dashboard and recommendations adjust automatically.', category: 'account' },
  { id: uid(), question: 'How do I submit fan content?', keywords: ['submit', 'fan content', 'article', 'contribute'], answer: 'From the Articles hub, click "Submit Fan Content." Your submission goes to an admin for approval before it appears publicly.', category: 'content' },
  { id: uid(), question: 'How do I find events near me?', keywords: ['event', 'convention', 'nearby', 'meetup', 'map'], answer: 'Visit the Events page and use the city filter, or allow location access to see the map centered near you.', category: 'events' },
  { id: uid(), question: 'I forgot my password, what do I do?', keywords: ['forgot password', 'reset', 'login', 'cant log in'], answer: 'Click "Forgot password?" on the login page. We\'ll generate a reset link — in this demo build it\'s shown directly on screen instead of emailed.', category: 'account' },
  { id: uid(), question: 'Can I turn on dark mode?', keywords: ['dark mode', 'theme', 'night mode'], answer: 'Yes — use the sun/moon icon in the top navigation bar. Your preference is saved to your account if you\'re logged in.', category: 'accessibility' },
  { id: uid(), question: 'How does content get sorted?', keywords: ['sort', 'filter', 'popular', 'latest'], answer: 'On the Explore page you can sort by Latest, Most Popular, or Alphabetical, and filter by category, content type, or release year.', category: 'general' },
  { id: uid(), question: 'How do I rate a video or audio clip?', keywords: ['rate', 'rating', 'stars', 'thumbs'], answer: 'Open the media item and use the star rating widget underneath the player. Ratings help shape the "Most Popular" sort order.', category: 'content' },
  { id: uid(), question: 'Is there merchandise I can buy here?', keywords: ['buy', 'purchase', 'merch', 'shop', 'checkout'], answer: 'Fan Hub Plus showcases merchandise for discovery only — there\'s no checkout here. Pre-order and ticket links point to the official source.', category: 'general' },
  { id: uid(), question: 'How do I report a bug?', keywords: ['bug', 'issue', 'broken', 'error', 'problem'], answer: 'Use the Feedback page and select "Bug" as the type. Admins review every submission from the control panel.', category: 'support' }
];

const users = [
  {
    id: uid(),
    name: 'Aria Nakamura',
    email: 'visionarycoders@gmail.com',
    passwordHash: hashPassword('Techwizpakistan'),
    role: 'admin',
    bio: 'Platform admin keeping the multiverse tidy.',
    favoriteCategories: [catId('anime'), catId('comics')],
    theme: 'dark',
    fontSize: 'md',
    createdAt: daysAgo(200),
    resetToken: null,
    resetTokenExpiry: null
  },
  {
    id: uid(),
    name: 'Jordan Blake',
    email: 'jordan@example.com',
    passwordHash: hashPassword('Fan@1234'),
    role: 'registered',
    bio: 'Anime and K-pop enthusiast, mostly here for comeback theories.',
    favoriteCategories: [catId('anime'), catId('kpop')],
    theme: 'light',
    fontSize: 'md',
    createdAt: daysAgo(90),
    resetToken: null,
    resetTokenExpiry: null
  },
  {
    id: uid(),
    name: 'Sam Whitfield',
    email: 'sam@example.com',
    passwordHash: hashPassword('Fan@1234'),
    role: 'registered',
    bio: 'Cosplay maker and part-time speedrunner.',
    favoriteCategories: [catId('cosplay'), catId('gaming')],
    theme: 'light',
    fontSize: 'md',
    createdAt: daysAgo(40),
    resetToken: null,
    resetTokenExpiry: null
  }
];

const jordanId = users[1].id;
const bookmarks = [
  { id: uid(), userId: jordanId, targetType: 'content', targetId: content[0].id, note: 'Rewatch this scene breakdown before the finale.', createdAt: daysAgo(3) },
  { id: uid(), userId: jordanId, targetType: 'character', targetId: characters.find((c) => c.name === 'LUNA ELEVEN').id, note: '', createdAt: daysAgo(1) }
];

const feedback = [
  { id: uid(), userId: jordanId, name: 'Jordan Blake', email: 'jordan@example.com', type: 'suggestion', message: 'Would love a filter for "currently airing" anime specifically.', status: 'new', createdAt: daysAgo(2) },
  { id: uid(), userId: null, name: 'Guest Visitor', email: 'guest@example.com', type: 'bug', message: 'The merch page took a while to load images on mobile data.', status: 'reviewed', createdAt: daysAgo(6) }
];

content.push({
  id: uid(),
  categoryId: catId('gaming'),
  title: 'Fan Theory: Petal Kingdoms\' Hidden Sixth Island',
  type: 'article',
  description: 'A community theory about datamined assets suggesting a sixth garden island.',
  body: 'Dataminers combing through Petal Kingdoms\' latest patch files found unused tile assets that don\'t match any of the five known garden islands. This piece lays out the visual evidence and why the community thinks a sixth island is coming.',
  status: 'pending',
  submittedBy: users[2].id,
  ratings: [],
  popularityScore: 0,
  releaseDate: daysAgo(0),
  createdAt: daysAgo(0)
});

const db = {
  users,
  categories,
  content,
  characters,
  merch,
  events,
  bookmarks,
  feedback,
  chatbotFaq,
  chatbotLogs: []
};

fs.writeFileSync(path.join(__dirname, '..', 'data', 'db.json'), JSON.stringify(db, null, 2));
console.log('Seeded data/db.json with', content.length, 'content items,', characters.length, 'characters,', merch.length, 'merch items,', events.length, 'events.');

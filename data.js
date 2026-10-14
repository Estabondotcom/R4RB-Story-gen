/*
 * Roll for Rocket Boots — editable adventure content.
 *
 * Add a story type to STORY_TYPES and a matching group to FOCUSES.
 * Add a time period to PERIODS.  Settings and focuses use inclusive era indexes.
 * Settings use tags so story focuses can adapt to the environment.
 * A focus has a broad label and a list of short, specific final hooks.
 *
 * Eligibility rules (optional on a setting, focus, or hook):
 *   min / max       inclusive time-period index
 *   anyTags         require at least one tag from the selected setting
 *   genres          thematic genres; only checked if the user selected genres
 *   magic           'some' or 'high'; unavailable in No Magic mode
 */
window.ROCKET_DATA = (() => {
  const STORY_TYPES = [
    ['monster', 'Monster Mystery'],
    ['mystery', 'General Mystery'],
    ['heist', 'Heist'],
    ['con', 'Con / Scam'],
    ['rescue', 'Rescue Mission'],
    ['escape', 'Escape'],
    ['survival', 'Survival'],
    ['treasure', 'Treasure Hunt'],
    ['bounty', 'Bounty Hunt'],
    ['escort', 'Escort Mission'],
    ['sabotage', 'Sabotage'],
    ['defense', 'Defense / Siege'],
    ['competition', 'Competition'],
    ['politics', 'Political Intrigue']
  ].map(([id, label]) => ({ id, label }));

  const PERIODS = [
    'Prehistoric', 'Ancient', 'Medieval', 'Renaissance / Early Modern',
    'Colonial Era', '1800s', 'World War I (1914–1918)', '1920s',
    'World War II (1939–1945)', '1950s', '1960s', '1970s', '1980s',
    '1990s', 'Modern Day', 'Near Future', 'Far Future'
  ].map((label, i) => ({ id: String(i), label, index: i }));

  const S = (id, label, tags, rules = {}) => ({ id, label, tags, ...rules });
  const SETTINGS = [
    S('metropolis', 'Large City / Metropolis', ['urban','social','commerce'], { min: 1 }),
    S('town', 'Small Town / Village', ['rural','social','commerce']),
    S('mountain-town', 'Mountain Town', ['rural','mountain','wilderness','social'], { min: 1 }),
    S('forest', 'Woodlands / Forest', ['wilderness','forest','rural']),
    S('mountains', 'Mountains / Highland Pass', ['wilderness','mountain']),
    S('desert', 'Desert / Badlands', ['wilderness','remote']),
    S('swamp', 'Swamp / Marshlands', ['wilderness','water','rural']),
    S('jungle', 'Jungle / Rainforest', ['wilderness','forest','remote']),
    S('arctic', 'Frozen Wilderness', ['wilderness','remote']),
    S('port', 'Coastal Town / Port', ['water','commerce','social','rural'], { min: 1 }),
    S('island', 'Island / Archipelago', ['water','wilderness','remote']),
    S('ocean', 'Open Ocean', ['water','wilderness','travel']),
    S('caves', 'Underground / Caverns', ['underground','remote','wilderness']),
    S('ruins', 'Ruins / Abandoned Settlement', ['ruins','remote','wilderness'], { min: 1 }),
    S('fortress', 'Castle / Fortress', ['fortified','military','social'], { min: 1 }),
    S('manor', 'Manor / Estate', ['social','wealth','rural'], { min: 1 }),
    S('military', 'Military Base / Encampment', ['military','fortified','social']),
    S('factory', 'Industrial District / Factory', ['industry','urban','commerce'], { min: 3 }),
    S('laboratory', 'Research Facility / Laboratory', ['science','institution','industry'], { min: 3 }),
    S('school', 'School / University', ['institution','social'], { min: 1 }),
    S('hospital', 'Hospital / Medical Facility', ['institution','science','social'], { min: 1 }),
    S('prison', 'Prison / Detention Facility', ['institution','fortified','military'], { min: 1 }),
    S('temple', 'Temple / Religious Site', ['sacred','institution','ruins']),
    S('carnival', 'Amusement Park / Carnival', ['entertainment','social','commerce'], { min: 3 }),
    S('market', 'Shopping Center / Marketplace', ['commerce','social','urban'], { min: 1 }),
    S('ship', 'Ship / Seagoing Vessel', ['water','travel','remote']),
    S('train', 'Train / Railway', ['travel','industry','social'], { min: 5 }),
    S('space', 'Space Station / Spacecraft', ['space','travel','science','remote'], { min: 15, genres: ['scifi'] }),
    S('underwater', 'Underwater Settlement', ['water','science','remote'], { min: 14, genres: ['scifi'] }),
    S('cybercity', 'Cyberpunk City', ['urban','commerce','industry','science'], { min: 15, genres: ['scifi'] }),
    S('clockwork', 'Clockwork City', ['urban','commerce','industry'], { min: 3, genres: ['steampunk','fantasy'] }),
    S('enchanted', 'Enchanted Forest', ['wilderness','forest','sacred'], { genres: ['fantasy'], magic: 'some' }),
    S('skycity', 'Floating City / Sky Island', ['remote','urban','travel'], { min: 2, genres: ['fantasy','scifi'] }),
    S('wasteland', 'Wasteland / Fallout Zone', ['wilderness','ruins','remote'], { min: 6 }),
    S('alien', 'Alien Colony / World', ['space','wilderness','science','remote'], { min: 15, genres: ['scifi'] })
  ];

  const F = (id, label, hooks, rules = {}) => ({ id, label, hooks: hooks.map((h, i) => typeof h === 'string' ? { id: id + '-' + i, label: h } : { id: id + '-' + i, ...h }), ...rules });
  const H = (label, rules = {}) => ({ label, ...rules });

  const FOCUSES = {
    monster: [
      F('cryptids','Cryptids', ['Mothman','Bigfoot','Jersey Devil','Chupacabra','Thunderbird','Lake Monster','Goatman','An Uncatalogued Local Legend'], { anyTags:['wilderness','rural','water','mountain','forest','ruins'] }),
      F('predator','Unknown Predator', ['Claw Marks with No Tracks','The Creature That Hunts Only at Night','A Vanishing Pack Animal','A Predator That Copies Voices','The Last Survivor of Its Kind','Something Hunting the Hunters']),
      F('folklore','Folklore Creatures', ['A Troll Beneath a Crossing','The Forest Guardian','A Goblin That Steals Names','A River Spirit','The Night-Hag Legend','A Creature Bound to an Old Promise'], { magic:'some' }),
      F('hauntings','Hauntings', ['A Restless Former Resident','Footsteps in Empty Rooms','An Apparition Seen at the Same Hour','The Ghost of a Lost Traveler','A Possessed Family Heirloom','Voices from Beneath the Floor'], { magic:'some' }),
      F('mimics','Impostors & Shapeshifters', ['Someone Replaced Overnight','A Doppelgänger in the Crowd','A Creature Wearing a Familiar Face','The Uninvited Guest','One Person in Two Places','A Reflection That Acts on Its Own'], { magic:'some' }),
      F('beasts','Strange Wildlife', ['An Albino Beast of Unusual Size','A Species Thought Extinct','Animals Acting in Perfect Unison','A Nest Where None Should Exist','A Creature That Leaves Glassy Tracks','Something That Moves Beneath the Ground']),
      F('deep','Deep-Water Creatures', ['Something Under the Keel','A Glow Beneath the Surface','A Huge Shape in the Fog','An Empty Fishing Boat','The Thing in the Reservoir','A Creature Tangled in the Nets'], { anyTags:['water'] }),
      F('experiments','Escaped Experiments', ['A Failed Hybrid','The Missing Test Subject','A Contaminated Specimen','The Abandoned Containment Tank','A Creature with a Tracking Collar','The Prototype That Learned to Hunt'], { min:9, anyTags:['science','industry','urban','institution','space'] }),
      F('machines','Rogue Constructs', ['An Autonomous Watchdog','A Maintenance Machine Gone Feral','A Doll That Moves When Unseen','The Missing Security Drone','A Self-Replicating Device','An Ancient Clockwork Sentinel'], { min:3, anyTags:['industry','urban','science','institution','space'], genres:['steampunk','scifi','fantasy'] }),
      F('aliens','Alien Organisms', ['A Stowaway in the Ventilation','A Mimic Plant','A Parasite That Controls Hosts','An Egg Found in Cargo','A Silent Colony of Spores','An Organism That Changes Shape'], { min:15, genres:['scifi'] }),
      F('guardian','Ancient Guardians', ['A Sentinel Beneath the Ruins','The Protector of a Sealed Gate','A Beast Bound to a Shrine','A Monument That Wakes at Dusk','The Last Watcher','The Guardian That Mistakes Everyone for Intruders'], { anyTags:['ruins','sacred','underground','fortified','forest'], magic:'some' })
    ],
    mystery: [
      F('murder','Murder', ['At a Dinner Party','Inside a Locked Room','During a Festival','A Victim with No Known Enemies','A Second Body with the Same Clue','A Disappearance Disguised as a Death','A Body Found in the Wrong Place','A Victim Who Should Still Be Alive']),
      F('disappearance','Disappearance', ['The Entire Household Is Gone','A Missing Local Celebrity','No Footprints Leaving the Scene','The Last Person Seen at the Crossing','A Traveler Who Never Arrived','A Whole Crew Vanishes','A Child Returns with No Memory']),
      F('theft','Unexplained Theft', ['Something Stolen from a Locked Vault','A Priceless Object Replaced with a Fake','The Theft No One Reported','A Missing Shipment','A Thief Who Leaves Gifts Behind','Several Unrelated Victims','An Object That Vanishes Every Year']),
      F('conspiracy','Conspiracy', ['A Shared Secret Among Officials','Records That Contradict Each Other','A Cover-Up After an Accident','A Hidden Patron Funding Both Sides','A Witness Paid to Lie','A Pattern of Quiet Arrests']),
      F('identity','Hidden Identity', ['A Stranger with Familiar Memories','An Heir Whose Papers Are Forged','Two People Claiming One Name','The Wrong Person at a Ceremony','An Official Who Never Existed','Someone Living Under a Dead Person’s Identity']),
      F('phenomena','Unexplained Phenomena', ['A Signal at the Same Hour','Objects Falling Upward','A Door That Opens to the Wrong Place','Animals Refusing to Enter an Area','Lights Beneath the Ground','People Sharing the Same Dream']),
      F('secret','Secret Society', ['An Invitation with No Sender','A Meeting Beneath the Town','The Same Symbol at Every Crime Scene','Members Who Deny Knowing Each Other','A Ceremony Behind Closed Doors','An Initiation That Went Wrong']),
      F('forgery','Forged Evidence', ['A Confession Written Before the Crime','A False Map','Witnesses with Identical Stories','A Fabricated Family History','A Ledger with Missing Pages','An Incriminating Object Planted Too Perfectly']),
      F('signal','Mysterious Transmission', ['A Distress Call from an Empty Place','A Message from Tomorrow','A Broadcast in an Unknown Language','Coordinates Hidden in Static','A Voice Thought to Be Dead','A Repeating Warning'], { min:6, anyTags:['urban','science','industry','space','military','travel','remote'] }),
      F('incident','Suspicious Accident', ['A Collapsed Bridge','A Poisoned Feast','An Explosion with No Obvious Source','The Only Survivor Changes Their Story','A Wreck with Missing Passengers','A Disaster That Benefits One Person'])
    ],
    heist: [
      F('collector','Private Collection', ['A Stolen Masterpiece','A Sealed Curiosity Cabinet','The Collector’s Favorite Jewel','An Uncatalogued Exhibit','A One-of-a-Kind Instrument','A Secret Room Behind the Gallery']),
      F('treasury','Royal or State Treasury', ['The Crown Jewels','A Sealed Tax Chest','A Royal Signet','A Ledger of Secret Payments','A Ceremonial Sword','A Vault Key Held by Three People'], { min:1 }),
      F('techco','Tech Company', ['A Proprietary Microchip','The Source-Code Master Key','A Prototype Interface','Encrypted Research Drives','The Company’s Secret Patent','An Experimental Neural Implant',H('A Self-Learning AI Core',{min:15})], { min:11, anyTags:['urban','industry','science','commerce','space'] }),
      F('syndicate','Criminal Syndicate', ['A Smuggled Shipment','The Boss’s Blackmail Ledger','An Unmarked Money Cache','A Forged Identity Archive','An Incriminating Recording','An Auction Invitation']),
      F('archive','Government Archive', ['A Buried Treaty','Confidential Personnel Files','The Original Census','A Lost Land Deed','A Classified Correspondence','An Erased Prison Record'], { min:1 }),
      F('artifact','Rare Artifact', ['A Relic in a Glass Case','An Ancient Map','A Ceremonial Mask','A Famous Explorer’s Journal','A Meteorite Fragment','A Treasure with a False Replica']),
      F('convoy','Protected Convoy', ['An Armored Money Shipment','A Crate in the Third Car','Cargo Tracked by a Decoy','A Transport Manifest','The Prisoner’s Personal Effects','A Package with No Sender'], { min:5, anyTags:['travel','military','urban','commerce','industry'] }),
      F('museum','Public Exhibition', ['The Centerpiece Before Opening Night','A Trophy on Display','The Object Swapped at Midnight','An Item on Loan','A Signed First Edition','A Relic Behind Two Locks'], { min:3, anyTags:['urban','social','institution','entertainment','commerce'] }),
      F('casino','Casino or Gambling House', ['The House’s Reserve','A Marked Deck','A Winning Ticket','The Owner’s Private Ledger','A Secret High-Roller List','A Locked Chip Case'], { min:4, anyTags:['urban','commerce','social','entertainment'] }),
      F('smugglers','Smugglers’ Cache', ['Contraband Beneath the Dock','A Hidden Compartment','A Map of Secret Routes','The Captain’s Locked Chest','Cargo Hidden in Plain Sight','A Cache Buried Beyond the Tide'], { anyTags:['water','commerce','travel','ruins'] }),
      F('research','Research Facility', ['The Only Working Sample','A Restricted Blueprint','A Coded Specimen Log','A Formula Before Publication','A Prototype Locked in Cold Storage','An Unregistered Test Result'], { min:9, anyTags:['science','industry','institution','space'] })
    ],
    con: [
      F('patron','Wealthy Patron', ['A Forged Family Connection','A Fake Investment Opportunity','An Invented Rare Collection','A False Charitable Appeal','A Fabricated Inheritance','A Carefully Staged Emergency']),
      F('auction','Rigged Auction', ['A Counterfeit Masterpiece','A Shill Bidder','A Faked Provenance','A Swapped Winning Lot','A Secret Reserve Price','The Auctioneer’s Hidden Partner'], { anyTags:['social','commerce','urban','wealth','entertainment'] }),
      F('identity','False Identity', ['A Missing Noble’s Heir','A Fabricated Inspector','An Impostor Diplomat','A Stand-In for a Famous Person','The Person Everyone Expects','Two Rival Claimants']),
      F('merchandise','Counterfeit Merchandise', ['Fake Healing Tonics','A Bogus Treasure Map','Imitation Luxury Goods','Forged Credentials','A Copy of an Important Relic','An Entirely Invented Product']),
      F('miracle','Fake Miracle', ['A Staged Prophecy','A Hidden Mechanism Behind the Wonder','A False Saintly Relic','An Engineered Omen','A Miracle with a Paid Witness','A Predicted Eclipse'], { anyTags:['sacred','social','commerce','rural','urban','entertainment'] }),
      F('crisis','Manufactured Crisis', ['A Faked Monster Sighting','An Invented Supply Shortage','A Bogus Evacuation Order','An Alleged Contamination','A False Threat of Attack','A Staged Kidnapping']),
      F('favor','Political Favor', ['A Promised Appointment','A Secret Introduction','A Fake Endorsement','A Misrepresented Alliance','A Fabricated Letter of Support','An Invented Royal Connection'], { min:1 }),
      F('deal','Black-Market Deal', ['A Switch at the Handoff','An Empty Briefcase','A Fake Buyer','A Double-Sold Shipment','An Item That Never Existed','A Buyer with a Stolen Identity']),
      F('investment','Investment Scheme', ['A Nonexistent Mine','A Fictional Shipping Company','A Land Deal with Two Owners','A Fake Scientific Breakthrough','A Pump-and-Dump Rumor','A Pyramid of Promises'], { min:5 }),
      F('show','Staged Performance', ['A Fake Medium','A Rigged Contest','A Manufactured Rescue','A Rehearsed Public Meltdown','A Celebrity Impersonator','An Illusion Sold as Proof'], { anyTags:['entertainment','social','urban','commerce'] })
    ],
    rescue: [
      F('hostage','Hostage Situation', ['A Trade at Sunrise','The Hostages Have Been Moved','A Demanded Exchange','A Captor Who Refuses to Speak','One Hostage Is an Impostor','A Deadline No One Explains']),
      F('lost','Lost Traveler', ['Vanished on a Familiar Trail','The Last Campfire','A Map Marked with the Wrong Route','A Signal from an Impossible Location','Only Their Gear Was Found','Following a String of Trail Markers']),
      F('prisoner','Captured Ally', ['Held Behind the Enemy Lines','Moved During a Ceremony','Hidden in an Unmarked Cell','Escorted Through a Checkpoint','Traded Between Rival Factions','Questioned by an Unknown Captor']),
      F('child','Missing Child', ['Last Seen at the Festival','A Trail of Handmade Toys','A Note in a Child’s Handwriting','A Witness Who Saw Two Children','A Disappearance at Dusk','The Child Who Called for Help']),
      F('witness','Endangered Witness', ['Targeted Before Testimony','Hiding Under an Assumed Name','Wanted by Both Sides','The Only Person Who Knows the Truth','Protective Custody Compromised','Refusing to Be Rescued']),
      F('crew','Stranded Crew', ['Marooned on a Remote Shore','A Vessel That Ran Aground','A Silent Distress Signal','A Crew Divided into Two Groups','An Emergency Landing','Supply Reserves Running Out'], { anyTags:['travel','water','space','wilderness','remote'] }),
      F('miners','Trapped Workers', ['A Caved-In Tunnel','An Elevator That Never Returned','A Fire Behind a Sealed Door','A Flooding Lower Level','A Collapsed Shaft','A Failing Life-Support System'], { anyTags:['underground','industry','science','institution','space','ruins'] }),
      F('evacuation','Evacuation', ['Before the Bridge Falls','With Only One Route Out','An Isolated Hospital Ward','Before the Storm Arrives','With a Missing Passenger','Without Alerting the Threat']),
      F('creature','Kidnapped Creature', ['A Stolen Hatchling','An Animal Taken for a Private Zoo','A Sacred Beast in a Cage','A Missing Pack Leader','A Creature Sold at Auction','A Rare Specimen in Transit'], { anyTags:['wilderness','rural','water','commerce','science','entertainment'] }),
      F('dignitary','Abducted Dignitary', ['A Disguised Prisoner','A Ransom Paid Twice','The Abduction at a Banquet','A Fake Rescue Attempt','A Secret Transfer','An Heir Hidden by Loyalists'], { min:1 })
    ],
    escape: [
      F('prison','Imprisonment', ['Before the Morning Inspection','Through the Disused Passage','During a Guard Rotation','A Cellmate with a Hidden Key','A False Transfer Order','An Escape Route That Leads Elsewhere']),
      F('pursuit','Relentless Pursuit', ['A Hunter Who Knows the Route','Nowhere Safe after Dark','Pursued by Mistaken Allies','A Trail That Cannot Be Hidden','The Enemy Controls the Crossings','A Betrayal at the Safe House']),
      F('collapse','Collapsing Structure', ['A Stairway Already Gone','The Final Support Beam','A Flooding Basement','The Only Exit Is Sealed','Someone Refuses to Leave','A Map of Forgotten Tunnels']),
      F('hazard','Natural Hazard', ['Flash Flood','Wildfire','Blizzard','Sandstorm','Volcanic Eruption','Rising Tide']),
      F('siege','Surrounded by Enemies', ['The Last Gate Closes','A Secret Route through the Walls','The Enemy Offers Safe Passage','Supplies for One More Night','The Siege Ends at Dawn','An Escape Hidden in the Supply Run']),
      F('territory','Hostile Territory', ['A Border with New Patrols','A False Travel Permit','A Guide Who Changes Sides','The Only Pass Is Watched','A Trail of Abandoned Camps','A Race for Neutral Ground']),
      F('wreck','Crashed Transport', ['A Lifeboat with One Seat Missing','A Breakdown in Enemy Land','The Emergency Exit Is Jammed','A Missing Navigation Chart','A Radio That Broadcasts the Wrong Position','Cargo Blocking the Escape Route'], { anyTags:['travel','water','space','wilderness','remote'] }),
      F('labyrinth','Labyrinth / Maze', ['Doors That Rearrange','A Corridor with No Echo','Only One Safe Crossing','The Same Room Reappears','A Map That Is Almost Correct','A Path Marked by Old Bones']),
      F('containment','Containment Failure', ['Quarantine Doors Sealed','The Wrong Test Subject Released','Oxygen Levels Falling','An Automated Lockdown','An Alarm No One Can Silence','The Safe Zone Is Compromised'], { min:9, anyTags:['science','institution','industry','space'] }),
      F('vessel','Doomed Vessel', ['A Sinking Ship','An Engine Room Fire','A Hull Breach','A Mutiny in Progress','A Route into a Storm','The Last Lifeboat'], { anyTags:['water','travel','space'] })
    ],
    survival: [
      F('elements','Extreme Elements', ['A Whiteout Blizzard','A Brutal Heat Wave','A Season-Long Storm','A Sudden Deep Freeze','A Forest Fire','Unending Heavy Rain']),
      F('scarcity','Scarce Resources', ['The Last Water Source','Food Stores Destroyed','Spoiled Medicine','A Missing Supply Cache','Contaminated Water','One Shelter Too Few']),
      F('predators','Dangerous Wildlife', ['Something Circling Camp','A Migrating Stampede','A Territorial Apex Predator','Nesting Season','A Predator That Hunts in Groups','An Unknown Venomous Creature']),
      F('isolated','Isolation', ['No Route Back','A Map with a Missing Landmark','Cut Off by a Landslide','Communications Have Failed','The Only Guide Is Missing','All Markers Point the Wrong Way']),
      F('disease','Disease Outbreak', ['A Mystery Fever','Contaminated Food','An Illness with Unusual Timing','The Last Dose of Medicine','A Carrier Who Shows No Symptoms','A Quarantine in Question']),
      F('expedition','Stranded Expedition', ['The Guide Vanishes','A Camp Found Empty','The Route Takes Twice as Long','An Unexpected Second Group','Equipment Left Behind','The Expedition’s Records Are Wrong']),
      F('raiders','Hostile Neighbors', ['A Raid at Dusk','A False Offer of Shelter','A Stolen Supply Caravan','A Blockaded Water Source','Enemies Following Footprints','Two Rival Camps']),
      F('machine','Critical Equipment Failure', ['A Broken Water Purifier','The Only Engine Has Failed','A Heating System Breakdown','An Airlock That Will Not Seal','A Missing Power Cell','A Countdown to Total Shutdown'], { min:5, anyTags:['industry','science','space','travel','institution','urban'] }),
      F('catastrophe','Regional Catastrophe', ['The Dam Breaks','A Toxic Cloud','A Sudden Earthquake','A Meteor Strike','A Massive Landslide','A Tidal Surge']),
      F('territory','Predator Territory', ['The Nesting Grounds','An Ambush at the Watering Hole','A Trail of Bones','The Safest Route Is Claimed','An Animal That Never Sleeps','The Night Calls Grow Closer'])
    ],
    treasure: [
      F('relic','Lost Relic', ['A Saint’s Missing Icon','The Broken Coronation Crown','An Idol with No Known Origin','A Relic Hidden by Its Guardians','An Artifact from a Lost Culture','A Reliquary with Two Keys']),
      F('fortune','Buried Fortune', ['Coins Under an Old Oak','A Chest beneath the Tide Line','The Spoils of a Forgotten Battle','A Cache Hidden in a Wall','A Fortune Buried with False Markers','The Last Survivor’s Map']),
      F('map','Cryptic Map', ['A Map Written in Song','A Route Marked by Constellations','A Chart with One Island Missing','A Map Divided into Pieces','Directions Hidden in a Painting','A Map That Changes at Dawn']),
      F('tomb','Forgotten Tomb', ['A Burial Chamber Sealed from Within','A Tomb with an Empty Sarcophagus','The Last King’s Resting Place','A Shrine Beneath the Floor','A Forgotten Family Crypt','A Tomb Reached Only at Low Tide'], { anyTags:['ruins','underground','sacred','wilderness','fortified'] }),
      F('sunken','Sunken Treasure', ['A Wreck in Shallow Water','The Captain’s Iron Chest','A Bell Marked with Coordinates','A Map inside a Bottle','A Fleet Lost in a Storm','A Cache beneath a Reef'], { anyTags:['water'] }),
      F('inheritance','Missing Inheritance', ['A Will with an Extra Page','A Locked Box for the Wrong Heir','A Treasure Split between Rivals','The Estate’s Hidden Room','A Family Secret in the Attic','A Fortune Buried under an Alias'], { min:1 }),
      F('hoard','Smuggler’s Hoard', ['Goods under a False Floor','A Secret Warehouse Inventory','A Chain of Coastal Markers','A Crate with No Customs Seal','A Vault Known to Two Rivals','A Cache Traded for a Map']),
      F('collection','Lost Collection', ['The Explorer’s Missing Journals','A Library Lost in Transit','A Set of Matching Coins','The Last Masterwork','An Archive Hidden from Invaders','The Collector’s Final Shipment']),
      F('myth','Legendary Treasure', ['The Golden Fleece','A Sword with a False Legend','A Crown Said to Choose Its Wearer','A Cup Hidden from Kings','A Gem Called the Last Star','A Treasure No One May Own']),
      F('data','Lost Data Archive', ['The Only Surviving Backup','Coordinates to a Forgotten Base','A Founder’s Encrypted Diary','The Missing Navigation Database','A Data Core from a Dead Station','A Memory Chip with Erased Names'], { min:12, anyTags:['science','industry','urban','space','institution','ruins'] })
    ],
    bounty: [
      F('criminal','Fugitive Criminal', ['The Bandit with Three Aliases','An Escaped Master Thief','A Killer Moving Under False Papers','The Forger’s Last Known Location','An Outlaw Who Became a Folk Hero','A Fugitive Thought Dead']),
      F('soldier','Deserter / Renegade', ['A Captain with Stolen Orders','An Elite Scout Gone Missing','A Defector Seeking Asylum','A Mercenary Leader on the Run','A Traitor Carrying Secrets','A Renegade Who Claims Innocence']),
      F('beast','Dangerous Beast', ['The White Stag','A Maneater Near the Road','A Creature with a Famous Scar','A Beast with an Unusual Bounty','The Animal That Escaped Its Cage','The Last of a Feared Pack']),
      F('noble','Runaway VIP', ['An Heir Traveling Incognito','A Lord in Disguise','A Missing Diplomat','A Young Ruler Seeking Exile','A Patron Who Faked Their Death','The Target Who Hired a Decoy'], { min:1 }),
      F('construct','Rogue Machine', ['An Escaped Security Automaton','A Clockwork Servant with Secrets','A Drone That Refuses Recall','A War Machine with No Owner','An AI Hiding in a Small Device','A Factory Prototype'], { min:3, genres:['steampunk','scifi','fantasy'] }),
      F('witness','Wanted Witness', ['The Only Survivor','A Witness Bought by Both Sides','A Person with a Stolen Name','A Survivor Under Protective Custody','The Witness Who Will Not Testify','A Refugee with Classified Knowledge']),
      F('pirate','Pirate Captain', ['The Captain of the Black-Sailed Ship','A Raider Flying a False Flag','A Captain Who Never Goes Ashore','A Pirate with a Secret Island','The Mutineer Who Took Command','An Officer Turned Smuggler'], { anyTags:['water','commerce','travel','port'] }),
      F('rival','Rival Hunter', ['A Former Partner','A Hunter Who Always Arrives First','A Rival with a Forged Contract','A Bounty Already Claimed','The One Who Knows the Target Best','A Hunter Protecting the Quarry']),
      F('experiment','Escaped Subject', ['A Lab Subject with False Memories','A Dangerous Prototype','A Specimen with a Reward Tag','A Test Pilot Who Vanished','An Experiment That Can Speak','A Prisoner from a Closed Facility'], { min:9, anyTags:['science','urban','industry','space','institution'] }),
      F('fraud','Wanted Swindler', ['A Traveling Charlatan','The Impostor Inspector','A Fake Merchant Prince','A Fortune-Teller Who Fleeced a Town','An Inventor Selling Empty Boxes','A Marriage Scammer'])
    ],
    escort: [
      F('witness','Vulnerable Witness', ['Across Hostile Territory','Before the Trial','Without Revealing Their Identity','Through a Crowded Festival','With a Traitor in the Party','To a Meeting They Fear']),
      F('cargo','Valuable Cargo', ['A Crate That Must Stay Upright','An Unmarked Iron Chest','A Shipment with Decoy Wagons','Cargo That Attracts Thieves','A Package That Cannot Be Opened','The Only Known Sample']),
      F('envoy','Royal / State Envoy', ['A Peace Offer to the Enemy','A Visit under a False Name','An Unwelcome Marriage Proposal','A Mission to a Rival Court','A Letter with Two Seals','A Diplomat with a Secret Escort'], { min:1 }),
      F('prisoner','Prisoner Transport', ['A Prisoner Who Knows the Route','An Offer to Switch Prisoners','A Transport with a Hidden Passenger','A Jailbreak Planned Along the Way','A Prisoner Wanted by Two Factions','A Journey Without Chains']),
      F('medicine','Medical Shipment', ['Vaccines before a Deadline','The Last Herbal Remedy','A Fragile Organ Transport','Rare Antidote','A Supply Box with a Broken Seal','Medicine Needed on Both Sides']),
      F('message','Secret Message', ['A Letter Sewn into a Coat','Coordinates in a Music Box','A Code Only One Person Can Read','A Message That Must Stay Unopened','The Original Treaty','A Warning Someone Must Never See']),
      F('performer','Traveling Performers', ['A Headliner Who Cannot Be Seen','A Tour through Dangerous Territory','A Show Targeted by Rivals','A Performer Carrying a Secret','An Act with Exotic Animals','A Final Performance before Dawn'], { anyTags:['social','travel','entertainment','commerce'] }),
      F('artifact','Fragile Artifact', ['A Cracked Ancient Tablet','A Ceremonial Vessel','A Painting That Cannot Be Folded','A Glass Instrument','A One-of-a-Kind Fossil','An Idol with a Missing Base']),
      F('delegation','Diplomatic Delegation', ['Two Rivals Traveling Together','The Last Chance at Peace','A Treaty to Be Signed at Dawn','A Negotiator with a Price on Their Head','A Mission Hidden as a Trade Visit','An Escort across a Disputed Border'], { min:1 }),
      F('refugees','Evacuees / Refugees', ['A Caravan of Families','The Last Boat Out','An Injured Group Moving Slowly','Two Groups That Refuse to Travel Together','A Safe Haven Already Full','A Child Carrying the Only Map'])
    ],
    sabotage: [
      F('supplies','Supply Chain', ['A Warehouse of Rations','The Only Freshwater Source','A High-Value Shipment','A Bridge Used by Convoys','The Enemy’s Fuel Reserve','An Import Deal with One Weak Link']),
      F('communications','Communications', ['Signal Fires on the Ridge','A Courier Network','A Radio Relay','An Encoded Dispatch','A Telegraph Hub','The Commander’s Messenger']),
      F('power','Power Source', ['A Waterwheel at the Mill','A Generator with One Weak Valve','A Fuel Depot','An Unstable Reactor','A Citywide Substation','A Steam Engine Under Guard'], { min:3, anyTags:['industry','urban','science','space','institution','travel','military'] }),
      F('event','Public Event', ['A Tournament Final','A Grand Opening','A Procession','A Royal Ceremony','A Broadcast Address','The Main Stage before Showtime'], { anyTags:['social','entertainment','urban','commerce','sacred','institution'] }),
      F('industry','Industrial Operation', ['The Main Assembly Line','A Mine’s Ventilation System','A Precision Machine','A Shipment of Raw Materials','A Rival’s Secret Recipe','A Factory Shift Change'], { min:3, anyTags:['industry','science','urban','underground'] }),
      F('weapon','Military Project', ['A Prototype Siege Engine','A Weapons Shipment','The Fortress’s Main Gate','The Only Working Prototype','An Artillery Platform','A Hidden Ammunition Cache'], { anyTags:['military','fortified','industry','science','urban'] }),
      F('trade','Trade Route', ['A Toll Bridge','A River Crossing','A Shipment Tracking Ledger','A Smuggler’s Shortcut','A Caravan Departure','The Main Harbor Crane'], { anyTags:['commerce','water','travel','rural','urban','mountain'] }),
      F('ritual','Ritual / Ceremony', ['The Circle of Candles','A Consecration at Midnight','The Altar’s Missing Component','A Ceremony with a False Priest','The Procession’s Route','A Chant That Cannot Be Completed'], { anyTags:['sacred','ruins','forest','social','fortified'], magic:'some' }),
      F('surveillance','Surveillance Network', ['The City’s Central Cameras','A Security Drone Hub','A Secret Listening Station','The Facial Recognition Archive','A Network of Spy Devices','An Unregistered Satellite Link'], { min:12, anyTags:['urban','science','industry','space','military','institution'] }),
      F('research','Research Program', ['A Critical Trial Run','A Formula Before Publication','The Only Testing Chamber','A Hidden Funding Record','An Unlicensed Experiment','A Fragile First Prototype'], { min:9, anyTags:['science','industry','institution','space'] })
    ],
    defense: [
      F('settlement','Threatened Settlement', ['Raiders at Sunset','A Deadline for Tribute','The Bridge into Town','Only One Working Gate','A Threat from Within','Civilians Refusing to Evacuate']),
      F('caravan','Traveling Caravan', ['The Narrow Mountain Pass','A Night Ambush','A Decoy Caravan','A Broken Axle at Dusk','Bandits Disguised as Guards','A Wagon Carrying a Secret']),
      F('crossing','Strategic Crossing', ['The Last Bridge','A Mountain Pass','A Ferry with No Replacement','A Tunnel Entrance','A Canyon Bottleneck','The Only Road through the Marsh']),
      F('fort','Besieged Fortress', ['A Crumbling Outer Wall','A Betrayer at the Gate','The Last Supply Wagon','A Siege Engine Approaching','A Secret Tunnel under the Keep','A Relief Force That Never Arrives']),
      F('event','Public Gathering', ['The Festival Opening','A Tournament Crowd','A Peace Ceremony','A Parade with a Secret Threat','A Concert before a Storm','An Unwelcome Guest'], { anyTags:['social','entertainment','urban','commerce','sacred','institution'] }),
      F('secret','Protected Secret', ['A Hidden Safe House','A Sealed Archive','A Witness in Hiding','An Unopened Message','A Sacred Burial Site','A Laboratory with a Secret Entrance']),
      F('monster','Creature Attack', ['A Pack at the Walls','The Threat Beneath the Floor','A Beast That Returns Each Night','A Nest Near the Gate','An Animal Driven Mad','The Creature That Avoids Fire']),
      F('raiders','Organized Raiders', ['A Feint at the Main Gate','A Siege from Two Directions','Bandits with Inside Information','A Mercenary Company','An Army That Never Negotiates','A Captain with a Personal Grudge']),
      F('vip','High-Value Person', ['An Heir at a Wedding','A Witness before Testimony','A Commander Marked for Death','A Visiting Diplomat','A Celebrated Performer','A Scientist with a Bounty']),
      F('facility','Critical Facility', ['A Generator during a Blackout','A Flood Barrier','An Airlock Under Attack','A Water Purification Plant','A Medical Ward','The Only Communications Tower'], { min:5, anyTags:['science','industry','institution','space','urban','military'] })
    ],
    competition: [
      F('sport','Athletic Tournament', ['An Unbeaten Local Champion','A Disputed Final Round','An Injury before the Event','A Contest with a Secret Rule','Two Rivals on the Same Team','A Final Against the Host']),
      F('wits','Battle of Wits', ['A Riddle Contest','An Impossible Puzzle','A Debate with a Hidden Topic','A Chess Match for High Stakes','A Trial of Memory','A Contest Whose Rules Keep Changing']),
      F('craft','Craftsmanship Contest', ['An Unusual Material Challenge','A Masterwork Made in One Day','A Rival Accused of Cheating','A Judge with a Secret Preference','A Damaged Entry','A Rare Tool Shared by Everyone']),
      F('arts','Performance Contest', ['A Talent Show with a Surprise Judge','A Rival Band','An Ill-Timed Power Failure','A Famous Guest Performer','A Costume Mix-Up','A Performance with a Secret Message']),
      F('race','Race', ['Across a Dangerous Route','A Last-Minute Vehicle Swap','An Unknown Shortcut','A Race with Changing Checkpoints','An Underdog with a Strange Mount','A Rival Who Knows the Terrain']),
      F('cooking','Cooking Competition', ['A Mystery Ingredient','The Host’s Secret Recipe','A Sabotaged Pantry','A Dish for a Disguised Judge','A Team Missing Its Chef','The Final Round’s Forbidden Ingredient']),
      F('gambling','Games of Chance', ['A High-Stakes Card Table','A Rigged Wheel','A Tournament of Bluffing','A Wager That Changes the Stakes','A Host Who Never Loses','The Final Hand']),
      F('science','Invention Challenge', ['A Machine Built from Scrap','A Public Prototype Demo','A Race to Solve a Problem','A Rival’s Stolen Blueprint','A Prize for the Smallest Device','The Last Test Before Judging'], { min:5, anyTags:['science','industry','urban','institution','space'] }),
      F('hunt','Hunting Contest', ['The Rare White Beast','A Rival Team’s False Tracks','A Catch-and-Release Rule','A Hunt Before the Storm','A Creature That Must Not Be Hurt','A Prize Nobody Wants'], { anyTags:['wilderness','forest','mountain','rural','swamp','water','jungle'] }),
      F('political','Political Contest', ['A Public Debate','A Vote with a Missing Delegate','A Leadership Trial','An Election decided by One District','An Unusual Tie-Breaker','A Campaign Rumor'], { min:1, anyTags:['social','urban','institution','fortified','commerce'] })
    ],
    politics: [
      F('succession','Succession Crisis', ['Two Legitimate Heirs','A Missing Will','An Heir Who Refuses the Throne','A Ruler Declared Dead Too Soon','A Hidden Marriage Contract','An Adopted Claimant'], { min:1 }),
      F('summit','Diplomatic Summit', ['An Uninvited Delegation','Negotiations behind Locked Doors','A Disputed Seating Arrangement','The Host’s Secret Agenda','One Delegate Goes Missing','A Sudden Ultimatum']),
      F('corruption','Corruption Scandal', ['A Bribery Ledger','An Official Protecting a Relative','Missing Public Funds','A Contract Awarded in Secret','A Witness with Two Stories','A Whistleblower Under Threat']),
      F('treaty','Treaty Negotiations', ['A Border Dispute','A Trade Agreement','A Proposed Prisoner Exchange','One Clause Written in Secret','A Peace Deal with a Hidden Cost','A Signature Required by Sunrise']),
      F('vote','Power Struggle / Election', ['A Vote Decided by One Seat','A Candidate Disappears','A Secret Ballot with Duplicate Names','An Endorsement Bought Overnight','A Challenge to the Result','An Unexpected Third Candidate'], { min:1 }),
      F('factions','Rival Factions', ['Two Groups Claim One Territory','A Faction Split from Within','A Fragile Temporary Alliance','An Old Grudge Reopened','A Neutral Broker under Pressure','A Leader Suspected of Switching Sides']),
      F('espionage','Espionage', ['A Double Agent','A Message Swapped in Transit','A Spy Exposed at a Dinner Party','A Codebook in the Wrong Hands','An Informant Who Will Not Meet','A False Defector']),
      F('trade','Trade Dispute', ['An Embargo Threat','A Missing Shipment','A Guild That Refuses to Negotiate','Tariffs Raised Overnight','A Port Closed for Inspection','A Monopoly Challenged']),
      F('blackmail','Blackmail', ['Letters Hidden in a Wall','A Portrait That Proves Too Much','A Secret Family Connection','A Recording of a Private Meeting','A Debt No One Can Repay','A Scandal with Fabricated Evidence']),
      F('coup','Coup Plot', ['A General with Secret Support','A Planned Midnight Arrest','A Guard Unit Changes Allegiance','The Palace Gates Closed Early','A Plot Disguised as a Parade','A Counter-Coup in Preparation'], { min:1 })
    ]
  };

  return { STORY_TYPES, PERIODS, SETTINGS, FOCUSES };
})();

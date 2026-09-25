window.STATE_DATA = [
  {id:"01",name:"Alabama",abbr:"AL",capital:"Montgomery",region:"South Region",division:"East South Central Division"},
  {id:"02",name:"Alaska",abbr:"AK",capital:"Juneau",region:"West Region",division:"Pacific Division"},
  {id:"04",name:"Arizona",abbr:"AZ",capital:"Phoenix",region:"West Region",division:"Mountain Division"},
  {id:"05",name:"Arkansas",abbr:"AR",capital:"Little Rock",region:"South Region",division:"West South Central Division"},
  {id:"06",name:"California",abbr:"CA",capital:"Sacramento",region:"West Region",division:"Pacific Division"},
  {id:"08",name:"Colorado",abbr:"CO",capital:"Denver",region:"West Region",division:"Mountain Division"},
  {id:"09",name:"Connecticut",abbr:"CT",capital:"Hartford",region:"Northeast Region",division:"New England Division"},
  {id:"10",name:"Delaware",abbr:"DE",capital:"Dover",region:"South Region",division:"South Atlantic Division"},
  {id:"11",name:"District of Columbia",abbr:"DC",capital:"Washington, D.C.",region:"South Region",division:"South Atlantic Division",district:true},
  {id:"12",name:"Florida",abbr:"FL",capital:"Tallahassee",region:"South Region",division:"South Atlantic Division"},
  {id:"13",name:"Georgia",abbr:"GA",capital:"Atlanta",region:"South Region",division:"South Atlantic Division"},
  {id:"15",name:"Hawaii",abbr:"HI",capital:"Honolulu",region:"West Region",division:"Pacific Division"},
  {id:"16",name:"Idaho",abbr:"ID",capital:"Boise",region:"West Region",division:"Mountain Division"},
  {id:"17",name:"Illinois",abbr:"IL",capital:"Springfield",region:"Midwest Region",division:"East North Central Division"},
  {id:"18",name:"Indiana",abbr:"IN",capital:"Indianapolis",region:"Midwest Region",division:"East North Central Division"},
  {id:"19",name:"Iowa",abbr:"IA",capital:"Des Moines",region:"Midwest Region",division:"West North Central Division"},
  {id:"20",name:"Kansas",abbr:"KS",capital:"Topeka",region:"Midwest Region",division:"West North Central Division"},
  {id:"21",name:"Kentucky",abbr:"KY",capital:"Frankfort",region:"South Region",division:"East South Central Division"},
  {id:"22",name:"Louisiana",abbr:"LA",capital:"Baton Rouge",region:"South Region",division:"West South Central Division"},
  {id:"23",name:"Maine",abbr:"ME",capital:"Augusta",region:"Northeast Region",division:"New England Division"},
  {id:"24",name:"Maryland",abbr:"MD",capital:"Annapolis",region:"South Region",division:"South Atlantic Division"},
  {id:"25",name:"Massachusetts",abbr:"MA",capital:"Boston",region:"Northeast Region",division:"New England Division"},
  {id:"26",name:"Michigan",abbr:"MI",capital:"Lansing",region:"Midwest Region",division:"East North Central Division"},
  {id:"27",name:"Minnesota",abbr:"MN",capital:"Saint Paul",region:"Midwest Region",division:"West North Central Division"},
  {id:"28",name:"Mississippi",abbr:"MS",capital:"Jackson",region:"South Region",division:"East South Central Division"},
  {id:"29",name:"Missouri",abbr:"MO",capital:"Jefferson City",region:"Midwest Region",division:"West North Central Division"},
  {id:"30",name:"Montana",abbr:"MT",capital:"Helena",region:"West Region",division:"Mountain Division"},
  {id:"31",name:"Nebraska",abbr:"NE",capital:"Lincoln",region:"Midwest Region",division:"West North Central Division"},
  {id:"32",name:"Nevada",abbr:"NV",capital:"Carson City",region:"West Region",division:"Mountain Division"},
  {id:"33",name:"New Hampshire",abbr:"NH",capital:"Concord",region:"Northeast Region",division:"New England Division"},
  {id:"34",name:"New Jersey",abbr:"NJ",capital:"Trenton",region:"Northeast Region",division:"Middle Atlantic Division"},
  {id:"35",name:"New Mexico",abbr:"NM",capital:"Santa Fe",region:"West Region",division:"Mountain Division"},
  {id:"36",name:"New York",abbr:"NY",capital:"Albany",region:"Northeast Region",division:"Middle Atlantic Division"},
  {id:"37",name:"North Carolina",abbr:"NC",capital:"Raleigh",region:"South Region",division:"South Atlantic Division"},
  {id:"38",name:"North Dakota",abbr:"ND",capital:"Bismarck",region:"Midwest Region",division:"West North Central Division"},
  {id:"39",name:"Ohio",abbr:"OH",capital:"Columbus",region:"Midwest Region",division:"East North Central Division"},
  {id:"40",name:"Oklahoma",abbr:"OK",capital:"Oklahoma City",region:"South Region",division:"West South Central Division"},
  {id:"41",name:"Oregon",abbr:"OR",capital:"Salem",region:"West Region",division:"Pacific Division"},
  {id:"42",name:"Pennsylvania",abbr:"PA",capital:"Harrisburg",region:"Northeast Region",division:"Middle Atlantic Division"},
  {id:"44",name:"Rhode Island",abbr:"RI",capital:"Providence",region:"Northeast Region",division:"New England Division"},
  {id:"45",name:"South Carolina",abbr:"SC",capital:"Columbia",region:"South Region",division:"South Atlantic Division"},
  {id:"46",name:"South Dakota",abbr:"SD",capital:"Pierre",region:"Midwest Region",division:"West North Central Division"},
  {id:"47",name:"Tennessee",abbr:"TN",capital:"Nashville",region:"South Region",division:"East South Central Division"},
  {id:"48",name:"Texas",abbr:"TX",capital:"Austin",region:"South Region",division:"West South Central Division"},
  {id:"49",name:"Utah",abbr:"UT",capital:"Salt Lake City",region:"West Region",division:"Mountain Division"},
  {id:"50",name:"Vermont",abbr:"VT",capital:"Montpelier",region:"Northeast Region",division:"New England Division"},
  {id:"51",name:"Virginia",abbr:"VA",capital:"Richmond",region:"South Region",division:"South Atlantic Division"},
  {id:"53",name:"Washington",abbr:"WA",capital:"Olympia",region:"West Region",division:"Pacific Division"},
  {id:"54",name:"West Virginia",abbr:"WV",capital:"Charleston",region:"South Region",division:"South Atlantic Division"},
  {id:"55",name:"Wisconsin",abbr:"WI",capital:"Madison",region:"Midwest Region",division:"East North Central Division"},
  {id:"56",name:"Wyoming",abbr:"WY",capital:"Cheyenne",region:"West Region",division:"Mountain Division"}
];

window.BUNDLED_SPELLING_WORDS = ["police","promise","reply","slight","behind","child","mire","cyclone","sighing","satisfy","lightning","die","rind","thy","untie","whine","divide","decide","sign","thigh"];
const CARTOON_DOG_HEELER_WORDS = ["sheaf","were","between","extreme","turkey","trolley","wheat","feast","copy","astronomy","complete","envy","money","sincere","speech","kneel","tease","freeze","barley","empty"];

window.AUDIO_PACKS = {
  "cartoon-dog-heeler": {
    label:"Cartoon Dog Heeler",
    sampleWord:"between",
    words:CARTOON_DOG_HEELER_WORDS,
    spelling:Object.fromEntries(CARTOON_DOG_HEELER_WORDS.map(word=>[word,`audio/cartoon-dog-heeler/spelling/${word}.mp3`])),
    poems:{"the-crocodile":"audio/cartoon-dog-heeler/poems/the-crocodile.mp3"}
  },
  "william-cypher": {
    label:"William Cypher",
    sampleWord:"cyclone",
    words:window.BUNDLED_SPELLING_WORDS,
    spelling:Object.fromEntries(window.BUNDLED_SPELLING_WORDS.map(word=>[word,`audio/william-cypher/spelling/${word}.mp3`])),
    poems:{"the-crocodile":"audio/william-cypher/poems/the-crocodile.mp3"}
  },
  "circuit-sentinel": {
    label:"Circuit Sentinel",
    sampleWord:"police",
    words:window.BUNDLED_SPELLING_WORDS,
    spelling:Object.fromEntries(window.BUNDLED_SPELLING_WORDS.map(word=>[word,`audio/circuit-sentinel/spelling/${word}.mp3`])),
    poems:{"the-crocodile":"audio/circuit-sentinel/poems/the-crocodile.mp3"}
  }
};

window.DEFAULT_POEMS = [{
  id:"the-crocodile",
  title:"The Crocodile",
  author:"Lewis Carroll",
  audio:"audio/circuit-sentinel/poems/the-crocodile.mp3",
  text:"How doth the little crocodile\nImprove his shining tail,\nAnd pour the waters of the Nile\nOn every golden scale!\n\nHow cheerfully he seems to grin,\nHow neatly spreads his claws,\nAnd welcomes little fishes in\nWith gently smiling jaws!"
},{
  id:"brave-little-steps",
  title:"Brave Little Steps",
  author:"Learning Arcade",
  text:"A little step, a little try,\nA question asked: how, when, and why?\nI do not need to know it all—\nI learn each time I rise from a fall.\n\nWith every word and fact I find,\nI build a brave and growing mind."
}];

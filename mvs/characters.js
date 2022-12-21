require('dotenv').config();
const Characters = {
    Shaggy: { name: "Shaggy", slug: "character_shaggy", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/ShaggyDefault.png?raw=true`, emote: "<:ShaggyLogo:1017563955016781915>"},
    Reindog: { name: "Reindog", slug: "character_creature", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/ReindogDefault.png?raw=true`, emote: "<:ReindogLogo:980375104703852605>"},
    StevenUniverse: { name: "Steven Universe", slug: "character_steven", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/StevenDefault.png?raw=true`, emote: "<:StevenLogo:1001121366386417705>"},
    Garnet: { name: "Garnet", slug: "character_garnet" , imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/GarnetDefault.png?raw=true`, emote: "<:GarnetLogo:980374527806697482>"},
    HarleyQuinn: { name: "Harley Quinn", slug: "character_harleyquinn", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/HarleyQuinnDefault.png?raw=true`, emote: "<:HarleyLogo:980374594336727070>"},
    AryaStark: { name: "Arya Stark", slug: "character_arya", imagepath: `https://github.com/TaetaeMVS/mvsoce/raw/main/assets/AryaDefault.png?raw=true`, emote: "<:AryaLogo:980374195798171710>"},
    Finn: { name: "Finn", slug: "character_finn", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/FinnDefault.png?raw=true`, emote: "<:FinnLogo:1017563948456890368>"},
    Taz: { name: "Taz", slug: "character_taz", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/TazDefault.png?raw=true`, emote: "<:TazLogo:1001121434636144752>" },
    WonderWoman: { name: "Wonder Woman", slug: "character_wonder_woman", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/WonderWomanDefault.png?raw=true`, emote: "<:WonderWomanLogo:1001121636164063246>" },
    Jake: { name: "Jake", slug: "character_jake", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/JakeDefault.png?raw=true`, emote: "<:JakeLogo:980375030947004416>" },
    Superman: { name: "Superman", slug: "character_superman", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/SupermanDefault.png?raw=true`, emote: "<:SupermanLogo:1001121284085788683>" },
    Batman: { name: "Batman", slug: "character_batman", imagepath: `https://github.com/TaetaeMVS/mvsoce/raw/main/assets/BatmanDefault.png?raw=true`, emote: "<:BatmanLogo:980374315717500928>"},
    BugsBunny: { name: "BugsBunny", slug: "character_bugs_bunny", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/BugsDefault.png?raw=true`, emote: "<:BugsLogo:980374385347145798>" },
    TomAndJerry: { name: "Tom & Jerry", slug: "character_tom_and_jerry", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/Tom&JerryDefault.png?raw=true`, emote: "<:TomJerryLogo:1001121508850159636>" },
    Velma: { name: "Velma", slug: "character_velma", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/VelmaDefault.png?raw=true`, emote: "<:VelmaLogo:1017563961350176808>" },
    IronGiant: { name: "Iron Giant", slug: "character_C017", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/IronGiantDefault.png?raw=true`, emote: "<:IronGiantLogo:1001745826353254410>" },
    LebronJames: { name: "Lebron James", slug: "character_c16", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/LeBronJamesDefault.png?raw=true`, emote: "<:LeBronLogo:1001746012131569664>" },
    RickSanchez: { name: "Rick Sanchez", slug: "character_C020", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/RickDefault.png?raw=true`, emote: "<:RickLogo:1024529297765060608>" },
    Stripe: { name: "Stripe", slug: "character_C023B", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/StripeDefault.png?raw=true`, emote: "<:StripeLogo:1029907875042177094>"},
    Marvin: { name: "Marvin", slug: "character_C018", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/MarvinDefault.png?raw=true`, emote: "<:MarvinLogo:1045501012737269770>" },
    BlackAdam: { name: "Black Adam", slug: "character_C021", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/BlackAdamDefault.png?raw=true`, emote: "<:BlackAdamLogo:1036903155545411634>" },
    Morty: { name: "Morty", slug: "character_c019", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/MortyDefault.png?raw=true`, emote: "<:MortyLogo:1011836360866398269>"},
    Gizmo: { name: "Gizmo", slug: "character_C023A", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/GizmoDefault.png?raw=true`, emote: "<:GizmoLogo:1017631697631719434>"},
};

function getCharacterFromSlug(slug) {
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return char;
        }
    }
}

function slugToDisplay(slug) {
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return Characters[char].name;
        }
    }
}

function displayToSlug(name) {
    for (const char in Characters) {
        if (Characters[char].name === name) {
            return Characters[char].slug;
        }
    }
}

function getImagePath(character) {
    slug = displayToSlug(character);
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return Characters[char].imagepath;
        }
    }
}

function getEmote(character) {
    slug = displayToSlug(character);
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return Characters[char].emote;
        }
    }
}

module.exports.getCharacterFromSlug = getCharacterFromSlug;
module.exports.slugToDisplay = slugToDisplay;
module.exports.displayToSlug = displayToSlug;
module.exports.getImagePath = getImagePath;
module.exports.getEmote = getEmote;
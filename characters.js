require('dotenv').config();
const Characters = {
    Shaggy: { name: "Shaggy", slug: "character_shaggy", imagepath: `${process.env.assetspath}shaggydefault.png`},
    Reindog: { name: "Reindog", slug: "character_creature", imagepath: `${process.env.assetspath}reindogdefault.png`},
    StevenUniverse: { name: "Steven Universe", slug: "character_steven", imagepath: `${process.env.assetspath}stevenuniversedefault.png`},
    Garnet: { name: "Garnet", slug: "character_garnet" , imagepath: `${process.env.assetspath}garnetdefault.png`},
    HarleyQuinn: { name: "Harley Quinn", slug: "character_harleyquinn", imagepath: `${process.env.assetspath}harleyquinndefault.png` },
    AryaStark: { name: "Arya Stark", slug: "character_arya", imagepath: `${process.env.assetspath}aryadefault.png` },
    Finn: { name: "Finn", slug: "character_finn", imagepath: `${process.env.assetspath}finndefault.png` },
    Taz: { name: "Taz", slug: "character_taz", imagepath: `${process.env.assetspath}tazdefault.png` },
    WonderWoman: { name: "Wonder Woman", slug: "character_wonder_woman", imagepath: `${process.env.assetspath}wonderwomandefault.png` },
    Jake: { name: "Jake", slug: "character_jake", imagepath: `${process.env.assetspath}jakedefault.png` },
    Superman: { name: "Superman", slug: "character_superman", imagepath: `${process.env.assetspath}supermandefault.png` },
    Batman: { name: "Batman", slug: "character_batman", imagepath: `${process.env.assetspath}batmandefault.png` },
    BugsBunny: { name: "BugsBunny", slug: "character_bugs_bunny", imagepath: `${process.env.assetspath}bugsdefault.png` },
    TomAndJerry: { name: "Tom & Jerry", slug: "character_tom_and_jerry", imagepath: `${process.env.assetspath}tom&jerrydefault.png` },
    Velma: { name: "Velma", slug: "character_velma", imagepath: `${process.env.assetspath}velmadefault.png` },
    IronGiant: { name: "Iron Giant", slug: "character_C017", imagepath: `${process.env.assetspath}irongiantdefault.png` },
    LebronJames: { name: "Lebron James", slug: "character_c16", imagepath: `${process.env.assetspath}lebronjamesdefault.png` },
    RickSanchez: { name: "Rick Sanchez", slug: "character_C020", imagepath: `${process.env.assetspath}rickdefault.png` },
    Stripe: { name: "Stripe", slug: "character_C023B", imagepath: `${process.env.assetspath}stripedefault.png` },
    Marvin: { name: "Marvin", slug: "character_C018", imagepath: `${process.env.assetspath}marvindefault.png` },
    BlackAdam: { name: "Black Adam", slug: "character_C021", imagepath: `${process.env.assetspath}blackadamdefault.png` },
    Morty: { name: "Morty", slug: "character_c019", imagepath: `${process.env.assetspath}mortydefault.png` },
    Gizmo: { name: "Gizmo", slug: "character_C023A", imagepath: `${process.env.assetspath}gizmodefault.png` },
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

function getImagePathFromSlug(slug) {
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return Characters[char].imagepath;
        }
    }
}
module.exports.getCharacterFromSlug = getCharacterFromSlug;
module.exports.slugToDisplay = slugToDisplay;
module.exports.displayToSlug = displayToSlug;
module.exports.getImagePathFromSlug = getImagePathFromSlug;
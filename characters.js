require('dotenv').config();
const Characters = {
    Shaggy: { name: "Shaggy", slug: "character_shaggy", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/ShaggyDefault.png?raw=true`},
    Reindog: { name: "Reindog", slug: "character_creature", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/ReindogDefault.png?raw=true`},
    StevenUniverse: { name: "Steven Universe", slug: "character_steven", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/StevenDefault.png?raw=true`},
    Garnet: { name: "Garnet", slug: "character_garnet" , imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/GarnetDefault.png?raw=true`},
    HarleyQuinn: { name: "Harley Quinn", slug: "character_harleyquinn", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/HarleyQuinnDefault.png?raw=true` },
    AryaStark: { name: "Arya Stark", slug: "character_arya", imagepath: `https://github.com/TaetaeMVS/mvsoce/raw/main/assets/AryaDefault.png?raw=true` },
    Finn: { name: "Finn", slug: "character_finn", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/FinnDefault.png?raw=true` },
    Taz: { name: "Taz", slug: "character_taz", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/TazDefault.png?raw=true` },
    WonderWoman: { name: "Wonder Woman", slug: "character_wonder_woman", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/WonderWomanDefault.png?raw=true` },
    Jake: { name: "Jake", slug: "character_jake", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/JakeDefault.png?raw=true` },
    Superman: { name: "Superman", slug: "character_superman", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/SupermanDefault.png?raw=true` },
    Batman: { name: "Batman", slug: "character_batman", imagepath: `https://github.com/TaetaeMVS/mvsoce/raw/main/assets/BatmanDefault.png?raw=true` },
    BugsBunny: { name: "BugsBunny", slug: "character_bugs_bunny", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/BugsDefault.png?raw=true` },
    TomAndJerry: { name: "Tom & Jerry", slug: "character_tom_and_jerry", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/Tom&JerryDefault.png?raw=true` },
    Velma: { name: "Velma", slug: "character_velma", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/VelmaDefault.png?raw=true` },
    IronGiant: { name: "Iron Giant", slug: "character_C017", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/IronGiantDefault.png?raw=true` },
    LebronJames: { name: "Lebron James", slug: "character_c16", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/LeBronJamesDefault.png?raw=true` },
    RickSanchez: { name: "Rick Sanchez", slug: "character_C020", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/RickDefault.png?raw=true` },
    Stripe: { name: "Stripe", slug: "character_C023B", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/StripeDefault.png?raw=true` },
    Marvin: { name: "Marvin", slug: "character_C018", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/MarvinDefault.png?raw=true` },
    BlackAdam: { name: "Black Adam", slug: "character_C021", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/BlackAdamDefault.png?raw=true` },
    Morty: { name: "Morty", slug: "character_c019", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/MortyDefault.png?raw=true` },
    Gizmo: { name: "Gizmo", slug: "character_C023A", imagepath: `https://github.com/TaetaeMVS/mvsoce/blob/main/assets/GizmoDefault.png?raw=true` },
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
module.exports.getCharacterFromSlug = getCharacterFromSlug;
module.exports.slugToDisplay = slugToDisplay;
module.exports.displayToSlug = displayToSlug;
module.exports.getImagePath = getImagePath;
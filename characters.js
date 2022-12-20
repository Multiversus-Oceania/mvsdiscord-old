const Characters = {
    Shaggy: { name: "Shaggy", slug: "character_shaggy" },
    Reindog: { name: "Reindog", slug: "character_creature" },
    StevenUniverse: { name: "Steven Universe", slug: "character_steven" },
    Garnet: { name: "Garnet", slug: "character_garnet" },
    HarleyQuinn: { name: "Harley Quinn", slug: "character_harleyquinn" },
    AryaStark: { name: "Arya Stark", slug: "character_arya" },
    Finn: { name: "Finn", slug: "character_finn" },
    Taz: { name: "Taz", slug: "character_taz" },
    WonderWoman: { name: "Wonder Woman", slug: "character_wonder_woman" },
    Jake: { name: "Jake", slug: "character_jake" },
    Superman: { name: "Superman", slug: "character_superman" },
    Batman: { name: "Batman", slug: "character_batman" },
    BugsBunny: { name: "BugsBunny", slug: "character_bugs_bunny" },
    TomAndJerry: { name: "Tom & Jerry", slug: "character_tom_and_jerry" },
    Velma: { name: "Velma", slug: "character_velma" },
    IronGiant: { name: "Iron Giant", slug: "character_C017" },
    LebronJames: { name: "Lebron James", slug: "character_c16" },
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

module.exports.getCharacterFromSlug = getCharacterFromSlug;
module.exports.slugToDisplay = slugToDisplay;
module.exports.displayToSlug = displayToSlug;
// custom.ts
// Custom MakeCode extension file

class CraftPattern {
    patternText: String
    public constructor(patternText: String) {
        this.patternText = patternText;
    }
}

//% weight=200 color="#0096FF" icon="\uf126" block="Hour of AI"
namespace haiInputs {

    /**
     * This function takes
     */
    //% block="craft with %n"
    //% block.loc.he="צור עם %n"
    //% block.loc.he-IL="צור עם %n"
    //% n.shadow="ghostBlock"
    //% color="#0096FF"
    export function craftWith(n: number): void {
        player.execute(`scoreboard players set .output${n} global 1`);
    }

}

//% weight=200 color="#0096FF" icon="\uf126" block="Hour of AI Python"
namespace ai {

    const items: { [key: string]: string } = {
        'oak_planks': '1',
        'cobblestone': '3',
        'oak_log': '1',
        'birch_log': '2',
        'acacia_log': '3',
        'coal_ore': '4',
        'iron_ore': '5',
        'wool': '6',
        'grass': '0',
        'lava': '0',
        'soul_sand': '0',
        'coal': '21',
        'iron_ingot': '22',
        'stick': '2',
        'wood_pickaxe': '1',
        'wood_axe': '2',
        'wood_shovel': '3',
        'wood': '1'
    }

    const crafting_recipes: { [key: string]: string } = {
        'BBBB': '4', // crafting bench
        'OOOOBOOBO': '5', // stick or torch
        'BBBOBOOBO': '6', // pickaxe
        'BBOOBOOBO': '7', // axe
        'OBOOBOOBO': '8', // shovel
        'BBOBBOBBO': '9', // door
        'BBBBOBBBB': '10', // furnace
        'OOOBBBBBB': '11', // bed
        'OOOOBOOOB': '12', // shears
        'OOOB': '13' // plank
    }

    /**
     * This function makes an API request.
     *
     * Usage Example:
     * ai.make_api_request(
     *     api_url,
     *     api_key,
     *     api_endpoint,
     *     training_data)
     *
     * api_endpoint: Available endpoints are 'classify', 'crafting' or 'upgrade'.
     * 
     * training_data should be a list of training_type:training_value key pairs.
     * Example:
     * training_data = {
     *     'wood': 'oak_log'
     * }
     */
    export function make_api_request(api_url: string, api_key: string, api_endpoint: string, data: { [key: string]: string }): void {
        if (api_url !== 'minecraft://agent.ai/') {
            player.execute(`/title @p title §6404 Not Found:`);
            player.execute(`/title @p subtitle §6The requested URL ${api_url} was not found on this server.`);

        } else if (api_endpoint !== "classify" && api_endpoint !== "crafting" && api_endpoint !== "upgrade") {
            player.execute(`/title @p title §6Invalid endpoint:`);
            player.execute(`/title @p subtitle §6'${api_endpoint}'. Available endpoints are 'classify', 'crafting' or 'upgrade'.`);

        } else {
            if (api_endpoint == "classify") {

                const keys = Object.keys(data);
                for (const key of keys) {
                    // Trim the value to remove any accidental leading/trailing whitespace.
                    const value = data[key].trim();

                    // --- Validation Check ---
                    // Before using the value, check if it exists as a key in our 'items' list.
                    if (items[value] === undefined) {
                        // If it doesn't exist, show an error to the player with the original (untrimmed) value.
                        player.execute(`/title @p title §6Invalid Item Name:`);
                        player.execute(`/title @p subtitle §6'${data[key]}' is not a valid item for classification.`);
                        return; // Stop processing immediately
                    }

                    // This line will now only run if the value is valid.
                    player.execute(`scoreboard players set .output${items[value]} global 1`);
                }

            } else if (api_endpoint == "crafting") {

                const keys = Object.keys(data);
                for (const key of keys) {
                    // Trim the value to remove any accidental leading/trailing whitespace.
                    let value = data[key].trim();
                    value = value.split("\n").join("");
                    value = value.split(" ").join("");
                    value = value.split("\t").join("");
                    // --- Validation Check ---
                    // Before using the value, check if it exists as a key in our 'items' list.
                    if (crafting_recipes[value] === undefined) {
                        // If it doesn't exist, show an error to the player with the original (untrimmed) value.
                        player.execute(`/title @p title §6Invalid Crafting Recipe:`);
                        player.execute(`/title @p subtitle §6The passed pattern is not a valid crafting recipe.`);
                        return; // Stop processing immediately
                    }

                    // This line will now only run if the value is valid.
                    player.execute(`scoreboard players set .output${crafting_recipes[value]} global 1`);
                }
            } else if (api_endpoint == "upgrade") {
                const keys = Object.keys(data);
                for (const key of keys) {
                    // Trim the value to remove any accidental leading/trailing whitespace.
                    const value = data[key].trim();

                    // --- Validation Check ---
                    // Before using the value, check if it exists as a key in our 'items' list.
                    if (items[value] === undefined || items[value] !== '3') {
                        // If it doesn't exist, show an error to the player with the original (untrimmed) value.
                        player.execute(`/title @p title §6Invalid Upgrade Type:`);
                        player.execute(`/title @p subtitle §6'${value}' is not a valid upgrade.`);
                        return; // Stop processing immediately
                    }

                    // This line will now only run if the value is valid.
                    player.execute(`scoreboard players set .output${items[value]} global 1`);
                }
            }
        }
    }
}



//% weight=200 color="#008106" icon="\uf126" block="Hour of AI"
namespace hai {

    /**
     * Training Module
     */
    //% block="training module"
    //% block.loc.he="מודול אימון"
    //% block.loc.he-IL="מודול אימון"
    //% color="#0096FF"
    //% blockId=on_training_start 
    export function trainingStart(handler:() => void) {
        handler();
    }

    // INPUTS
    // These functions set scoreboard values based on user selections.

    /**
     * Select block to craft with.
     */
    //% block="craft with %n"
    //% block.loc.he="צור עם %n"
    //% block.loc.he-IL="צור עם %n"
    //% n.shadow="ghostBlock"
    //% color="#0096FF"
    export function craftWith(n: number): void {
        player.execute(`scoreboard players set .output${n} global 1`);
    }

    /**
     * Train agent crafting.
     */
    //% block="crafting grid %pattern"
    //% block.loc.he="רשת יצירה %pattern"
    //% block.loc.he-IL="רשת יצירה %pattern"
    //% blockid="craft"
    //% color="#0096FF"
    export function crafting(pattern: CraftPattern): void {

        // This simple logic removes space delimiters and trims extra newlines.
        const normalizedPattern = pattern.patternText
            .split(' ').join('')
            .trim();

        // This if/else if chain should now work perfectly.
        if (
            normalizedPattern === `##\n##` ||             // The original 2x2 pattern
            normalizedPattern === `##.\n##.\n...` ||    // Top-left 2x2 in a 3x3
            normalizedPattern === `.##\n.##\n...` ||    // Top-right 2x2 in a 3x3
            normalizedPattern === `...\n##.\n##.` ||    // Bottom-left 2x2 in a 3x3
            normalizedPattern === `...\n.##\n.##`      // Bottom-right 2x2 in a 3x3
        ) {
            // Crafted crafting bench
            player.execute(`scoreboard players set .output4 global 1`);
        } else if (
            normalizedPattern === `#.\n#.` || normalizedPattern === `.#\n.#` || // Stick patterns for 2x2
            normalizedPattern === `#..\n#..\n...` || normalizedPattern === `.#.\n.#.\n...` ||
            normalizedPattern === `..#\n..#\n...` || normalizedPattern === `...\n#..\n#..` ||
            normalizedPattern === `...\n.#.\n.#.` || normalizedPattern === `...\n..#\n..#`
        ) {
            // Crafted stick or torch
            player.execute(`scoreboard players set .output5 global 1`);
        } else if (normalizedPattern === `###\n.#.\n.#.`) {
            // Crafted pickaxe
            player.execute(`scoreboard players set .output6 global 1`);
        } else if (normalizedPattern === `##.\n##.\n.#.` || normalizedPattern === `.##\n.##\n.#.`) {
            // Crafted axe
            player.execute(`scoreboard players set .output7 global 1`);
        } else if (
            normalizedPattern === `.#.\n.#.\n.#.` || normalizedPattern === `#..\n#..\n#..` ||
            normalizedPattern === `..#\n..#\n..#`
        ) {
            // Crafted shovel
            player.execute(`scoreboard players set .output8 global 1`);
        } else if (
            normalizedPattern === `##.\n##.\n##.` || normalizedPattern === `.##\n.##\n.##`
        ) {
            // Crafted door
            player.execute(`scoreboard players set .output9 global 1`);
        } else if (
            normalizedPattern === `###\n#.#\n###`
        ) {
            // Crafted furnace
            player.execute(`scoreboard players set .output10 global 1`);
        } else if (
            normalizedPattern === `...\n###\n###` || normalizedPattern === `###\n###\n...`
        ) {
            // Crafted bed
            player.execute(`scoreboard players set .output11 global 1`);
        } else if (
            // Shears Patterns
            // 2x2 Grid
            normalizedPattern === `#.\n.#` ||
            normalizedPattern === `.#\n#.` ||

            // 3x3 Grid (Top-Left to Bottom-Right Diagonal)
            normalizedPattern === `#..\n.#.\n...` ||
            normalizedPattern === `.#.\n..#\n...` ||
            normalizedPattern === `...\n#..\n.#.` ||
            normalizedPattern === `...\n.#.\n..#` ||

            // 3x3 Grid (Top-Right to Bottom-Left Diagonal)
            normalizedPattern === `.#.\n#..\n...` ||
            normalizedPattern === `..#\n.#.\n...` ||
            normalizedPattern === `...\n.#.\n#..` ||
            normalizedPattern === `...\n..#\n.#.`
        ) {
            // Crafted shears
            player.execute(`scoreboard players set .output12 global 1`);
        } else if (
            normalizedPattern === `#..\n...\n...` ||
            normalizedPattern === `.#.\n...\n...` ||
            normalizedPattern === `..#\n...\n...` ||
            normalizedPattern === `...\n#..\n...` ||
            normalizedPattern === `...\n.#.\n...` ||
            normalizedPattern === `...\n..#\n...` ||
            normalizedPattern === `...\n...\n#..` ||
            normalizedPattern === `...\n...\n.#.` ||
            normalizedPattern === `...\n...\n..#` ||
            normalizedPattern === `#.\n..` ||
            normalizedPattern === `.#\n..` ||
            normalizedPattern === `..\n.#` ||
            normalizedPattern === `..\n#.`
        ) {
            // Crafted plank
            player.execute(`scoreboard players set .output13 global 1`);
        } else {
            // Pattern did not match any recipe
            player.execute(`scoreboard players set .output0 global 1`);
        }
    }

    /**
     * Classify a wood log.
     */
    //% block="classify %n as wood"
    //% block.loc.he="סווג %n כעץ"
    //% block.loc.he-IL="סווג %n כעץ"
    //% n.shadow="ghostBlock"
    //% color="#0096FF"
    export function classifyWood(n: number): void {
        player.execute(`scoreboard players set .output${n} global 1`);
    }

    /**
    * Upgrade tools material.
    */
    //% block="upgrade %t to %m"
    //% block.loc.he="שדרג %t ל-%m"
    //% block.loc.he-IL="שדרג %t ל-%m"
    //% t.shadow="ghostItem"
    //% m.shadow="ghostBlock"
    //% color="#0096FF"   
    export function upgradeTool(t: number, m: number): void {
        player.execute(`scoreboard players set .output${t} global ${m}`);
    }

    /**
    * House Materials
    */
    //% block="building material %b"
    //% block.loc.he="חומר בנייה %b"
    //% block.loc.he-IL="חומר בנייה %b"
    //% b.shadow="ghostBlock"
    //% color="#0096FF"   
    export function buildingMaterials(b: number): void {
        player.execute(`scoreboard players set .output${b} global 1`);
    }

    /**
    * Classify as ore
    */
    //% block="classify %b as ore"
    //% block.loc.he="סווג %b כעפרה"
    //% block.loc.he-IL="סווג %b כעפרה"
    //% b.shadow="ghostBlock"
    //% color="#0096FF"   
    export function classifyOre(b: number): void {
        player.execute(`scoreboard players set .output${b} global 1`);
    }

    //VALUES
    // These functions return constant values representing different items.

    // BLOCKS

    /**
     * Select Wood
     */
    //% block="`custom.PlanksOak` wood"
    //% block.loc.he="`custom.PlanksOak` עץ"
    //% block.loc.he-IL="`custom.PlanksOak` עץ"
    export function wood(): number {
        return 1;
    }

    /**
     * Select Cobblestone
     */
    //% block="`custom.Cobblestone` cobblestone"
    //% block.loc.he="`custom.Cobblestone` אבן מסותתת"
    //% block.loc.he-IL="`custom.Cobblestone` אבן מסותתת"
    export function cobblestone(): number {
        return 3;
    }

    /**
     * Select Oak Log
     */
    //% block="`custom.logOak` oak log"
    //% block.loc.he="`custom.logOak` גזע אלון"
    //% block.loc.he-IL="`custom.logOak` גזע אלון"
    //% blockId=oaklog
    export function logOak(): number {
        return 1;
    }

    /**
     * Select Birch Log
     */
    //% block="`custom.logBirch` birch log"
    //% block.loc.he="`custom.logBirch` גזע ליבנה"
    //% block.loc.he-IL="`custom.logBirch` גזע ליבנה"
    //% blockId=birchlog
    export function logBirch(): number {
        return 2;
    }

    /**
     * Select Acacia Log
     */
    //% block="`custom.logAcacia` acacia log"
    //% block.loc.he="`custom.logAcacia` גזע שיטה"
    //% block.loc.he-IL="`custom.logAcacia` גזע שיטה"
    //% blockId=acacialog
    export function logAcacia(): number {
        return 3;
    }

    /**
     * Select Coal Ore
     */
    //% block="`custom.CoalOre` coal ore"
    //% block.loc.he="`custom.CoalOre` עפרת פחם"
    //% block.loc.he-IL="`custom.CoalOre` עפרת פחם"
    //% blockId=coalore
    export function coalOre(): number {
        return 4;
    }

    /**
     * Select Iron Ore
     */
    //% block="`custom.IronOre` iron ore"
    //% block.loc.he="`custom.IronOre` עפרת ברזל"
    //% block.loc.he-IL="`custom.IronOre` עפרת ברזל"
    //% blockId=ironore
    export function ironOre(): number {
        return 5;
    }

    /**
     * Select Wool
     */
    //% block="`custom.Wool` wool"
    //% block.loc.he="`custom.Wool` צמר"
    //% block.loc.he-IL="`custom.Wool` צמר"
    //% blockId=wool
    export function wool(): number {
        return 6;
    }

    /**
     * Select Grass
     */
    //% block="`custom.Grass` grass"
    //% block.loc.he="`custom.Grass` דשא"
    //% block.loc.he-IL="`custom.Grass` דשא"
    //% blockId=grass
    export function grass(): number {
        return 0;
    }

    /**
     * Select Lava
     */
    //% block="`custom.Lava` lava"
    //% block.loc.he="`custom.Lava` לבה"
    //% block.loc.he-IL="`custom.Lava` לבה"
    //% blockId=lava
    export function lava(): number {
        return 0;
    }

    /**
     * Select Soul Sand
     */
    //% block="`custom.SoulSand` soul sand"
    //% block.loc.he="`custom.SoulSand` חול נשמות"
    //% block.loc.he-IL="`custom.SoulSand` חול נשמות"
    //% blockId=soul_sand
    export function soulSand(): number {
        return 0;
    }

    /**
     * Ghost Block
     */
    //% block="`custom.Ghost`"
    //% block.loc.he="`custom.Ghost`"
    //% block.loc.he-IL="`custom.Ghost`"
    //% color="#8E8E8E"
    //% blockId=ghostBlock
    export function ghostBlock(): number {
        return 0;
    }

    // CRAFTING INGREDIENTS

    /**
     * Coal
     */
    //% block="`custom.Coal` coal"
    //% block.loc.he="`custom.Coal` פחם"
    //% block.loc.he-IL="`custom.Coal` פחם"
    //% blockId=coal
    export function coal(): number {
        return 21;
    }

    /**
     * Iron Ingot
     */
    //% block="`custom.IronIngot` iron ingot"
    //% block.loc.he="`custom.IronIngot` מטיל ברזל"
    //% block.loc.he-IL="`custom.IronIngot` מטיל ברזל"
    //% blockId=ironIngot
    export function ironIngot(): number {
        return 22;
    }

    // ITEMS    

    /**
     * Select Stick
     */
    //% block="`custom.Stick` stick"
    //% block.loc.he="`custom.Stick` מקל"
    //% block.loc.he-IL="`custom.Stick` מקל"
    export function stick(): number {
        return 2;
    }

    /**
     * Select Pickaxe
     */
    //% block="`custom.WoodenPickaxe` pickaxe"
    //% block.loc.he="`custom.WoodenPickaxe` מכוש"
    //% block.loc.he-IL="`custom.WoodenPickaxe` מכוש"
    //% blockId=pickaxe
    export function pickaxe(): number {
        return 1;
    }

    /**
     * Select Axe
     */
    //% block="`custom.WoodenAxe` axe"
    //% block.loc.he="`custom.WoodenAxe` גרזן"
    //% block.loc.he-IL="`custom.WoodenAxe` גרזן"
    //% blockId=axe
    export function axe(): number {
        return 2;
    }

    /**
     * Select Pickaxe
     */
    //% block="`custom.WoodenShovel` shovel"
    //% block.loc.he="`custom.WoodenShovel` את"
    //% block.loc.he-IL="`custom.WoodenShovel` את"
    //% blockId=shovel
    export function shovel(): number {
        return 3;
    }

    /**
     * Ghost Item
     */
    //% block="`custom.GhostItem`"
    //% block.loc.he="`custom.GhostItem`"
    //% block.loc.he-IL="`custom.GhostItem`"
    //% color="#8E8E8E"
    //% blockId=ghostItem
    export function ghostItem(): number {
        return 0;
    }

    // CRAFTING GRIDS

    /**
     * 2x2 Crafting Grid.
     */
    //% blockId=pocketcraftPattern block="2x2"
    //% imageLiteralColumns=2
    //% imageLiteralRows=2
    //% gridLiteral=1
    export function pocketcraftingPattern(pattern: string) {
        return new CraftPattern(pattern);
    }

    /**
     * 3x3 Crafting Grid.
     */
    //% blockId=craftPattern block="3x3"
    //% imageLiteralColumns=3
    //% imageLiteralRows=3
    //% gridLiteral=1

    export function craftingPattern(pattern: string) {
        return new CraftPattern(pattern);
    }

}

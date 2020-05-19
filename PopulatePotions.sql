-- Truncates the potions table and the languages table, and then repopulates them with all the potions and their respective languages.

use OceansOfPotions_sp20;

DELETE FROM potions;
INSERT INTO potions (PotionName, PotionDescription, PotionPrice)
VALUES 
('Bug Blaster', 'Finds up to 10 bugs in your code.', 220),
('Poetic Pantry', 'Changes all your variable names into fancy food names.', 15),
('Speedy Sorter', 'A sorting function that always works in constant time.', 950),
('Terrific Translator', 'Rewrites your code in a different language.', 350),
('Deceptive Decompiler', 'Converts machine code back into human readable code.', 350),
('Aesthetic Artist', 'Reformats code in an aestheticly pleasing manner.', 45),
('Shape Shifter', 'Creates whatever masterpiece you desire using print statements.', 75),
('Runtime Revealer', 'Annotates your functions with their runtime complexity.', 180),
('Crafty Commenter', 'Writes your comments for you.', 500),
('Syntax Sniper', 'Corrects syntax errors as you go.', 650),
('Stack Searcher', 'Writes functions for you by searching Stack Overflow.', 1000),
('Psuedo Psychic', 'Translates psuedo code into real code.', 750),
('Cocky Completer', 'Auto-Complete that finishes your code as you type.', 150),
('Clandestine Calculator', 'Simplifies expressions in your code.', 175),
('Functional Fairy', 'Translates procedural code into Haskell.', 500),
('Zany Zebra', 'Makes every other line black or white.', 10),
('Lofty Lorax', 'Creates tree stuctures and appropriate functions for you.', 300),
('Squirt Shortener', 'Shortens your program into the fewest possible charecters.', 75),
('Nifty Namer', 'Changes all your function names into fun words.', 15),
('Time Traveler', 'Prevents any race conditions or synchronization issues.', 425)
;

DELETE FROM languages;
INSERT INTO languages (PotionID, LanguageName)
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Bug Blaster'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Bug Blaster'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Poetic Pantry'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Poetic Pantry'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Speedy Sorter'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Speedy Sorter'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Terrific Translator'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Terrific Translator'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Terrific Translator'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Terrific Translator'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Deceptive Decompiler'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Deceptive Decompiler'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Deceptive Decompiler'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Aesthetic Artist'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Shape Shifter'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Runtime Revealer'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Runtime Revealer'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Runtime Revealer'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Runtime Revealer'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Crafty Commenter'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Crafty Commenter'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Syntax Sniper'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Syntax Sniper'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Stack Searcher'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Stack Searcher'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Psuedo Psychic'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Cocky Completer'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Clandestine Calculator'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Clandestine Calculator'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Clandestine Calculator'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Functional Fairy'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Functional Fairy'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Zany Zebra'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Zany Zebra'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Zany Zebra'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Zany Zebra'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Lofty Lorax'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Squirt Shortener'
UNION ALL
SELECT PotionID, 'C' FROM potions WHERE PotionName = 'Squirt Shortener'
UNION ALL
SELECT PotionID, 'C++' FROM potions WHERE PotionName = 'Squirt Shortener'
UNION ALL
SELECT PotionID, 'Python' FROM potions WHERE PotionName = 'Nifty Namer'
UNION ALL
SELECT PotionID, 'Java' FROM potions WHERE PotionName = 'Time Traveler';

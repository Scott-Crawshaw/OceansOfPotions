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

SELECT * FROM potions;
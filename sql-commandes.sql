-- usine 
INSERT INTO usine (nom) VALUES 
('Usine de Production A'),
('Usine de Production B'),
('Usine de Production C');

-- Inserting UniteFabrication records associated with existing Usine records
INSERT INTO unite_fabrication  VALUES 
(1,'Unité de Fabrication 1',1),
(2,'Unité de Fabrication 2',2),
(3,'Unité de Fabrication 3',3),
(4,'Unité de Fabrication 4',4);





-- Inserting Workshop records associated with existing UniteFabrication records
INSERT INTO workshop  VALUES 
(1,'Atelier A',1),
(2,'Atelier B',1),
(3,'Atelier C',2),
(4,'Atelier D',3),
(5,'Atelier E',4);

-- Inserting Machine records associated with existing Workshop records
INSERT INTO machine  VALUES 
(1,'Machine 1',1),
(2,'Machine 2',1),
(3,'Machine 3',1),
(4,'Machine 4',1),
(5,'Machine 5',1),
(6,'Machine 6',1);

-- Inserting Capteur records associated with existing Machine records
INSERT INTO capteur  VALUES 
(1,'Température',1),
(2,'Pression',2),
(3,'Humidité',3),
(4,'Vibratio1',4),
(5,'Gaz',5),
(6,'Lumière',6),
(7,'Mouvement',1);

-- Inserting Element records associated with existing Capteur records
INSERT INTO element  VALUES 
(1,'Élément A',1),
(2,'Élément B',1),
(3,'Élément C',1),
(4,'Élément D',1),
(5,'Élément E',1),
(6,'Élément F',1),
(7,'Élément G',1),
(8,'Élément H',1);

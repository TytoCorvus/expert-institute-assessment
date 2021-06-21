DO
$do$
BEGIN
	IF NOT EXISTS (SELECT FROM public.recipe) then
		INSERT INTO public.recipe (cocktail_id,ingredient,unit,amount)
        VALUES  (1,'angostura bitters','dash',2),
                (1,'bourbon','cL',4.5),
                (1,'sugar','cube',1),
                (1,'water','dash',1),
                (2,'coke','dash',1),
                (2,'gin','oz',0.5),
                (2,'lemon peel','twist',1),
                (2,'light rum','oz',0.5),
                (2,'tequila','oz',0.5),
                (2,'vodka','oz',0.5),
                (4,'ginger ale','oz',8),
                (4,'lime juice','oz',2),
                (4,'vodka','oz',2),
                (5,'orange juice','oz',10),
                (5,'vodka','oz',2);
	END if;
END
$do$
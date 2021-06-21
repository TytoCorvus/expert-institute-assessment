DO
$do$
BEGIN
	IF NOT EXISTS (SELECT FROM public.cocktail) then
		INSERT INTO public.cocktail (name)
		VALUES  ('old fashioned'),
				('long island iced tea'),
				('margarita'),
				('moscow mule'),
				('screwdriver');
	END if;
END
$do$
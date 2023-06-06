-- Type: game_type

-- DROP TYPE IF EXISTS public.game_type;

CREATE TYPE public.game_type AS ENUM
    ('free', 'paid', 'subscription');

ALTER TYPE public.game_type
    OWNER TO postgres;

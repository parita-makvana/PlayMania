-- Type: valid_roles

-- DROP TYPE IF EXISTS public.valid_roles;

CREATE TYPE public.valid_roles AS ENUM
    ('buyer', 'seller', 'app_admin');

ALTER TYPE public.valid_roles
    OWNER TO postgres;

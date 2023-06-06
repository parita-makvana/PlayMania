-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    user_id integer NOT NULL,
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role valid_roles NOT NULL,
    dob date,
    email character varying(80) COLLATE pg_catalog."default",
    hashed_password character varying(255) COLLATE pg_catalog."default",
    subscription_ends timestamp without time zone,
    acc_creation_date timestamp without time zone DEFAULT now(),
    CONSTRAINT user_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;
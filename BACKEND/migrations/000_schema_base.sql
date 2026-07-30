--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: accion_moderacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.accion_moderacion AS ENUM (
    'aprobado',
    'rechazado',
    'suspendido'
);


--
-- Name: estado_pago; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_pago AS ENUM (
    'exitoso',
    'fallido',
    'reembolsado'
);


--
-- Name: estado_publicacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_publicacion AS ENUM (
    'pendiente_revision',
    'aprobado',
    'rechazado',
    'suspendido'
);


--
-- Name: estado_reserva; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_reserva AS ENUM (
    'pendiente',
    'confirmada',
    'cancelada'
);


--
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rol_usuario AS ENUM (
    'turista',
    'anfitrion',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alojamiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alojamiento (
    id integer NOT NULL,
    id_anfitrion integer NOT NULL,
    titulo character varying(150) NOT NULL,
    descripcion text NOT NULL,
    ubicacion character varying(200) NOT NULL,
    latitud numeric(9,6),
    longitud numeric(9,6),
    estado public.estado_publicacion DEFAULT 'pendiente_revision'::public.estado_publicacion,
    created_at timestamp without time zone DEFAULT now(),
    motivo_rechazo text,
    fecha_revision timestamp without time zone,
    id_admin_revision integer,
    precio_noche numeric(10,2) NOT NULL,
    capacidad integer NOT NULL,
    es_compartido boolean DEFAULT false NOT NULL,
    cupos_disponibles integer,
    habitaciones integer,
    camas integer,
    banos integer
);


--
-- Name: alojamiento_categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alojamiento_categoria (
    id_alojamiento integer NOT NULL,
    id_categoria integer NOT NULL
);


--
-- Name: alojamiento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alojamiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alojamiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alojamiento_id_seq OWNED BY public.alojamiento.id;


--
-- Name: alojamiento_imagen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alojamiento_imagen (
    id integer NOT NULL,
    id_alojamiento integer NOT NULL,
    url text NOT NULL,
    portada boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    public_id character varying(255),
    espacio character varying(32) DEFAULT 'general'::character varying NOT NULL
);


--
-- Name: alojamiento_imagen_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alojamiento_imagen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alojamiento_imagen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alojamiento_imagen_id_seq OWNED BY public.alojamiento_imagen.id;


--
-- Name: alojamiento_servicio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alojamiento_servicio (
    id_alojamiento integer NOT NULL,
    id_servicio integer NOT NULL
);


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    tipo character varying(50) DEFAULT 'alojamiento'::character varying NOT NULL,
    icono character varying(50)
);


--
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- Name: conversacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversacion (
    id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    id_alojamiento integer,
    asunto character varying(200),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT conversacion_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['reserva'::character varying, 'moderacion'::character varying])::text[])))
);


--
-- Name: conversacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conversacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: conversacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conversacion_id_seq OWNED BY public.conversacion.id;


--
-- Name: conversacion_participante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversacion_participante (
    id_conversacion integer NOT NULL,
    id_usuario integer NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: mensaje; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensaje (
    id integer NOT NULL,
    id_conversacion integer NOT NULL,
    id_remitente integer NOT NULL,
    cuerpo text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    read_at timestamp without time zone
);


--
-- Name: mensaje_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mensaje_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mensaje_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mensaje_id_seq OWNED BY public.mensaje.id;


--
-- Name: moderacion_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moderacion_log (
    id integer NOT NULL,
    tipo_contenido character varying(20) NOT NULL,
    id_contenido integer NOT NULL,
    accion public.accion_moderacion NOT NULL,
    motivo text,
    estado_anterior public.estado_publicacion,
    estado_nuevo public.estado_publicacion NOT NULL,
    id_admin_revision integer NOT NULL,
    fecha_revision timestamp without time zone DEFAULT now()
);


--
-- Name: moderacion_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moderacion_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moderacion_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moderacion_log_id_seq OWNED BY public.moderacion_log.id;


--
-- Name: pago; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pago (
    id integer NOT NULL,
    id_reserva integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    metodo character varying(50) NOT NULL,
    estado public.estado_pago NOT NULL,
    referencia_externa character varying(100),
    fecha_pago timestamp without time zone DEFAULT now()
);


--
-- Name: pago_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pago_id_seq OWNED BY public.pago.id;


--
-- Name: resena; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resena (
    id integer NOT NULL,
    id_turista integer NOT NULL,
    id_alojamiento integer NOT NULL,
    calificacion integer,
    comentario text,
    fecha timestamp without time zone DEFAULT now(),
    CONSTRAINT resena_calificacion_check CHECK (((calificacion >= 1) AND (calificacion <= 5)))
);


--
-- Name: resena_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resena_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resena_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resena_id_seq OWNED BY public.resena.id;


--
-- Name: reserva; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reserva (
    id integer NOT NULL,
    id_turista integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado public.estado_reserva DEFAULT 'pendiente'::public.estado_reserva,
    total numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    id_alojamiento integer NOT NULL
);


--
-- Name: reserva_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reserva_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reserva_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reserva_id_seq OWNED BY public.reserva.id;


--
-- Name: servicio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicio (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    icono character varying(50) DEFAULT 'check'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: servicio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicio_id_seq OWNED BY public.servicio.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol public.rol_usuario DEFAULT 'turista'::public.rol_usuario NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    avatar_url character varying(500),
    avatar_public_id character varying(255)
);


--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: alojamiento id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento ALTER COLUMN id SET DEFAULT nextval('public.alojamiento_id_seq'::regclass);


--
-- Name: alojamiento_imagen id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_imagen ALTER COLUMN id SET DEFAULT nextval('public.alojamiento_imagen_id_seq'::regclass);


--
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- Name: conversacion id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversacion ALTER COLUMN id SET DEFAULT nextval('public.conversacion_id_seq'::regclass);


--
-- Name: mensaje id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensaje ALTER COLUMN id SET DEFAULT nextval('public.mensaje_id_seq'::regclass);


--
-- Name: moderacion_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moderacion_log ALTER COLUMN id SET DEFAULT nextval('public.moderacion_log_id_seq'::regclass);


--
-- Name: pago id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago ALTER COLUMN id SET DEFAULT nextval('public.pago_id_seq'::regclass);


--
-- Name: resena id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resena ALTER COLUMN id SET DEFAULT nextval('public.resena_id_seq'::regclass);


--
-- Name: reserva id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserva ALTER COLUMN id SET DEFAULT nextval('public.reserva_id_seq'::regclass);


--
-- Name: servicio id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio ALTER COLUMN id SET DEFAULT nextval('public.servicio_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Name: alojamiento_categoria alojamiento_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_categoria
    ADD CONSTRAINT alojamiento_categoria_pkey PRIMARY KEY (id_alojamiento, id_categoria);


--
-- Name: alojamiento_imagen alojamiento_imagen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_imagen
    ADD CONSTRAINT alojamiento_imagen_pkey PRIMARY KEY (id);


--
-- Name: alojamiento alojamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento
    ADD CONSTRAINT alojamiento_pkey PRIMARY KEY (id);


--
-- Name: alojamiento_servicio alojamiento_servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_servicio
    ADD CONSTRAINT alojamiento_servicio_pkey PRIMARY KEY (id_alojamiento, id_servicio);


--
-- Name: categoria categoria_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_nombre_key UNIQUE (nombre);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- Name: conversacion_participante conversacion_participante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversacion_participante
    ADD CONSTRAINT conversacion_participante_pkey PRIMARY KEY (id_conversacion, id_usuario);


--
-- Name: conversacion conversacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversacion
    ADD CONSTRAINT conversacion_pkey PRIMARY KEY (id);


--
-- Name: mensaje mensaje_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT mensaje_pkey PRIMARY KEY (id);


--
-- Name: moderacion_log moderacion_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moderacion_log
    ADD CONSTRAINT moderacion_log_pkey PRIMARY KEY (id);


--
-- Name: pago pago_id_reserva_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_reserva_key UNIQUE (id_reserva);


--
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id);


--
-- Name: resena resena_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resena
    ADD CONSTRAINT resena_pkey PRIMARY KEY (id);


--
-- Name: reserva reserva_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_pkey PRIMARY KEY (id);


--
-- Name: servicio servicio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_nombre_key UNIQUE (nombre);


--
-- Name: servicio servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: idx_alojamiento_servicio_servicio; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alojamiento_servicio_servicio ON public.alojamiento_servicio USING btree (id_servicio);


--
-- Name: idx_conversacion_participante_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversacion_participante_usuario ON public.conversacion_participante USING btree (id_usuario);


--
-- Name: idx_conversacion_updated; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversacion_updated ON public.conversacion USING btree (updated_at DESC);


--
-- Name: idx_mensaje_conversacion_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mensaje_conversacion_created ON public.mensaje USING btree (id_conversacion, created_at);


--
-- Name: alojamiento alojamiento_id_anfitrion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento
    ADD CONSTRAINT alojamiento_id_anfitrion_fkey FOREIGN KEY (id_anfitrion) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: alojamiento_servicio alojamiento_servicio_id_alojamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_servicio
    ADD CONSTRAINT alojamiento_servicio_id_alojamiento_fkey FOREIGN KEY (id_alojamiento) REFERENCES public.alojamiento(id) ON DELETE CASCADE;


--
-- Name: alojamiento_servicio alojamiento_servicio_id_servicio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_servicio
    ADD CONSTRAINT alojamiento_servicio_id_servicio_fkey FOREIGN KEY (id_servicio) REFERENCES public.servicio(id) ON DELETE CASCADE;


--
-- Name: conversacion conversacion_id_alojamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversacion
    ADD CONSTRAINT conversacion_id_alojamiento_fkey FOREIGN KEY (id_alojamiento) REFERENCES public.alojamiento(id) ON DELETE SET NULL;


--
-- Name: conversacion_participante conversacion_participante_id_conversacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversacion_participante
    ADD CONSTRAINT conversacion_participante_id_conversacion_fkey FOREIGN KEY (id_conversacion) REFERENCES public.conversacion(id) ON DELETE CASCADE;


--
-- Name: conversacion_participante conversacion_participante_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversacion_participante
    ADD CONSTRAINT conversacion_participante_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: alojamiento_categoria fk_ac_alojamiento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_categoria
    ADD CONSTRAINT fk_ac_alojamiento FOREIGN KEY (id_alojamiento) REFERENCES public.alojamiento(id) ON DELETE CASCADE;


--
-- Name: alojamiento_categoria fk_ac_categoria; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_categoria
    ADD CONSTRAINT fk_ac_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id) ON DELETE CASCADE;


--
-- Name: alojamiento_imagen fk_ai_alojamiento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alojamiento_imagen
    ADD CONSTRAINT fk_ai_alojamiento FOREIGN KEY (id_alojamiento) REFERENCES public.alojamiento(id) ON DELETE CASCADE;


--
-- Name: mensaje mensaje_id_conversacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT mensaje_id_conversacion_fkey FOREIGN KEY (id_conversacion) REFERENCES public.conversacion(id) ON DELETE CASCADE;


--
-- Name: mensaje mensaje_id_remitente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT mensaje_id_remitente_fkey FOREIGN KEY (id_remitente) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: moderacion_log moderacion_log_id_admin_revision_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moderacion_log
    ADD CONSTRAINT moderacion_log_id_admin_revision_fkey FOREIGN KEY (id_admin_revision) REFERENCES public.usuario(id);


--
-- Name: pago pago_id_reserva_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reserva(id) ON DELETE CASCADE;


--
-- Name: resena resena_id_alojamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resena
    ADD CONSTRAINT resena_id_alojamiento_fkey FOREIGN KEY (id_alojamiento) REFERENCES public.alojamiento(id) ON DELETE CASCADE;


--
-- Name: resena resena_id_turista_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resena
    ADD CONSTRAINT resena_id_turista_fkey FOREIGN KEY (id_turista) REFERENCES public.usuario(id);


--
-- Name: reserva reserva_id_alojamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_id_alojamiento_fkey FOREIGN KEY (id_alojamiento) REFERENCES public.alojamiento(id) ON DELETE CASCADE;


--
-- Name: reserva reserva_id_turista_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_id_turista_fkey FOREIGN KEY (id_turista) REFERENCES public.usuario(id);


--
-- PostgreSQL database dump complete
--



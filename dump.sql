--
-- PostgreSQL database dump
--


-- Dumped from database version 14.9 (Ubuntu 14.9-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.9 (Ubuntu 14.9-0ubuntu0.22.04.1)

-- Dumped from database version 12.16 (Ubuntu 12.16-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.16 (Ubuntu 12.16-0ubuntu0.20.04.1)

-- Started on 2023-08-21 14:48:09 -03


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--

-- Name: hashtag; Type: TABLE; Schema: public; Owner: -

-- TOC entry 211 (class 1259 OID 33180)
-- Name: hashtag; Type: TABLE; Schema: public; Owner: postgres

--

CREATE TABLE public.hashtag (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


--
-- Name: hashtag_id_seq; Type: SEQUENCE; Schema: public; Owner: -
    name text NOT NULL
);


ALTER TABLE public.hashtag OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 33178)
-- Name: hashtag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hashtag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hashtag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER TABLE public.hashtag_id_seq OWNER TO postgres;

--
-- TOC entry 3024 (class 0 OID 0)
-- Dependencies: 210
-- Name: hashtag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hashtag_id_seq OWNED BY public.hashtag.id;


--
-- Name: like; Type: TABLE; Schema: public; Owner: -
-- TOC entry 209 (class 1259 OID 33162)
-- Name: like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."like" (
    id integer NOT NULL,
    "postId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


--
-- Name: like_id_seq; Type: SEQUENCE; Schema: public; Owner: -
    "userId" integer NOT NULL
);


ALTER TABLE public."like" OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 33160)
-- Name: like_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.like_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER TABLE public.like_id_seq OWNER TO postgres;

--
-- TOC entry 3025 (class 0 OID 0)
-- Dependencies: 208
-- Name: like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.like_id_seq OWNED BY public."like".id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: -
-- TOC entry 207 (class 1259 OID 33146)
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    url text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


--
    description text NOT NULL
);


ALTER TABLE public.post OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 33191)
-- Name: postHasHashtag; Type: TABLE; Schema: public; Owner: postgres

--

CREATE TABLE public."postHasHashtag" (
    id integer NOT NULL,
    "postId" integer NOT NULL,
    "hashtagId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


--
-- Name: postHasHashtag_id_seq; Type: SEQUENCE; Schema: public; Owner: -

    "hashtagId" integer NOT NULL
);


ALTER TABLE public."postHasHashtag" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 33189)
-- Name: postHasHashtag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres

--

CREATE SEQUENCE public."postHasHashtag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: postHasHashtag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER TABLE public."postHasHashtag_id_seq" OWNER TO postgres;

--
-- TOC entry 3026 (class 0 OID 0)
-- Dependencies: 212
-- Name: postHasHashtag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres

--

ALTER SEQUENCE public."postHasHashtag_id_seq" OWNED BY public."postHasHashtag".id;


--

-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
-- TOC entry 206 (class 1259 OID 33144)
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
n
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER TABLE public.post_id_seq OWNER TO postgres;

--
-- TOC entry 3027 (class 0 OID 0)
-- Dependencies: 206
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -

-- TOC entry 205 (class 1259 OID 33133)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


--
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: -
    token uuid NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 33131)
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER TABLE public.session_id_seq OWNER TO postgres;

--
-- TOC entry 3028 (class 0 OID 0)
-- Dependencies: 204
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.session.id;


--
-- TOC entry 203 (class 1259 OID 33118)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    "photoUrl" text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
    "photoUrl" text NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 33116)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 3029 (class 0 OID 0)
-- Dependencies: 202
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres

--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 2869 (class 2604 OID 33183)
-- Name: hashtag id; Type: DEFAULT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public.hashtag ALTER COLUMN id SET DEFAULT nextval('public.hashtag_id_seq'::regclass);


--
-- TOC entry 2868 (class 2604 OID 33165)
-- Name: like id; Type: DEFAULT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."like" ALTER COLUMN id SET DEFAULT nextval('public.like_id_seq'::regclass);


--
-- TOC entry 2867 (class 2604 OID 33149)
-- Name: post id; Type: DEFAULT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- TOC entry 2870 (class 2604 OID 33194)
-- Name: postHasHashtag id; Type: DEFAULT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."postHasHashtag" ALTER COLUMN id SET DEFAULT nextval('public."postHasHashtag_id_seq"'::regclass);


--
-- TOC entry 2866 (class 2604 OID 33136)
-- Name: session id; Type: DEFAULT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public.session ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- TOC entry 2865 (class 2604 OID 33121)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--

-- Data for Name: hashtag; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: like; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: postHasHashtag; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: hashtag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hashtag_id_seq', 1, false);


--
-- Name: like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.like_id_seq', 1, false);


--
-- Name: postHasHashtag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."postHasHashtag_id_seq"', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.post_id_seq', 1, false);


--
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.session_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: hashtag hashtag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
-- TOC entry 2884 (class 2606 OID 33188)
-- Name: hashtag hashtag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtag
    ADD CONSTRAINT hashtag_pkey PRIMARY KEY (id);


--
-- TOC entry 2882 (class 2606 OID 33167)
-- Name: like like_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_pkey PRIMARY KEY ("postId", "userId");


--
-- TOC entry 2886 (class 2606 OID 33196)
-- Name: postHasHashtag postHasHashtag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."postHasHashtag"
    ADD CONSTRAINT "postHasHashtag_pkey" PRIMARY KEY ("postId", "hashtagId");


--

-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2880 (class 2606 OID 33154)
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--

-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2878 (class 2606 OID 33138)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--

-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2872 (class 2606 OID 33128)
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--

-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2874 (class 2606 OID 33126)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2876 (class 2606 OID 33130)
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--

-- Name: like like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2889 (class 2606 OID 33168)
-- Name: like like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.post(id);


--

-- Name: like like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2890 (class 2606 OID 33173)
-- Name: like like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: postHasHashtag postHasHashtag_hashtagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

-- TOC entry 2892 (class 2606 OID 33202)
-- Name: postHasHashtag postHasHashtag_hashtagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."postHasHashtag"
    ADD CONSTRAINT "postHasHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES public.hashtag(id);


--
-- Name: postHasHashtag postHasHashtag_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
-- TOC entry 2891 (class 2606 OID 33197)
-- Name: postHasHashtag postHasHashtag_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."postHasHashtag"
    ADD CONSTRAINT "postHasHashtag_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.post(id);


--
-- Name: post post_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
-- TOC entry 2888 (class 2606 OID 33155)
-- Name: post post_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "post_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
-- TOC entry 2887 (class 2606 OID 33139)
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id);


-- Completed on 2023-08-21 14:48:09 -03

--
-- PostgreSQL database dump complete
--


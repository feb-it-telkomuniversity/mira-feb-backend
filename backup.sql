--
-- PostgreSQL database dump
--

\restrict DTWNx9rYqr1am76mD7ceD9Wg13mvZzrUDl2CxNKsowrzikq2OPeSQOvmgToRtiU

-- Dumped from database version 17.7 (bdd1736)
-- Dumped by pg_dump version 17.8 (Ubuntu 17.8-1.pgdg24.04+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ActivityMonitoringStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ActivityMonitoringStatus" AS ENUM (
    'Normal',
    'RoomConflict',
    'OfficialConflict',
    'DoubleConflict',
    'Cancelled'
);


ALTER TYPE public."ActivityMonitoringStatus" OWNER TO neondb_owner;

--
-- Name: ActivityStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ActivityStatus" AS ENUM (
    'Terlaksana',
    'BelumTerlaksana'
);


ALTER TYPE public."ActivityStatus" OWNER TO neondb_owner;

--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ActivityType" AS ENUM (
    'JointDegree',
    'DoubleDegree',
    'JointClass',
    'StudentExchange',
    'VisitingProfessor',
    'JointResearch',
    'JointPublication',
    'JointCommunityService',
    'SocialProject',
    'General'
);


ALTER TYPE public."ActivityType" OWNER TO neondb_owner;

--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'Approved',
    'Returned',
    'Submitted',
    'Pending',
    'Skipped'
);


ALTER TYPE public."ApprovalStatus" OWNER TO neondb_owner;

--
-- Name: Category; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Category" AS ENUM (
    'Sidang',
    'Keuangan',
    'Wisuda',
    'Sekretariat',
    'Wadek1',
    'Wadek2',
    'ProdiS1',
    'ProdiS2'
);


ALTER TYPE public."Category" OWNER TO neondb_owner;

--
-- Name: ContractManagementCategory; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ContractManagementCategory" AS ENUM (
    'Financial',
    'NonFinancial',
    'InternalBusinessProcess'
);


ALTER TYPE public."ContractManagementCategory" OWNER TO neondb_owner;

--
-- Name: DocType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."DocType" AS ENUM (
    'MoA',
    'MoU',
    'IA'
);


ALTER TYPE public."DocType" OWNER TO neondb_owner;

--
-- Name: Feedback; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Feedback" AS ENUM (
    '1',
    '2',
    '3'
);


ALTER TYPE public."Feedback" OWNER TO neondb_owner;

--
-- Name: MeetingActionStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."MeetingActionStatus" AS ENUM (
    'Open',
    'Closed'
);


ALTER TYPE public."MeetingActionStatus" OWNER TO neondb_owner;

--
-- Name: MeetingStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."MeetingStatus" AS ENUM (
    'Selesai',
    'Berlangsung',
    'Terjadwal',
    'Batal'
);


ALTER TYPE public."MeetingStatus" OWNER TO neondb_owner;

--
-- Name: OfficialOption; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."OfficialOption" AS ENUM (
    'Rektor',
    'WakilRektor1',
    'WakilRektor2',
    'WakilRektor3',
    'WakilRektor4',
    'Dekan',
    'WakilDekanI',
    'WakilDekanII',
    'KaurSekretariatDekan',
    'KaurAkademik',
    'KaurLaboratorium',
    'KaurSDMKeuangan',
    'KaurKemahasiswaan',
    'KaprodiS1Manajemen',
    'KaprodiS1AdministrasiBisnis',
    'KaprodiS1Akuntansi',
    'KaprodiS1LeisureManagement',
    'KaprodiS1BisnisDigital',
    'KaprodiS2Manajemen',
    'KaprodiS2ManajemenPJJ',
    'KaprodiS2AdministrasiBisnis',
    'KaprodiS2Akuntansi',
    'KaprodiS3Manajemen',
    'SekprodiS1Manajemen',
    'SekprodiS1ICTBusiness',
    'SekprodiS1Akuntansi',
    'SekprodiS2Manajemen',
    'SekprodiS2ManajemenPJJ',
    'SekprodiS2AdministrasiBisnis',
    'Dekanat',
    'Ponggawa',
    'KetuaKKAEFS',
    'KetuaKKTBM',
    'KetuaKKDBE'
);


ALTER TYPE public."OfficialOption" OWNER TO neondb_owner;

--
-- Name: PartnershipType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."PartnershipType" AS ENUM (
    'Akademik',
    'Penelitian',
    'Abdimas'
);


ALTER TYPE public."PartnershipType" OWNER TO neondb_owner;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Role" AS ENUM (
    'mahasiswa',
    'dosen',
    'admin',
    'dekanat',
    'kaur',
    'kaprodi',
    'sekprodi'
);


ALTER TYPE public."Role" OWNER TO neondb_owner;

--
-- Name: RoomOption; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."RoomOption" AS ENUM (
    'RuangRapatManterawuLt2',
    'RuangRapatMiossuLt1',
    'RuangRapatMiossuLt2',
    'RuangRapatMaratuaLt1',
    'AulaFEB',
    'AulaManterawu',
    'Lainnya'
);


ALTER TYPE public."RoomOption" OWNER TO neondb_owner;

--
-- Name: ScheduleStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ScheduleStatus" AS ENUM (
    'draft',
    'pending',
    'sent',
    'cancelled'
);


ALTER TYPE public."ScheduleStatus" OWNER TO neondb_owner;

--
-- Name: Scope; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Scope" AS ENUM (
    'national',
    'international'
);


ALTER TYPE public."Scope" OWNER TO neondb_owner;

--
-- Name: Sender; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Sender" AS ENUM (
    'user',
    'bot',
    'admin'
);


ALTER TYPE public."Sender" OWNER TO neondb_owner;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Status" AS ENUM (
    'open',
    'in_progress',
    'resolved'
);


ALTER TYPE public."Status" OWNER TO neondb_owner;

--
-- Name: Step; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Step" AS ENUM (
    'select_role',
    'ask_lecturer_name',
    'lecturer_select_unit',
    'ask_student_nim',
    'ask_student_name',
    'menu',
    'chat',
    'awaiting_feedback'
);


ALTER TYPE public."Step" OWNER TO neondb_owner;

--
-- Name: UnitOption; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."UnitOption" AS ENUM (
    'Dekan',
    'WakilDekanI',
    'WakilDekanII',
    'UrusanSekretariatDekan',
    'UrusanLayananAkademik',
    'UrusanLaboratorium',
    'UrusanSDMKeuangan',
    'UrusanKemahasiswaan',
    'ProdiS1Manajemen',
    'ProdiS1AdministrasiBisnis',
    'ProdiS1Akuntansi',
    'ProdiS1LeisureManagement',
    'ProdiS1BisnisDigital',
    'ProdiS2Manajemen',
    'ProdiS2ManajemenPJJ',
    'ProdiS2AdministrasiBisnis',
    'ProdiS2Akuntansi',
    'ProdiS3Manajemen'
);


ALTER TYPE public."UnitOption" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Admins" (
    id integer NOT NULL,
    username text NOT NULL,
    full_name text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Admins" OWNER TO neondb_owner;

--
-- Name: Admins_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Admins_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Admins_id_seq" OWNER TO neondb_owner;

--
-- Name: Admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Admins_id_seq" OWNED BY public."Admins".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: activity_monitoring; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activity_monitoring (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    date date NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    participants integer DEFAULT 0 NOT NULL,
    unit public."UnitOption" NOT NULL,
    room public."RoomOption" DEFAULT 'AulaFEB'::public."RoomOption" NOT NULL,
    officials public."OfficialOption"[],
    status public."ActivityMonitoringStatus" DEFAULT 'Normal'::public."ActivityMonitoringStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    location_detail text
);


ALTER TABLE public.activity_monitoring OWNER TO neondb_owner;

--
-- Name: activity_monitoring_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.activity_monitoring_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_monitoring_id_seq OWNER TO neondb_owner;

--
-- Name: activity_monitoring_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.activity_monitoring_id_seq OWNED BY public.activity_monitoring.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    phone_number text NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.contacts OWNER TO neondb_owner;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO neondb_owner;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: contract_management; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.contract_management (
    id integer NOT NULL,
    "ContractManagementCategory" public."ContractManagementCategory",
    responsibility text NOT NULL,
    quarterly text NOT NULL,
    unit text,
    max double precision,
    min double precision,
    pers_real double precision,
    value double precision,
    "Input" text,
    "Monitor" text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    weight double precision,
    target text,
    realization double precision,
    achievement double precision
);


ALTER TABLE public.contract_management OWNER TO neondb_owner;

--
-- Name: contract_management_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.contract_management_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contract_management_id_seq OWNER TO neondb_owner;

--
-- Name: contract_management_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.contract_management_id_seq OWNED BY public.contract_management.id;


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    user_id integer NOT NULL,
    category public."Category",
    last_bot_message_id integer,
    step public."Step" NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.conversations OWNER TO neondb_owner;

--
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.conversations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversations_id_seq OWNER TO neondb_owner;

--
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- Name: employee_tpa; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.employee_tpa (
    id integer NOT NULL,
    name text NOT NULL,
    nip text NOT NULL,
    work_unit text NOT NULL,
    employment_status text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.employee_tpa OWNER TO neondb_owner;

--
-- Name: employee_tpa_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.employee_tpa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_tpa_id_seq OWNER TO neondb_owner;

--
-- Name: employee_tpa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.employee_tpa_id_seq OWNED BY public.employee_tpa.id;


--
-- Name: lecturers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.lecturers (
    id integer NOT NULL,
    nip text NOT NULL,
    nuptk text,
    front_title text,
    name text NOT NULL,
    back_title text,
    prodi text NOT NULL,
    lecturer_code text,
    education text,
    job_functional text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.lecturers OWNER TO neondb_owner;

--
-- Name: lecturers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.lecturers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lecturers_id_seq OWNER TO neondb_owner;

--
-- Name: lecturers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.lecturers_id_seq OWNED BY public.lecturers.id;


--
-- Name: management_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.management_reports (
    id integer NOT NULL,
    indicator text NOT NULL,
    evidence_link text,
    year integer NOT NULL,
    tw_1 boolean DEFAULT false NOT NULL,
    tw_2 boolean DEFAULT false NOT NULL,
    tw_3 boolean DEFAULT false NOT NULL,
    tw_4 boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.management_reports OWNER TO neondb_owner;

--
-- Name: management_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.management_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.management_reports_id_seq OWNER TO neondb_owner;

--
-- Name: management_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.management_reports_id_seq OWNED BY public.management_reports.id;


--
-- Name: meeting_action_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.meeting_action_items (
    id integer NOT NULL,
    task text NOT NULL,
    pic text NOT NULL,
    deadline date NOT NULL,
    agenda_id integer NOT NULL,
    status public."MeetingActionStatus" DEFAULT 'Open'::public."MeetingActionStatus" NOT NULL,
    notes text
);


ALTER TABLE public.meeting_action_items OWNER TO neondb_owner;

--
-- Name: meeting_action_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.meeting_action_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meeting_action_items_id_seq OWNER TO neondb_owner;

--
-- Name: meeting_action_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.meeting_action_items_id_seq OWNED BY public.meeting_action_items.id;


--
-- Name: meeting_agendas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.meeting_agendas (
    id integer NOT NULL,
    title text NOT NULL,
    discussion text,
    decision text,
    meeting_id integer NOT NULL
);


ALTER TABLE public.meeting_agendas OWNER TO neondb_owner;

--
-- Name: meeting_agendas_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.meeting_agendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meeting_agendas_id_seq OWNER TO neondb_owner;

--
-- Name: meeting_agendas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.meeting_agendas_id_seq OWNED BY public.meeting_agendas.id;


--
-- Name: meetings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.meetings (
    id integer NOT NULL,
    title text NOT NULL,
    date date NOT NULL,
    start_time timestamp(3) without time zone NOT NULL,
    end_time timestamp(3) without time zone NOT NULL,
    leader text NOT NULL,
    notetaker text NOT NULL,
    participants text[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    status public."MeetingStatus" DEFAULT 'Terjadwal'::public."MeetingStatus" NOT NULL,
    location_detail text,
    room public."RoomOption" NOT NULL
);


ALTER TABLE public.meetings OWNER TO neondb_owner;

--
-- Name: meetings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.meetings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meetings_id_seq OWNER TO neondb_owner;

--
-- Name: meetings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.meetings_id_seq OWNED BY public.meetings.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    conversation_id integer NOT NULL,
    sender public."Sender" NOT NULL,
    message_text text NOT NULL,
    need_human boolean DEFAULT false,
    feedback public."Feedback",
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: partnership_activities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.partnership_activities (
    id integer NOT NULL,
    type public."ActivityType",
    status public."ActivityStatus" DEFAULT 'BelumTerlaksana'::public."ActivityStatus",
    document_id integer NOT NULL,
    notes text
);


ALTER TABLE public.partnership_activities OWNER TO neondb_owner;

--
-- Name: partnership_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.partnership_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partnership_activities_id_seq OWNER TO neondb_owner;

--
-- Name: partnership_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.partnership_activities_id_seq OWNED BY public.partnership_activities.id;


--
-- Name: partnership_documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.partnership_documents (
    id integer NOT NULL,
    year_issued integer NOT NULL,
    doc_type public."DocType",
    partner_name text NOT NULL,
    scope public."Scope",
    pic_external text,
    pic_internal text,
    doc_number_internal text,
    doc_number_external text,
    date_created timestamp(3) without time zone,
    signing_type text,
    date_signed timestamp(3) without time zone,
    valid_until timestamp(3) without time zone,
    notes text,
    has_hardcopy boolean DEFAULT false NOT NULL,
    has_softcopy boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    partnership_type public."PartnershipType",
    approval_dekan public."ApprovalStatus",
    approval_dir_spio public."ApprovalStatus",
    approval_dir_sps public."ApprovalStatus",
    approval_kabag_kst public."ApprovalStatus",
    approval_kabag_sekpim public."ApprovalStatus",
    approval_kaur_legal public."ApprovalStatus",
    approval_rektor public."ApprovalStatus",
    approval_wadek1 public."ApprovalStatus",
    approval_wadek2 public."ApprovalStatus",
    approval_warek1 public."ApprovalStatus",
    doc_link text,
    duration text,
    pic_external_phone text
);


ALTER TABLE public.partnership_documents OWNER TO neondb_owner;

--
-- Name: partnership_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.partnership_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partnership_documents_id_seq OWNER TO neondb_owner;

--
-- Name: partnership_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.partnership_documents_id_seq OWNED BY public.partnership_documents.id;


--
-- Name: schedule_recipients; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.schedule_recipients (
    id integer NOT NULL,
    schedule_id integer NOT NULL,
    contact_id integer
);


ALTER TABLE public.schedule_recipients OWNER TO neondb_owner;

--
-- Name: schedule_recipients_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.schedule_recipients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_recipients_id_seq OWNER TO neondb_owner;

--
-- Name: schedule_recipients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.schedule_recipients_id_seq OWNED BY public.schedule_recipients.id;


--
-- Name: schedules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.schedules (
    id integer NOT NULL,
    event_title text NOT NULL,
    event_description text NOT NULL,
    event_time timestamp(3) without time zone NOT NULL,
    reminder_time timestamp(3) without time zone NOT NULL,
    status public."ScheduleStatus" DEFAULT 'pending'::public."ScheduleStatus" NOT NULL,
    created_by text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.schedules OWNER TO neondb_owner;

--
-- Name: schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedules_id_seq OWNER TO neondb_owner;

--
-- Name: schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;


--
-- Name: unresolved; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.unresolved (
    id integer NOT NULL,
    message_id integer NOT NULL,
    status public."Status" DEFAULT 'open'::public."Status",
    assigned_to character varying(100),
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.unresolved OWNER TO neondb_owner;

--
-- Name: unresolved_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.unresolved_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unresolved_id_seq OWNER TO neondb_owner;

--
-- Name: unresolved_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.unresolved_id_seq OWNED BY public.unresolved.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "phoneNumber" character varying(30),
    role public."Role" DEFAULT 'dosen'::public."Role" NOT NULL,
    identifier character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    full_name character varying(200) NOT NULL,
    password character varying(255),
    updated_at timestamp(3) without time zone NOT NULL,
    username character varying(100)
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Admins id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Admins" ALTER COLUMN id SET DEFAULT nextval('public."Admins_id_seq"'::regclass);


--
-- Name: activity_monitoring id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_monitoring ALTER COLUMN id SET DEFAULT nextval('public.activity_monitoring_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: contract_management id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contract_management ALTER COLUMN id SET DEFAULT nextval('public.contract_management_id_seq'::regclass);


--
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- Name: employee_tpa id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_tpa ALTER COLUMN id SET DEFAULT nextval('public.employee_tpa_id_seq'::regclass);


--
-- Name: lecturers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecturers ALTER COLUMN id SET DEFAULT nextval('public.lecturers_id_seq'::regclass);


--
-- Name: management_reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.management_reports ALTER COLUMN id SET DEFAULT nextval('public.management_reports_id_seq'::regclass);


--
-- Name: meeting_action_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meeting_action_items ALTER COLUMN id SET DEFAULT nextval('public.meeting_action_items_id_seq'::regclass);


--
-- Name: meeting_agendas id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meeting_agendas ALTER COLUMN id SET DEFAULT nextval('public.meeting_agendas_id_seq'::regclass);


--
-- Name: meetings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meetings ALTER COLUMN id SET DEFAULT nextval('public.meetings_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: partnership_activities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.partnership_activities ALTER COLUMN id SET DEFAULT nextval('public.partnership_activities_id_seq'::regclass);


--
-- Name: partnership_documents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.partnership_documents ALTER COLUMN id SET DEFAULT nextval('public.partnership_documents_id_seq'::regclass);


--
-- Name: schedule_recipients id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schedule_recipients ALTER COLUMN id SET DEFAULT nextval('public.schedule_recipients_id_seq'::regclass);


--
-- Name: schedules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);


--
-- Name: unresolved id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.unresolved ALTER COLUMN id SET DEFAULT nextval('public.unresolved_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Admins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Admins" (id, username, full_name, password, "createdAt", "updatedAt") FROM stdin;
1	nyomanpaul	Nyoman Paul Kristian	$2b$10$1btcd5mCSQ8KvtA8hKEa4OgNgOyCcPs0AFeAKxYjpJ6ykPkBFWxeG	2025-10-24 08:16:37.32	2025-10-24 08:16:37.32
2	mtyaspawitra	Mohammad Tyas Pawitra	$2b$10$uiEMTQpymwKo0XJYcI43UuuXpt.KCcU5EnPPiV7d.GWWBNtVI/4e2	2025-10-29 03:54:50.711	2025-10-29 03:54:50.711
3	uat_admin	UAT Administrator	$2b$10$xzFTVd0wiawyRPDsA/5e9.nrrwYpKC2UWXTbZpemxTAca8A.fs/h6	2026-01-05 08:29:40.99	2026-01-05 08:29:40.99
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
35eaa89f-6217-4139-9d8e-add8aeb4aa74	becc9b52203b103de179e3d810064c29affc16d145529aefd2098b854ad4192d	2025-10-24 06:38:09.797498+00	20251024063806_init	\N	\N	2025-10-24 06:38:08.268538+00	1
86c319b1-346f-4f8a-b44d-50240c529014	004f0ec4d7dc484285301ccba61a6136b22c404538023383ccff3cbbbe726241	2025-11-10 06:58:58.732838+00	20251110065856_add_contacts_table	\N	\N	2025-11-10 06:58:57.400256+00	1
0cc81589-719c-4ef4-86ef-0035714fe65b	927b3e5ef0ff7009512c7f78cf53a5370b2325ea9cab0c147e4b4b84ec30156c	2025-12-19 06:43:30.988578+00	20251219064328_contract_management_numeric_fields_for_weight	\N	\N	2025-12-19 06:43:29.556233+00	1
6ed1d3b9-6301-4d15-b9c8-4e9123d1528a	a24342324d7a38616b4404814cb24e14c7ce5dfa4cb8154ea9eedd46b01d3946	2025-11-18 03:58:31.524697+00	20251118035829_add_partnership_documents_table	\N	\N	2025-11-18 03:58:30.259745+00	1
d4b9b8ee-a52e-436a-ad36-58e33be2cd17	ef351387757fd3b2a99af39df9dfe5a2c5b9b673d692fca5b39dce228e354d47	2025-11-18 07:07:11.423878+00	20251118070708_make_scope_optional	\N	\N	2025-11-18 07:07:10.202238+00	1
0d602035-1048-422f-8e05-3a04d6ffa805	ce46e3076d56b743e96869f495faae9746f0a1106872b79be15635359ee1f146	2025-11-19 06:28:05.646344+00	20251119062803_add_activity_and_category	\N	\N	2025-11-19 06:28:04.394632+00	1
fd3cc10e-f817-4c33-b86f-84a14373e388	34a8e05cc54b15927965fd3e00e3b598bac4e219cb6dfe43ad534d8cc2704638	2025-12-22 09:51:00.525272+00	20251222095057_init_activity_monitoring	\N	\N	2025-12-22 09:50:59.066938+00	1
00fe96d1-3567-4756-abbd-a4deb8a6d31c	774d5c6faec27f7782ca2163e92b66fb825fa83e8cdfdf0164ed15bf85b1bab8	2025-11-19 06:54:37.105946+00	20251119065434_delete_doc_link_field	\N	\N	2025-11-19 06:54:35.864211+00	1
e1929278-f747-4752-ba37-b785d674f0d5	ed726a42b85f141c106ae6fb12d4eaf37bff00a1f20367cdc5efea3e752d652b	2025-11-27 04:40:39.958086+00	20251127044037_add_approval_columns	\N	\N	2025-11-27 04:40:38.431138+00	1
e34d3866-2959-41cd-8aaf-0ef9f7207e5b	ab84a4b11303cdd1e92fadb76a1e9c88add3a39b6c980e7e6e62bd59c2266f06	2026-01-01 15:58:53.549858+00	20260101155850_add_meeting_status	\N	\N	2026-01-01 15:58:52.274573+00	1
0a3990f6-df18-41ce-aa90-b5d6988e3a32	d4768242cc9c6e563c034286eb0a4d66b9d12f4aa06404d49f94bb2d0af582ca	2025-12-04 06:26:34.070668+00	20251204062630_delete_activity_type	\N	\N	2025-12-04 06:26:32.23057+00	1
72cd71ea-4f62-4241-9c73-65d8e91b72a1	509f7bbcf741b248367ba193db2dfe74e1b4ea79757c668c75e999779e32cd28	2025-12-22 10:10:56.730539+00	20251222101053_update_activity_status_enum	\N	\N	2025-12-22 10:10:55.401867+00	1
1f6ee534-a2a9-4e7c-b6da-f947389c2988	c0576ad0bafb0a1e44e107a7066c48d4085da4324dada2c4bf26bd0acd6a467a	2025-12-04 06:28:56.815503+00	20251204062852_change_activity_type_to_array	\N	\N	2025-12-04 06:28:54.76851+00	1
b722c3b4-26da-41fc-bfe3-f309d510569b	fba9bb38442364d52f98cb8aa103e8985e5544bcf29c96324f499ccffca15676	2025-12-04 07:35:19.659372+00	20251204073516_create_activity_table	\N	\N	2025-12-04 07:35:17.818846+00	1
e413d6dd-249b-425b-bdab-1d7fafc57797	5ffe7c2ef9bc2fcb426c437dd9e48b3e7858377037be5ade38af0111209e5998	2025-12-08 02:31:25.715138+00	20251208023121_add_notes_field_to_partnership_activity	\N	\N	2025-12-08 02:31:23.668129+00	1
18efbd26-63b4-4254-bd60-95e8efb5d384	f6de573859dd4c1ebe6b749de5317112551eb86f76e8cc23c4a40ff6dbc78d24	2025-12-22 10:20:27.981444+00	20251222102025_update_activity_monitoring_column	\N	\N	2025-12-22 10:20:26.673607+00	1
8c710813-b5b9-450d-b3bd-622df2c768fb	3af0e73fddeae9429100993344ca7eb55a2a3fc4d234dd0176fab63fcaa448ee	2025-12-16 03:59:36.933211+00	20251216035934_create_contract_management_table	\N	\N	2025-12-16 03:59:35.563841+00	1
a462595d-88ab-4fcb-9e4e-5d649b62d578	c5733591bd50629efd25fcc04883635d7fe9ae5a22077e7fead0ab3a2885c6e1	2025-12-19 03:36:35.117491+00	20251219033632_contract_management_numeric_fields	\N	\N	2025-12-19 03:36:33.682916+00	1
74b37b11-68bb-49af-b576-3a3941ba43c2	b01f8fb4425c1a8a037753e2fb7fca8ed942ba315245761298d125d4ffea2a4b	2026-01-07 03:28:03.281639+00	20260107032759_change_column_decimal_to_float_in_contract_management	\N	\N	2026-01-07 03:28:01.676046+00	1
9530c795-d060-415e-b672-caccddc3a464	3d99733c0c6af7082263a0ea63d66a0119440681015e419537911ce4faee025f	2025-12-30 03:02:08.452925+00	20251230030205_create_management_report	\N	\N	2025-12-30 03:02:06.988821+00	1
35252950-b066-4d4f-8c38-f87df8538700	a889c40eb5361da3dcfd0ae7696461808000452e813a5e0e8a646576f7f66e41	2026-01-06 06:30:54.686022+00	20260106063050_update_activity_room_logic	\N	\N	2026-01-06 06:30:52.644324+00	1
49835b5d-7a08-4175-a1a2-cc5294ec26f0	6c206c58adc4265d78f7e415e2dc926ec0352e2f791012a1dd528cbcc8783061	2025-12-30 04:06:36.659486+00	20251230040634_add_indexes_management_report	\N	\N	2025-12-30 04:06:35.38925+00	1
1bed791f-050b-4887-9269-acc02fea4769	0d137b9f1d22c06e492bc4b4ff1a2aa2b53d505a73bb3e050c50c86781a83e33	2025-12-31 02:10:33.148423+00	20251231021030_init_employee_tpa_and_lecturer_table	\N	\N	2025-12-31 02:10:31.86391+00	1
84b08b76-6e0c-416d-90c5-cb4e3aa0aab7	5051ce2c73bfeb254b7e3a58eb9d384fd3d128b2a4906a67c6382f4f9dea93a6	2025-12-31 04:17:11.08652+00	20251231041708_create_meeting_tables	\N	\N	2025-12-31 04:17:09.769641+00	1
f2417615-fb25-4564-9971-bae28b4882d5	4cacb32c32d078bc1afa6b564c277781192beed4a4b23fbcb7f162307ef84dd3	2026-01-06 06:42:11.55243+00	20260106064207_restructure_activity_table	\N	\N	2026-01-06 06:42:09.430517+00	1
305a0061-7d9b-42b2-89f5-c5e6d686a79c	168f26be98ce421b345d15744ed1ea44505285c157682b8b13067c7d3d6db3cc	2026-01-06 07:18:10.742993+00	20260106071806_add_sekprodi_enum	\N	\N	2026-01-06 07:18:08.754542+00	1
a6b797c9-6020-4380-b52a-d0708ecb3809	723210f953bb5efb70bc2d86fda6958596b4316a3aedc52c7b2c7bc49ac8f3e0	2026-01-12 07:10:08.375458+00	20260112071005_restructure_meeting_schema	\N	\N	2026-01-12 07:10:07.060503+00	1
aae00fdb-b192-4c79-9bb9-8d2b522c6ca9	ff455fe168579aae662e490607f7cd8d1e978f7e20b41102d8a1183667de1f86	2026-01-07 03:14:14.523152+00	20260107031411_change_target_to_string	\N	\N	2026-01-07 03:14:13.246913+00	1
9b799561-ed1b-4108-8dd4-d299f6f164bb	48303080a93c25104273afd2859acbb8dfd2ade9145460b8317acd932d8935e9	2026-01-13 02:26:15.946207+00	20260113014753_change_meeting_action_status_to_open_closed		\N	2026-01-13 02:26:15.946207+00	0
5608cdde-9b31-43b5-b72f-a96209cbed27	61ba5a9460e29f2b824403b813c50fc374074fe3fdd56df788a97ba40e12c5f0	\N	20260128050748_add_username_column_on_users	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260128050748_add_username_column_on_users\n\nDatabase error code: 42710\n\nDatabase error:\nERROR: enum label "admin" already exists\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42710), message: "enum label \\"admin\\" already exists", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("pg_enum.c"), line: Some(348), routine: Some("AddEnumLabel") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260128050748_add_username_column_on_users"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260128050748_add_username_column_on_users"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:260	\N	2026-01-28 07:02:15.375172+00	0
\.


--
-- Data for Name: activity_monitoring; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activity_monitoring (id, title, description, date, "startTime", "endTime", participants, unit, room, officials, status, created_at, updated_at, location_detail) FROM stdin;
25	Rapat AIM-6 	Rapat persiapan AIM yang akan dijadwalkan pada perkuliahan minggu ke-7 dan 9 Semester Genap 25/26	2026-01-27	2026-01-27 06:00:00	2026-01-27 08:00:00	9	ProdiS1Akuntansi	RuangRapatMiossuLt2	{KaprodiS1Akuntansi,SekprodiS1Akuntansi}	Normal	2026-01-21 07:15:37.152	2026-01-21 08:03:24.599	\N
17	Rapat Manajemen		2026-01-07	2026-01-07 08:30:00	2026-01-07 12:00:00	30	Dekan	RuangRapatManterawuLt2	{KaurSDMKeuangan,Ponggawa}	Normal	2026-01-05 08:31:12.526	2026-02-18 03:58:12.1	\N
36	One-Day Workshop AACSB	08.30 – 09.00 \tSetting the Emotional Tone\n09.00 – 10.00\tThe Philosophy Behind AACSB \n10.00 – 11.30\tUnderstanding AACSB Through Games\n11.30 – 13.00 \tIsoma\n13.00 – 13.30\tPenjelasan SLO dan Kompetensi Fakultas\n13.30 – 14.00\tDiskusi penentuan kompetensi prodi\n14.00 – 15.00\tFinalisasi kompetensi prodi \n15.00 – 15.30\tClosing — Emotional Anchor \n\nGAMES\nWaktu Main: 60 Menit\nTim 1 (Koordinator: Prof Anton, Bu Winda)\n1. Dekan\n2. Kaprodi MM\n3. Kaprodi MBA\n4. Kaprodi S1 Akuntansi\n5. Sekprodi MBTI Reguler\n6. Sekprodi S1 Adbis Inter\n7. Ketua KK TBM\n8. Kaur Akademik\nTim 2 (Koordinator: Bu Nurafni, Bu Citra)\n1. WD1\n2. Kaprodi MM PJJ\n3. Kaprodi S1 Adbis\n4. Kaprodi S1 LM\n5. Sekprodi MBTI Inter\n6. Sekprodi S1 Akuntansi\n7. Ketua KK DBES\n8. Kaur SDM\nTim 3 (Koordinator: Bu Dian, Bu Siska)\n1. WD2\n2. Kaprodi MAKSI\n3. Kaprodi S1 MBTI\n4. Kaprodi S1 Bisdi\n5. Sekprodi MM\n6. Sekprodi S1 Adbis Reguler\n7. Sekprodi MM PJJ\n8. Ketua KK AEFS	2026-02-20	2026-02-20 01:30:00	2026-02-20 08:30:00	50	Dekan	RuangRapatManterawuLt2	{Ponggawa}	Normal	2026-02-18 03:55:00.28	2026-02-19 02:11:10.909	\N
37	Rapat Senat		2026-02-25	2026-02-25 06:00:00	2026-02-25 09:00:00	30	Dekan	AulaManterawu	{Dekanat}	Normal	2026-02-19 04:46:41.741	2026-02-19 04:46:41.741	\N
27	Pelantikan Pengurus KAFEGAMA Jawa Barat	Pelantikan pengurus KAFEGAMA dan seminar	2026-02-03	2026-02-03 05:00:00	2026-02-03 08:30:00	50	Dekan	Lainnya	{Rektor,Ponggawa,Dekan}	Normal	2026-02-04 03:08:11.285	2026-02-04 03:09:37.462	Gedung Bangkit, Ruang Multimedia
34	Munggahan		2026-02-18	2026-02-18 04:30:00	2026-02-18 06:30:00	70	Dekan	RuangRapatManterawuLt2	{Ponggawa}	Normal	2026-02-18 03:51:43.724	2026-02-18 03:51:43.724	\N
35	Pemantauan Akreditasi LAMEMBA	Agenda: Rapat Koordinasi Rencana Pemantauan LAMEMBA Tahun 2026 di FEB\nPenyelenggara: SPM\n	2026-02-19	2026-02-19 03:00:00	2026-02-19 04:00:00	50	Dekan	Lainnya	{Ponggawa}	Normal	2026-02-18 03:53:29.16	2026-02-18 03:53:29.16	zoom
24	Rapat Pengampuan FEB		2026-02-02	2026-02-02 02:00:00	2026-02-02 05:00:00	150	Dekan	AulaFEB	{SekprodiS1ICTBusiness,Ponggawa}	Normal	2026-01-21 02:07:17.031	2026-02-20 02:40:26.354	\N
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.contacts (id, name, title, phone_number, notes, created_at, updated_at) FROM stdin;
20	Mohammad Tyas Pawitra	Nama kegiatan tidak diisi	6285221885685@c.us	\N	2025-11-14 09:38:31.741	2025-11-14 09:38:31.741
40	Prof. Farida Titik K		6281394982607@c.us	Dekan FEB	2025-12-04 04:02:27.626	2025-12-04 04:02:27.626
41	Deannes Isynuwardhana		6281320028400@c.us	Wakil Dekan 2	2025-12-05 06:36:10.29	2025-12-05 06:36:10.29
42	Irni Yunita		628122171430@c.us	Wakil Dekan 1	2025-12-05 06:36:52.961	2025-12-05 06:36:52.961
43	Rofi		6285157455205@c.us	TLH DEKANAT	2026-02-05 07:31:59.461	2026-02-05 07:31:59.461
\.


--
-- Data for Name: contract_management; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.contract_management (id, "ContractManagementCategory", responsibility, quarterly, unit, max, min, pers_real, value, "Input", "Monitor", created_at, updated_at, weight, target, realization, achievement) FROM stdin;
1184	Financial	Operating Ratio Fakultas	TW-1	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	7.5	56,02	40.45	\N
1185	Financial	Operating Ratio Fakultas	TW-2	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	7.5	49,20	38.36	\N
1186	Financial	Operating Ratio Fakultas	TW-3	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	7.5	47,64	36.49	\N
1187	Financial	Operating Ratio Fakultas	TW-4	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	7.5	RKA	\N	\N
1188	Financial	Operating Ratio & Cash Collection Telkom University (Common Indikator)	TW-1	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	2.5	100	114.46	\N
1189	Financial	Operating Ratio & Cash Collection Telkom University (Common Indikator)	TW-2	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	2.5	100	106.23	\N
1190	Financial	Operating Ratio & Cash Collection Telkom University (Common Indikator)	TW-3	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	2.5	100,00	106.17	\N
1191	Financial	Operating Ratio & Cash Collection Telkom University (Common Indikator)	TW-4	%	120	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	2.5	RKA	\N	\N
1192	NonFinancial	Kepuasan Mahasiswa (EDOM)	TW-1	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1193	NonFinancial	Kepuasan Mahasiswa (EDOM)	TW-2	%	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	82	85.1	\N
1194	NonFinancial	Kepuasan Mahasiswa (EDOM)	TW-3	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1195	NonFinancial	Kepuasan Mahasiswa (EDOM)	TW-4	%	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	82	85.7	\N
1196	NonFinancial	Customer Satisfaction Index	TW-1	%	105	80	\N	\N	86,81	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	8	75	86.81	\N
1197	NonFinancial	Customer Satisfaction Index	TW-2	%	\N	\N	\N	\N	86,81	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1198	NonFinancial	Customer Satisfaction Index	TW-3	%	\N	\N	\N	\N	86,81	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1199	NonFinancial	Customer Satisfaction Index	TW-4	%	\N	\N	\N	\N	86,81	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1200	InternalBusinessProcess	Lulusan mendapat pekerjaan yang layak	TW-1	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1201	InternalBusinessProcess	Lulusan mendapat pekerjaan yang layak	TW-2	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1202	InternalBusinessProcess	Lulusan mendapat pekerjaan yang layak	TW-3	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	18	57.56	\N
1203	InternalBusinessProcess	Lulusan mendapat pekerjaan yang layak	TW-4	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1204	InternalBusinessProcess	Kelulusan Tepat Waktu	TW-1	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1205	InternalBusinessProcess	Kelulusan Tepat Waktu	TW-2	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1206	InternalBusinessProcess	Kelulusan Tepat Waktu	TW-3	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	57	73.52	\N
1207	InternalBusinessProcess	Kelulusan Tepat Waktu	TW-4	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1208	InternalBusinessProcess	DO dan Undur Diri (Turn Over) Mahasiswa Angkatan Habis Masa Studi	TW-1	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1209	InternalBusinessProcess	DO dan Undur Diri (Turn Over) Mahasiswa Angkatan Habis Masa Studi	TW-2	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1210	InternalBusinessProcess	DO dan Undur Diri (Turn Over) Mahasiswa Angkatan Habis Masa Studi	TW-3	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	15	11.98	\N
1211	InternalBusinessProcess	DO dan Undur Diri (Turn Over) Mahasiswa Angkatan Habis Masa Studi	TW-4	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1212	InternalBusinessProcess	Kelas yang kolaboratif dan partisipatif 	TW-1	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	15	60	84.38	\N
1213	InternalBusinessProcess	Kelas yang kolaboratif dan partisipatif 	TW-2	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1214	InternalBusinessProcess	Kelas yang kolaboratif dan partisipatif 	TW-3	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	60	89.3	\N
1215	InternalBusinessProcess	Kelas yang kolaboratif dan partisipatif 	TW-4	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1216	InternalBusinessProcess	Mahasiswa mendapat pengalaman di luar kampus	TW-1	%	\N	\N	\N	\N	\N	https://bpa.telkomuniversity.ac.id/dashboard-mahasiswa/	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1217	InternalBusinessProcess	Mahasiswa mendapat pengalaman di luar kampus	TW-2	%	\N	\N	\N	\N	\N	https://bpa.telkomuniversity.ac.id/dashboard-mahasiswa/	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1218	InternalBusinessProcess	Mahasiswa mendapat pengalaman di luar kampus	TW-3	%	\N	\N	\N	\N	\N	https://bpa.telkomuniversity.ac.id/dashboard-mahasiswa/	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1219	InternalBusinessProcess	Mahasiswa mendapat pengalaman di luar kampus	TW-4	%	105	80	\N	\N	\N	https://bpa.telkomuniversity.ac.id/dashboard-mahasiswa/	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	12	55	\N
1220	InternalBusinessProcess	Jumlah kerjasama infrastruktur laboratorium	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1221	InternalBusinessProcess	Jumlah kerjasama infrastruktur laboratorium	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1222	InternalBusinessProcess	Jumlah kerjasama infrastruktur laboratorium	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1223	InternalBusinessProcess	Jumlah kerjasama infrastruktur laboratorium	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	2	8	\N
1224	InternalBusinessProcess	Publikasi Terindex Scopus / WoS	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1225	InternalBusinessProcess	Publikasi Terindex Scopus / WoS	TW-2	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	15	100	285.37	\N
1226	InternalBusinessProcess	Publikasi Terindex Scopus / WoS	TW-3	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	160	421.2	\N
1227	InternalBusinessProcess	Publikasi Terindex Scopus / WoS	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	200	\N	\N
1228	InternalBusinessProcess	Penelitian dan abdimas yang didanai pihak eksternal	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1229	InternalBusinessProcess	Penelitian dan abdimas yang didanai pihak eksternal	TW-2	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	20	29	\N
1230	InternalBusinessProcess	Penelitian dan abdimas yang didanai pihak eksternal	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1231	InternalBusinessProcess	Penelitian dan abdimas yang didanai pihak eksternal	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	40	\N	\N
1232	InternalBusinessProcess	Peningkatan Sitasi Baru dari paper yang terindeks	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1233	InternalBusinessProcess	Peningkatan Sitasi Baru dari paper yang terindeks	TW-2	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	500	2273	\N
1234	InternalBusinessProcess	Peningkatan Sitasi Baru dari paper yang terindeks	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1235	InternalBusinessProcess	Peningkatan Sitasi Baru dari paper yang terindeks	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	1000	\N	\N
1236	InternalBusinessProcess	International Publication Collaboration	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1237	InternalBusinessProcess	International Publication Collaboration	TW-2	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	25	112.83	\N
1238	InternalBusinessProcess	International Publication Collaboration	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1239	InternalBusinessProcess	International Publication Collaboration	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	40	\N	\N
1240	InternalBusinessProcess	Desa Binaan	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1241	InternalBusinessProcess	Desa Binaan	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1242	InternalBusinessProcess	Desa Binaan	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1243	InternalBusinessProcess	Desa Binaan	TW-4	Jumlah	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	4	10	\N
1244	InternalBusinessProcess	Prestasi kompetisi (tingkat Internasional/Nasional/Provinsi)	TW-1	Skor	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1245	InternalBusinessProcess	Prestasi kompetisi (tingkat Internasional/Nasional/Provinsi)	TW-2	Skor	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	50	174.8	\N
1246	InternalBusinessProcess	Prestasi kompetisi (tingkat Internasional/Nasional/Provinsi)	TW-3	Skor	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1247	InternalBusinessProcess	Prestasi kompetisi (tingkat Internasional/Nasional/Provinsi)	TW-4	Skor	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	75	\N	\N
1248	InternalBusinessProcess	Jumlah pendanaan hibah kompetisi belmawa (termasuk innovillage)	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1249	InternalBusinessProcess	Jumlah pendanaan hibah kompetisi belmawa (termasuk innovillage)	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1250	InternalBusinessProcess	Jumlah pendanaan hibah kompetisi belmawa (termasuk innovillage)	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1251	InternalBusinessProcess	Jumlah pendanaan hibah kompetisi belmawa (termasuk innovillage)	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	6	6	\N
1252	InternalBusinessProcess	Jumlah dosen yang terlibat membina kompetisi minimal tingkat nasional (Keterlibatan Membimbing)	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1253	InternalBusinessProcess	Jumlah dosen yang terlibat membina kompetisi minimal tingkat nasional (Keterlibatan Membimbing)	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1254	InternalBusinessProcess	Jumlah dosen yang terlibat membina kompetisi minimal tingkat nasional (Keterlibatan Membimbing)	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1255	InternalBusinessProcess	Jumlah dosen yang terlibat membina kompetisi minimal tingkat nasional (Keterlibatan Membimbing)	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	20	\N	\N
1256	InternalBusinessProcess	Prodi Kelas Internasional dengan Dual/Joint Degree Aktif minimal submit kemendikbud	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1257	InternalBusinessProcess	Prodi Kelas Internasional dengan Dual/Joint Degree Aktif minimal submit kemendikbud	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1258	InternalBusinessProcess	Prodi Kelas Internasional dengan Dual/Joint Degree Aktif minimal submit kemendikbud	TW-3	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	15	3	3	\N
1259	InternalBusinessProcess	Prodi Kelas Internasional dengan Dual/Joint Degree Aktif minimal submit kemendikbud	TW-4	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1260	InternalBusinessProcess	Kesiapan Jumlah mahasiswa inbound mobility	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1261	InternalBusinessProcess	Kesiapan Jumlah mahasiswa inbound mobility	TW-2	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	210	534	\N
1262	InternalBusinessProcess	Kesiapan Jumlah mahasiswa inbound mobility	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1263	InternalBusinessProcess	Kesiapan Jumlah mahasiswa inbound mobility	TW-4	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1264	InternalBusinessProcess	Mahasiswa outbound mobility (short dan long program)	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1265	InternalBusinessProcess	Mahasiswa outbound mobility (short dan long program)	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1266	InternalBusinessProcess	Mahasiswa outbound mobility (short dan long program)	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1267	InternalBusinessProcess	Mahasiswa outbound mobility (short dan long program)	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	675	\N	\N
1268	InternalBusinessProcess	Performansi Dosen S3 (Sesuai SK yang Ditetapkan)	TW-1	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1269	InternalBusinessProcess	Performansi Dosen S3 (Sesuai SK yang Ditetapkan)	TW-2	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1270	InternalBusinessProcess	Performansi Dosen S3 (Sesuai SK yang Ditetapkan)	TW-3	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1271	InternalBusinessProcess	Performansi Dosen S3 (Sesuai SK yang Ditetapkan)	TW-4	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	100	\N	\N
1272	InternalBusinessProcess	Performansi terkait JFA Lektor, Lektor Kepala, dan Guru Besar (Sesuai SK yang Ditetapkan)	TW-1	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1273	InternalBusinessProcess	Performansi terkait JFA Lektor, Lektor Kepala, dan Guru Besar (Sesuai SK yang Ditetapkan)	TW-2	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1274	InternalBusinessProcess	Performansi terkait JFA Lektor, Lektor Kepala, dan Guru Besar (Sesuai SK yang Ditetapkan)	TW-3	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1275	InternalBusinessProcess	Performansi terkait JFA Lektor, Lektor Kepala, dan Guru Besar (Sesuai SK yang Ditetapkan)	TW-4	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	100	\N	\N
1276	InternalBusinessProcess	Mata kuliah menerapkan standard Online Learning	TW-1	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1277	InternalBusinessProcess	Mata kuliah menerapkan standard Online Learning	TW-2	%	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	90	97.47	\N
1278	InternalBusinessProcess	Mata kuliah menerapkan standard Online Learning	TW-3	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1279	InternalBusinessProcess	Mata kuliah menerapkan standard Online Learning	TW-4	%	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	90	106.98	\N
1280	InternalBusinessProcess	Jumlah learning factory*	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1281	InternalBusinessProcess	Jumlah learning factory*	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1282	InternalBusinessProcess	Jumlah learning factory*	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1283	InternalBusinessProcess	Jumlah learning factory*	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	1	15	\N
1284	InternalBusinessProcess	Jumlah sertifikasi (untuk mahasiswa)	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1285	InternalBusinessProcess	Jumlah sertifikasi (untuk mahasiswa)	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1286	InternalBusinessProcess	Jumlah sertifikasi (untuk mahasiswa)	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1287	InternalBusinessProcess	Jumlah sertifikasi (untuk mahasiswa)	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	8	38	\N
1288	InternalBusinessProcess	Penelitian Dosen TRL >=4 Granted PPM 	TW-1	Jumlah	110	80	\N	\N	https://telkomuniversityofficial-my.sharepoint.com/:x:/g/personal/pppi_365_telkomuniversity_ac_id/EYGRi_DMbItOqQ_ogON6OCsBFJhcomA5FNFw2N0b9vhkpg?e=IkJ52h&nav=MTVfezAyQTVBRkY2LTFDQTEtNDBDQy1BRUZELTczQTY1MTk1MkJBMn0	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	20	5	70	\N
1289	InternalBusinessProcess	Penelitian Dosen TRL >=4 Granted PPM 	TW-2	Jumlah	110	80	\N	\N	https://telkomuniversityofficial-my.sharepoint.com/:x:/g/personal/pppi_365_telkomuniversity_ac_id/EYGRi_DMbItOqQ_ogON6OCsBFJhcomA5FNFw2N0b9vhkpg?e=IkJ52h&nav=MTVfezAyQTVBRkY2LTFDQTEtNDBDQy1BRUZELTczQTY1MTk1MkJBMn0	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	20	46	\N
1290	InternalBusinessProcess	Penelitian Dosen TRL >=4 Granted PPM 	TW-3	Jumlah	110	80	\N	\N	https://telkomuniversityofficial-my.sharepoint.com/:x:/g/personal/pppi_365_telkomuniversity_ac_id/EYGRi_DMbItOqQ_ogON6OCsBFJhcomA5FNFw2N0b9vhkpg?e=IkJ52h&nav=MTVfezAyQTVBRkY2LTFDQTEtNDBDQy1BRUZELTczQTY1MTk1MkJBMn0	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	10	30	48	\N
1291	InternalBusinessProcess	Penelitian Dosen TRL >=4 Granted PPM 	TW-4	Jumlah	110	80	\N	\N	https://telkomuniversityofficial-my.sharepoint.com/:x:/g/personal/pppi_365_telkomuniversity_ac_id/EYGRi_DMbItOqQ_ogON6OCsBFJhcomA5FNFw2N0b9vhkpg?e=IkJ52h&nav=MTVfezAyQTVBRkY2LTFDQTEtNDBDQy1BRUZELTczQTY1MTk1MkJBMn0	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	50	\N	\N
1292	InternalBusinessProcess	Tim Startup Berbasis Inovasi yang baru	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1293	InternalBusinessProcess	Tim Startup Berbasis Inovasi yang baru	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1294	InternalBusinessProcess	Tim Startup Berbasis Inovasi yang baru	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1295	InternalBusinessProcess	Tim Startup Berbasis Inovasi yang baru	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	10	7	\N
1296	InternalBusinessProcess	Jumlah HKI yang diimplementasikan di industri*	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1297	InternalBusinessProcess	Jumlah HKI yang diimplementasikan di industri*	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1298	InternalBusinessProcess	Jumlah HKI yang diimplementasikan di industri*	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1299	InternalBusinessProcess	Jumlah HKI yang diimplementasikan di industri*	TW-4	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	5	1	2	\N
1300	InternalBusinessProcess	Persentase dosen yang berkegiatan tridharma di luar kampus	TW-1	%	110	80	\N	\N	Jumlah Dosen FEB : 193	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	20	10	64.76	\N
1301	InternalBusinessProcess	Persentase dosen yang berkegiatan tridharma di luar kampus	TW-2	%	\N	\N	\N	\N	Jumlah Dosen FEB : 193	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1302	InternalBusinessProcess	Persentase dosen yang berkegiatan tridharma di luar kampus	TW-3	%	\N	\N	\N	\N	Jumlah Dosen FEB : 193	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1303	InternalBusinessProcess	Persentase dosen yang berkegiatan tridharma di luar kampus	TW-4	%	\N	\N	\N	\N	Jumlah Dosen FEB : 193	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1304	InternalBusinessProcess	Persentase dosen yang memiliki sertifikasi profesi	TW-1	%	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	20	10	57.29	\N
1305	InternalBusinessProcess	Persentase dosen yang memiliki sertifikasi profesi	TW-2	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1306	InternalBusinessProcess	Persentase dosen yang memiliki sertifikasi profesi	TW-3	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1307	InternalBusinessProcess	Persentase dosen yang memiliki sertifikasi profesi	TW-4	%	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1308	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP research di CoE	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1309	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP research di CoE	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1310	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP research di CoE	TW-3	Jumlah	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	45	69	\N
1311	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP research di CoE	TW-4	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1312	InternalBusinessProcess	Jumlah dosen yang ditugaskan untuk terlibat di entrepreneurship berkolaborasi dengan BTP	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1313	InternalBusinessProcess	Jumlah dosen yang ditugaskan untuk terlibat di entrepreneurship berkolaborasi dengan BTP	TW-2	Jumlah	110	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	10	19	\N
1314	InternalBusinessProcess	Jumlah dosen yang ditugaskan untuk terlibat di entrepreneurship berkolaborasi dengan BTP	TW-3	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1315	InternalBusinessProcess	Jumlah dosen yang ditugaskan untuk terlibat di entrepreneurship berkolaborasi dengan BTP	TW-4	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1316	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP entrepreneurship dan Program Entrepreneurship lainnya di BTP	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1317	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP entrepreneurship dan Program Entrepreneurship lainnya di BTP	TW-2	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1318	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP entrepreneurship dan Program Entrepreneurship lainnya di BTP	TW-3	Jumlah	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	50	127	\N
1319	InternalBusinessProcess	Jumlah mahasiswa yang terlibat WRAP entrepreneurship dan Program Entrepreneurship lainnya di BTP	TW-4	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1320	InternalBusinessProcess	Jumlah Pegawai yang Mengikuti dan Menuntaskan Kewajiban Peningkatan kompetensi SDM	TW-1	Jumlah	\N	\N	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	\N	\N	\N	\N
1321	InternalBusinessProcess	Jumlah Pegawai yang Mengikuti dan Menuntaskan Kewajiban Peningkatan kompetensi SDM	TW-2	Jumlah	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	7	19	\N
1322	InternalBusinessProcess	Jumlah Pegawai yang Mengikuti dan Menuntaskan Kewajiban Peningkatan kompetensi SDM	TW-3	Jumlah	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	4	14	23	\N
1323	InternalBusinessProcess	Jumlah Pegawai yang Mengikuti dan Menuntaskan Kewajiban Peningkatan kompetensi SDM	TW-4	Jumlah	105	80	\N	\N	\N	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	28	\N	\N
1324	InternalBusinessProcess	Kelengkapan Lapman	TW-1	%	105	80	\N	\N	Kelengkapan Lapman	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	7	90	100	\N
1325	InternalBusinessProcess	Kelengkapan Lapman	TW-2	%	105	80	\N	\N	Kelengkapan Lapman	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	90	100	\N
1326	InternalBusinessProcess	Kelengkapan Lapman	TW-3	%	105	80	\N	\N	Kelengkapan Lapman	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	90	100	\N
1327	InternalBusinessProcess	Kelengkapan Lapman	TW-4	%	105	80	\N	\N	Kelengkapan Lapman	\N	2026-01-07 03:41:52.504	2026-01-07 03:41:52.504	3	90	100	\N
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.conversations (id, user_id, category, last_bot_message_id, step, created_at) FROM stdin;
\.


--
-- Data for Name: employee_tpa; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.employee_tpa (id, name, nip, work_unit, employment_status, created_at, updated_at) FROM stdin;
1	Alfi Inayati S.Pd	22970021	Urusan Sekretariat	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
2	Asep Sudrajat S.Kom.	15840035	Kepala Urusan Laboratorium/Bengkel/Studio	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
3	Astri Anggelia S.E.	21840003	Prodi S3 Manajemen	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
4	Aulia Ferina Sendhitasari S.Kom	23990038	Prodi S1 Bisnis Digital	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
5	Azam Fhadillah Mulki S. T	62400039	Prodi S2 Akuntansi	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
6	Desma Luluk Arianti S.Pi.	62498040	Urusan Akademik	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
7	Enung Muhaemi	1710044	Prodi S1 Akuntansi	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
8	Hani Widianingrum S.Ak.	23000039	Urusan Akademik	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
9	Harrys Sudarmadji S.M.B.	19900033	Prodi S1 Manajemen	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
10	Imas Maesyaroh A.Md.	19800005	Urusan Akademik	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
11	Indra Gunawan S.Kom.	12830015	Kepala Urusan Kemahasiswaan	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
12	Irwan Mulyawan S.Pd.	15820076	Urusan Kemahasiswaan	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
13	Ismaya Indrayanti S. A. B	22970019	Prodi S1 Administrasi Bisnis	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
14	Kharisma Ellyana S.M.B.	15850073	Urusan Kemahasiswaan	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
15	Khoerunisa Mubarrokah Kusumawardhani S.Pd	62498041	Prodi S2 Manajemen	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
16	Mesayu Ana Hanifah Yahsallah S.H.	23940021	Urusan Sumber Daya Manusia dan Keuangan	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
17	Mohammad Tyas Pawitra S.M.B.	15870055	Kepala Urusan Sekretariat	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
18	Muhamad Ramadhan S. E	23910010	Urusan Akademik	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
19	Muhammad Farhan Ramadhan S.Pd	23990037	Prodi S2 Manajemen	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
20	Nathaleo Michel Apon S.T.	12830063	Kepala Urusan Sumber Daya Manusia dan Keuangan	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
21	Nensi Damayanti S.S.	15860094	Urusan Laboratorium/Bengkel/Studio	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
22	Puji Adhiayati S.KM	62497042	Prodi S2 Administrasi Bisnis	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
23	Ratih Raihun Raihanun S.T., M.T.	22000009	Urusan Sumber Daya Manusia dan Keuangan	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
24	Sela Garnita S.M.	22950037	Prodi S2 Manajemen PJJ	TPA Profesional Full Time	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
25	Setiadi S.Kom.	15860072	Kepala Urusan Akademik	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
26	Shinta Sekaring Wijiutami S.M.	23950041	Prodi S1 Manajemen Bisnis Rekreasi	TPA Pegawai Tetap	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
27	Ahmad Sidik Rofiudin S.Kom	82501081	Urusan Sekretariat	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
28	Ansari Siddieqi Yustia S.Kom.	82497100	Urusan Kemahasiswaan	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
29	Dara Dhenissa Herman S.Sos.	82502079	Prodi S1 Manajemen (Inter)	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
30	Farhan Dzulfikri S. M	82401031	Prodi S2 Manajemen PJJ	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
31	Fauzan Taufiqul Hakim S.M.	82501076	Prodi S2 Manajemen PJJ	TLH (Borongan)	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
32	Khevin Arviansyah S.Kom.	82401134	Urusan Laboratorium/Bengkel/Studio	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
33	Luthfi Nur Hakim S. S. I	82501014	Prodi S2 Manajemen	TLH (Borongan)	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
34	Muhammad Fauzi Ghifari A.Md.Kom	82200002	Urusan Laboratorium/Bengkel/Studio	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
35	Muhammad Nizar Ihsan Sabilah S.Kom.	82401133	Urusan Sumber Daya Manusia dan Keuangan	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
36	Muhammad Rabbani Syawal A.Md.S.I.Ak.	82502078	Urusan Sumber Daya Manusia dan Keuangan	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
37	Ratu Alifia Chairunnisa S.M.	82599077	Urusan Sumber Daya Manusia dan Keuangan	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
38	Rifki Nurhuda Isnaeni S.M.B.	82384345	Prodi S1 Akuntansi	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
39	Rizky Pratama Hibatulah Amd. Kom, S. Kom	82201311	Urusan Sekretariat	TLH	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
40	Salsabila Ramadhania S.M.	-	Urusan Akademik	TLH (Borongan)	2025-12-31 02:26:54.742	2025-12-31 02:26:54.742
\.


--
-- Data for Name: lecturers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.lecturers (id, nip, nuptk, front_title, name, back_title, prodi, lecturer_code, education, job_functional, created_at, updated_at) FROM stdin;
1	23660002	1560744645130070	Dr. Ir.	A. Mukti Soma	M.M.	S2 MAN	DUL	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
2	02760025	1041754655130140		Abdullah	S.Pd., M.M.	S1 MAN	DLL		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
3	23890007	8656767668130250		Abdurrahman Faris Indriya Himawan	S.E., M.SM., Ph.D.	S1 MAN	MWN	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
4	91660037	2360744645230080		Ade Irma Susanty	M.M., Ph.D.	S1 ADBIS	NTY	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
5	10730006	0458751652137062	Dr.	Adhi Prasetio	S.T., M.M.	S1 MAN	AHP	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
6	24880006	9459766667130300	Dr.	Adi Santoso	SE., MM., CMA.	S1 MAN	DST	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
7	14720030	1047750651130200		Aditya Wardhana	S.E.,M.Si.,M.M	S1 ADBIS	ADT		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
8	14680034	3146746647130130	Dr.	Agus Maolana Hidayat	S.E.,M.Si	S1 ADBIS	AUM	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
9	23940016	5337772673230320		Ajeng Luthfiyatul Farida	S.E., M.Akun	S1 AKUN	AJF		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
10	22670001	1453745646130090	Dr.	Akhmad Yunani	S.E., M.T	S1 ADBIS	AKU	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
11	23740003	5550752653130100		Aldi Akbar	A.T.,M.M	S1 ADBIS	LDI	S3	AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
12	14870046	9962765666237030		Aldilla Iradianty	S.E., M.M.	S1 MAN	LDL		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
13	92700026	7958748649130150	Dr	Alex Winarno	S.T., M.M	S1 ADBIS	WNO	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
14	21880008	1450766667130240		Ali Riza Fahlevi	S.E., Ak., M.Acc., CA.	S1 AKUN	AFV		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
15	08860064	6140764665230380		Andrieta Shintia Dewi	S.Pd., M.M.	S1 MAN	TSD	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
16	13710043	2259749650130110	Dr.	Andry Alamsyah	S.Si., M.Sc.	S1 MAN	YAL	S3	GB	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
17	14870053	2061765666230260	Dr.	Anisah Firli	S.M.B., M.M.	S2 MAN PJJ	NFY	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
18	12770068	0542755656230143		Anita Silvianita	S.E., M.S.M., Ph.D	S2 ADBIS	AVA	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
19	15890059	7248767668230290		Annisa Nurbaiti	S.E., M.Si.	S1 AKUN	NBT		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
20	23730002	6460751652130080	Dr.	Anton Mulyono Azis	S.E., M.T.	S2 MAN PJJ	AYZ	S3	GB	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
21	19920021	7148770671130370		Ardan Gani Asalam	S.E., M.Ak., BKP.	S1 AKUN	GAA		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
22	23920012	6539770671130290		Ardio Sagita	S.E., M.Sc.	S1 MAN	IOS	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
23	0	0	Dr.	Arief Arianto Hidayat		S1 MAN		S3		2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
24	21870002	1258765666230210		Arien Arianti Gunawan	S.S., M.S.M., M.Phil. PhD.	S1 MAN	IGW	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
25	20810001	4354759660130150		Arif Kuswanto	S.T.,M.B.A	S1 ADBIS	KWO		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
26	08800009	9560758659230200		Arlin Ferlina Mochamad Trenggana	S.E.,M.M.	S1 ADBIS	AFO		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
27	11780029	0851756657130112		Arry Widodo	Ph.D.	S2 ADBIS	AWO	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
28	11770007	3463755656130090		Ary Ferdian	S.T., M.M.	S1 LM	AFE		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
29	24840003	8550762663230240	Dr.	Ashri Putri Rahadi	S.T.,M.S.M.,M.Sc.	S1 ADBIS	HPI	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
30	24860001	8558764665130960		Asrarul Rahman	SST (Akt), MBIS (Prof), PhD, CFE, CISA	S1 AKUN	LAM	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
31	13800049	7347758659130180	Dr.	Astadi Pangarso	S.T.,M.B.A	S1 ADBIS	NGA	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
32	14800037	6056758659230140	Dr.	Astri Ghina	S.Si., M.S.M.	S2 MAN	ATG	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
33	10790015	9757757658231100	Dr.	Astrie Krisnawati	S.Sos., MSi.M.	S1 MAN	AWC	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
35	02620020	6348740641137060	Dr	Brady Rikumahu	S.E., M.B.A.	S1 AKUN	BRD	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
36	23800006	5244758659137010		Budi Prasetiyo	S.Sos., M.M.	S1 ADBIS	BPC	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
37	14800070	1935758659130170		Budi Rustandi Kartawinata	S.E.,M.M	S1 ADBIS	BDR	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
38	08830052	3361761662230200	Dr.	Cahyaningsih	S.E., Ak., M.Si.	S2 AKUN	CYH	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
39	13630031	3249741642130080	Ir.	Candiwan	M.ICT.	S1 MAN	CDW		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
40	14840076	1346762663130220		Candra Wijayangka	S.T.,M.M.	S1 ADBIS	CRW		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
41	10820044	1956760661230180		Citra Kusuma Dewi	S.E., M.A.B. Ph.D	S2 MAN	CKD	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
42	14900030	3133768669231020		Cut Irna Setiawati	S.A.B.,M.M.	S1 ADBIS	CUT		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
44	19810006	2037759660130290	Dr.	Dadang Ramdhan	S.IP.,M.S.E.,M.Sc	S1 ADBIS	DGR	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
45	13730024	7934751652130100	Dr.	Daduk Merdika Mansur	S.T., M.M.	S1 MAN	DMD	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
46	24720001	9958750651130150	Dr.	Dali Sadli Mulia	S.T., M.M.	S2 MAN	DSM	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
47	10780055	2358756657230140		Damayanti Octavia	S.E., M.M.	S1 MAN	DOC	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
48	23810001	4443759660130240		Danang Indrajaya	S.Si., M.Si.	S1 MAN	DAJ	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
49	24710001	2636749650130150	Dr.	David Harmaen Suryaman	S.E., M.Ak.	S1 AKUN	DVH	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
50	08790035	0145757658130143		Deannes Isynuwardhana	S.E., M.M., Ph.D	S1 AKUN	YWH	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
51	00760013	8654754655130080	Dr.	Deden Syarif Hidayatulloh	S.Ag., M.Pd.I.	S1 MAN	DSH	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
52	22750003	4049753654130130		Dedi Iskamto	S.E., M.M., Ph.D.	S1 MAN	DKM	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
53	15850065	0158763664131103		Dedik Nur Triyanto	S.E., M.Acc.	S1 AKUN	NYO		LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
54	23850007	9452763664130190		Dematria Pringgabayu	S.AP., M.M.	S1 ADBIS	DMB	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
56	14810054	8557759660230220		Devilia Sari	S.T.,M.S.M	S1 ADBIS	DVL		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
57	14790054	9542757658130190		Dewa Putra Krishna Mahardika	CFA, FRM	S1 AKUN	DPK		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
58	20670001	0554745646230092	Dr.	Dian Indiyati	S.H., S.E., M.Si.	S2 MAN	IIY	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
59	20970029	9460775676230150		Dian Puteri Ramadhani	S.M., M.M	S1 MAN	PDH		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
60	23810006	5534759660230240	Dr.	Didin Kristinawati	S.T., M.Sc.	S1 MAN	DKU	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
61	14720002	9444750651230120	Dr.	Dini Wahjoe Hapsari	S.E., M.Si., Ak.	S2 AKUN	DYP	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
63	10770063	4537755656130130		Dudi Pratomo	S.E.T., M.Ak., Ph.D	S2 AKUN	DUP	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
64	22930023	8658771672130280	Dr	Dwi Fitrizal Salim	S.M., M.M	S1 MAN	DFZ	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
65	22760003	7636754655130100		Dwi Urip Wardoyo	S.E., M.M.Si	S1 AKUN	DFY		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
66	19720003	1449750651130090	Dr.	Edi Witjara	S.T., M.H.	S2 MAN	ETJ	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
67	13780036	4959756657230110		Eka Yuliana	S.T., MSM	S1 MAN	EYU	S3	AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
68	19670002	4760745646230060		Elly Suryani	S..E., M.Si., Ak., CA., CPA	S1 AKUN	ESI		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
69	13730060	0535751652230123		Elvira Azis	S.E., M.T.	S1 MAN	EAZ	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
70	24820004	1942760661137020	Dr. M.,	Eman Sulaiman	S.T., M.M	S1 MAN	EMS	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
71	08820021	9661760661230200		Erni Martini	S.Sos., M.M.	S1 MAN	EMI	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
73	15890044	8043767668230290		Eva Nurhazizah	S.T., M.M.	S1 LM	EVU		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
74	14820065	5351760661130140		Fajar Sidiq Adi Prabowo	S.E., M.A.B.	S1 MAN	FSD		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
75	22860005	0340764665230273	Dr.	Fajra Octrina	S.E., M.M.	S1 MAN	FJO	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
76	25910003	7457769670130300		Fanji Farman	SE., M.Ak	S1 AKUN	-		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
77	24920008	9353770671130280		Faqih Ahmad Muzakky	B.MS. (hons), M.SM., AWP	S1 ADBIS	FQM			2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
78	13860062	3135764665230260		Farah Alfanur	S.Si., M.S.M., M.Eng.	S1 MAN	FAF		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
79	14860081	7359764665230190		Farah Oktafani	S.E.,M.M	S1 ADBIS	OKT		NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
80	14680002	3439746647230090	Dr	Farida Titik Kristanti	S.E., M.Si.	S1 AKUN	FTT	S3	GB	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
81	24820002	2038760661130260	Dr.	Fariz	SE., MM., ICPM.	S2 MAN PJJ	FIZ	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
82	22900016	8455768669137000		Fauzan Aziz	S.M.B., M.B.A.	S1 ADBIS	FZZ		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
83	08780003	6452756657230110	Dr.	Fetty Poerwita Sary	S.S., M.Pd.	S1 MAN	FPS	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
84	24960003	3139774675130220		Fikri Mohamad Rizaldi	B.B.A., M.A.B.	S1 ADBIS	FMO		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
85	15900018	6756768669230410		Fitriani Nur Utami	S.Si.,M.M	S1 ADBIS	FNU		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
86	23840003	6143762663230210		Galuh Sudarawerti	S.E., MBA.	S1 MAN	GLH		NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
87	23730004	1434751652230080	Dr	Galuh Tresna Murti	S.E., M.Si., Ak., CA., ACPA	S1 AKUN	GLM	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
88	14860090	9458764665230220		Grisna Anggadwita	S.T., M.S.M.	S1 MAN	GRG	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
89	14870092	7539765666230240		Hani Gita Ayuningtias	S.Psi., M.M.	S1 MAN	HGT		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
90	08730028	5957751652230100	Dr.	Helni Mutiarsih Jumhur	S.H., M.Hum.	S1 MAN	HMJ	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
91	22720003	2441750651130090	Dr.	Henry Christiadi	S.T., M.M.	S2 MAN PJJ	HCD	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
92	10800002	9445758659231040		Heppy Millanyani	S.Sos., M.M., Ph.D.	S1 LM	HML	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
93	23800007	3152758659130220		Herdiansyah Gustira Pramudia Suryono	S.T., M.E.	S1 ADBIS	HGS		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
94	06730013	9662751652131070		Herry Irawan	M.M., M.T.	S1 MAN	HRI		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
95	22740001	3550752653230090		Hilda	SE., M.Si., Ak., CA., CPA.	S1 AKUN	HLA			2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
96	23880007	1962766667130310	Dr	Hosam Alden Riyadh A-Alazeez	D.Ba., M.Sc.	S1 AKUN	HOR	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
97	19630010	4659741642230090	Dr.	Ida Nurnida	M.M	S1 ADBIS	REL	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
99	24870002	5356765666130270		Ihsan Hadiansah	S.E., M.S.M.	S1 ADBIS	IDB		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
100	00690039	2161747648130100	Dr.	Imanuddin Hasbi	S.T.,M.M.	S1 ADBIS	INB	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
101	25690001	7343747648230130		Ina Nusuki	S.E., Ak., M.Ak., CA.	S1 AKUN	NSK		NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
102	08800005	7455758659230130		Indira Rachmawati	S.T., M.S.M., Ph.D.	S1 MAN	IIW	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
103	90660010	0661744645230072	Dra.	Indrawati	M.M., Ph.D.	S2 MAN	IWI	S3	GB	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
104	24790004	9861757658230130	Dr.	Irayanti Adriant	S.Si., M.T.	S2 MAN	IRI	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
105	13810023	0953759660230182	Dr.	Irni Yunita	S.T., M.M.	S2 MAN PJJ	IRY	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
106	10780031	7936756657130150		Jurry Hatammimi	S.E., M.M., Ph.D.	S1 MAN	JRR	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
107	25950038	0		Kadina Mutiara Hati	S.M.,M.M	S1 MAN	KDM		NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
108	10810037	3148759660237120		Khairani Ratnasari Siregar	S.Si., M.T., Ph.D.	S1 MAN	KHI	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
109	14800017	8753758659230220		Khairunnisa	S.E., M.M.	S1 AKUN	KHN		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
110	12720026	1960750651130120	Dr.	Kiki Sudiana	S.T., M.M, GPHR	S1 MAN	KKS	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
111	22680001	0744746647130162	Dr.	Koenta Adji Koerniawan	SE.,Ak.,MM.,BKP.,CPA.,CA.,M.Ak	S1 AKUN	KOE	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
112	14780054	5355756657130110		Krishna Kusumahadi	B.Sc., M.M.	S1 MAN	KRI		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
113	12770058	9437755656230110		Kristina Sisilia	S.T., M.A.B.	S2 ADBIS	KRT		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
114	19740004	2554752653130110		Kurnia	S.AB., M.M.	S1 AKUN	KRA		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
115	14700034	8254748649230080	Dr.	Leny Suzan	S.E., M.Si.	S2 AKUN	LYU	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
116	21730006	3848751652130100	Dr.	Leonardus W Wasono Miharjo	S.T.,M.Eng.	S1 ADBIS	LWW	S3		2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
117	08750024	7037753654230210		Lia Yuldinawati	S.T., M.M., Ph.D.	S1 MAN	LIA	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
118	24760001	5248754655230130	Dr.	Liza Mahavianti Syamsuri	S.T., M.T.	S1 ADBIS	LMV	S3		2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
120	13860058	0049764665137033		Mahendra Fakhri	S.E., M.A.B.	S1 ADBIS	MAK	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
121	14850064	9154763664130210		Mahir Pradana	S.E., M.Sc.BA., Ph.D	S2 ADBIS	MPR	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
122	11630001	7433741642231350	Dr.	Majidah	S.E., M.Si.	S2 AKUN	MAJ	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
123	14870001	0440765666230262		Marheni Eka Saputri	S.T., M.B.A.	S1 ADBIS	MHE		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
124	15780021	5735756657230160	Dr.	Maria Apsari Sugiat	S.E.Ak., M.M.	S2 MAN PJJ	GAT	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
125	23730003	0756751652131062	Dr.	Marindra Bawono	S.T., M.Sc.	S1 MAN	MBW	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
126	08730016	5748751652231140	Dr.	Maya Ariyanti	S.E., M.M.	S2 MAN	MYY	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
127	23820004	5442760661230220		Maya Irjayanti	S.E., MBA., PhD	S1 MAN	MYJ	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
128	24750001	6055753654230090		Maya Safira Dewi	S.E.,Ak.,M.Si., CA	S2 MAN PJJ	MSD		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
129	14810012	8836759660230250		Mediany Kriseka Putri	S.K.G., M.A.B	S1 MAN	MKP		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
130	23870009	7041765666231120		Mita Kharisma	S.S., M.M.	S1 MAN	MTC	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
131	23910023	5737769670130380		Mochamad Arief Rahman Ramadhian	S.M., M.A.B.	S1 ADBIS	MER		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
132	15830007	0551761662137012		Mochamad Yudha Febrianta	ST., MM.	S1 MAN	YDF	S3	AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
133	23650002	8646743644130070	Dr. Ir.	Mohammad Riza Sutjipto	M.T.	S1 MAN	RZS	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
134	08780061	9445756657130100		Muhamad Muslih	S.E., M.M., CSRA., MOS	S1 AKUN	MSL		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
135	21680001	3447746647130090	Dr. Ir	Muhammad Awaluddin	M.B.A.	S2 MAN	WLU	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
136	12810076	2555759660130170		Muhammad Azhari	S.E., M.B.A.	S1 MAN	MMZ		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
137	23860004	5136764665131120		Muhammad Iqbal Alamsyah	S.E., M.M.	S1 MAN	MIL	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
138	21730008	1241751652130120	Dr.	Muhammad Subhan Iswahyudi	S.T., M.Eng.	S1 ADBIS	MWD	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
139	23680002	0		Muslim Amin	S.E, M.B.A.Ph.D.	S2 MAN PJJ	MSM	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
141	10850035	3757763664230240	Dr.	Nidya Dudija	S.Psi., M.A.	S1 MAN	NDD	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
142	10740051	8437752653230120	Dr. Ir.	Nora Amelda Rizal	M.Sc., M.M.	S1 MAN	NZL	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
144	12730046	6347751652230100	Dr.	Nurvita Trianasari	S.Si., M.Stat.	S1 MAN	NVT	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
145	22690005	8460747648130070		Nuslih Jamiat	S.E., M.M.	S1 ADBIS	NJT		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
146	13780041	4138756657130150		Osa Omar Sharif	S.Si., M.S.M.	S1 MAN	OSA		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
147	13850022	5659763664230270	Dr.	Puspita Kencana Sari	S.Kom., M.T.I.	S1 MAN	PSR	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
148	01770028	4834755656230220		Puspita Wulansari	S.P., M.M., Ph.D.	S2 MAN	PWS	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
149	22840003	7441762663230210	Dr.	Putri Fariska Sugestie	S.Si., M.Si.	S1 MAN	PFS	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
150	13800008	1541758659230150	Dr.	Putu Nina Madiawati	S.T., M.T., M.M.	S2 ADBIS	PNM	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
151	21880010	1148766667230310	Dr.	R Amalina Dewi Kumalasari	S.AB, M.A.B.	S1 ADBIS	RLR	S3	AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
152	24740004	3560752653130110	Dr.	Raden Adrian Ariatin	S.Sn., M.B.A.	S1 ADBIS	RIB	S3		2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
153	13860020	1753764665231100		R. Nurafni Rubiyanti	S.M.B., M.A.B., Ph.D	S2 ADBIS	RRB	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
155	08740053	5443752653230130		Rah Utami Nugrahani	S.Sos., M.A.B., Ph.D.	S1 ADBIS	RUN	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
156	20910015	2045769670130340		Rajiv Dharma Mangruwa	B.Bee, M.Tim., D.B.A	S1 ADBIS	RJV	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
157	08850090	1540763664230210		Ratih Hendayani	S.T., M.M.,Ph.D	S1 MAN	RYN	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
158	23800008	7959758659230160	Dr.	Ratna Komala Putri	S.E., M.Si.	S1 MAN	ROP	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
159	01680016	5734746647230150	Dr. Ir.	Ratna Lindawati Lubis	M.M.	S2 MAN	RLN	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
160	08810047	2451759660230160	Dr.	Ratri Wahyuningtyas	S.T., M.M.	S2 MAN PJJ	RRG	S3	GB	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
161	06760014	9660754655130100		Refi Rifaldi Windya Giri	S.T., M.B.A.	S1 MAN	RRF	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
162	08800015	4734758659230200		Retno Setyorini	S.T., M.M.	S1 ADBIS	RET	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
163	23940028	2459772673130260		Rezzy Eko Caraka	S.Si., M.Sc (RES)., Ph.D	S2 MAN PJJ	REY	S3	NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
164	21650004	3946743644230070	Dr. Ir.	Rina Djunita Pasaribu	M. Sc., CPM	S2 MAN PJJ	RBU	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
165	22850010	5543763664131150	Dr.	Riski Taufik Hidayah	S.E., M.M.	S1 MAN	RTK	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
166	14820051	8155760661230160		Risris Rismayani	S.M.B., S.Pd., M.M.	S1 LM	RRS		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
167	24830003	0156761662130193	Dr.	Rony Wardhana	SE., M.Ak	S1 AKUN	RWO	S3	AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
168	24810001	2456759660130140		Roy Budiharjo	SE., M.Ak	S1 AKUN	RBJ		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
169	10840006	4533762663237010		Rr. Rieka Febriyanti Hutami	S.M.B., M.M.	S1 MAN	RFH		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
170	20710002	3255749650230110		Rr. Sri Saraswati	SE.,Ak., M.Ak	S1 AKUN	SSW	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
171	23930020	2361771672230220		Ruri Octari Dinata	S.E., M.S.A	S1 AKUN	OTD		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
172	24900001	2558768669230300		Salsabila Aisyah Alfaiza	S.E., M.M.	S1 MAN	SAZ		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
173	24900010	4762768669131110		Sauqi Mujahid Robbani	S.M.B.,, MPA.	S1 MAN	SMR			2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
174	23930022	4542771672230290		Sherly Artadita	S.T.P.,M.B.A., M.S.M.	S1 ADBIS	HET		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
175	14810038	4154759660230150		Sisca Eka Fitria	S.T., M.M.	S1 MAN	SSE		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
176	08780059	6442756657230180		Siska Noviaristanti	S.Si., M.T, Ph.D	S2 MAN	SSK	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
177	14850019	1636763664231200		Siska Priyandani Yudowati	S.E., M.B.A.	S1 AKUN	SPW		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
178	20840012	9535762663230210	Dr.	Sita Deliyana Firmialy	S.E., MSM	S1 ADBIS	SIL	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
179	14770009	4544755656230140		Sri Rahayu	S.E., M.Ak., Ak., CA.	S1 AKUN	RIR		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
180	08820025	0742760661231152		Sri Widiyanesti	S.T., M.M., Ph.D.	S1 MAN	YST	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
181	22660001	3247744645130100		Suhal Kusairi	S.E., M.Si., Ph.D	S1 MAN	UHA	S3	LK	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
182	22890012	0238767668130303		Sunu Puguh Hayu Triono	S.T., M.M.	S1 MAN	PUG	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
183	23570002	8443735636130070	Prof. Dr. Ir. H.	Sutarman	M.Sc., IPU	S2 MAN	UTM	S3	GB	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
184	14790007	1551757658130130		Syahputra	S.Sos., M.Sc., Ph.D.	S1 ADBIS	SHP	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
185	15850021	9649763664130240		Tarandhika Tantra	S.MB., M.M.	S1 LM	TAH		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
186	12720045	2160750651130140		Taufan Umbara	S.T., M.M.	S1 ADBIS	TFU		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
187	22730005	3648751652110030		Teguh Iman Santoso	S.Sos., M.M., Ph.D.	S1 MAN	TGO	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
188	24770001	7542755656230130	Dr.	Teodora Winda Mulia	Ak., CA., CPA.	S1 AKUN	TEW	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
189	08800041	9141758659230160		Tieka Trikartika Gustyana	S.E., M.M.	S1 MAN	TKG		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
190	14800013	5658758659131170		Tri Indra Wijaksana	S.Sos., M.Si.	S1 ADBIS	TIJ		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
191	23910016	8140769670230390		Tri Utami Lestari	SE., M.Ak	S1 AKUN	TLE		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
192	15810073	6455759660230150		Tri Widarmanti	S.M.B., MM	S1 MAN	TWM		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
193	21780003	3050756657130140		Triaji Prio Pratomo	S.Pi, M.A.B.	S1 ADBIS	TPO		AA	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
194	14890030	0758767668230292		Trisha Gilang Saraswati	S.E., M.S.M.	S1 ADBIS	TGS		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
195	23900005	5551768669130260		Uruqul Nadhif Dzakiy	S.Si., M.T.	S1 ADBIS	UND	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
196	08850001	1434763664230270		Vaya Juliana Dillak	S.E., M.M.	S1 AKUN	VJD		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
197	24920007	2156770671130300	Dr.M.	Vigory Gloriman Manalu	S.E., M.M.,	S2 MAN PJJ	VGM	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
198	22920021	5239770671230310		Wahdan Arum Inawati	S.E., M.Ak.	S1 AKUN	WRM		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
199	10750028	3050753654230110		Willy Sri Yuliandhari	S.E., Ak., M.M., Ph.D.	S1 AKUN	WSY	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
200	17610023	0159739640230073	Dr.	Wiwin Aminah	S.E., M.M., Akt.	S1 AKUN	WIW	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
202	23870010	7752765666130290		Yogi Suprayogi	S.E., M.M.	S1 ADBIS	YGR	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
203	10770050	7261755656230130		Yuhana Astuti	S.Si., S.E., M.T., M.Agr., Ph.D	S1 MAN	YHN	S3	L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
204	23950032	9035773674230240		Yulia Nur Hasanah	S.Si., M.B.A	S1 ADBIS	YLN		L	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
205	15870091	4536765666130260		Yusza Reditya Murti	S.T., M.Kom.	S1 MAN	YZR		NJAD	2025-12-31 02:26:55.911	2025-12-31 02:26:55.911
\.


--
-- Data for Name: management_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.management_reports (id, indicator, evidence_link, year, tw_1, tw_2, tw_3, tw_4, created_at, updated_at) FROM stdin;
13	Kepuasan Mahasiswa (EDOM)	https://api.restful-api.dev/objects	2026	t	t	t	f	2026-01-06 06:31:59.165	2026-02-09 07:59:21.569
\.


--
-- Data for Name: meeting_action_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.meeting_action_items (id, task, pic, deadline, agenda_id, status, notes) FROM stdin;
63	Menyesuaikan dengan kompetensi Dosen, beban tugas Dosen, beban sks tiap matkul	Wadek I	2026-01-14	102	Open	1. Memetakan Dosen berdasarkan status dan tugas tambahan dosen biasa, Dosen dengan status tugas belajar dan dosen kontrak\n2. Memperhatikan batas maksimal Dosen mengajar sesuai pedoman operasional beban kerja dosen\n3. Pelimpahan mata kuliah kepada /Dosen prodi lainnya, tetap menjaga beban mengajar Dosen prodi agar tidak berlebih
64	Koordinasi  dengan PPM, BTP, Ketua KK untuk pencapaian target KM TW 4 - 2025	Kaur Sekdek	2026-01-07	103	Open	Pengisian target KM TW 4 - 2025 secara lengkap dengan evidence
65	Koordinasi dengan BTP untuk mencari tim startup lainnya dan mendaftarkan tim startup dari S1 Adbis	Kaur Sekdek	2026-01-07	103	Open	BA tim startup FEB dari BTP
66	TRL Penelitian Dosen	Kaur Sekdek	2026-01-07	103	Open	Menggunakan data PPM (TRL >=3 masuk kedalam laporan)
88	Menyelesaikan dokumen Renstra	M Tyas Pawitra	2026-01-23	145	Open	
67	Buat SK Insentif Baru	Kaur SDM	2026-02-26	104	Open	Contoh catatan 1
68	Sosialisasi ke Dosen	Kaprodi	2026-03-02	104	Open	Contoh catatan 2
\.


--
-- Data for Name: meeting_agendas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.meeting_agendas (id, title, discussion, decision, meeting_id) FROM stdin;
145	Membahas mengenai Rolling Renstra	Renstra harus di rolling karena ada perbedaan	Deadline rolling minggu ini	19
104	Evaluasi Kinerja 2025	\N	\N	15
102	Plotting Dosen	Melakukan draft ploting Dosen	\N	18
103	Kontrak Manajemen  FEB TW 4 - 2025	Kelengkapan KM FEB  guna meningkatkan capaian target KM TW 4 - 2025	\N	18
\.


--
-- Data for Name: meetings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.meetings (id, title, date, start_time, end_time, leader, notetaker, participants, created_at, updated_at, status, location_detail, room) FROM stdin;
18	Rapat Manajemen 1 2026	2026-01-07	2026-01-07 12:30:00	2026-01-07 21:00:00	Dekan	Kaur Sekdek	{Ponggawa}	2026-01-21 07:18:17.878	2026-01-21 07:28:24.801	Selesai	Ruang Rapat Manterawu lt. 2	Lainnya
19	Rapat Manajemen 2 2026	2026-02-05	2026-02-05 06:08:00	2026-02-05 10:30:00	Dekan	Adam Solihun	{Dekanat,"M Tyas Pawitra"}	2026-02-05 07:47:41.251	2026-02-05 09:25:29.099	Terjadwal		RuangRapatMiossuLt2
15	Rapat Kerja Tahunan 2026	2026-02-20	2026-02-20 01:00:00	2026-02-20 07:00:00	Dekan	Sekretaris Dekanat	{"Wakil Dekan 1",Kaprodi,"Manajer SDM"}	2026-01-13 02:22:09.639	2026-02-10 03:38:07.508	Terjadwal	Hotel Savoy Homann Bandung	Lainnya
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.messages (id, conversation_id, sender, message_text, need_human, feedback, created_at) FROM stdin;
\.


--
-- Data for Name: partnership_activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.partnership_activities (id, type, status, document_id, notes) FROM stdin;
59	JointDegree	Terlaksana	846	paling mantap
60	DoubleDegree	Terlaksana	846	cukup mantap
61	JointClass	BelumTerlaksana	846	\N
62	StudentExchange	BelumTerlaksana	846	\N
\.


--
-- Data for Name: partnership_documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.partnership_documents (id, year_issued, doc_type, partner_name, scope, pic_external, pic_internal, doc_number_internal, doc_number_external, date_created, signing_type, date_signed, valid_until, notes, has_hardcopy, has_softcopy, created_at, updated_at, partnership_type, approval_dekan, approval_dir_spio, approval_dir_sps, approval_kabag_kst, approval_kabag_sekpim, approval_kaur_legal, approval_rektor, approval_wadek1, approval_wadek2, approval_warek1, doc_link, duration, pic_external_phone) FROM stdin;
846	2024	MoU	Tamara Fulton	national	Qui dolor nobis odit	Cillum dolores irure	945	740	2024-02-12 00:00:00	Commodi et iure culp	2024-10-07 00:00:00	2025-12-11 00:00:00	Sint voluptates reru	f	t	2026-01-28 02:33:28.279	2026-02-09 02:03:25.666	Akademik	Approved	Approved	Skipped	Approved	Skipped	Pending	Pending	Returned	Returned	Skipped	Sint similique sapie	Libero aperiam est 	0851234567
750	2024	MoA	Association of Chartered Certified Accountants (ACCA)	international	\N	Ruri Octari Dinata	172/SAM4/EB-DEK/2024	\N	2024-06-20 17:00:00	\N	2024-06-30 17:00:00	2027-01-06 17:00:00	\N	f	f	2025-12-15 09:14:37.448	2025-12-15 09:14:37.448	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	3 tahun	\N
751	2024	MoA	Hannan Medispa Sdn. Bhd.	international	\N	\N	299/SAM4/EB-DEK/2024	001/HM/UT/10/2024	2024-09-24 17:00:00	\N	\N	\N	\N	f	f	2025-12-15 09:14:38.711	2025-12-15 09:14:38.711	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
752	2024	MoU	Insititute of Singapore Chartered Accountants (ISCA) Singapore	international	\N	Prodi Akuntansi	311/SAM4/EB-DEK/2024	\N	\N	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:38.963	2025-12-15 09:14:38.963	\N	\N	Approved	\N	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
753	2024	MoA	Lal Bahadur Shastri Institute of Management (LBSIM) Delhi India	international	\N	Heppy Millanyani	412/SAM4/EB-DEK/2024	\N	\N	Desk-to-desk	2025-01-17 17:00:00	\N	\N	f	f	2025-12-15 09:14:39.474	2025-12-15 09:14:39.474	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
754	2024	MoA	Nexmu Sdn. Bhd. Malaysia (LSS)	international	\N	Putri Fariska	376/SAM4/EB-DEK/2024	NexMULSS1.Batch14/2024	2024-11-12 17:00:00	Desk-to-desk	2025-01-02 17:00:00	\N	\N	f	f	2025-12-15 09:14:39.734	2025-12-15 09:14:39.734	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
755	2024	MoU	SEGI University Malaysia	international	\N	Ratri Wahyuningtyas	292/SAM3/EB-DEK/2024	\N	\N	Desk-to-desk	2025-01-02 17:00:00	\N	\N	f	f	2025-12-15 09:14:39.996	2025-12-15 09:14:39.996	\N	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	\N	\N	\N
756	2024	MoA	SEGI University Malaysia	international	\N	Ratri Wahyuningtyas	387/SAM4/EB-DEK/2024	\N	\N	Desk-to-desk	2025-01-16 17:00:00	\N	\N	f	f	2025-12-15 09:14:40.497	2025-12-15 09:14:40.497	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
757	2024	IA	SEGI University Malaysia	international	\N	Ratri Wahyuningtyas	685/SAM05/EB-DEK/2024	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:40.758	2025-12-15 09:14:40.758	\N	\N	Approved	\N	Approved	\N	\N	\N	Approved	Approved	\N	\N	\N	\N
758	2024	MoA	Universiti Tenaga Nasional (UNITEN), Malaysia	international	\N	Putri Fariska	\N	\N	\N	\N	\N	\N	Belum ditandatangani UNITEN	f	f	2025-12-15 09:14:41.28	2025-12-15 09:14:41.28	\N	\N	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
759	2024	MoA	Fakultas Ilmu Komputer Universitas Indonesia (FASILKOM UI)	national	\N	Puspita K. S.	308/SAM4/COE-EADT/2024	765/PKS/FASILKOM/UI/2024	\N	Desk-to-desk	\N	2029-09-29 17:00:00	\N	f	f	2025-12-15 09:14:41.842	2025-12-15 09:14:41.842	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
760	2024	MoU	PT. Angkasa Pura II	national	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:42.094	2025-12-15 09:14:42.094	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
761	2024	MoU	Sekolah Tinggi Ilmu Ekonomi Sabang (STIES) Banda Aceh	national	Muhammad	Dudi Pratomo	290/SAM3/EB-DEK/2024	190/MoU/STIES/XI/2024	2024-11-20 17:00:00	Desk-to-desk	2025-01-02 17:00:00	\N	\N	f	f	2025-12-15 09:14:42.598	2025-12-15 09:14:42.598	\N	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	\N	\N	6285370608217
762	2024	MoA	Universitas Hayam Wuruk PERBANAS	national	\N	\N	\N	\N	\N	\N	\N	\N	Tidak ada balasan dari UHW	f	f	2025-12-15 09:14:42.851	2025-12-15 09:14:42.851	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
763	2024	MoA	Universitas Islam Negeri Sumatera Utara (UINSU) Medan	national	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:43.118	2025-12-15 09:14:43.118	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
764	2024	MoA	Universitas YASRI	national	\N	Prodi Akuntansi	\N	\N	\N	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:43.383	2025-12-15 09:14:43.383	\N	\N	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
765	2024	IA	Universitas YASRI	national	\N	Prodi Akuntansi	807/SAM05/EB-DEK/2024	007/SPA-YARSI/YARSI/IA/XII/2024	\N	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:43.639	2025-12-15 09:14:43.639	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
766	2024	MoA	Yayasan Kesehatan (YAKES) Telkom	national	\N	Erni Martini	340/SAM4/COE-EADT/2024	67/HK.620/YAKES-32/2024	\N	Desk-to-desk	\N	\N	\N	f	f	2025-12-15 09:14:43.893	2025-12-15 09:14:43.893	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
767	2024	MoU	Aberdeen University	international	\N	\N	\N	\N	\N	Desk-to-desk	\N	2029-09-16 17:00:00	\N	f	f	2025-12-15 09:14:44.145	2025-12-15 09:14:44.145	\N	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	\N	5 tahun	\N
768	2024	MoU	Grant Thornton	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:44.401	2025-12-15 09:14:44.401	\N	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	\N	\N	\N
769	2024	MoA	Institut Akuntan Publik Indonesia (IAPI)	national	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:45.189	2025-12-15 09:14:45.189	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
770	2024	MoA	London School of Accountancy & Finance (LSAF)	international	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:45.466	2025-12-15 09:14:45.466	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
771	2024	MoA	Politeknik Internasional Bali (PIB)	national	\N	Prodi LM	316/SAM4/EB-DEK/2024	54/MoA-PIB/IX/2024	\N	Desk-to-desk	2024-09-17 17:00:00	2025-09-17 17:00:00	\N	f	f	2025-12-15 09:14:45.721	2025-12-15 09:14:45.721	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
772	2024	MoA	PT. Krakatau Bandar Samudera	national	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:45.983	2025-12-15 09:14:45.983	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
773	2024	MoA	Young Entrepreneur Academy	national	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:46.248	2025-12-15 09:14:46.248	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
774	2025	MoA	Aberdeen University	international	\N	Ratri Wahyuningtyas	\N	\N	2025-01-01 17:00:00	Desk-to-desk	\N	\N	\N	f	f	2025-12-15 09:14:46.51	2025-12-15 09:14:46.51	\N	\N	Approved	\N	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
775	2025	MoA	Asosiasi Digital Marketing Indonesia (DIGIMIND)	national	\N	TUK	\N	\N	2025-01-20 17:00:00	Desk-to-desk	2025-04-16 17:00:00	\N	\N	f	f	2025-12-15 09:14:46.767	2025-12-15 09:14:46.767	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
776	2025	MoA	Asosiasi Manajemen Indonesia (AMA) Cabang Bandung	national	Rizki	Nuslih Jamiat	055/SAM4/EB-DEK/2025	001/BPC-AMA Jabar/MoA/S/II/2025	2025-02-25 17:00:00	Ceremonial (Int)	2025-03-09 17:00:00	2028-03-09 17:00:00	\N	f	f	2025-12-15 09:14:47.03	2025-12-15 09:14:47.03	\N	Approved	Approved	Approved	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	6285795298524
777	2025	MoA	CPA Australia	international	Aslina	Prodi Akuntansi	\N	\N	2025-02-12 17:00:00	Ceremonial (Int)	2025-02-12 17:00:00	\N	\N	f	f	2025-12-15 09:14:47.652	2025-12-15 09:14:47.652	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
778	2025	MoA	PT. Sembodo Rental Indonesia	national	\N	Prodi LM	\N	\N	\N	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:47.956	2025-12-15 09:14:47.956	\N	\N	Approved	\N	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
779	2025	MoA	The Papandayan Hotel	national	\N	Prodi LM	\N	\N	2025-02-27 17:00:00	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:48.265	2025-12-15 09:14:48.265	\N	\N	Approved	\N	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
780	2025	MoA	Grafika Cikole	national	\N	Yuhana Astuti	\N	\N	2025-02-27 17:00:00	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:48.567	2025-12-15 09:14:48.567	\N	\N	\N	\N	\N	\N	\N	\N	Approved	Approved	\N	\N	\N	\N
781	2025	MoU	Sekolah Tinggi Manajemen PPM Jakarta	national	\N	Ahmad Yunani	\N	\N	2025-03-03 17:00:00	Desk-to-desk	\N	\N	\N	f	f	2025-12-15 09:14:49.1	2025-12-15 09:14:49.1	\N	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	Approved	\N	\N	\N
782	2025	MoA	Universitas Winaya Mukti (UNWIM)	national	\N	Tri Utami	\N	\N	2025-03-03 17:00:00	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:49.365	2025-12-15 09:14:49.365	\N	\N	\N	\N	\N	\N	\N	\N	Approved	Approved	\N	\N	\N	\N
783	2025	MoA	Mini MM dengan PT. Telkom Indonesia	national	\N	Ajeng	\N	\N	2025-04-21 17:00:00	Desk-to-desk	2025-04-28 17:00:00	\N	\N	f	f	2025-12-15 09:14:49.627	2025-12-15 09:14:49.627	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
784	2025	MoA	Nexmu Sdn. Bhd. Malaysia (LSS)	international	\N	Putri	\N	\N	2025-04-27 17:00:00	\N	\N	\N	Dokumen di Mitra	f	f	2025-12-15 09:14:49.89	2025-12-15 09:14:49.89	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
785	2025	MoA	PT. HGI	national	\N	Nurafni Rubiyanti	0813-9500-0488	\N	\N	Ceremonial (Int)	\N	\N	Dokumen di Mitra	f	f	2025-12-15 09:14:50.177	2025-12-15 09:14:50.177	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
786	2025	MoA	DINAS KEBUDAYAAN DAN PARIWISATA KAB. BANDUNG	national	\N	\N	\N	\N	\N	\N	\N	\N	Dokumen di Prodi	f	f	2025-12-15 09:14:50.445	2025-12-15 09:14:50.445	\N	\N	Approved	\N	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
787	2025	MoU	EKUITAS	national	\N	\N	\N	\N	\N	Desk-to-desk	\N	\N	\N	f	f	2025-12-15 09:14:50.701	2025-12-15 09:14:50.701	\N	Approved	Approved	Approved	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
788	2025	MoA	BSSN	national	\N	\N	\N	\N	\N	\N	\N	\N	Dokumen di BSSN	f	f	2025-12-15 09:14:50.952	2025-12-15 09:14:50.952	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
789	2025	MoA	INNOVATIVE UNIVERSITY COLLEGE	international	\N	\N	\N	\N	\N	\N	\N	\N	Sudah di Dekanat	f	f	2025-12-15 09:14:51.232	2025-12-15 09:14:51.232	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
790	2025	MoU	DKM Al-Hidayah	national	\N	\N	\N	\N	2025-07-09 17:00:00	\N	\N	\N	Dokumen di Mitra	f	f	2025-12-15 09:14:51.758	2025-12-15 09:14:51.758	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
791	2025	MoA	BRIN	national	\N	Maya Ariyanti	\N	\N	\N	\N	\N	\N	Dokumen di Mitra	f	f	2025-12-15 09:14:52.035	2025-12-15 09:14:52.035	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
792	2025	MoA	EKUITAS	national	\N	Maya Irjayanti	\N	\N	\N	\N	\N	\N	paraf bu Irni	f	f	2025-12-15 09:14:52.544	2025-12-15 09:14:52.544	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
793	2025	MoA	Journal of Accounting and Investment (JAI)	national	\N	Maya Irjayanti	\N	\N	2025-07-14 17:00:00	Desk-to-desk	\N	\N	\N	f	f	2025-12-15 09:14:52.798	2025-12-15 09:14:52.798	\N	Approved	Approved	Approved	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
794	2025	MoA	Mini MM dengan Telkom Access	national	\N	Ajeng	\N	\N	2025-07-14 17:00:00	Desk-to-desk	2025-06-18 17:00:00	\N	\N	f	f	2025-12-15 09:14:53.05	2025-12-15 09:14:53.05	\N	Approved	Approved	Approved	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
795	2025	MoU	PANDI	national	\N	Helni	\N	\N	2025-07-23 17:00:00	\N	\N	\N	belum diambil mitra	f	f	2025-12-15 09:14:53.301	2025-12-15 09:14:53.301	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
796	2025	MoA	JASWITA	national	\N	Prodi LM	\N	\N	2025-07-30 17:00:00	Desk-to-desk	\N	\N	\N	f	f	2025-12-15 09:14:53.567	2025-12-15 09:14:53.567	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
797	2025	MoA	English Now (EF)	national	\N	Prodi Adbis	\N	\N	\N	\N	\N	\N	Legal SPIO	f	f	2025-12-15 09:14:53.822	2025-12-15 09:14:53.822	\N	\N	\N	\N	\N	\N	\N	\N	Approved	Approved	\N	\N	\N	\N
798	2025	IA	Universitas Lambung Mangkurat (SCBTII)	national	\N	Galuh Tresna Mukti	\N	\N	\N	Desk-to-desk	\N	\N	\N	f	f	2025-12-15 09:14:54.08	2025-12-15 09:14:54.08	\N	Approved	Approved	Approved	Approved	Approved	Approved	\N	Approved	Approved	\N	\N	\N	\N
799	2025	MoA	Universitas Esa Unggul	national	\N	Galuh Tresna Mukti	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:54.338	2025-12-15 09:14:54.338	\N	\N	\N	\N	\N	\N	\N	\N	Approved	Approved	\N	\N	\N	\N
800	2025	IA	Universitas Esa Unggul (SCBTII)	national	\N	Galuh Tresna Mukti	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:54.591	2025-12-15 09:14:54.591	\N	\N	\N	\N	\N	\N	\N	\N	\N	Approved	\N	\N	\N	\N
801	2025	MoA	JOURNAL ON INFORMATICS VISUALIZATION AND SOCIAL COMPUTING (JIVSC)	national	\N	Yusza	\N	\N	\N	\N	\N	\N	Legal	f	f	2025-12-15 09:14:55.101	2025-12-15 09:14:55.101	\N	\N	\N	\N	\N	\N	\N	\N	\N	Approved	\N	\N	\N	\N
802	2025	MoA	INTERNATIONAL JOURNAL OF SUSTAINABLE BUSINESS, MANAGEMENT AND ACCOUNTING (IJSBMA)	national	\N	Yusza	\N	\N	\N	\N	\N	\N	Legal	f	f	2025-12-15 09:14:55.36	2025-12-15 09:14:55.36	\N	\N	\N	\N	\N	\N	\N	\N	\N	Approved	\N	\N	\N	\N
803	2025	MoA	Sekolah Tinggi Farmasi Indonesia (STFI)	national	\N	Nurvita	\N	\N	\N	\N	\N	\N	Berkas perlu dikirim ke mitra	f	f	2025-12-15 09:14:55.619	2025-12-15 09:14:55.619	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
804	2025	MoA	SEKOLAH INDONESIA KUALA LUMPUR, MALAYSIA	international	\N	Dwi Fitrizal	\N	\N	2025-09-25 17:00:00	\N	\N	\N	Berkas dibawa pak Dwi	f	f	2025-12-15 09:14:55.874	2025-12-15 09:14:55.874	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
805	2025	MoA	Nexmu Sdn. Bhd. Malaysia (LSS) Batch 15	international	\N	Cak Faris	\N	\N	\N	\N	\N	\N	Berkas di prodi	f	f	2025-12-15 09:14:56.132	2025-12-15 09:14:56.132	\N	\N	Approved	\N	Approved	\N	Approved	\N	Approved	Approved	\N	\N	\N	\N
806	2025	MoA	INSTITUT AKUNTAN PUBLIK INDONESIA (IAPI)	national	\N	Prodi Akuntansi	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:56.385	2025-12-15 09:14:56.385	\N	\N	Approved	\N	Approved	\N	Submitted	\N	Approved	Approved	\N	\N	\N	\N
807	2025	MoA	Four Points Hotel Bandung	national	\N	Prodi LM	\N	\N	\N	\N	\N	\N	Prodi	f	f	2025-12-15 09:14:56.638	2025-12-15 09:14:56.638	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
808	2025	MoA	PT. Langit Biru Membiru	national	\N	Prodi LM	\N	\N	\N	\N	\N	\N	Prodi	f	f	2025-12-15 09:14:56.897	2025-12-15 09:14:56.897	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
809	2025	MoU	TPCC (MINI MM)	national	\N	Prodi MM	\N	\N	\N	\N	\N	\N	Prodi	f	f	2025-12-15 09:14:57.153	2025-12-15 09:14:57.153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
810	2025	MoA	CHENGDU	international	\N	FEB	\N	\N	\N	\N	\N	\N	LEGAL	f	f	2025-12-15 09:14:57.418	2025-12-15 09:14:57.418	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
811	2025	MoU	AAEW	international	\N	Prodi S2 Akuntansi	\N	\N	\N	\N	\N	\N	Belum 2 bahasa	f	f	2025-12-15 09:14:57.676	2025-12-15 09:14:57.676	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
812	2025	MoA	DINAS PARIWISATA KABUPATEN SUBANG	national	\N	Vigory	\N	\N	\N	\N	\N	\N	LEGAL	f	f	2025-12-15 09:14:57.928	2025-12-15 09:14:57.928	\N	\N	Approved	\N	Approved	\N	Submitted	\N	Approved	Approved	\N	\N	\N	\N
813	2025	MoA	PT. Dinova Kanaya Pratama	national	\N	Prodi Bisnis Digital	\N	\N	2025-11-16 17:00:00	\N	\N	\N	SPIO	f	f	2025-12-15 09:14:58.187	2025-12-15 09:14:58.187	\N	\N	Approved	\N	Approved	\N	Submitted	\N	Approved	Approved	\N	\N	\N	\N
814	2025	MoA	International Islamic University Malaysia (IIUM)	international	\N	Irni Yunita	\N	\N	\N	\N	\N	\N	Drafting	f	f	2025-12-15 09:14:58.441	2025-12-15 09:14:58.441	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
815	2025	MoA	University of Applied Sciences Ruhr West	international	\N	Irni Yunita	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:14:58.696	2025-12-15 09:14:58.696	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
816	2025	MoU	Asosiasi Digital Marketing Indonesia	national	\N	TUK	022/SAM3/EB-DEK/2025	264/MOU/LSP/12/2025	\N	\N	2025-03-04 17:00:00	\N	Pendidikan, Penelitian, Pengabdian pada Masyarakat, dan Pengembangan Sumber Daya Institusi	f	f	2025-12-15 09:14:58.957	2025-12-15 09:14:58.957	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3 Tahun	\N
817	2025	MoU	Sekolah Tinggi Manajemen PPM	national	\N	S1 Administrasi Bisnis	053/SAM3/EB-DEK/2025	13/HE/MoU/STM-PPM/05/25	\N	\N	\N	\N	Penyelenggaraan, Pendidikan, Penelitian, Pengabdian Kepada Masyarakat, dan Pengembangan Sumber Daya Institusi	f	f	2025-12-15 09:14:59.222	2025-12-15 09:14:59.222	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3 Tahun	\N
818	2025	MoU	Sekolah TInggi Ilmu Ekonomi (EKUITAS)	national	Resanti Lestari	Maya Irjayanti	141/SAM03/EB-DEK/2025	21/EKUITAS/MOU/VI/2025	\N	\N	2025-06-25 17:00:00	\N	Pendidikan, Penelitian, Pengabdian pada Masyarakat, dan Pengembangan Sumber Daya Lembaga	f	f	2025-12-15 09:14:59.491	2025-12-15 09:14:59.491	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5 Tahun	\N
819	2025	MoU	Pengelola Nama Domain Internet Indonesia (PANDI)	national	\N	Helni	219/SAM3/EB-DEK/2025	4017.007/1100-5000.192/3500/E.2/VII/2025	\N	\N	\N	\N	Penyelenggaraan, Pendidikan, Penelitian, Pengabdian Kepada Masyarakat, dan Pengembangan Sumber Daya Institusi	f	f	2025-12-15 09:14:59.752	2025-12-15 09:14:59.752	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1 Tahun	\N
820	2025	MoU	Universitas Tenaga Nasional	international	\N	S1 MBTI	288/SAM3/EB-DEK/2025	\N	\N	\N	\N	\N	Academic Collaboration Agreement	f	f	2025-12-15 09:15:00.019	2025-12-15 09:15:00.019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
821	2025	MoU	PT. Telkom Prima Cipta Certifia	national	\N	S2 Manajemen	289/SAM3/EB-DEK/2025	\N	\N	\N	\N	\N	Perjanjian Kerjasama	f	f	2025-12-15 09:15:00.276	2025-12-15 09:15:00.276	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5 Tahun	\N
822	2025	MoU	ASEAN Accounting Education Workgroup	international	\N	S2 Akuntansi	301/SAM3/EB-DEK/2025	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:15:00.556	2025-12-15 09:15:00.556	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
823	2025	MoA	Aberdeen University	international	\N	Ratri Wahyuningtyas	004/SAM4/EB-DEK/2025	\N	\N	\N	\N	\N	Double Degree	f	f	2025-12-15 09:15:00.837	2025-12-15 09:15:00.837	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5 Tahun	\N
824	2025	MoA	Asosiasi Digital Marketing Indonesia	national	\N	TUK	014/SAM4/EB-DEK/2025	420/MoA/LSP/02/2025	\N	\N	2025-03-04 17:00:00	\N	Program Pelatihan dan Sertifikasi Digital Marketing, Content Creator, dan Social Media	f	f	2025-12-15 09:15:01.091	2025-12-15 09:15:01.091	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3 Tahun	\N
825	2025	MoU	Chengdu & ICCCM	international	\N	Irni Yunita	\N	\N	\N	\N	\N	\N	Educational Partnership	f	f	2025-12-15 09:15:01.359	2025-12-15 09:15:01.359	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4 Tahun	\N
826	2025	MoA	Chengdu & ICCCM	international	\N	Irni Yunita	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:15:01.668	2025-12-15 09:15:01.668	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4 Tahun	\N
827	2025	IA	Chengdu & ICCCM	international	\N	Irni Yunita	\N	\N	\N	\N	\N	\N	\N	f	f	2025-12-15 09:15:01.926	2025-12-15 09:15:01.926	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4 Tahun	\N
828	2025	MoA	CPA Australia	international	\N	S1 Akuntansi	\N	\N	\N	\N	2025-01-12 17:00:00	\N	Pengembangan Institusi	f	f	2025-12-15 09:15:02.193	2025-12-15 09:15:02.193	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3 Tahun	\N
829	2025	MoA	Sekolah TInggi Ilmu Ekonomi (EKUITAS)	national	Resanti Lestari	Maya Irjayanti	224/SAM4/EB-DEK/2025	1/EKUITAS/PKS/VIII/2025	\N	\N	2025-06-25 17:00:00	\N	Konferensi Nasional dan Internasional	f	f	2025-12-15 09:15:02.468	2025-12-15 09:15:02.468	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1 Tahun	\N
830	2025	MoA	Innovative University College	international	\N	S1 MBTI	\N	\N	\N	\N	\N	\N	PENDIDIKAN, PENELITIAN, PENGABDIAN KEPADA MASYARAKAT, DAN PENGEMBANGAN SUMBER DAYA LEMBAGA	f	f	2025-12-15 09:15:02.723	2025-12-15 09:15:02.723	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5 Tahun	\N
831	2025	MoA	PT JASA DAN KEPARIWISATAAN JABAR (PERSERODA)	national	\N	S1 LM	\N	\N	\N	\N	\N	\N	MAHASISWA MAGANG PROGRAM STUDI S1 MANAJEMEN BISNIS REKREASI	f	f	2025-12-15 09:15:02.996	2025-12-15 09:15:02.996	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3 Tahun	\N
832	2025	MoA	Journal of Accounting and Investment	national	\N	Maya Irjayanti	\N	\N	\N	\N	\N	\N	Publikasi Penelitian	f	f	2025-12-15 09:15:03.305	2025-12-15 09:15:03.305	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3 Tahun	\N
833	2025	MoA	PT Telkom Akses	national	\N	S2 Manajemen	\N	\N	\N	\N	\N	\N	Program Mini MM	f	f	2025-12-15 09:15:03.563	2025-12-15 09:15:03.563	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30-Sep-25	\N
834	2025	MoA	PT Telkom Indonesia	national	\N	S2 Manajemen	\N	\N	\N	\N	\N	\N	Program Mini MM untuk Mitratel	f	f	2025-12-15 09:15:03.822	2025-12-15 09:15:03.822	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	09-Sep-25	\N
835	2025	MoA	Nexmu Sendirian Berhad (Batch 14)	international	\N	S1 MBTI	\N	\N	\N	\N	\N	\N	The Lean Six Sigma Breen Belt Program (LSS)	f	f	2025-12-15 09:15:04.101	2025-12-15 09:15:04.101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1 Tahun	\N
836	2025	MoA	PT. Hasnur Grup Indonesia	national	\N	Nurafni Rubiyanti	\N	\N	\N	\N	\N	\N	Lingkup Human Capital & Knowledge Management	f	f	2025-12-15 09:15:04.353	2025-12-15 09:15:04.353	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2 Tahun	\N
837	2025	MoA	Sekolah Tinggi Farmasi Indonesia	national	\N	S1 Bisnis Digital	\N	\N	\N	\N	2025-09-25 17:00:00	\N	PENDIDIKAN, PENELITIAN, PENGABDIAN KEPADA MASYARAKAT, DAN PENGEMBANGAN SUMBER DAYA LEMBAGA	f	f	2025-12-15 09:15:04.639	2025-12-15 09:15:04.639	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5 Tahun	\N
838	2025	MoA	The Papandayan Hotel Bandung	national	\N	S1 LM	\N	\N	\N	\N	\N	\N	PENGEMBANGAN KURIKULUM, MAHASISWA MAGANG DAN PENYALURAN LULUSAN PROGRAM STUDI S1 MANAJEMEN BISNIS REKREASI	f	f	2025-12-15 09:15:04.928	2025-12-15 09:15:04.928	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1 Tahun	\N
839	2025	MoA	Universiti Tenaga Nasional, Malaysia	national	\N	S1 MBTI	\N	\N	\N	\N	2025-06-09 17:00:00	\N	Double Degreee	f	f	2025-12-15 09:15:05.183	2025-12-15 09:15:05.183	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5 Tahun	\N
840	2025	MoA	English Now	national	\N	S1 Administrasi Bisnis	322/SAM4/EB-DEK/2025	06/SRTKLR.EN/VIII/2025	\N	\N	2025-09-15 17:00:00	\N	\N	f	f	2025-12-15 09:15:05.46	2025-12-15 09:15:05.46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3 Tahun	\N
841	2025	MoA	PT. Dinova Kanaya Pratama	national	\N	S1 Bisnis Digital	\N	\N	\N	\N	2025-11-25 17:00:00	\N	PENDIDIKAN, PENELITIAN, PENGABDIAN KEPADA MASYARAKAT, DAN PENGEMBANGAN SUMBER DAYA INSTITUSI	f	f	2025-12-15 09:15:05.77	2025-12-15 09:15:05.77	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
842	2025	MoA	Badan Riset Inovasi Nasional (BRIN)	national	Anugerah Yuka Asmara	Maya Ariyanti	173/SAM5/EB-DEK/2025	329/V/KS/08/2025	\N	\N	\N	\N	Penguatan Sistem Inovasi Daerah Melalui Kolaborasi Triple Helix pada Industri Kecil Menengah Sektor Pangan di Kabupaten Bandung	f	f	2025-12-15 09:15:06.066	2025-12-15 09:15:06.066	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1 Tahun	\N
843	2025	IA	Universitas Lambung Mangkurat	national	Ahmad Yunani	Galuh Tresna Murti	328/SAM5/EB-DEK/2025	\N	\N	\N	\N	\N	SCBTII	f	f	2025-12-15 09:15:06.328	2025-12-15 09:19:52.912	Akademik	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: schedule_recipients; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.schedule_recipients (id, schedule_id, contact_id) FROM stdin;
1	1	\N
2	1	\N
4	3	\N
7	6	\N
9	8	\N
12	11	\N
14	13	\N
16	15	\N
18	17	\N
19	18	\N
20	19	\N
24	25	20
34	35	20
36	36	20
38	37	20
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.schedules (id, event_title, event_description, event_time, reminder_time, status, created_by, created_at) FROM stdin;
32	Pulang	Jangan lupa pulang	2025-11-17 09:30:00	2025-11-17 09:29:00	sent	6282318572605@c.us	2025-11-17 09:27:41.681
1	Minum	Jangan lupakan minum air putih	2025-10-24 08:00:00	2025-10-24 06:45:00	sent	6282318572605@c.us	2025-10-24 06:41:53.194
3	Sholat Dhuhur	Jangan lupa sholat dhuhur	2025-10-27 07:00:00	2025-10-27 06:51:00	sent	6282318572605@c.us	2025-10-27 06:50:40.532
33	Sholat Ashar	Jangan lupa sholat	2025-11-18 10:15:00	2025-11-18 10:13:00	sent	6282318572605@c.us	2025-11-18 10:11:53.866
6	Sholat Ashar	Jangan lupakan Sholat Ashar	2025-10-27 08:45:00	2025-10-27 08:35:00	sent	6282318572605@c.us	2025-10-27 08:33:29.459
34	Pulang	Langsung ke Paras	2025-11-18 10:25:00	2025-11-18 10:17:00	sent	6282318572605@c.us	2025-11-18 10:12:53.937
8	Sholat Dhuhur	Jangan lupa untuk sholat dhuhur	2025-10-28 07:00:00	2025-10-28 06:48:00	sent	6282318572605@c.us	2025-10-28 06:46:13.565
35	Wisuda FEB	Sesi 2\n13.30 – 16.30 WIB\nFakultas Ekonomi dan Bisnis	2025-11-28 06:30:00	2025-11-26 04:41:00	cancelled	6282318572605@c.us	2025-11-26 04:40:02.29
11	Sholat Ashar	Jangan lupa sholat ashar tepat waktu	2025-10-28 08:10:00	2025-10-28 07:45:00	sent	6282318572605@c.us	2025-10-28 07:09:39.108
13	Sholat Ashar	Jangan lupa nanti Sholat Ashar	2025-10-29 08:05:00	2025-10-29 07:45:00	sent	6282318572605@c.us	2025-10-29 07:42:40.678
15	Shooting Revisi Video Profile FEB	Shooting Revisi Video Profile FEB	2025-10-30 02:00:00	2025-10-29 08:02:00	sent	6282318572605@c.us	2025-10-29 08:00:40.76
17	Leisure Insight dan Penandatanganan MOA	Jangan lupa untuk menghadiri acara Leisure Insight	2025-10-31 02:00:00	2025-10-29 08:50:00	sent	6282318572605@c.us	2025-10-29 08:46:36.565
18	Makan siang	Makan siang.	2025-10-29 12:30:00	2025-10-29 09:25:00	sent	6282318572605@c.us	2025-10-29 09:22:59.424
19	Pulang	Jangan lupa pulang.	2025-10-29 12:30:00	2025-10-29 09:25:00	sent	6282318572605@c.us	2025-10-29 09:23:17.163
22	Sholat Dhuhur	Jangan lupa sholat	2025-11-10 07:40:00	2025-11-10 07:35:00	sent	6282318572605@c.us	2025-11-10 07:34:46.051
23	Sholat dhuhur	Jangan lupa sholat dhuhur	2025-11-11 07:35:00	2025-11-11 07:31:00	sent	6282318572605@c.us	2025-11-11 07:29:57.146
24	Sholat Ashar	Jangan lupa sholat ashar	2025-11-11 08:36:00	2025-11-11 08:15:00	sent	6282318572605@c.us	2025-11-11 08:02:45.025
36	Wisuda FEB	Sesi 2 \n13.30 – 16.30 WIB \nFakultas Ekonomi dan Bisnis	2025-11-26 06:30:00	2025-11-26 07:55:00	sent	6282318572605@c.us	2025-11-26 07:53:14.392
25	Sholat Ashar	Jangan lupa sholat	2025-11-14 09:45:00	2025-11-14 09:40:00	sent	6282318572605@c.us	2025-11-14 09:38:31.172
26	Nabung 	Jangan lupa nabung	2025-11-14 15:10:00	2025-11-14 15:07:00	sent	6282318572605@c.us	2025-11-14 15:05:25.125
30	Sholat Ashar	Jangan lupa sholat	2025-11-17 08:30:00	2025-11-17 08:27:00	sent	6282318572605@c.us	2025-11-17 08:26:53.329
31	Sholat Ashar lagi	Jangan lupa sholat ashar	2025-11-17 09:15:00	2025-11-17 09:11:00	sent	6282318572605@c.us	2025-11-17 09:10:00.816
37	Jangan lupa solat	Solat dulu ya... :)	2025-11-28 11:00:00	2025-11-28 10:50:00	sent	6282318572605@c.us	2025-11-28 09:30:19.547
39	Testing	hanya pesan testing	2025-12-06 07:30:00	2025-12-05 07:00:00	sent	6282318572605@c.us	2025-12-05 06:58:56.41
\.


--
-- Data for Name: unresolved; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.unresolved (id, message_id, status, assigned_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, "phoneNumber", role, identifier, created_at, full_name, password, updated_at, username) FROM stdin;
7	\N	kaprodi	\N	2026-01-20 09:31:19.449	Kaprodi MBTI	$2b$10$xmo8LcaPbfjMHFnx/Gn78.kly0RnQK5kmPkdynVIxslwmqZURmEjS	2026-01-20 09:31:19.449	kaprodimbti
8	\N	kaprodi	\N	2026-01-21 02:16:52.44	Para Kaprodi	$2b$10$.DJqgJREszDl24otzxpvD.2FGWqaE2vd6o76oStVIlIaMYFdNt1h2	2026-01-21 02:16:52.44	kaprodi
9	\N	kaur	\N	2026-01-21 03:49:54.316	Para Kaur	$2b$10$Fa8mBWE9/fd1sUSUsqt6oe3nLC1vx50DwCl2w8ermVdtdcX8gjppe	2026-01-21 03:49:54.316	kaur
3	\N	admin	\N	2026-01-19 08:23:21.126	UAT Administrator	$2b$10$rPKYXyhgX1hwm2mXHOqBregVcGC6Mq0NO7DLdXTzr36gvV89rjsx2	2026-01-21 05:20:58.08	uat_admin
10	\N	sekprodi	\N	2026-01-21 06:44:40.944	Para Sekprodi	$2b$10$xOuidoMDzgExvSlVUhDTXe0uN.m/uTh/uFkg51Q04L8jjUaPEWGJ2	2026-01-21 06:44:40.944	sekprodi
4	\N	dosen	\N	2026-01-20 04:43:12.377	Dosen saja	$2b$10$Reim9jhW92gV3qRotvxxBO14pAtAl2Hcnmbpj3/LXdDm4HsSfddlq	2026-01-28 08:53:43.395	dosensaja
\.


--
-- Name: Admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Admins_id_seq"', 3, true);


--
-- Name: activity_monitoring_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.activity_monitoring_id_seq', 38, true);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.contacts_id_seq', 43, true);


--
-- Name: contract_management_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.contract_management_id_seq', 1330, true);


--
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.conversations_id_seq', 4, true);


--
-- Name: employee_tpa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.employee_tpa_id_seq', 41, true);


--
-- Name: lecturers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.lecturers_id_seq', 205, true);


--
-- Name: management_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.management_reports_id_seq', 15, true);


--
-- Name: meeting_action_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.meeting_action_items_id_seq', 88, true);


--
-- Name: meeting_agendas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.meeting_agendas_id_seq', 145, true);


--
-- Name: meetings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.meetings_id_seq', 20, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.messages_id_seq', 25, true);


--
-- Name: partnership_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.partnership_activities_id_seq', 62, true);


--
-- Name: partnership_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.partnership_documents_id_seq', 846, true);


--
-- Name: schedule_recipients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.schedule_recipients_id_seq', 40, true);


--
-- Name: schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.schedules_id_seq', 39, true);


--
-- Name: unresolved_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.unresolved_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: Admins Admins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Admins"
    ADD CONSTRAINT "Admins_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: activity_monitoring activity_monitoring_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_monitoring
    ADD CONSTRAINT activity_monitoring_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: contract_management contract_management_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contract_management
    ADD CONSTRAINT contract_management_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: employee_tpa employee_tpa_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_tpa
    ADD CONSTRAINT employee_tpa_pkey PRIMARY KEY (id);


--
-- Name: lecturers lecturers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecturers
    ADD CONSTRAINT lecturers_pkey PRIMARY KEY (id);


--
-- Name: management_reports management_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.management_reports
    ADD CONSTRAINT management_reports_pkey PRIMARY KEY (id);


--
-- Name: meeting_action_items meeting_action_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meeting_action_items
    ADD CONSTRAINT meeting_action_items_pkey PRIMARY KEY (id);


--
-- Name: meeting_agendas meeting_agendas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meeting_agendas
    ADD CONSTRAINT meeting_agendas_pkey PRIMARY KEY (id);


--
-- Name: meetings meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: partnership_activities partnership_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.partnership_activities
    ADD CONSTRAINT partnership_activities_pkey PRIMARY KEY (id);


--
-- Name: partnership_documents partnership_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.partnership_documents
    ADD CONSTRAINT partnership_documents_pkey PRIMARY KEY (id);


--
-- Name: schedule_recipients schedule_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schedule_recipients
    ADD CONSTRAINT schedule_recipients_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: unresolved unresolved_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.unresolved
    ADD CONSTRAINT unresolved_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Admins_username_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Admins_username_key" ON public."Admins" USING btree (username);


--
-- Name: contacts_phone_number_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX contacts_phone_number_key ON public.contacts USING btree (phone_number);


--
-- Name: conversation_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX conversation_id ON public.messages USING btree (conversation_id);


--
-- Name: employee_tpa_nip_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX employee_tpa_nip_key ON public.employee_tpa USING btree (nip);


--
-- Name: lecturers_lecturer_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX lecturers_lecturer_code_key ON public.lecturers USING btree (lecturer_code);


--
-- Name: lecturers_nip_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX lecturers_nip_key ON public.lecturers USING btree (nip);


--
-- Name: management_reports_indicator_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX management_reports_indicator_idx ON public.management_reports USING btree (indicator);


--
-- Name: management_reports_indicator_year_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX management_reports_indicator_year_key ON public.management_reports USING btree (indicator, year);


--
-- Name: management_reports_year_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX management_reports_year_idx ON public.management_reports USING btree (year);


--
-- Name: message_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX message_id ON public.unresolved USING btree (message_id);


--
-- Name: partnership_documents_doc_number_external_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX partnership_documents_doc_number_external_key ON public.partnership_documents USING btree (doc_number_external);


--
-- Name: partnership_documents_doc_number_internal_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX partnership_documents_doc_number_internal_key ON public.partnership_documents USING btree (doc_number_internal);


--
-- Name: user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX user_id ON public.conversations USING btree (user_id);


--
-- Name: users_phoneNumber_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "users_phoneNumber_key" ON public.users USING btree ("phoneNumber");


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: conversations conversations_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_ibfk_1 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: meeting_action_items meeting_action_items_agenda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meeting_action_items
    ADD CONSTRAINT meeting_action_items_agenda_id_fkey FOREIGN KEY (agenda_id) REFERENCES public.meeting_agendas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: meeting_agendas meeting_agendas_meeting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meeting_agendas
    ADD CONSTRAINT meeting_agendas_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.meetings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_ibfk_1 FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: partnership_activities partnership_activities_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.partnership_activities
    ADD CONSTRAINT partnership_activities_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.partnership_documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedule_recipients schedule_recipients_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schedule_recipients
    ADD CONSTRAINT schedule_recipients_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedule_recipients schedule_recipients_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schedule_recipients
    ADD CONSTRAINT schedule_recipients_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: unresolved unresolved_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.unresolved
    ADD CONSTRAINT unresolved_ibfk_1 FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict DTWNx9rYqr1am76mD7ceD9Wg13mvZzrUDl2CxNKsowrzikq2OPeSQOvmgToRtiU


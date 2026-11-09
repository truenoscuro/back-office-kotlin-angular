create table if not exists public.event_publication
(
    id                     uuid                        not null
        primary key,
    completion_attempts    integer                     not null,
    completion_date        timestamp(6) with time zone,
    event_type             varchar(255)                not null,
    last_resubmission_date timestamp(6) with time zone,
    listener_id            varchar(255)                not null,
    publication_date       timestamp(6) with time zone not null,
    serialized_event       varchar(255)                not null,
    status                 varchar(255)
        constraint event_publication_status_check
            check ((status)::text = ANY
                   ((ARRAY ['PUBLISHED'::character varying, 'PROCESSING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying, 'RESUBMITTED'::character varying])::text[]))
);

create table if not exists roles
(
    id          bigint generated always as identity
        constraint roles_pk
            primary key,
    key         text                  not null
        constraint roles_uq
            unique,
    description text                  not null,

    is_active   boolean default false not null,
    is_system   boolean default false not null,
    is_default  boolean default false not null,
    created_by  text                  not null,
    created_at  timestamp             not null,
    updated_by  text,
    updated_at  timestamp
);

comment on table roles is 'Tabla de los rols';

comment on column roles.key is 'Nombre del role';

comment on column roles.description is 'Descripción del rol';

comment on column roles.is_system is 'No se puede eliminar es del sistema';

comment on column roles.is_default is 'Variable por defecto para los nuevos usuarios';


create table if not exists role_permissions
(
    role_id    bigint not null
        constraint role_permissions_roles_id_fk
            references roles,
    permission text   not null,
    constraint role_permissions_pk
        primary key (role_id, permission)
);

comment on column role_permissions.permission is 'Key de permission';



create table if not exists users
(
    id         bigint generated always as identity not null
        constraint users_pk
            primary key,
    email      text                                not null
        constraint users_uq
            unique,
    password   text                                not null,
    role_id    bigint                              not null
        constraint role_permissions_roles_id_fk
            references roles,
    is_system  boolean default false               not null,
    created_by text                                not null,
    created_at timestamp                           not null,
    updated_by text,
    updated_at timestamp
);

comment on table users is 'tabla de usuarios';

comment on column users.is_system is 'No se puede eliminar es del sistema';


create table if not exists label_group
(
    id          bigint generated always as identity
        constraint label_group_pk
            primary key,
    key         text not null
        constraint label_group_uq
            unique,
    description text not null
);

comment on column label_group.key is 'Parametro dl label group';


create table if not exists labels
(
    id             bigint generated always as identity
        constraint labels_pk
            primary key,
    label_group_id bigint not null
        constraint labels_label_group_id_fk
            references label_group,
    key            text   not null,
    constraint labels_uq
        unique (key, label_group_id)
);

comment on column labels.key is 'Key del label';


create table if not exists languages
(
    id         bigint generated always as identity
        constraint languages_pk
            primary key,
    locale     text                  not null
        constraint languages_uq
            unique,
    label_key  text                  not null,
    is_active  boolean default false not null,
    is_system  boolean default false not null,
    is_default boolean default false not null,
    created_by text                  not null,
    created_at timestamp             not null,
    updated_by text,
    updated_at timestamp
);

comment on column languages.locale is 'clave locale ejemplo es o es-ES';

comment on column languages.label_key is 'Key para mostrar en el frontal traducido';

comment on column languages.is_system is 'Parametro del sistema';

comment on column languages.is_default is 'Variable por defecto para los nuevos usuarios';


create table if not exists translations
(
    label_id    bigint    not null
        constraint translations_labels_id_fk
            references labels,
    language_id bigint    not null
        constraint translations_languages_id_fk
            references languages,
    value       text      not null,
    created_by  text      not null,
    created_at  timestamp not null,
    updated_by  text,
    updated_at  timestamp,
    constraint translations_pk
        primary key (language_id, label_id)
);

comment on column translations.value is 'Traducción';



create table if not exists menus
(
    id           bigint generated always as identity not null
        constraint menus_pk
            primary key,
    title        text                                not null,
    icon         text,

    order_sort   bigint  default 99                  not null,
    is_principal boolean default false               not null,
    created_by   text                                not null,
    created_at   timestamp                           not null,
    updated_by   text,
    updated_at   timestamp
);


comment on table menus is 'Tabla d menus';

comment on column menus.title is 'Titulo en formato label';

comment on column menus.is_principal is 'Define si el menú es principal';



create table if not exists screens
(
    id            bigint generated always as identity
        constraint screens_pk
            primary key,
    key           text      not null,
    tab_bar_title text      not null,
    title         text      not null,
    created_by    text      not null,
    created_at    timestamp not null,
    updated_by    text,
    updated_at    timestamp
);

comment on column screens.key is 'Clave de la screen';

comment on column screens.tab_bar_title is 'TItulo de la pesataña superior';

create table if not exists routes
(
    id               bigint generated always as identity
        constraint routes_pk
            primary key,
    description      text            not null,
    role_id          bigint          not null
        constraint routes_roles_id_fk
            references roles,
    breadcrumb_title text            not null,
    path             text default '' not null,
    father_id        bigint          not null
        constraint routes_routes_id_fk
            references routes,
    screen_id        bigint          not null
        constraint routes_screens_id_fk
            references screens,
    menu_id          bigint          not null
        constraint routes_menus_id_fk
            references menus

);

comment on table routes is 'Rutas para el frontal';

comment on column routes.description is 'Texto descriptivo de que hace';

comment on column routes.breadcrumb_title is 'Titulo de breadcrumb';


comment on column routes.path is 'Camino especifico para angular';
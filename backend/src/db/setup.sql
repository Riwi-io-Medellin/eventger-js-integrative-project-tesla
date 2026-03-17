-- Creating Tables

-- Strong Tables

create table discipline (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(45) not null unique 
);

create table role (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(20) not null unique
);

create table department (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(50) not null unique
);

create table scenario (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(45) not null unique,
	location VARCHAR(70) not null
);

create table notification (
	id UUID primary key default gen_random_uuid(),
	title VARCHAR(100) not null,
	description VARCHAR(200) not null,
	type VARCHAR(30) not null,
	urgent BOOLEAN not null,
	created_at TIMESTAMP default current_timestamp,
	event_id UUID,
	constraint fk_event_id
	foreign key (event_id) 
	references public.event(id)
	on delete cascade
	on update cascade	
);

-- Weak tables

create table user (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(100) not null,
	email VARCHAR(100) not null unique,
	password_hash VARCHAR(200) not null,
	is_active BOOLEAN not null default true,
	created_at TIMESTAMP default current_timestamp,
	department_id UUID,
	role_id UUID,
	constraint fk_department_id 
	foreign key (department_id) 
	references public.department(id)
	on delete cascade
	on update cascade,
	constraint fk_role_id
	foreign key (role_id) 
	references public.role(id)
	on delete cascade
	on update cascade
);

create table goal (
	id UUID primary key default gen_random_uuid(),
	title VARCHAR(100) not null,
	amount INT not null,
	year INT not null default extract(year from CURRENT_DATE)::INT,
	month VARCHAR(20) not null default to_char(CURRENT_DATE, 'Month'),
	discipline_id UUID,
	department_id UUID,
	constraint fk_department_id 
	foreign key (department_id) 
	references public.department(id)
	on delete cascade
	on update cascade,
	constraint fk_discipline_id
	foreign key (discipline_id) 
	references public.discipline(id)
	on delete set null
	on update cascade
);

create table space (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(150) not null,
	description VARCHAR(1000) not null,
	status VARCHAR(20) default 'active',
	created_at TIMESTAMP default current_timestamp,
	scenario_id UUID,
	constraint fk_scenario_id
	foreign key (scenario_id) 
	references public.scenario(id)
	on delete cascade
	on update cascade
);

create table event (
	id UUID primary key default gen_random_uuid(),
	title VARCHAR(100) not null,
	description VARCHAR(500),
	start_date TIMESTAMP not null default current_timestamp,
	finish_date TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour'),
	is_active BOOLEAN not null default true,
	created_at TIMESTAMP default current_timestamp,
	discipline_id UUID,
	scenario_id UUID,
	space_id UUID,
	creator_id UUID,
	constraint fk_discipline_id
	foreign key (discipline_id) 
	references public.discipline(id)
	on delete cascade
	on update cascade,
	constraint fk_creator_id
	foreign key (creator_id) 
	references public.user(id)
	on delete cascade
	on update cascade,
	constraint fk_scenario_id
	foreign key (scenario_id) 
	references public.scenario(id)
	on delete cascade
	on update cascade,
	constraint fk_space_id
	foreign key (space_id) 
	references public.space(id)
	on delete cascade
	on update cascade
);

-- Relational tables


create table notification_user (
	id UUID primary key default gen_random_uuid(),
	notification_id UUID references notification(id),
	user_id UUID,
	constraint fk_notification_id
	foreign key (notification_id) 
	references public.notification(id)
	on delete cascade
	on update cascade,
	constraint fk_user_id
	foreign key (user_id) 
	references public.user(id)
	on delete cascade
	on update cascade
);

/*
create table event_user (
	id UUID primary key default gen_random_uuid(),
	user_id UUID references "user"(id),
	event_id UUID references event(id)
);*/

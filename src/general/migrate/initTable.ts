function InitTable(nk: nkruntime.Nakama, logger: nkruntime.Logger) {


  logger.info("============= Start Init tables =============")
  let parameters: any = [];



  logger.info(" - CREATE TABLE z_hero --------------------------------------")
  nk.sqlExec(
    'CREATE TABLE IF NOT EXISTS z_hero (' +
    'id UUID NOT NULL DEFAULT gen_random_uuid(), ' +
    'number_id INT NOT NULL DEFAULT 0,' +
    'name_hero VARCHAR(255) NOT NULL,' +
    'class_type SMALLINT NOT NULL DEFAULT 0,' +
    'xp INT4 NOT NULL DEFAULT 0,' +
    'current_owner_id UUID NOT NULL, ' +
    'stage SMALLINT NOT NULL DEFAULT 0,' +
    'birth_date TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'stats JSONB NOT NULL,' +
    'parents_id UUID ARRAY, ' +
    'source_hero SMALLINT NOT NULL DEFAULT 0,' +
    'current_sale JSONB,' +
    'sale_history JSONB,' +
    'breed_history JSONB,' +
    'genes JSONB NOT NULL,' +
    'CONSTRAINT "primary" PRIMARY KEY (id ASC),' +
    'CONSTRAINT fk_current_owner_id_ref_users  FOREIGN  KEY(current_owner_id)  REFERENCES  users(id))'
    , parameters)


  logger.info(" - CREATE TABLE z_logic --------------------------------------")
  nk.sqlExec(
    'CREATE TABLE IF NOT EXISTS z_logic(' +
    'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
    'description VARCHAR NOT NULL,' +
    'image_url VARCHAR(512) NOT NULL,' +
    'created_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'CONSTRAINT "primary" PRIMARY KEY(id ASC))'
    , parameters
  )

  logger.info(" - CREATE TABLE z_ability --------------------------------------")
  nk.sqlExec(
    'CREATE TABLE IF NOT EXISTS z_ability(' +
    'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
    'logic_id UUID NOT NULL,' +
    'display_name VARCHAR(255) NOT NULL,' +
    'energy SMALLINT NOT NULL DEFAULT 0,' +
    'attack SMALLINT NOT NULL DEFAULT 0,' +
    'defence SMALLINT NOT NULL DEFAULT 0,' +
    'image_url VARCHAR(512),' +
    'created_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'CONSTRAINT "primary" PRIMARY KEY(id ASC),' +
    'CONSTRAINT fk_logic_id_ref_logics  FOREIGN  KEY(logic_id)  REFERENCES  z_logic(id))'
    , parameters
  )

  logger.info(" - CREATE TABLE z_part --------------------------------------")
  nk.sqlExec(
    'CREATE TABLE IF NOT EXISTS z_part(' +
    'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
    'ability_id UUID, ' +
    'display_name VARCHAR(255) NOT NULL,' +
    'special_type_data JSONB NOT NULL,' +
    'class_type SMALLINT NOT NULL DEFAULT 0,' +
    'created_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
    'CONSTRAINT "primary" PRIMARY KEY(id ASC),' +
    'CONSTRAINT fk_ability_id_ref_abilities  FOREIGN  KEY(ability_id)  REFERENCES  z_ability(id))'
    , parameters)

  logger.info("============= End Init tables =============")


}

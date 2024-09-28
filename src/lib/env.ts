import z from "zod";

//Array of enviroment variables names
//In order to validate a new env simply add it's name as string to the array
const ENVIROMENT_VARIABLES: string[] = [];

//creates schema as zod object with env names specified as z.string()
function createEnvSchema(envs: string[]) {
  return z.object(
    envs.reduce((acc, cur) => ({ ...acc, [cur]: z.string() }), {})
  );
}

//creates an object with all enviroment variables from process.env
function createEnvObject(envs: string[]) {
  return envs.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: process.env[cur],
    }),
    {}
  );
}

//parse the schema
const parse = createEnvSchema(ENVIROMENT_VARIABLES).safeParse(
  createEnvObject(ENVIROMENT_VARIABLES)
);

//and throw error if any is missing
if (!parse.success) {
  throw new Error(
    "An enviroment variable is missing.\nOriginal Error:\n",
    parse.error
  );
}

//otherwise exctract the object with all envs and export
const { data: env } = parse;

export default env;

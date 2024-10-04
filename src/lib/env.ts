import z from "zod";

//array of enviroment variables' names as strings
//in order to validate a new env add its name as string to the array
const ENVIROMENT_VARIABLES = [
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NO_SSL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_USER",
  "POSTGRES_HOST",
  "POSTGRES_PASSWORD",
  "POSTGRES_DATABASE",
] as const;

//zod object of strings for each env name
const envSchema = z.object(
  ENVIROMENT_VARIABLES.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: z.string(),
    }),
    {} as Record<(typeof ENVIROMENT_VARIABLES)[number], z.ZodString>
  )
);

//object containing all enviroment variables names assigned to their proper value from process.env
const envObj = ENVIROMENT_VARIABLES.reduce(
  (acc, cur) => ({ ...acc, [cur]: process.env[cur] }),
  {} as Record<(typeof ENVIROMENT_VARIABLES)[number], string | undefined>
);

//parse the schema validating if the envs are properly defined
const parse = envSchema.safeParse(envObj);

//throw error if any is missing
if (!parse.success) {
  throw new Error(
    "One of the enviroment variables is missing.\nOriginal Error :\n",
    parse.error
  );
}

//give access to entire application to the already validated and properly typed envs
const env = parse.data;

export default env;

import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { ObjectId } from 'mongodb';

import { InputFilter } from '@/common/schemas/filter-graphql.schema';

export function filterConvertDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const [filterConvertDirective] = getDirective(schema, fieldConfig, directiveName) || [];

      if (filterConvertDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, { filter: _filter, ...restArgs }, context, info) {
          const filter = convertFilters(_filter);

          return resolve(source, { ...restArgs, filter }, context, info);
        };
        return fieldConfig;
      }
    },
  });
}

export function convertFilters(filters?: InputFilter[]) {
  return filters?.reduce(
    (filterBy, filter) => ({
      ...filterBy,
      [filter.name]: {
        [filter.operator]: filter.isObjectId ? new ObjectId(filter.value as string) : filter.value,
      },
    }),
    {},
  );
}

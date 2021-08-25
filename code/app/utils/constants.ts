import GUEST_JSON from '../../.cache/data.json';

export const GUEST_LIST = GUEST_JSON.filter((g) => g.rank <= 4);
export const NUMBER_OF_TABLES = 12;
export const GUESTS_PER_TABLE = 10;
export const TABLE_NAMES = [
  'Dragon',
  'Psychic',
  'Water',
  'Ice',
  'Grass',
  'Electric',
  'Fire',
  'Ground',
  'Rock',
  'Steel',
  'Poison',
  'Flying'
]
  .slice(0, NUMBER_OF_TABLES)
  .map((tableName, key) => {
    return {
      id: key + 1,
      name: tableName
    };
  });

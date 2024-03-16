import { fakerRU as faker } from '@faker-js/faker';
import { RawLead } from './types';

export const clearObject = (
  object: Record<string, any>,
): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(object).filter((it) => (it[1] === 0 ? true : !!it[1])),
  );
};

export const generateFakeLead = (): Partial<RawLead> => {
  return {
    name: faker.lorem.sentence({ min: 3, max: 5 }),
    price: faker.helpers.rangeToNumber({ min: 1000, max: 10000000 }),
  };
};

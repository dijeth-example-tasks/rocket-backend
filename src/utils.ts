import { fakerRU as faker } from '@faker-js/faker';
import { RawLead, RawUser } from './types';

export const clearObject = (
  object: Record<string, any>,
): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(object).filter((it) => (it[1] === 0 ? true : !!it[1])),
  );
};

export const generateFakeLead = (
  userId: number,
  pipelineId: number,
  statusId: number,
): Partial<RawLead> => {
  return {
    name: faker.person.fullName(),
    price: faker.number.int({ min: 1000, max: 10000000 }),
    responsible_user_id: userId,
    status_id: statusId,
    pipeline_id: pipelineId,
  };
};

export const generateFakeUser = (): Partial<RawUser> => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    'rights[is_free]': true,
  };
};

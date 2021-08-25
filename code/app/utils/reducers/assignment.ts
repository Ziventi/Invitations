import { GUEST_LIST } from 'utils/constants';

import { Guest } from '../../../cli/controller/lib/classes';

export const AssignmentInitialState = GUEST_LIST.reduce(
  (acc: Record<string, AssignmentActionPayload>, guest: Guest) => {
    acc[guest.name] = {};
    return acc;
  },
  {}
);

export const AssignmentReducer: Reducer<AssignmentState, AssignmentAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'full': {
      return { ...action.payload };
    }
    case 'partial': {
      const { table, position } = action.payload;
      const guest = state[action.guest];
      if (!guest) {
        return Object.assign({}, state, {
          [action.guest]: {
            table,
            position
          }
        });
      }

      if (table) guest.table = table;
      if (position) guest.position = position;

      return Object.assign({}, state, {
        [action.guest]: guest
      });
    }
  }
};

export type AssignmentState = Record<string, AssignmentActionPayload>;
export type AssignmentAction =
  | {
      guest: string;
      payload: AssignmentActionPayload;
      type: 'partial';
    }
  | {
      payload: AssignmentState;
      type: 'full';
    };
export type AssignmentActionPayload = {
  table?: number;
  position?: number;
};
type Reducer<State, Action> = (state: State, action: Action) => State;

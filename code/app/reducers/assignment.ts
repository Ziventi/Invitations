import { GUEST_LIST } from 'utils/constants';

import { Guest } from '../../cli/controller/lib/classes';

export const AssignmentInitialState = generateInitialState();

export const AssignmentReducer: Reducer<AssignmentState, AssignmentAction> = (
  state,
  action
) => {
  switch (action.type) {
    case AssignmentActionType.FULL: {
      return Object.assign({}, state, {
        data: action.payload,
        lastActionType: action.type
      });
    }
    case AssignmentActionType.PARTIAL: {
      const { table, position } = action.payload;
      const guest = state.data[action.guest];
      if (!guest) {
        return Object.assign({}, state, {
          lastActionType: action.type,
          data: {
            ...state.data,
            [action.guest]: {
              table,
              position
            }
          }
        });
      }

      if (table) guest.table = table;
      if (position) guest.position = position;

      return Object.assign({}, state, {
        lastActionType: action.type,
        data: {
          ...state.data,
          [action.guest]: guest
        }
      });
    }
    case AssignmentActionType.CLEAR: {
      return generateInitialState(AssignmentActionType.CLEAR);
    }
  }
};

function generateInitialState(
  lastActionType?: AssignmentActionType
): AssignmentState {
  const data = GUEST_LIST.reduce(
    (acc: Record<string, AssignmentActionPayload>, guest: Guest) => {
      acc[guest.name] = {
        table: 0,
        position: 0
      };
      return acc;
    },
    {}
  );
  return { data, lastActionType };
}

export type AssignmentState = {
  data: Record<string, AssignmentActionPayload>;
  lastActionType?: AssignmentActionType;
};

export type AssignmentAction =
  | {
      guest: string;
      payload: AssignmentActionPayload;
      type: AssignmentActionType.PARTIAL;
    }
  | {
      payload: Record<string, AssignmentActionPayload>;
      type: AssignmentActionType.FULL;
    }
  | {
      type: AssignmentActionType.CLEAR;
    };

export type AssignmentActionPayload = {
  table?: number;
  position?: number;
};

export enum AssignmentActionType {
  'PARTIAL',
  'FULL',
  'CLEAR'
}

type Reducer<State, Action> = (state: State, action: Action) => State;

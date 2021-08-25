export const AssignmentInitialState = {};

export const AssignmentReducer: Reducer<AssignmentState, AssignmentAction> = (
  state,
  action
) => {
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
};

export type AssignmentState = Record<string, AssignmentActionPayload>;
export type AssignmentAction = {
  guest: string;
  payload: AssignmentActionPayload;
};
type AssignmentActionPayload = {
  table?: string;
  position?: number;
};
type Reducer<State, Action> = (state: State, action: Action) => State;

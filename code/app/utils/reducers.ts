export const GuestAssignmentInitialState = {};

export const GuestAssignmentReducer: Reducer<State, Action> = (
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

type State = Record<string, ActionPayload>;
type Action = {
  guest: string;
  payload: ActionPayload;
};
type ActionPayload = {
  table?: string;
  position?: number;
};
type Reducer<State, Action> = (state: State, action: Action) => State;

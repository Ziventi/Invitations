import { TABLE_NAMES, GUESTS_PER_TABLE } from 'utils/constants';

export const DistributionInitialState = TABLE_NAMES.reduce(
  (acc: Record<number, Array<string>>, table) => {
    acc[table.id] = new Array(GUESTS_PER_TABLE);
    return acc;
  },
  {}
);

export const DistributionReducer: Reducer<
  DistributionState,
  DistributionAction
> = (_, action) => {
  return { ...action.payload };
};

export type DistributionState = typeof DistributionInitialState;
export type DistributionAction = {
  payload: typeof DistributionInitialState;
};
type Reducer<State, Action> = (state: State, action: Action) => State;

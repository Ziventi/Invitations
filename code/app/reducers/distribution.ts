import { TABLE_NAMES, GUESTS_PER_TABLE } from 'utils/constants';

export const DistributionInitialState = generateInitialState();

export const DistributionReducer: Reducer<
  DistributionState,
  DistributionAction
> = (_, action) => {
  switch (action.type) {
    case 'update': {
      return { ...action.payload};
    }
    case 'clear': {
      return generateInitialState();
    }
  }
};

function generateInitialState(): DistributionState {
  return TABLE_NAMES.reduce((acc: Record<number, Array<string>>, table) => {
    acc[table.id] = new Array(GUESTS_PER_TABLE).fill('');
    return acc;
  }, {});
}

export type DistributionState = Record<number, string[]>;
export type DistributionAction =
  | {
      payload: typeof DistributionInitialState;
      type: 'update';
    }
  | {
      type: 'clear';
    };
type Reducer<State, Action> = (state: State, action: Action) => State;

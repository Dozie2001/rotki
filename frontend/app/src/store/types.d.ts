import { BalanceState } from '@/store/balances/types';
import { Section, Status } from '@/store/const';
import { SessionState } from '@/store/session/types';

type ActionFailure = {
  readonly message: string;
  readonly success: false;
};

type ActionSuccess = {
  readonly success: true;
};

export type ActionStatus = ActionFailure | ActionSuccess;

export interface StatusPayload {
  readonly status: Status;
  readonly section: Section;
}

export interface Version {
  readonly version: string;
  readonly latestVersion: string;
  readonly downloadUrl: string;
}

type SectionStatus = { [section: string]: Status };

export interface RotkehlchenState {
  status: SectionStatus;
  session?: SessionState;
  balances?: BalanceState;
}

export type ActionDataEntry<T = string> = {
  readonly identifier: T;
  readonly label: string;
  readonly icon?: string | undefined;
  readonly image?: string | undefined;
  readonly color?: string | undefined;
  readonly matcher?: (identifier: string) => boolean | undefined;
  readonly detailPath?: string | undefined;
};

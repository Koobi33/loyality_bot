import {
  type Conversation,
  type ConversationFlavor,
} from "grammy/conversations";
import { Context, SessionFlavor } from "grammy";

export enum UserRole {
  "None" = "None",
  "Admin" = "Admin",
  "Customer" = "Customer",
  "Employee" = "Employee",
  "Owner" = "Owner",
}

export interface EmployeeType {
  tgId: number;
  role: UserRole;
  employeeName: string;
}

// REQUESTS

export interface CafeListRequestType {
  userTgId: number;
}

export interface CreateCafeRequestType {
  cafeName: string;
  userTgId: number;
  cafeConfig: {
    purchaseCount: number;
  };
}

export interface CreateEmployeeInviteRequestType {
  cafeId: string;
  senderTgId: number;
  role: UserRole;
}

export interface CreateEmployeeRequestType {
  inviteId: string;
  employeeTgId: number;
  visibleEmployeeName: string;
}

export interface CreateNewsletterRequestType {
  cafeId: string;
  adminTgId: number;
  message: string;
}

export interface GetCustomersListRequestType {
  cafeId: string;
  masterId: number;
}
export interface GetCustomersListResponseType {
  cafeUsers: {
    owners: number[];
    admins: number[];
    employees: number[];
    users: number[];
  };
}

export interface RemoveEmployeeRequestType {
  cafeId: string;
  employeeTgId: number;
  adminTelegramId: number;
}

export interface EditCafeRequestType {
  newCafeName: string;
  cafeId: string;
  adminTgId: number;
  cafeConfig: {
    purchaseCount: number;
  };
}
export interface RemoveCafeRequestType {
  cafeId: string;
  adminTgId: number;
}

// =====
// RESPONSES

export interface CafeListResponseType {
  cafeName: string;
  cafeId: string;
  userRole: UserRole;
  purchaseCount: number;
  availableNoticeCount: number;
  employees: Array<EmployeeType>;
}

export interface CreateCafeResponseType {
  cafeId: string;
}

export interface CreateEmployeeInviteResponseType {
  inviteId: string;
}

// =====

export interface SessionData {
  cafeList: Array<CafeListResponseType>;
  currentCafe: CafeListResponseType | undefined;
  currentUser: EmployeeType | undefined;
}

// Flavor the context type to include sessions.
export type MyContext =
  & Context
  & SessionFlavor<SessionData>
  & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

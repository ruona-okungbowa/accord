"use client";
import {
  AddCircle,
  Close,
  Delete,
  ExpandMore,
  Lock,
  Send,
} from "@mui/icons-material";
import React from "react";

interface Props {
  closeModal: () => void;
}

const InvitePartipantsModal = ({ closeModal }: Props) => {
  const handleCancel = () => {
    closeModal();
  };
  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold leading-tight text-slate-900">
            Invite Participants
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Grant controlled access to the contract workspace
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <span className="text-[20px]">
            <Close fontSize="inherit" />
          </span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-4 px-1 pb-1">
            <div className="col-span-7">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Email Address
              </label>
            </div>
            <div className="col-span-4">
              <label
                htmlFor="role"
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Role
              </label>
            </div>
            <div className="col-span-1"></div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-start group">
            <div className="col-span-7">
              <input
                type="email"
                className="block w-full rounded-lg border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600 shadow-sm"
                placeholder="colleague@firm.com"
              />
            </div>
            <div className="col-span-4 relative">
              <select
                name="role"
                id="role"
                className="block w-full appearance-none rounded-lg border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-indigo-600 shadow-sm"
              >
                <option value="arranger">Arranger Counsel</option>
                <option value="borrower">Borrower Counsel</option>
                <option value="lender">Lender</option>
                <option value="borrower">Borrower</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <span className="text-[18px]">
                  <ExpandMore fontSize="inherit" />
                </span>
              </div>
            </div>
            <div className="col-span-1 flex-items-center justify-center h-10.5">
              <button className="text-slate-400 hover:text-red-500 transition-colors rounded p-1 hover:bg-red-50">
                <span className="text-[20px]">
                  <Delete fontSize="inherit" />
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-blue-600  transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-600">
            <span className="text-[20px]">
              <AddCircle fontSize="inherit" />
            </span>
            Add another
          </button>
        </div>
        <div className="mt-8 rounded-lg bg-blue-50 p-4 border border-blue 100">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 shrink-0 p-1 text-indigio-600">
              <span className="text-[18px] block">
                <Lock fontSize="inherit" />
              </span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Secure Access Control
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Invited participants will receive a secure link to authenticate.
                All invitiation actvities are logged for audit purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
        <div className="text-xs text-slate-500 font-medium">
          1 participants to be invited
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
            <span className="text-[18px]">
              <Send fontSize="inherit" />
            </span>
            Send Invites
          </button>
        </div>
      </div>
    </>
  );
};

export default InvitePartipantsModal;

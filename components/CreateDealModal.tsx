"use client";

import {
  Badge,
  Close,
  ExpandMore,
  Person,
  Tune,
  UploadFile,
} from "@mui/icons-material";
import { ChangeEvent, FormEvent, useState } from "react";

interface AddDealProps {
  closeModal: () => void;
}

interface DealData {
  name: string;
  description?: string;
  currency: string;
  targetSigningDate?: string | null;
  role: string;
  document?: File | null;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece | ValuePiece];

const CreateDealModal = ({ closeModal }: AddDealProps) => {
  const [formData, setFormData] = useState<DealData>({
    name: "",
    description: "",
    currency: "GBP",
    targetSigningDate: null,
    role: "",
    document: null,
  });
  const [value, onChange] = useState<Value>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof DealData
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        // Pop up for successfully create deal
        handleCancel();

        // Reset form
        setFormData({
          name: "",
          description: "",
          currency: "GBP",
          targetSigningDate: null,
          role: "",
          document: null,
        });
        onChange(null);
      } else {
        console.error("Failed to create deal:", data.message);
      }
    } catch (error) {
      console.error("Error creating deal:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  const formateDateOnly = (date: Date | null): string | null => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold leading-tight text-slate-900">
            Create New Deal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Initiate a loan agreement workflow
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
        >
          <span>
            <Close fontSize="medium" />
          </span>
        </button>
      </div>
      <form action="">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Upload Document
            </label>
            <div className="group relative flex items-center gap-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-4 transition-colors hover:border-indigo-600/50 hover:bg-slate-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-indigo-600">
                <span>
                  <UploadFile fontSize="medium" />
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  Drop file or{" "}
                  <button className="text-indigo-600 font-semibold hover:underline">
                    browse
                  </button>
                </p>
                <p className="text-xs text-slate-500">PDF or DOCX (max 25MB)</p>
              </div>
            </div>
          </div>
          <div className="mb-6 space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>
                <Badge fontSize="small" />
              </span>
              Deal Identity
            </h3>
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="dealName"
                  className="mb-1.5 block text-sm font-medium text-slate-900"
                >
                  Deal name <span className="text-red-500">*</span>
                </label>
                <input
                  className="block w-full rounded-lg border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                  type="text"
                  name="dealName"
                  id="dealName"
                  required
                  placeholder="£500m Term Loan B – ABC Holdings"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-900 mb-1.5"
                >
                  Description
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  className="block w-full resize-y rounded-lg border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                  placeholder="Senior secured term loan"
                  name="description"
                  id="description"
                  rows={2}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mb-6 space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>
                <Tune fontSize="small" />
              </span>
              Deal Basics
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-slate-900 mb-1.5"
                >
                  Currency
                </label>
                <div className="relative">
                  <select
                    className="block w-full appearance-none rounded-lg border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-indigo-600"
                    name="currency"
                    id="currency"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <span>
                      <ExpandMore fontSize="small" />
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="mb-1.5 block text-sm font-medium text-slate-900"
                >
                  Target signing date
                </label>
                <div className="relative">
                  <input
                    className="block w-full rounded-lg border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                    type="date"
                    name="date"
                    id="date"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>
                <Person fontSize="medium" />
                Your Role <span className="text-red-500">*</span>
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label
                htmlFor="role"
                className="group relative flex cursor-pointer flex-col rounded-lg border border-slate-200 p-3 transition-all hover:border-slate-300 hover:bg-slate-50 has-[checked]:border-indigo-600 has-[checked]:bg-blue-50/50 "
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    name="role"
                  />
                  <span className="font-bold text-slate-900 text-sm">
                    Arranger counsel
                  </span>
                </div>
                <span className="text-xs text-slate-500 leading-tight pl-6">
                  Leading the legal documentation process
                </span>
              </label>
              <label
                htmlFor="role"
                className="group relative flex cursor-pointer flex-col rounded-lg border border-slate-200 p-3 transition-all hover:border-slate-300 hover:bg-slate-50 has-[checked]:border-indigo-600 has-[checked]:bg-blue-50/50 "
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    name="role"
                  />
                  <span className="font-bold text-slate-900 text-sm">
                    Borrower counsel
                  </span>
                </div>
                <span className="text-xs text-slate-500 leading-tight pl-6">
                  Representing the borrower entity
                </span>
              </label>
              <label
                htmlFor="role"
                className="group relative flex cursor-pointer flex-col rounded-lg border border-slate-200 p-3 transition-all hover:border-slate-300 hover:bg-slate-50 has-[checked]:border-indigo-600 has-[checked]:bg-blue-50/50 "
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    name="role"
                  />
                  <span className="font-bold text-slate-900 text-sm">
                    Lender
                  </span>
                </div>
                <span className="text-xs text-slate-500 leading-tight pl-6">
                  Participating financial institution
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
            Create Deal
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateDealModal;

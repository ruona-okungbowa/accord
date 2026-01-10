"use client";

import {
  Badge,
  CheckCircle,
  Close,
  Delete,
  ExpandMore,
  Person,
  Tune,
  UploadFile,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

interface AddDealProps {
  closeModal: () => void;
}

interface DealData {
  name: string;
  description?: string;
  currency: string;
  targetSigningDate?: string | null;
  role: string;
  amount: number;
  document?: File | null;
}

const CreateDealModal = ({ closeModal }: AddDealProps) => {
  const router = useRouter();
  const [dealData, setDealData] = useState<DealData>({
    name: "",
    description: "",
    currency: "GBP",
    targetSigningDate: "",
    role: "",
    amount: 0,
    document: null,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof DealData
  ) => {
    setDealData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setErrors(null);

    // basic client-side validation
    if (!dealData.name || dealData.name.trim() === "") {
      setErrors("Please enter a deal name.");
      setIsCreating(false);
      return;
    }
    if (!dealData.role || dealData.role.trim() === "") {
      setErrors("Please select your role.");
      setIsCreating(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", dealData.name);
      formData.append("description", dealData.description || "");
      formData.append("currency", dealData.currency);
      formData.append("role", dealData.role);
      formData.append("amount", dealData.amount.toString());
      if (dealData.targetSigningDate) {
        formData.append("targetSigningDate", dealData.targetSigningDate);
      }
      if (dealData.document) {
        formData.append("document", dealData.document);
      }

      const response = await fetch("/api/contracts/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.error || "Error creating deal. Please try again.");
        setIsCreating(false);
        return;
      }

      const result = await response.json();
      console.log("Deal created successfully:", result);

      closeModal();
      router.push(`/contracts/${result.deal.id}`);
    } catch (error) {
      setErrors("Error creating deal. Please try again.");
      console.error("Error creating deal:", error);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  const removeDocument = () => {
    setDealData((prevData) => ({
      ...prevData,
      document: null,
    }));
    setErrors(null);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;
      setDealData((prevData) => ({
        ...prevData,
        document: selectedFile,
      }));
      setErrors(null);
    },
    [setDealData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 25 * 1024 * 1024, // 25MB
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    onDropRejected: (fileRejections: FileRejection[]) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === "file-too-large") {
        setErrors("File is too large. Maximum size is 25MB.");
      } else if (rejection.errors[0].code === "file-invalid-type") {
        setErrors("Invalid file type. Only PDF and DOCX files are supported.");
      } else {
        setErrors("File upload failed. Please try again.");
      }
    },
  });

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold leading-tight text-slate-900">
            Create New Contract
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
      <form onSubmit={handleCreate}>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-6">
            <label
              htmlFor="document"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Upload Document
            </label>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="group relative flex items-center gap-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-4 transition-colors hover:border-indigo-600/50 hover:bg-slate-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-indigo-600">
                    <span>
                      <UploadFile fontSize="medium" />
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Drop file here
                    </p>
                  </div>
                </div>
              ) : (
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
                    <p className="text-xs text-slate-500">
                      PDF or DOCX (max 25MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {dealData.document ? (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50/50 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span>
                    <CheckCircle fontSize="small" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {dealData.document.name}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Upload successful (
                    {Math.round(dealData.document.size / 1024)} KB)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeDocument}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Delete fontSize="small" />
                </button>
              </div>
            ) : null}
            {errors ? (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50/50 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span>
                    <Close fontSize="small" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-700">{errors}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setErrors(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Delete fontSize="small" />
                </button>
              </div>
            ) : null}
          </div>
          <div className="mb-6 space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>
                <Badge fontSize="small" />
              </span>
              Contract Identity
            </h3>
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="dealName"
                  className="mb-1.5 block text-sm font-medium text-slate-900"
                >
                  Contract name <span className="text-red-500">*</span>
                </label>
                <input
                  className="block w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                  type="text"
                  name="dealName"
                  id="dealName"
                  value={dealData.name}
                  onChange={(e) => handleInputChange(e, "name")}
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
                  <span className="text-slate-400 font-normal">
                    {" "}
                    (optional)
                  </span>
                </label>
                <textarea
                  className="block w-full resize-y rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                  placeholder="Senior secured term loan"
                  name="description"
                  id="description"
                  value={dealData.description}
                  onChange={(e) => handleInputChange(e, "description")}
                  rows={2}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mb-6 space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="text-[16px]">
                <Tune fontSize="inherit" />
              </span>
              Deal Basics
            </h3>
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="amount"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  Amount<span className="text-red-500"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="500,000"
                    id="amount"
                    value={dealData.amount}
                    required
                    onChange={(e) => handleInputChange(e, "amount")}
                    className=" block w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600 "
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-slate-900 mb-1.5"
                  >
                    Currency<span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full appearance-none rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-indigo-600"
                      name="currency"
                      id="currency"
                      value={dealData.currency}
                      onChange={(e) => handleInputChange(e, "currency")}
                    >
                      <option value="GBP">GBP</option>
                      <option value="EUR">EUR </option>
                      <option value="CHF">CHF</option>
                      <option value="RUB">RUB</option>
                      <option value="MAD">MAD</option>
                      <option value="NGN">NGN</option>
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
                    <span className="text-slate-400 font-normal">
                      {" "}
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                      type="date"
                      name="date"
                      id="date"
                      value={dealData.targetSigningDate ?? ""}
                      onChange={(e) =>
                        setDealData((p) => ({
                          ...p,
                          targetSigningDate: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>
                <Person fontSize="medium" />
                Your Role <span className="text-red-500">*</span>
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <label
                htmlFor="role"
                className="group relative flex cursor-pointer flex-col rounded-lg border border-slate-200 p-3 transition-all hover:border-slate-300 hover:bg-slate-50 has-[checked]:border-indigo-600 has-[checked]:bg-blue-50/50 "
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    name="role"
                    value="arranger_counsel"
                    checked={dealData.role === "arranger_counsel"}
                    onChange={(e) => handleInputChange(e, "role")}
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
                    value="borrower_counsel"
                    checked={dealData.role === "borrower_counsel"}
                    onChange={(e) => handleInputChange(e, "role")}
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
                    value="lender"
                    checked={dealData.role === "lender"}
                    onChange={(e) => handleInputChange(e, "role")}
                  />
                  <span className="font-bold text-slate-900 text-sm">
                    Lender
                  </span>
                </div>
                <span className="text-xs text-slate-500 leading-tight pl-6">
                  Participating financial institution
                </span>
              </label>
              <label
                htmlFor="role"
                className="group relative flex cursor-pointer flex-col rounded-lg border border-slate-200 p-3 transition-all hover:border-slate-300 hover:bg-slate-50 has-[checked]:border-indigo-600 has-[checked]:bg-blue-100 "
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    name="role"
                    value="borrower"
                    checked={dealData.role === "borrower"}
                    onChange={(e) => handleInputChange(e, "role")}
                  />
                  <span className="font-bold text-slate-900 text-sm">
                    Borrower
                  </span>
                </div>
                <span className="text-xs text-slate-500 leading-tight pl-6">
                  The entity receiving the financing
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={handleCancel}
            type="button"
            disabled={isCreating}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isCreating}
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50"
          >
            {isCreating ? "Creating…" : "Create Deal"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateDealModal;

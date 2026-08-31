import React from 'react';
import { Building2 } from 'lucide-react';
import type { CheckoutFormData, CheckoutErrors } from './types';

interface CompanyInfoFormProps {
  formData: CheckoutFormData;
  errors: CheckoutErrors;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = React.memo(({ formData, errors, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-[#A435F0]">
          <Building2 className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Company Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="Harish"
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A435F0] bg-slate-50/30 text-sm text-slate-800 transition-all ${
              errors.firstName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
            }`}
          />
          {errors.firstName && <span className="text-xs text-red-500 font-medium block mt-1">{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Kumar"
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A435F0] bg-slate-50/30 text-sm text-slate-800 transition-all ${
              errors.lastName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
            }`}
          />
          {errors.lastName && <span className="text-xs text-red-500 font-medium block mt-1">{errors.lastName}</span>}
        </div>

        {/* Billing Email */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Billing Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="kcglobed@yopmail.com"
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A435F0] bg-slate-50/30 text-sm text-slate-800 transition-all ${
              errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
            }`}
          />
          {errors.email && <span className="text-xs text-red-500 font-medium block mt-1">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="9915039343"
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A435F0] bg-slate-50/30 text-sm text-slate-800 transition-all ${
              errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
            }`}
          />
          {errors.phone && <span className="text-xs text-red-500 font-medium block mt-1">{errors.phone}</span>}
        </div>

        {/* Company Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            placeholder="KCGLOBED"
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A435F0] bg-slate-50/30 text-sm text-slate-800 transition-all ${
              errors.companyName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
            }`}
          />
          {errors.companyName && <span className="text-xs text-red-500 font-medium block mt-1">{errors.companyName}</span>}
        </div>

        {/* GST Number */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">GST / VAT Number</label>
            <span className="text-[10px] text-gray-400 italic font-medium">Optional</span>
          </div>
          <input
            type="text"
            value={formData.gstNumber}
            onChange={(e) => onChange('gstNumber', e.target.value)}
            placeholder="US123456789"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A435F0] bg-slate-50/30 text-sm text-slate-800 transition-all border-slate-200"
          />
        </div>
      </div>
    </div>
  );
});

CompanyInfoForm.displayName = 'CompanyInfoForm';

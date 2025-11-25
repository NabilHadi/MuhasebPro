import { Check, X } from 'lucide-react';
import { FooterControlConfig } from '../types';

interface FooterProps {
  acceptButtonLabel?: string;
  closeButtonLabel?: string;
  onAccept: () => void;
  onClose: () => void;
  isAcceptDisabled: boolean;
  footerControls?: FooterControlConfig[];
}

export default function Footer({
  acceptButtonLabel = 'موافق',
  closeButtonLabel = 'إلغاء',
  onAccept,
  onClose,
  isAcceptDisabled,
  footerControls,
}: FooterProps) {
  return (
    <div className="py-2 px-3 border-t border-gray-500 bg-gray-50 flex justify-between items-center flex-shrink-0">
      {/* Left: Footer Controls (Checkboxes/Selects) */}
      <div className="flex gap-4">
        {footerControls && footerControls.length > 0 && (
          <>
            {footerControls.map((control) => {
              if (control.type === 'checkbox') {
                return (
                  <label
                    key={control.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(control.value)}
                      onChange={(e) => control.onChange(e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm">{control.label}</span>
                  </label>
                );
              }

              if (control.type === 'select') {
                return (
                  <select
                    key={control.id}
                    value={String(control.value || '')}
                    onChange={(e) => control.onChange(e.target.value)}
                    className="px-2 py-1 border border-gray-300 focus:outline-none text-sm rounded"
                  >
                    <option value="">{control.label}</option>
                    {control.options?.map((opt) => (
                      <option key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                );
              }

              return null;
            })}
          </>
        )}
      </div>

      {/* Center: Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onAccept}
          disabled={isAcceptDisabled}
          className="flex items-center justify-center gap-2 font-bold px-6 py-1 bg-gray-200 border-2 border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 rounded"
        >
          <Check size={18} /> {acceptButtonLabel}
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 font-bold px-6 py-1 bg-gray-200 border-2 border-gray-300 text-sm hover:bg-gray-300 rounded"
        >
          <X size={16} /> {closeButtonLabel}
        </button>
      </div>

      {/* Right: Empty slot for future expansion */}
      <div className="w-32"></div>
    </div>
  );
}

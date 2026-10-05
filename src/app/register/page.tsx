'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validatePhone, validateEmail } from '@/lib/utils';
import { BRANCHES, GRAD_YEARS, SLOTS, COLLEGES } from '@/lib/constants';
import { getTrackingParams } from '@/components/TrackingCapture';

async function trackEvent(sessionId: string, type: string, meta?: Record<string, unknown>) {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, type, meta }),
    });
  } catch {
    // Silent fail for analytics
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interacted, setInteracted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college_id: null as number | null,
    college_other: '',
    branch: '',
    grad_year: 0,
    email: '',
    slot: SLOTS.length === 1 ? SLOTS[0].value : '',
    consent: false,
    website: '', // honeypot
  });

  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setSessionId(id);
    trackEvent(id, 'page_view', { page: '/register' });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCollegeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInteraction = useCallback(() => {
    if (!interacted) {
      setInteracted(true);
      trackEvent(sessionId, 'form_start');
    }
  }, [interacted, sessionId]);

  const updateForm = (key: string, value: unknown) => {
    handleInteraction();
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const filteredColleges = COLLEGES.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const selectCollege = (college: { id: number; name: string } | null) => {
    if (college) {
      updateForm('college_id', college.id);
      updateForm('college_other', '');
      setCollegeSearch(college.name);
    } else {
      // "Other" selected
      updateForm('college_id', null);
      setCollegeSearch('Other');
    }
    setShowCollegeDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleCollegeKeyDown = (e: React.KeyboardEvent) => {
    const total = filteredColleges.length + 1; // +1 for "Other"
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % total);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + total) % total);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      if (highlightedIndex < filteredColleges.length) {
        selectCollege(filteredColleges[highlightedIndex]);
      } else {
        selectCollege(null);
      }
    } else if (e.key === 'Escape') {
      setShowCollegeDropdown(false);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-college-item]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || formData.name.trim().length < 2) {
        return setError('Name must be at least 2 characters');
      }
      if (!validatePhone(formData.phone)) {
        return setError('Please enter a valid 10-digit Indian mobile number');
      }
      trackEvent(sessionId, 'step_1_complete');
    } else if (step === 2) {
      if (!formData.college_id && !formData.college_other.trim()) {
        return setError('Please select your college');
      }
      if (!formData.branch) {
        return setError('Please select your branch');
      }
      if (!formData.grad_year) {
        return setError('Please select your graduation year');
      }
      trackEvent(sessionId, 'step_2_complete');
    }
    setError('');
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError('');
    setStep((s) => s - 1);
  };

  const submitForm = async () => {
    if (!validateEmail(formData.email)) return setError('Please enter a valid email');
    if (!formData.slot) return setError('Please select a time slot');
    if (!formData.consent) return setError('Please consent to receive updates');

    setLoading(true);
    setError('');

    try {
      trackEvent(sessionId, 'step_3_complete');

      const tracking = getTrackingParams();
      let session_id = '';
      try {
        session_id = sessionStorage.getItem('buildday_session_id') || '';
      } catch {}

      const payload = {
        ...formData,
        ...tracking,
        session_id,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.ref_code) {
        router.push(`/thanks/${data.ref_code}`);
      } else if (res.status === 429) {
        setError('Too many attempts. Please wait a minute and try again.');
      } else if (data.errors) {
        const firstError = Object.values(data.errors)[0] as string;
        setError(firstError || 'Please check your details and try again.');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Your Info', 'College', 'Confirm'];

  return (
    <div className="min-h-screen py-8 pb-24 px-4 flex flex-col items-center">
      {/* Header */}
      <Link
        href="/"
        className="text-xl font-bold gradient-text mb-8 hover:opacity-80 transition-opacity"
      >
        BuildDay
      </Link>

      <div className="w-full max-w-md">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white'
                      : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    isActive ? 'text-white font-medium' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isDone ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="card">
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Honeypot — visually hidden but present for bots */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', tabIndex: -1 } as React.CSSProperties}
          >
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) => updateForm('website', e.target.value)}
              />
            </label>
          </div>

          {/* STEP 1: Name & Phone */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
                  WhatsApp Number
                </label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    className="input-field rounded-l-none"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) =>
                      updateForm('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                    }
                    inputMode="numeric"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We&apos;ll send workshop details here. No spam.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: College, Branch, Year */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              {/* College — searchable dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label
                  htmlFor="college"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  College
                </label>
                <input
                  id="college"
                  type="text"
                  className="input-field"
                  placeholder="Search your college..."
                  value={collegeSearch}
                  onChange={(e) => {
                    setCollegeSearch(e.target.value);
                    setShowCollegeDropdown(true);
                    setHighlightedIndex(-1);
                    if (formData.college_id) updateForm('college_id', null);
                  }}
                  onFocus={() => setShowCollegeDropdown(true)}
                  onKeyDown={handleCollegeKeyDown}
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={showCollegeDropdown}
                  aria-haspopup="listbox"
                />
                {showCollegeDropdown && (
                  <div
                    ref={listRef}
                    role="listbox"
                    className="absolute z-50 w-full mt-1 bg-dark-card border border-white/10 rounded-xl shadow-2xl max-h-52 overflow-y-auto"
                  >
                    {filteredColleges.length === 0 && collegeSearch.length > 0 && (
                      <div className="p-3 text-sm text-gray-500">
                        No colleges found. Select &quot;Other&quot; below.
                      </div>
                    )}
                    {filteredColleges.slice(0, 30).map((college, idx) => (
                      <div
                        key={college.id}
                        data-college-item
                        role="option"
                        aria-selected={highlightedIndex === idx}
                        className={`p-3 cursor-pointer border-b border-white/5 last:border-0 transition-colors ${
                          highlightedIndex === idx
                            ? 'bg-accent-blue/20'
                            : 'hover:bg-white/5'
                        }`}
                        onClick={() => selectCollege(college)}
                      >
                        <div className="text-sm font-medium">{college.name}</div>
                        <div className="text-xs text-gray-500">
                          {college.city}, {college.state}
                        </div>
                      </div>
                    ))}
                    <div
                      data-college-item
                      role="option"
                      aria-selected={highlightedIndex === filteredColleges.length}
                      className={`p-3 cursor-pointer text-accent-cyan text-sm font-medium border-t border-white/10 transition-colors ${
                        highlightedIndex === filteredColleges.length
                          ? 'bg-accent-blue/20'
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => selectCollege(null)}
                    >
                      + Other (college not listed)
                    </div>
                  </div>
                )}
              </div>

              {/* Free-text college input when "Other" is chosen */}
              {!formData.college_id && collegeSearch === 'Other' && (
                <div>
                  <label
                    htmlFor="college_other"
                    className="block text-sm font-medium text-gray-300 mb-1.5"
                  >
                    College Name
                  </label>
                  <input
                    id="college_other"
                    type="text"
                    className="input-field"
                    placeholder="Enter your college name"
                    value={formData.college_other}
                    onChange={(e) => updateForm('college_other', e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              {/* Branch */}
              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Branch
                </label>
                <select
                  id="branch"
                  className="input-field"
                  value={formData.branch}
                  onChange={(e) => updateForm('branch', e.target.value)}
                >
                  <option value="" className="bg-dark-bg">Select your branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b} className="bg-dark-bg">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grad Year */}
              <div>
                <label
                  htmlFor="grad_year"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Graduation Year
                </label>
                <select
                  id="grad_year"
                  className="input-field"
                  value={formData.grad_year || ''}
                  onChange={(e) => updateForm('grad_year', Number(e.target.value))}
                >
                  <option value="" className="bg-dark-bg">Select year</option>
                  {GRAD_YEARS.map((y) => (
                    <option key={y} value={y} className="bg-dark-bg">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Email, Slot, Consent */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Slot
                </label>
                <div className="space-y-2">
                  {SLOTS.map((slot) => (
                    <label
                      key={slot.value}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.slot === slot.value
                          ? 'border-accent-cyan bg-accent-cyan/10 shadow-sm shadow-accent-cyan/10'
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={slot.value}
                        checked={formData.slot === slot.value}
                        onChange={() => updateForm('slot', slot.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.slot === slot.value
                            ? 'border-accent-cyan'
                            : 'border-gray-500'
                        }`}
                      >
                        {formData.slot === slot.value && (
                          <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                        )}
                      </div>
                      <span className="text-sm">{slot.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => updateForm('consent', e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-500 text-accent-cyan focus:ring-accent-cyan"
                />
                <span className="text-sm text-gray-300 leading-relaxed">
                  I consent to receive workshop updates via WhatsApp and email. No spam, unsubscribe
                  anytime.
                </span>
              </label>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="btn-secondary px-5 py-3"
                type="button"
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="btn-primary flex-1 py-3 text-center"
                type="button"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={submitForm}
                disabled={loading}
                className="btn-primary flex-1 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register Now 🚀'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trust footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          🔒 Your data is safe. We never share your info. By NxtWave.
        </p>
      </div>
    </div>
  );
}

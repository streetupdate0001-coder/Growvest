import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck, Info } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showCriteria?: boolean;
  username?: string;
  email?: string;
}

export interface PasswordAnalysis {
  score: number; // 0 to 4
  label: string;
  colorClass: string;
  bgColorClass: string;
  textColorClass: string;
  hasMinLength: boolean;
  hasInstitutionalLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasNoCommonPatterns: boolean;
  feedback: string;
}

export function analyzePassword(
  password: string,
  username?: string,
  email?: string
): PasswordAnalysis {
  if (!password) {
    return {
      score: 0,
      label: 'Too Weak',
      colorClass: 'bg-slate-300 dark:bg-slate-700',
      bgColorClass: 'bg-slate-100 dark:bg-slate-800',
      textColorClass: 'text-slate-500 dark:text-slate-400',
      hasMinLength: false,
      hasInstitutionalLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      hasNoCommonPatterns: true,
      feedback: 'Enter a strong password with at least 8 characters'
    };
  }

  const hasMinLength = password.length >= 8;
  const hasInstitutionalLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Check for common weak patterns
  const isSequential = /(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|pqr|qrs|rst|stu|xyz|password|qwerty|1111|0000)/i.test(
    password
  );
  const containsUsername = username && username.length > 2 && password.toLowerCase().includes(username.toLowerCase());
  const containsEmail = email && email.length > 3 && password.toLowerCase().includes(email.split('@')[0].toLowerCase());
  const hasNoCommonPatterns = !isSequential && !containsUsername && !containsEmail;

  let points = 0;
  if (hasMinLength) points += 1;
  if (hasInstitutionalLength) points += 1;
  if (hasUppercase && hasLowercase) points += 1;
  if (hasNumber) points += 1;
  if (hasSpecialChar) points += 1;
  if (hasNoCommonPatterns && points >= 2) points += 1;

  // Convert points to 0-4 scale
  let score = 0;
  if (password.length < 6) {
    score = 0;
  } else if (points <= 2) {
    score = 1;
  } else if (points <= 3) {
    score = 2;
  } else if (points <= 4) {
    score = 3;
  } else {
    score = 4;
  }

  const levelConfigs = [
    {
      label: 'Too Weak',
      colorClass: 'bg-rose-500',
      bgColorClass: 'bg-rose-500/10',
      textColorClass: 'text-rose-600 dark:text-rose-400',
      feedback: 'Requires at least 8 characters and varied character types'
    },
    {
      label: 'Weak',
      colorClass: 'bg-orange-500',
      bgColorClass: 'bg-orange-500/10',
      textColorClass: 'text-orange-600 dark:text-orange-400',
      feedback: 'Add uppercase letters, numbers, and special symbols'
    },
    {
      label: 'Moderate',
      colorClass: 'bg-amber-400',
      bgColorClass: 'bg-amber-500/10',
      textColorClass: 'text-amber-600 dark:text-amber-400',
      feedback: 'Good, but 12+ characters recommended for institutional vault access'
    },
    {
      label: 'Strong',
      colorClass: 'bg-emerald-500',
      bgColorClass: 'bg-emerald-500/10',
      textColorClass: 'text-emerald-600 dark:text-emerald-400',
      feedback: 'Meets high security standards for financial management'
    },
    {
      label: 'Institutional Grade',
      colorClass: 'bg-emerald-500',
      bgColorClass: 'bg-emerald-500/20',
      textColorClass: 'text-emerald-700 dark:text-emerald-300',
      feedback: 'Optimal cryptographic entropy for institutional accounts'
    }
  ];

  const config = levelConfigs[score];

  return {
    score,
    label: config.label,
    colorClass: config.colorClass,
    bgColorClass: config.bgColorClass,
    textColorClass: config.textColorClass,
    hasMinLength,
    hasInstitutionalLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasNoCommonPatterns,
    feedback: config.feedback
  };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showCriteria = true,
  username,
  email
}) => {
  const analysis = analyzePassword(password, username, email);

  const criteria = [
    {
      id: 'length',
      label: '8+ characters (12+ for vault grade)',
      met: analysis.hasMinLength,
      bonusMet: analysis.hasInstitutionalLength
    },
    {
      id: 'case',
      label: 'Uppercase & lowercase letters',
      met: analysis.hasUppercase && analysis.hasLowercase
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      met: analysis.hasNumber
    },
    {
      id: 'symbol',
      label: 'Special character (e.g. !@#$%^&*)',
      met: analysis.hasSpecialChar
    },
    {
      id: 'pattern',
      label: 'No predictable sequences or personal data',
      met: analysis.hasNoCommonPatterns
    }
  ];

  return (
    <div id="growvest-password-strength-meter" className="space-y-2 text-xs">
      {/* Header bar and label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
            Security Strength:
          </span>
          <span className={`text-[11px] font-bold font-mono ${analysis.textColorClass}`}>
            {analysis.label}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
          {analysis.score}/4 Level
        </span>
      </div>

      {/* Segmented Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map(step => {
          const isActive = step <= analysis.score;
          return (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${
                isActive ? analysis.colorClass : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          );
        })}
      </div>

      {/* Helper feedback text */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
        {analysis.feedback}
      </p>

      {/* Detailed Checklist */}
      {showCriteria && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1.5 mt-2 transition-colors">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Institutional Password Criteria
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {criteria.map(c => (
              <div
                key={c.id}
                className={`flex items-center gap-1.5 text-[10px] font-mono transition-colors ${
                  c.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {c.met ? (
                  <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                ) : (
                  <X className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />
                )}
                <span className={c.met ? 'font-medium' : ''}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

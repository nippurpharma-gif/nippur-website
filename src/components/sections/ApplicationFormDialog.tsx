'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ApplicationFormDialogProps {
  position: string | null;
  department?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['.pdf', '.doc', '.docx'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplicationFormDialog({
  position,
  department = '',
  open,
  onOpenChange,
}: ApplicationFormDialogProps) {
  const { locale } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const labels = locale === 'ar'
    ? {
        title: 'تقديم على الوظيفة',
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        position: 'الوظيفة',
        department: 'القسم',
        coverLetter: 'رسالة التعريف',
        cv: 'السيرة الذاتية (CV)',
        cvHint: 'PDF أو DOC، بحد أقصى 5 ميجابايت',
        submit: 'تقديم الطلب',
        submitting: 'جارِ التقديم...',
        success: 'تم تقديم طلبك بنجاح!',
        error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        chooseFile: 'اختر ملف',
      }
    : {
        title: 'Apply for Position',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        position: 'Position',
        department: 'Department',
        coverLetter: 'Cover Letter',
        cv: 'Curriculum Vitae (CV)',
        cvHint: 'PDF or DOC, max 5MB',
        submit: 'Submit Application',
        submitting: 'Submitting...',
        success: 'Your application has been submitted successfully!',
        error: 'Something went wrong. Please try again.',
        chooseFile: 'Choose File',
      };

  const isRtl = locale === 'ar';

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;

      if (!file) {
        setSelectedFile(null);
        return;
      }

      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ACCEPTED_TYPES.includes(ext)) {
        toast.error(
          locale === 'ar'
            ? 'نوع الملف غير مدعوم. يرجى رفع PDF أو DOC.'
            : 'Invalid file type. Please upload PDF or DOC.'
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFile(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          locale === 'ar'
            ? 'حجم الملف يتجاوز 5 ميجابايت.'
            : 'File size exceeds 5MB limit.'
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    },
    [locale]
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!name.trim() || !email.trim()) {
        toast.error(
          locale === 'ar'
            ? 'يرجى ملء الحقول المطلوبة.'
            : 'Please fill in all required fields.'
        );
        return;
      }

      setSubmitting(true);

      try {
        const formData = new FormData();
        formData.append('fullName', name.trim());
        formData.append('email', email.trim());
        if (phone.trim()) formData.append('phone', phone.trim());
        if (position) formData.append('position', position);
        if (department) formData.append('department', department);
        if (coverLetter.trim()) formData.append('coverLetter', coverLetter.trim());
        if (selectedFile) formData.append('cv', selectedFile);

        const res = await fetch('/api/applications?XTransformPort=3000', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Submission failed');

        toast.success(labels.success);
        resetForm();
        onOpenChange(false);
      } catch {
        toast.error(labels.error);
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, phone, position, department, coverLetter, selectedFile, labels, onOpenChange, resetForm]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${isRtl ? 'sm:text-right' : 'sm:text-left'} sm:max-w-lg max-h-[90vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-700">
            {labels.title}
          </DialogTitle>
          <DialogDescription>
            {position
              ? locale === 'ar'
                ? `تقدّم لوظيفة: ${position}`
                : `Applying for: ${position}`
              : locale === 'ar'
                ? 'أكمل النموذج أدناه لتقديم طلبك'
                : 'Complete the form below to submit your application'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="app-name">
              {labels.name}
              <span className="text-red-500 ms-1">*</span>
            </Label>
            <Input
              id="app-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.name}
              disabled={submitting}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="app-email">
              {labels.email}
              <span className="text-red-500 ms-1">*</span>
            </Label>
            <Input
              id="app-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={labels.email}
              disabled={submitting}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="app-phone">{labels.phone}</Label>
            <Input
              id="app-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={labels.phone}
              disabled={submitting}
            />
          </div>

          {/* Position */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="app-position">{labels.position}</Label>
            <Input
              id="app-position"
              type="text"
              value={position ?? ''}
              readOnly
              className="bg-muted/50 cursor-not-allowed"
            />
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="app-department">{labels.department}</Label>
            <Input
              id="app-department"
              type="text"
              value={department}
              readOnly
              className="bg-muted/50 cursor-not-allowed"
            />
          </div>

          {/* Cover Letter */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="app-cover">{labels.coverLetter}</Label>
            <Textarea
              id="app-cover"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder={labels.coverLetter}
              disabled={submitting}
            />
          </div>

          {/* CV Upload */}
          <div className="flex flex-col gap-1.5">
            <Label>{labels.cv}</Label>

            {selectedFile ? (
              <div className="flex items-center gap-3 rounded-md border border-brand-200 bg-brand-50/50 p-3">
                <FileText className="size-5 text-brand-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  disabled={submitting}
                >
                  <X className="size-4" />
                  <span className="sr-only">
                    {locale === 'ar' ? 'إزالة الملف' : 'Remove file'}
                  </span>
                </button>
              </div>
            ) : (
              <label
                htmlFor="app-cv"
                className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-brand-200 bg-brand-50/30 p-6 cursor-pointer transition-colors hover:border-brand-400 hover:bg-brand-50/60 ${submitting ? 'pointer-events-none opacity-50' : ''}`}
              >
                <Upload className="size-8 text-brand-500" />
                <span className="text-sm font-medium text-brand-700">
                  {labels.chooseFile}
                </span>
                <span className="text-xs text-muted-foreground">{labels.cvHint}</span>
              </label>
            )}

            <input
              ref={fileInputRef}
              id="app-cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={submitting}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold h-11 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {labels.submitting}
              </>
            ) : (
              labels.submit
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}